import React from 'react';

const KEYWORDS = [
  'ACCELERATE', 'ACTION', 'ASSAULT', 'DEATHKNELL', 'DEFLECT',
  'GANKING', 'HIDDEN', 'LEGION', 'MIGHTY', 'REACTION',
  'SHIELD', 'TANK', 'TEMPORARY', 'VISION', 'ADD'
];

const STATS = ['MIGHT'];
const NUMERICS = ['RUNES']

export const RichDescription: React.FC<{ description: string }> = ({ description }) => {
  // Split by brackets first to handle [KEYWORD]

    const keywordBlock = (partIndex:number, keyword:String ) => {
        return (
            <span key={partIndex} className="card-detail-overlay__keyword-tag">
                {keyword}
            </span>
        )
    }

    const iconBlock = (partIndex:number, wordIndex:number, word:string) => {
        return(
            <React.Fragment key={`${partIndex}-${wordIndex}`}>
                {word.startsWith(' ') && ' '}
                    <img
                        src={`/assets/icons/${word.toLowerCase()}.svg`}
                        alt={word}
                        className="card-detail-overlay__stat-icon"
                    />
                {word.endsWith(' ') && ' '}
            </React.Fragment>
        )
    }

  const parts = description.split(/(\[[^\]]+\])/g);

  return (
    <span className="card-detail-overlay__rich-description">
      {parts.map((part, partIndex) => {
        // Check if it's a bracketed keyword
        if (part.startsWith('[') && part.endsWith(']')) {
          const keyword = part.slice(1, -1);
          const trueKeyword = keyword.split(/(\W+)/)[0];
          if (KEYWORDS.includes(trueKeyword)) {
            return (keywordBlock(partIndex, keyword));
          }
          else{
            return iconBlock(partIndex, -1, trueKeyword);
          }
        }

        // For non-bracketed text, split by words and check for stats
        const words = part.split(/(\W+)/);

        return words.map((word, wordIndex) => {
          // Check if it's a stat keyword (replace with icon)
            if(parseInt(word) >= 0 && NUMERICS.includes(words[wordIndex + 2])){
                return;
            }

            if (STATS.includes(word)) {
                return (iconBlock(partIndex,wordIndex,word));
            }

            if(NUMERICS.includes(word))
            {
                const amount:number = parseInt(words[wordIndex-2]);
                return (iconBlock(partIndex,wordIndex,words[wordIndex-2]+word));
            }

            return <span key={`${partIndex}-${wordIndex}`}>{word}</span>;
        });
      })}
    </span>
  );
};
