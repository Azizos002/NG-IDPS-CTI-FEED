import React from 'react';

interface CategoryNavProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryNav({ categories, selected, onSelect }: CategoryNavProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-base ${
            selected === category
              ? 'bg-blue-600 text-white'
              : 'bg-cti-800 text-text-secondary hover:text-foreground hover:bg-cti-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
