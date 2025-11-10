import React, 'react';
import type { Platform } from '../types';
import { HeartIcon } from './icons/HeartIcon';
import { CommentIcon } from './icons/CommentIcon';
import { ShareIcon } from './icons/ShareIcon';

interface ResultCardProps {
  platform: Platform;
  content: string;
}

const PREVIEW_TRUNCATE_LENGTH = 250;

export const ResultCard: React.FC<ResultCardProps> = ({ platform, content }) => {
  const [copied, setCopied] = React.useState(false);
  const { name, Icon, color, charLimit, id } = platform;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedContent = content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  const charCount = content.length;
  const isOverLimit = charLimit ? charCount > charLimit : false;

  const isTruncated = content.length > PREVIEW_TRUNCATE_LENGTH;
  const previewContent = isTruncated ? content.substring(0, PREVIEW_TRUNCATE_LENGTH) : content;

  const renderPlatformHandle = () => {
    switch(id) {
        case 'twitter': return <span className="text-gray-500 dark:text-gray-400">@yourhandle</span>;
        case 'linkedin': return <span className="text-gray-500 dark:text-gray-400">Your Name • 1st</span>;
        case 'instagram': return <span className="font-semibold text-sm">yourhandle</span>;
        case 'facebook': return <span className="text-gray-500 dark:text-gray-400 text-sm">Just now</span>;
        default: return null;
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="p-5" style={{ borderTop: `4px solid ${color}` }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8" style={{ color }}/>
            <h3 className="text-xl font-bold" style={{ color }}>{name}</h3>
          </div>
          {charLimit && (
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                isOverLimit 
                ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50' 
                : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700'
            }`}>
                {charCount} / {charLimit}
            </span>
          )}
        </div>
        
        {/* Platform Preview */}
        <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Preview</h4>
            <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-gray-50 dark:bg-slate-900/50">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-slate-600 mr-3"></div>
                    <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{id === 'instagram' ? '' : 'Your Name'}</p>
                        {renderPlatformHandle()}
                    </div>
                </div>
                <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {previewContent}
                    {isTruncated && <span className="text-blue-500 cursor-pointer">... see more</span>}
                </div>
                <div className="flex items-center gap-6 mt-4 text-gray-500 dark:text-gray-400">
                    <HeartIcon className="w-5 h-5" />
                    <CommentIcon className="w-5 h-5" />
                    <ShareIcon className="w-5 h-5" />
                </div>
            </div>
        </div>

        {/* Copyable Content */}
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Copyable Content</h4>
                <button
                    onClick={handleCopy}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                    copied
                        ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200'
                        : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200'
                    }`}
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap p-4 bg-gray-100 dark:bg-slate-700/50 rounded-lg">
                <p>{formattedContent}</p>
            </div>
        </div>
      </div>
    </div>
  );
};