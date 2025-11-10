import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PlatformSelector } from './components/PlatformSelector';
import { PostInput } from './components/PostInput';
import { NicheInput } from './components/NicheInput';
import { HashtagSuggester } from './components/HashtagSuggester';
import { ContentPlanDisplay } from './components/ContentPlanDisplay';
import { Tabs } from './components/Tabs';
import { PLATFORMS } from './constants';
import type { GeneratedPost, UploadedMedia, ContentPlanDay } from './types';
import { generateAdaptedPosts, suggestHashtags, suggestTopic, generateImageFromTopic, expandTopicIntoPost, generate30DayContentPlan } from './services/geminiService';
import { DownloadIcon } from './components/icons/DownloadIcon';

const App: React.FC = () => {
  const [originalPost, setOriginalPost] = useState<string>('');
  const [media, setMedia] = useState<UploadedMedia | null>(null);
  const [niche, setNiche] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin']);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [contentPlan, setContentPlan] = useState<ContentPlanDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [isSuggestingHashtags, setIsSuggestingHashtags] = useState<boolean>(false);
  const [isSuggestingTopic, setIsSuggestingTopic] = useState<boolean>(false);
  const [isExpandingTopic, setIsExpandingTopic] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };
  
  const handleSuggestHashtags = useCallback(async () => {
    if (!originalPost.trim() && !media) {
      setError("Please write a post or upload media first to get hashtag suggestions.");
      return;
    }
    
    setIsSuggestingHashtags(true);
    setError(null);
    setSuggestedHashtags([]);

    try {
      const hashtags = await suggestHashtags(originalPost, niche);
      setSuggestedHashtags(hashtags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsSuggestingHashtags(false);
    }
  }, [originalPost, niche, media]);

  const handleHashtagClick = (hashtag: string) => {
    setOriginalPost(currentPost => 
        (currentPost.trimEnd() + ` #${hashtag} `)
    );
  };

  const handleSuggestTopic = useCallback(async () => {
    setIsSuggestingTopic(true);
    setError(null);
    try {
      const topic = await suggestTopic(niche);
      setOriginalPost(topic);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsSuggestingTopic(false);
    }
  }, [niche]);

  const handleExpandTopic = useCallback(async () => {
    if (!originalPost.trim()) {
      setError("Please write a topic first to expand it with AI.");
      return;
    }
    setIsExpandingTopic(true);
    setError(null);
    try {
      const expandedPost = await expandTopicIntoPost(originalPost, niche);
      setOriginalPost(expandedPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsExpandingTopic(false);
    }
  }, [originalPost, niche]);

  const handleGenerateImage = useCallback(async () => {
    if (!originalPost.trim()) {
      setError("Please write a topic in the message box first to generate an image.");
      return;
    }
    
    setIsGeneratingImage(true);
    setError(null);
    setMedia(null);

    try {
      const generatedMedia = await generateImageFromTopic(originalPost, niche);
      setMedia(generatedMedia);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the image.');
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [originalPost, niche]);
  
  const handleGeneratePlan = useCallback(async () => {
    if (!originalPost.trim()) {
      setError("Please provide a core topic to generate a content plan.");
      return;
    }
    
    setIsGeneratingPlan(true);
    setError(null);
    setSuccessMessage(null);
    setGeneratedPosts([]);
    setContentPlan([]);

    try {
      const plan = await generate30DayContentPlan(originalPost, niche);
      setContentPlan(plan);
      setSuccessMessage('Your 30-day content plan has been generated successfully!');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the plan.');
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  }, [originalPost, niche]);

  const handleGeneratePosts = useCallback(async () => {
    if ((!originalPost.trim() && !media) || selectedPlatforms.length === 0) {
      setError("Please write a post or upload media, and select at least one platform.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setGeneratedPosts([]);
    setContentPlan([]);

    try {
      const targetPlatforms = PLATFORMS.filter(p => selectedPlatforms.includes(p.id));
      const results = await generateAdaptedPosts(originalPost, targetPlatforms, niche, media);
      setGeneratedPosts(results);
      setSuccessMessage('Posts adapted successfully! They are ready to be copied below.');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalPost, selectedPlatforms, niche, media]);

  const handleExportPostsJSON = () => {
    if (!generatedPosts || generatedPosts.length === 0) return;

    const jsonString = JSON.stringify(generatedPosts, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'adapted-social-posts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const isActionDisabled = isLoading || isGeneratingImage || isGeneratingPlan;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Write your content once. We'll adapt it for every platform, optimizing tone, length, and hashtags.
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
            <PostInput
              postContent={originalPost}
              setPostContent={setOriginalPost}
              onSuggestTopic={handleSuggestTopic}
              isSuggestingTopic={isSuggestingTopic}
              onExpandTopic={handleExpandTopic}
              isExpandingTopic={isExpandingTopic}
              media={media}
              setMedia={setMedia}
              onGenerateImage={handleGenerateImage}
              isGeneratingImage={isGeneratingImage}
            />
             <NicheInput 
              niche={niche}
              setNiche={setNiche}
            />
            <HashtagSuggester
                onSuggest={handleSuggestHashtags}
                isLoading={isSuggestingHashtags}
                hashtags={suggestedHashtags}
                onHashtagClick={handleHashtagClick}
                disabled={!originalPost.trim() && !media}
            />
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onPlatformChange={handlePlatformChange}
            />
            
            <div className="border-t border-gray-200 dark:border-slate-700 pt-6 space-y-3">
               <button
                  onClick={handleGeneratePosts}
                  disabled={isActionDisabled || (!originalPost.trim() && !media) || selectedPlatforms.length === 0}
                  className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adapting Content...
                    </>
                  ) : (
                    '✨ Adapt Content for Platforms'
                  )}
                </button>
                 <button
                  onClick={handleGeneratePlan}
                  disabled={isActionDisabled || !originalPost.trim()}
                  className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  {isGeneratingPlan ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Building Your Plan...
                    </>
                  ) : (
                    '🗓️ Generate 30-Day Plan'
                  )}
                </button>
            </div>
          </div>

          {successMessage && !error && (
            <div className="mt-6 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200 p-4 rounded-md" role="status">
              <p className="font-bold">Success!</p>
              <p>{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="mt-10">
            {generatedPosts.length === 0 && contentPlan.length === 0 && !isLoading && !isGeneratingPlan && (
               <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md">
                 <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Your results will appear here</h3>
                 <p className="mt-2 text-gray-500 dark:text-gray-400">Adapt a post for multiple platforms or generate a 30-day content plan!</p>
               </div>
            )}
            
            {contentPlan.length > 0 && <ContentPlanDisplay plan={contentPlan} />}

            {generatedPosts.length > 0 && (
              <div>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleExportPostsJSON}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 text-sm font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    aria-label="Export adapted posts as JSON"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Export All Posts (JSON)
                  </button>
                </div>
                <Tabs posts={generatedPosts} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;