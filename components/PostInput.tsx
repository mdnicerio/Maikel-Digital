import React from 'react';
import type { UploadedMedia } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface PostInputProps {
  postContent: string;
  setPostContent: (content: string) => void;
  onSuggestTopic: () => void;
  isSuggestingTopic: boolean;
  onExpandTopic: () => void;
  isExpandingTopic: boolean;
  media: UploadedMedia | null;
  setMedia: (media: UploadedMedia | null) => void;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
}

export const PostInput: React.FC<PostInputProps> = ({
  postContent,
  setPostContent,
  onSuggestTopic,
  isSuggestingTopic,
  onExpandTopic,
  isExpandingTopic,
  media,
  setMedia,
  onGenerateImage,
  isGeneratingImage,
}) => {
  const charCount = postContent.length;

  const handleRemoveMedia = () => {
    setMedia(null);
  }

  const handleDownloadImage = () => {
    if (!media) return;
    const link = document.createElement('a');
    link.href = `data:${media.mimeType};base64,${media.base64}`;
    link.download = media.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
        <label htmlFor="post-input" className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
          1. Create Your Content
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={onSuggestTopic}
            disabled={isSuggestingTopic || isExpandingTopic}
            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-700 text-sm font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSuggestingTopic ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Thinking...
              </>
            ) : (
              '🤖 Suggest a topic'
            )}
          </button>
          <button
            onClick={onExpandTopic}
            disabled={isExpandingTopic || isSuggestingTopic || !postContent.trim()}
            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-700 text-sm font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExpandingTopic ? (
              <>
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Expanding...
              </>
            ) : (
              '✍️ Expand with AI'
            )}
          </button>
        </div>
      </div>

       {/* Media Section Simplified */}
      <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800/20">
        {isGeneratingImage ? (
          <div className="text-center">
              <svg className="animate-spin mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Generating your image...
              </p>
              <p className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                  The AI is getting creative. This may take a moment.
              </p>
          </div>
        ) : !media ? (
            <div>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-3">
                    Optionally, generate an image to go with your post.
                </p>
                <button
                    onClick={onGenerateImage}
                    disabled={!postContent.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 text-sm font-semibold py-2.5 px-3 rounded-lg hover:bg-indigo-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    ✨ Generate Image from Text
                </button>
            </div>
        ) : (
          <div className="relative">
              <div className="flex items-center gap-4">
                  <img src={`data:${media.mimeType};base64,${media.base64}`} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-grow text-sm overflow-hidden">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{media.name}</p>
                      <p className="text-gray-500 dark:text-gray-400">AI-Generated Image</p>
                      <button
                          onClick={handleDownloadImage}
                          className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          aria-label="Download generated image"
                      >
                          <DownloadIcon className="w-4 h-4" />
                          Download Image
                      </button>
                  </div>
              </div>
              <button
                  onClick={handleRemoveMedia}
                  className="absolute top-0 right-0 p-1 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                  aria-label="Remove media"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </div>
        )}
      </div>

      <div className="relative mt-4">
        <textarea
          id="post-input"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder={media ? "Describe the generated image or add a caption..." : "What's on your mind? Type your announcement, idea, or update here..."}
          className="w-full h-28 p-4 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
        />
        <div className="absolute bottom-3 right-3 text-sm text-gray-500 dark:text-gray-400">
          {charCount} characters
        </div>
      </div>
    </div>
  );
};