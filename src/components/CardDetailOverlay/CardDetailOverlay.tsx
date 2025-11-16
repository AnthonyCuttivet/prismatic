import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'src/types/card';
import './CardDetailOverlay.css';

interface CardDetailOverlayProps {
  card: Card;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

function CardDetailOverlay({ card, onClose, onNext, onPrevious, hasNext, hasPrevious }: CardDetailOverlayProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [showFoil, setShowFoil] = useState(card.isFoil || false);
  const [forceShine, setForceShine] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

    if(leaveTimeoutRef.current)
    {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width * 0.5;
    const centerY = rect.height * 0.5;

    // Calculate rotation (max 20 degrees)
    const rotateY = ((x - centerX) / centerX) * 20;
    const rotateX = ((centerY - y) / centerY) * 20;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setRotation({ x: 0, y: 0 });
    }, 150);
  };

  const handleFoilToggle = () => {
    setShowFoil(!showFoil);

    // Trigger a brief shine effect
    if (!showFoil) {
      // Turning foil ON - show a quick shine
      setForceShine(true);
      setTimeout(() => setForceShine(false), 200);
    }
  };

  useEffect(() => {
    setRotation({ x: 0, y: 0 });
    setShowFoil(card.isFoil || false);
  }, [card.id, card.isFoil]);

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

  // Get rarity color
  const getRarityColor = (rarity: string): string => {
    const colors: { [key: string]: string } = {
      common: '#a9bac6',
      uncommon: '#a6f1eb',
      rare: '#CC27F5',
      epic: '#ff9532',
      showcase: '#ffd000',
    };
    return colors[rarity.toLowerCase()] || '#667eea';
  };

  const getDomainColor = (domain: string): string => {
    const colors: { [key: string]: string } = {
      fury: '#ff000b',
      calm: '#25c300',
      mind: '#00a2ff',
      chaos: '#8100ff',
      body: '#ff8100',
      order: '#ffd600'
    };
    return colors[domain.toLowerCase()] || '#667eea';
  };

  // Get RGB values for rarity color (for rgba backgrounds)
  const getRarityRGB = (rarity: string): string => {
    const rgbColors: { [key: string]: string } = {
      common: '169, 186, 198',
      uncommon: '166, 241, 235',
      rare: '204, 39, 245',
      epic: '255, 149, 50',
      showcase: '255, 208, 0',
    };
    return rgbColors[rarity.toLowerCase()] || '102, 126, 234';
  };

  const domain1Color = getDomainColor(card.domain[0]);
  const domain2Color = getDomainColor(card.domain.length == 2 ? card.domain[1] : card.domain[0]);
  const rarityColor = getRarityColor(card.rarity);
  const rarityRGB = getRarityRGB(card.rarity);

  return (
    <div className="card-detail-overlay" onClick={onClose}>

      {hasPrevious && (
        <button
          className="card-detail-overlay__nav card-detail-overlay__nav--prev"
          onClick={(e) => {
             e.stopPropagation();
              onPrevious?.();
          }}
          aria-label="Previous card"
        >
        ‹
        </button>
      )}

      <div
        className="card-detail-overlay__content"
        onClick={(e) => e.stopPropagation()}
      >
      {/* Left side - Card Image 3D */}
      <div
        ref={imageRef}
        className="card-detail-overlay__image-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={imageRef}
          className="card-detail-overlay__image-container"
          style={{
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: rotation.x === 0 && rotation.y === 0
              ? 'transform 0.2s ease-out'
              : 'transform 0.1s ease-out'
          }}
        >
          <img
            src={card.imageUrl}
            alt={card.name}
            className="card-detail-overlay__image"
          />
          {showFoil &&
            <div
            className="card-detail-overlay__shine"
            style={{
              background: `
              radial-gradient(circle 35vw at ${50 + rotation.y * 2}% ${50 - rotation.x * 2}%,
              rgba(255, 255, 255, 1.0) 0%,
              rgba(255, 200, 255, 0.85) 35%,
              rgba(166, 255, 255, 0.9) 55%,
              rgba(255, 253, 151, 0.95) 75%,
              transparent 95%)`,
            opacity: forceShine ? 0.25 : (Math.abs(rotation.x) > 1 || Math.abs(rotation.y) > 1 ? 0.6 : 0),
            transition: forceShine ? 'opacity 0.8s ease-out' : 'opacity 0.3s ease-out'
            }}
            />
          }
        </div>
      </div>

        {/* Right side - Card Details */}
        <div
          className="card-detail-overlay__details"
          style={{
            '--domain1-color': domain1Color,
            '--domain2-color': domain2Color,
            '--rarity-color': rarityColor,
            '--rarity-rgb': rarityRGB
          } as React.CSSProperties}
        >
          <button
            className="card-detail-overlay__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          <h2 className="card-detail-overlay__title">{card.name}</h2>

          <div className="card-detail-overlay__meta">
            <span className={`card-detail-overlay__rarity`}>
              <img src={`/assets/icons/rarity_${card.rarity}.png`} alt="" className="card-detail-overlay__icon" />
              {card.rarity}
            </span>
            <span className="card-detail-overlay__type">{card.type}</span>
          </div>

          {(card.runeCost > 0 || card.might > 0) &&
          <div className="card-detail-overlay__stats">
          {card.runeCost > 0 &&
            <div className="card-detail-overlay__stat">
              <span className="card-detail-overlay__stat-label">Rune Cost</span>
              <span className="card-detail-overlay__stat-value card-detail-overlay__stat-value--circle">
                {card.runeCost > 0 ? card.runeCost : "0"}
              </span>
            </div>
          }

          {card.might > 0 &&
            <div className="card-detail-overlay__stat">
              <span className="card-detail-overlay__stat-label">Might</span>
              <span className="card-detail-overlay__stat-value">
                <img src="/assets/icons/might.svg" alt="" className="card-detail-overlay__icon-inline" />
                {card.might > 0 ? card.might : "-"}
              </span>
            </div>

          }
          </div>
          }

          <div className="card-detail-overlay__section">
            <h3 className="card-detail-overlay__section-title">Description</h3>
            <p className="card-detail-overlay__description">{card.description.length > 0 ? card.description : "-"}</p>
          </div>

          {card.domain && card.domain.length > 0 && (
            <div className="card-detail-overlay__section">
              <h3 className="card-detail-overlay__section-title">{card.domain.length <= 1 ? "Domain" : "Domains"}</h3>
              <div className="card-detail-overlay__tags">
                {card.domain.map((d, index) => (
                    <span
                    key={d}
                    className="card-detail-overlay__tag card-detail-overlay__tag--domain"
                    style={{
                        '--domain-color': `var(--domain${index + 1}-color)`,
                        color: `#0a0a0a`,
                        backgroundColor: `var(--domain${index + 1}-color)`
                    } as React.CSSProperties}
                    >
                      <img src={`/assets/icons/dom_${d}.png`} alt="" className="card-detail-overlay__icon card-detail-overlay__icon-black" />
                      {d}
                    </span>
                ))}
                </div>
            </div>
          )}

          {card.tags && card.tags.length > 0 && (
            <div className="card-detail-overlay__section">
              <h3 className="card-detail-overlay__section-title">Tags</h3>
              <div className="card-detail-overlay__tags">
                {card.tags.map(tag => (
                  <span key={tag} className="card-detail-overlay__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="card-detail-overlay__footer">
            <div className="card-detail-overlay__info">
              <span><strong>Set:</strong> {card.set}</span>
              <span><strong>Card Number:</strong> {card.cardNumber}</span>
              <div className="card-detail-overlay__artist">
                <strong>Artist:</strong> {card.artist}
              </div>
            </div>
            <button
              className={`card-detail-overlay__foil-toggle ${showFoil ? 'card-detail-overlay__foil-toggle--active' : ''}`}
              onClick={handleFoilToggle}
            >
              Toggle Foil
            </button>
          </div>
        </div>
      </div>

      {hasNext && (
        <button
          className="card-detail-overlay__nav card-detail-overlay__nav--next"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          aria-label="Next card"
        >
          ›
        </button>
      )}

    </div>
  );
}

export default CardDetailOverlay;
