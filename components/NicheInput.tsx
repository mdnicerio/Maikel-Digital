import React from 'react';

interface NicheInputProps {
  niche: string;
  setNiche: (niche: string) => void;
}

export const NicheInput: React.FC<NicheInputProps> = ({ niche, setNiche }) => {
  return (
    <div>
      <label htmlFor="niche-input" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
        2. Define Your Niche (Optional)
      </label>
      <input
        id="niche-input"
        type="text"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        placeholder="e.g., 'early-stage tech startups', 'fitness enthusiasts', 'local coffee shop owners'"
        className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
};
