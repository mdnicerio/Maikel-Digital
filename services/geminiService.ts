import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Platform, GeneratedPost, UploadedMedia, ContentPlanDay } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (originalPost: string, platforms: Platform[], niche: string, hasMedia: boolean): string => {
  const platformDetails = platforms.map(p => `- ${p.name}: ${p.description}`).join('\n');
  
  let nicheInstruction = '';
  if (niche && niche.trim() !== '') {
    nicheInstruction = `
**Specific Niche:**
Tailor all content for this specific niche: "${niche}". This should influence the vocabulary, tone, and examples used.`;
  }

  const coreTask = hasMedia 
    ? `Your task is to act as an expert social media manager and write engaging posts for the provided image/video.`
    : `You are an expert social media manager. Your task is to adapt a single piece of content for various social media platforms, optimizing it for each platform's unique style, tone, and constraints.`;

  const contentContext = hasMedia
    ? originalPost.trim()
      ? `Use the following text as a starting point, context, or specific instruction for the post: "${originalPost}"`
      : `The user has not provided specific text, so you should creatively describe the media or generate a compelling caption for it.`
    : `**Original Content:**\n"${originalPost}"`;


  return `
    ${coreTask}

    ${contentContext}
    ${nicheInstruction}

    **Target Platforms and Guidelines:**
    ${platformDetails}

    Please generate the adapted content for each of the following platforms: ${platforms.map(p => p.name).join(', ')}.
  `;
};

export const generateAdaptedPosts = async (originalPost: string, platforms: Platform[], niche: string, media: UploadedMedia | null): Promise<GeneratedPost[]> => {
  if (platforms.length === 0) {
    return [];
  }

  const prompt = generatePrompt(originalPost, platforms, niche, !!media);
  
  const contents: ({ text: string } | { inlineData: { data: string; mimeType: string; } })[] = [{ text: prompt }];
  
  if (media) {
    contents.push({
      inlineData: {
        data: media.base64,
        mimeType: media.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: contents },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: {
                type: Type.STRING,
                description: 'The name of the social media platform (e.g., "twitter", "linkedin"). Should be one of the requested platform IDs.',
                enum: platforms.map(p => p.id)
              },
              content: {
                type: Type.STRING,
                description: 'The adapted content for the specified platform.'
              }
            },
            required: ['platform', 'content']
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse: GeneratedPost[] = JSON.parse(jsonText);
    
    // Ensure the order matches the selected platforms for consistent display
    const orderedResponse = platforms.map(p => {
        const foundPost = parsedResponse.find(pr => pr.platform.toLowerCase() === p.id.toLowerCase());
        return foundPost || { platform: p.id, content: "Could not generate content for this platform." };
    });

    return orderedResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate content from the AI model. Please check the console for more details.");
  }
};


export const suggestHashtags = async (originalPost: string, niche: string): Promise<string[]> => {
  if (!originalPost.trim()) {
    return [];
  }

  let nicheInstruction = '';
  if (niche && niche.trim() !== '') {
    nicheInstruction = `The content is for the niche: "${niche}". The hashtags should be highly relevant to this niche.`;
  }

  const prompt = `
    You are a hashtag suggestion expert. Based on the following social media content, generate a list of 8 to 12 relevant and potentially trending hashtags.
    Do not include the '#' symbol in your response.

    **Content:**
    "${originalPost}"

    ${nicheInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hashtags: {
              type: Type.ARRAY,
              description: 'A list of suggested hashtag strings.',
              items: {
                type: Type.STRING,
                description: 'A single hashtag without the "#" symbol.'
              }
            }
          },
          required: ['hashtags']
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse: { hashtags: string[] } = JSON.parse(jsonText);
    return parsedResponse.hashtags || [];

  } catch (error) {
    console.error("Error calling Gemini API for hashtags:", error);
    throw new Error("Failed to suggest hashtags. Please check the console for more details.");
  }
};

export const suggestTopic = async (niche: string): Promise<string> => {
  let nicheInstruction = 'Suggest a general, engaging topic for a social media post.';
  if (niche && niche.trim() !== '') {
    nicheInstruction = `Suggest an engaging social media post topic specifically for this niche: "${niche}".`;
  }

  const prompt = `
    You are a creative social media content strategist. 
    Your task is to provide a single, compelling topic idea for a social media post that can be expanded upon.
    ${nicheInstruction}
    Provide only the topic text itself, without any introductory phrases like "Here's a topic:".
    The topic should be a complete sentence or a strong opening phrase.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for topic suggestion:", error);
    throw new Error("Failed to suggest a topic. Please check the console for more details.");
  }
};

export const expandTopicIntoPost = async (topic: string, niche: string): Promise<string> => {
  if (!topic.trim()) {
    throw new Error("A topic is required to expand into a post.");
  }

  let nicheInstruction = 'The post should be generally appealing.';
  if (niche && niche.trim() !== '') {
    nicheInstruction = `The post should be tailored for this niche: "${niche}".`;
  }

  const prompt = `
    You are a creative social media content writer. 
    Your task is to expand the following topic or idea into a complete and engaging "core" social media post. 
    This post should be a good starting point that can be adapted for different platforms later.
    It should be around 2-4 sentences long.
    
    ${nicheInstruction}

    **Topic to expand:**
    "${topic}"

    Provide only the generated post content, without any introductory phrases like "Here's the post:".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for post expansion:", error);
    throw new Error("Failed to expand the topic into a post. Please check the console for more details.");
  }
};

export const generateImageFromTopic = async (topic: string, niche: string): Promise<UploadedMedia> => {
  if (!topic.trim()) {
    throw new Error("A topic is required to generate an image.");
  }

  let prompt = `A high-quality, visually appealing image for a social media post about: "${topic}". The image should be vibrant and engaging.`;
  if (niche && niche.trim()) {
    prompt += ` The target audience is interested in ${niche}.`;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
          name: 'ai-generated-image.png'
        };
      }
    }
    
    throw new Error("The AI model did not return an image.");

  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    throw new Error("Failed to generate an image. Please check the console for more details.");
  }
};

export const generate30DayContentPlan = async (topic: string, niche: string): Promise<ContentPlanDay[]> => {
  if (!topic.trim()) {
    throw new Error("A core topic is required to generate a content plan.");
  }

  let nicheInstruction = '';
  if (niche && niche.trim() !== '') {
    nicheInstruction = `The plan should be specifically tailored for this niche: "${niche}".`;
  }

  const prompt = `
    You are an expert social media content strategist. Your task is to generate a 30-day content plan based on a core topic.
    For each day, provide a unique, engaging topic idea and a short, creative post snippet (1-2 sentences).
    The plan should show a logical progression, keeping the audience engaged throughout the month.

    **Core Topic:**
    "${topic}"

    ${nicheInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: "A 30-day content plan.",
          items: {
            type: Type.OBJECT,
            properties: {
              day: {
                type: Type.NUMBER,
                description: 'The day number of the plan (1-30).',
              },
              topic: {
                type: Type.STRING,
                description: 'The specific topic or angle for that day\'s post.'
              },
              snippet: {
                type: Type.STRING,
                description: 'A short, engaging 1-2 sentence snippet for the post.'
              }
            },
            required: ['day', 'topic', 'snippet']
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedResponse: ContentPlanDay[] = JSON.parse(jsonText);
    return parsedResponse;

  } catch (error) {
    console.error("Error calling Gemini API for content plan generation:", error);
    throw new Error("Failed to generate the content plan. Please try again.");
  }
};