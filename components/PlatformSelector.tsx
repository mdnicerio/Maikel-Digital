import React from 'react';
import { PLATFORMS } from '../constants';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformChange: (platformId: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatforms, onPlatformChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
        3. Select Target Platforms
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PLATFORMS.map(({ id, name, Icon, color }) => {
          const isSelected = selectedPlatforms.includes(id);
          return (
            <button
              key={id}
              onClick={() => onPlatformChange(id)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                  : 'border-gray-300 dark:border-slate-600 bg-transparent hover:border-gray-400 dark:hover:border-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" style={{ color: isSelected ? color : 'currentColor' }}/>
              <span className="font-semibold text-sm">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
