import React, { useState, useRef } from 'react';
import { Card } from '@/types/card';
import './CardItem.css';

interface CardItemProps {
  card: Card;
  onClick: (card:Card) => void;
  isImageLoaded?: boolean;
  onImageLoaded?: () => void;

}

function CardItem({ card, onClick, onImageLoaded }: CardItemProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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

  const handleImageLoad = () => {
    if(imageLoaded){return;}
    setTimeout(() => {
      setImageLoaded(true);
      onImageLoaded?.();
    }, 100);
  };

  // Reset when card changes
  // React.useEffect(() => {
  //   setImageLoaded(false);
  // }, [card.id]);

  return (
      <div
      ref={cardRef}
      className={`card-item ${imageLoaded ? 'card-item--loaded' : ''}`}
      onClick={() => onClick(card)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
      }}
    >
      <div className='card-flip-inner'>
        <div className="card-item__back">
          <img
            src="/assets/card-back.png"
            alt="Card back"
            className="card-item__image"
          />
        </div>
        <div className="card-item__front">
          <img
            onLoad={handleImageLoad}
            src={card.imageUrl}
            alt={card.name}
            className="card-item__image"
          />
          {isHovered && card.isFoil && (
            <div
              className="card-item__shine"
              style={{
                background: `radial-gradient(circle at ${50 + rotation.y * 10}% ${50 - rotation.x * 10}%,
                  rgba(255, 255, 255, 0.4) 0%,
                  transparent 50%)`,
                opacity: 0.6
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CardItem;
