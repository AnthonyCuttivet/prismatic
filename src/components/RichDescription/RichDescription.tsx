import React from 'react';

const KEYWORDS = [
  'ACCELERATE', 'ACTION', 'ASSAULT', 'DEATHKNELL', 'DEFLECT',
  'GANKING', 'HIDDEN', 'LEGION', 'MIGHTY', 'REACTION',
  'SHIELD', 'TANK', 'TEMPORARY', 'VISION', 'ADD'
];

const STATS = ['MIGHT'];
const NUMERICS = ['RUNES', 'RUNE', 'RUNE_BODY', 'RUNE_VIGOR', 'RUNE_CALM', 'RUNE_MIND', 'RUNE_CHAOS', 'RUNE_FURY'];

export const RichDescription: React.FC<{ description: string }> = ({ description }) => {
  // Split by brackets first to handle [KEYWORD]

    const getKeywordColor = (keyword:String) => {
        switch (keyword) {
            case "REACTION":
            case "ACTION":
            case "ACCELERATE":
            case "LEGION":
            case "HIDDEN":
                return "g1";

            case "ADD":
            case "VISION":
            case "MIGHTY":
                return "s";

            case "SHIELD":
            case "ASSAULT":
            case "TANK":
                return "p";

            case "GANKING":
            case "DEFLECT":
            case "TEMPORARY":
            case "DEATHKNELL":
                return "g2";
        }
    }

    const keywordBlock = (partIndex:number, keyword:String, trueKeyword:String ) => {
        return (
            <span key={partIndex} className={`card-detail-overlay__keyword-tag tag-${getKeywordColor(trueKeyword)}`}>
                {keyword}
            </span>
        )
    }

    const iconBlock = (partIndex: number, wordIndex: number, word: string, count: number = 1) => {
        return (
            <React.Fragment key={`${partIndex}-${wordIndex}`}>
            {word.startsWith(' ') && ' '}
            {Array.from({ length: count }).map((_, index) => (
                <img
                key={index}
                src={`/assets/icons/${word.toLowerCase()}.svg`}
                alt={word}
                className="card-detail-overlay__stat-icon"
                />
            ))}
            {word.endsWith(' ') && ' '}
            </React.Fragment>
        );
    };

  const parts = description.split(/(\[[^\]]+\])/g);

  return (
    <span className="card-detail-overlay__rich-description">
      {parts.map((part, partIndex) => {
        // Check if it's a bracketed keyword
        if (part.startsWith('[') && part.endsWith(']')) {
          const keyword = part.slice(1, -1);
          const trueKeyword = keyword.split(/(\W+)/)[0];
          if (KEYWORDS.includes(trueKeyword)) {
            return (keywordBlock(partIndex, keyword, trueKeyword));
          }
          else{
            return iconBlock(partIndex, -1, trueKeyword);
          }
        }

        // For non-bracketed text, split by words and check for stats
        const words = part.split(/(\W+)/);

        return words.map((word, wordIndex) => {
          // Check if it's a stat keyword (replace with icon)
            if(parseInt(word) >= 0){
                if(NUMERICS.includes(words[wordIndex + 2])){
                    return;
                }

                if(words[wordIndex + 2] == 'RUNE_RAINBOW'){
                    return;
                }
            }

            if(word == 'AND')
            {
                return;
            }

            if(word == 'RUNE_RAINBOW')
            {
                return (iconBlock(partIndex,wordIndex,word, parseInt(words[wordIndex-2])));
            }

            if (STATS.includes(word)) {
                return (iconBlock(partIndex,wordIndex,word));
            }

            if(NUMERICS.includes(word))
            {
                let amount:String = '';
                if(!word.includes('_')){
                    amount = words[wordIndex-2];
                }
                return (iconBlock(partIndex,wordIndex,amount+word));
            }

            return <span key={`${partIndex}-${wordIndex}`}>{word}</span>;
        });
      })}
    </span>
  );
};
