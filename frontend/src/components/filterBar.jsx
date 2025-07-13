import React from 'react';

const ALL_TAGS = [
  'scenic', 'quiet', 'picnic', 'hiking',
  'swimming', 'family-friendly', 'exercise',
  'wildlife', 'photogenic', 'relaxing', 'trees', 'sand', 'lake'
];

export default function FilterBar({ selectedTags, setSelectedTags }) {
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {ALL_TAGS.map(tag => (
        <button
          key={tag}
          onClick={() => toggleTag(tag)}
          className={`px-3 py-1 text-sm rounded-full border ${
            selectedTags.includes(tag)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
