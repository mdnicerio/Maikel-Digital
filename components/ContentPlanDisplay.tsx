import React, { useState } from 'react';
import type { ContentPlanDay } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { CopyIcon } from './icons/CopyIcon';

interface ContentPlanDisplayProps {
  plan: ContentPlanDay[];
}

interface CopiedState {
  type: 'topic' | 'snippet';
  day: number;
}

const CopyButton: React.FC<{text: string; onCopy: () => void; isCopied: boolean; type: string}> = ({text, onCopy, isCopied, type}) => (
    <button 
        onClick={onCopy}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors relative"
        aria-label={`Copy ${type}`}
    >
        {isCopied ? (
            <span className="text-xs text-indigo-500 font-semibold">Copied!</span>
        ) : (
            <CopyIcon className="w-4 h-4" />
        )}
    </button>
);

export const ContentPlanDisplay: React.FC<ContentPlanDisplayProps> = ({ plan }) => {
  const [copiedState, setCopiedState] = useState<CopiedState | null>(null);

  const handleCopy = (text: string, type: 'topic' | 'snippet', day: number) => {
    navigator.clipboard.writeText(text);
    setCopiedState({ type, day });
    setTimeout(() => {
        setCopiedState(null);
    }, 2000);
  };

  const handleExportCSV = () => {
    if (!plan || plan.length === 0) return;

    const formatCSVCell = (text: string | number): string => {
        const str = String(text);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const headers = ['Day', 'Topic Idea', 'Post Snippet'];
    const csvRows = [
        headers.join(','), 
        ...plan.map(item => [
            item.day,
            formatCSVCell(item.topic),
            formatCSVCell(item.snippet)
        ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', '30-day-content-plan.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-5 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Your 30-Day Content Plan
          </h3>
          <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 text-sm font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              aria-label="Export content plan as CSV"
          >
              <DownloadIcon className="w-4 h-4" />
              Export as CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200 dark:border-slate-700 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">Day</div>
              <div className="col-span-5">Topic Idea</div>
              <div className="col-span-6">Post Snippet</div>
            </div>
            {/* Body */}
            <div className="space-y-2 mt-2">
              {plan.map((item) => (
                <div 
                  key={item.day} 
                  className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800/50"
                >
                  <div className="col-span-1 font-bold text-indigo-600 dark:text-indigo-400">{item.day}</div>
                  <div className="col-span-5 flex justify-between items-center gap-2">
                    <span className="font-medium">{item.topic}</span>
                    <CopyButton 
                        text={item.topic}
                        type="topic"
                        onCopy={() => handleCopy(item.topic, 'topic', item.day)}
                        isCopied={copiedState?.type === 'topic' && copiedState?.day === item.day}
                    />
                  </div>
                  <div className="col-span-6 flex justify-between items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400 italic">"{item.snippet}"</span>
                     <CopyButton 
                        text={item.snippet}
                        type="snippet"
                        onCopy={() => handleCopy(item.snippet, 'snippet', item.day)}
                        isCopied={copiedState?.type === 'snippet' && copiedState?.day === item.day}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};