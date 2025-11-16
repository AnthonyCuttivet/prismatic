import React from 'react';
import { Card } from 'src/types/card';
import CardItem from 'src/components/CardItem/CardItem';
import './CardGrid.css';

interface CardGridProps {
  cards: Card[];
  title?: string;
  onCardClick: (card: Card) => void;
}

function CardGrid({ cards, title, onCardClick }: CardGridProps) {
  return (
    <div className="card-grid">
      {title && (
        <h2 className="card-grid__header">
          {title} ({cards.length} cards)
        </h2>
      )}

      <div className="card-grid__container">
        {cards.map(card => (
          <CardItem
            key={card.id}
            card={card}
            onClick={onCardClick}
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
