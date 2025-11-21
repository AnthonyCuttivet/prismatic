import React, { useRef, useState } from 'react';
import { Card } from '@/types/card';
import CardItem from '@/components/CardItem/CardItem';
import { ButtonGroup } from '../ui/button-group';
import { Button } from '../ui/button';

import { PlusIcon, MinusIcon } from 'lucide-react';

import './CardGrid.css';

interface CardGridProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
}

function CardGrid({ cards, onCardClick }: CardGridProps) {

  const loadedImagesRef = useRef<Set<string>>(new Set());

  const [gridColumns, setGridColumns] = useState(6);

  const handleAddGridColumn = () => {
    if (gridColumns >= 10) { return }
      setGridColumns(gridColumns + 1);

  }

  const handleRemoveGridColumn = () => {
    if (gridColumns <= 3) { return }
      setGridColumns(gridColumns - 1);
  }

  return (
    <div className="card-grid">
      <div className="card-grid__header">
        <h2 className="card-grid__header-text">
          Showing {cards.length} cards
        </h2>
        <ButtonGroup>
          <Button variant="outline" onClick={handleRemoveGridColumn} disabled={gridColumns <= 3}>
            <MinusIcon></MinusIcon>
          </Button>
          <Button variant="outline" className="cursor-default">
            {gridColumns}
          </Button>
          <Button variant="outline" onClick={handleAddGridColumn} disabled={gridColumns >= 10}>
            <PlusIcon></PlusIcon>
          </Button>
        </ButtonGroup>
      </div>

      <div className="card-grid__container" style={{'--grid': gridColumns} as React.CSSProperties}>
        {cards.map(card => (
          <CardItem
            key={card.id}
            card={card}
            onClick={onCardClick}
            isImageLoaded={loadedImagesRef.current.has(card.imageUrl)}
            onImageLoaded={() => loadedImagesRef.current.add(card.imageUrl)}
          />
        ))}
      </div>

      {cards.length === 0 && (
        <p className="card-grid__empty">
          No cards to display
        </p>
      )}
    </div>
  );
}

export default CardGrid;
