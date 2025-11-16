import React, { useState, useRef } from 'react';
import { Card } from 'src/types/card';
import './CardItem.css';

interface CardItemProps {
  card: Card;
  onClick: (card:Card) => void;
}

function CardItem({ card, onClick }: CardItemProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width * 0.5;
    const centerY = rect.height * 0.5;

    // Subtle rotation (max 5 degrees)
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="card-item"
      onClick={() => onClick(card)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
      }}
    >
      <img
        src={card.imageUrl}
        alt={card.name}
        className="card-item__image"
      />

      {isHovered && card.isFoil &&
        <div
          className="card-item__shine"
          style={{
            background: `
            radial-gradient(circle at ${50 + rotation.y * 2}% ${50 - rotation.x * 2}%,
              rgba(255, 255, 255, 0.84) 0%,
              rgba(255, 200, 255, 0.62) 30%,
              rgba(166, 255, 255, 0.56) 45%,
              rgba(255, 244, 147, 0.53) 60%,
              transparent 90%)`,
            opacity: isHovered ? 0.7 : 0
          }}
        />
      }


    </div>
  );
}

export default CardItem;
