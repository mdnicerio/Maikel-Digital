import React, { useState, useEffect } from 'react';
import type { GeneratedPost } from '../types';
import { PLATFORMS } from '../constants';
import { ResultCard } from './ResultCard';

interface TabsProps {
  posts: GeneratedPost[];
}

export const Tabs: React.FC<TabsProps> = ({ posts }) => {
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    // Set the first post as active by default, or if the activeTab is no longer in the posts list
    if (posts.length > 0 && !posts.find(p => p.platform === activeTab)) {
      setActiveTab(posts[0].platform);
    }
  }, [posts, activeTab]);

  if (posts.length === 0) {
    return null;
  }

  const activePost = posts.find(post => post.platform === activeTab);
  const activePlatformDetails = PLATFORMS.find(p => p.id === activeTab);

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
          {posts.map(post => {
            const platform = PLATFORMS.find(p => p.id === post.platform);
            if (!platform) return null;
            const isActive = activeTab === post.platform;
            return (
              <button
                key={platform.id}
                onClick={() => setActiveTab(platform.id)}
                className={`whitespace-nowrap flex items-center gap-2 py-3 px-1 border-b-4 text-sm font-medium transition-colors duration-200 focus:outline-none
                  ${
                    isActive
                      ? `text-indigo-600 dark:text-indigo-400`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-slate-500'
                  }
                `}
                style={isActive ? { borderColor: platform.color } : {}}
                aria-current={isActive ? 'page' : undefined}
              >
                <platform.Icon className="w-5 h-5" />
                {platform.name}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="pt-6">
        {activePost && activePlatformDetails && (
          <ResultCard
            key={activePost.platform}
            platform={activePlatformDetails}
            content={activePost.content}
          />
        )}
      </div>
    </div>
  );
};
