
import React from 'react';

interface HashtagSuggesterProps {
  onSuggest: () => void;
  isLoading: boolean;
  hashtags: string[];
  onHashtagClick: (hashtag: string) => void;
  disabled: boolean;
}

export const HashtagSuggester: React.FC<HashtagSuggesterProps> = ({
  onSuggest,
  isLoading,
  hashtags,
  onHashtagClick,
  disabled,
}) => {
  return (
    <div className="mt-2">
      <button
        onClick={onSuggest}
        disabled={isLoading || disabled}
        className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-slate-700 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Suggesting...
          </>
        ) : (
          '💡 Suggest Hashtags'
        )}
      </button>

      {hashtags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Hashtag suggestions">
          {hashtags.map((tag, index) => (
            <button
              key={index}
              onClick={() => onHashtagClick(tag)}
              className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-3 py-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
              title={`Add #${tag} to your post`}
            >
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
