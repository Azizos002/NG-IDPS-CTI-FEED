import React from 'react';

interface CategoryNavProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryNav({ categories, selected, onSelect }: CategoryNavProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 custom-scrollbar">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wide whitespace-nowrap transition-base border ${
            selected === category
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-100 hover:border-slate-700'
          }`}
        >
          {category.replaceAll('_', ' ')}
        </button>
      ))}
    </div>
  );
}
