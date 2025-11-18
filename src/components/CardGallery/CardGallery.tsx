import React, { useState, useEffect } from 'react';
import { fetchAllCards } from 'src/services/riftbound_api';
import { Card } from 'src/types/card';
import CardGrid from 'src/components/CardGrid/CardGrid';
import CardDetailOverlay from 'src/components/CardDetailOverlay/CardDetailOverlay';
import './CardGallery.css';

function CardGallery() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(-1);

  useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        const cardData = await fetchAllCards();

        // Auto-set foil for rare+ cards
        const cardsWithFoil = cardData.map(card => ({
          ...card,
          isFoil: (['rare', 'epic', 'showcase'].includes(card.rarity.toLowerCase()) || (card.tags != null && card.tags.includes('PROMO')))
        }));

        setCards(cardsWithFoil);

        // Preload all card images in background
        cardsWithFoil.forEach(card => {
          const img = new Image();
          img.src = card.imageUrl;
        });

        console.log('Loaded', cardsWithFoil.length, 'cards');
      } catch (err) {
        setError('Failed to load cards. Check console for details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  useEffect(() => {
    if (selectedCardIndex >= 0) {
      // Preload next image
      if (selectedCardIndex < cards.length - 1) {
        const img = new Image();
        img.src = cards[selectedCardIndex + 1].imageUrl;
      }
      // Preload previous image
      if (selectedCardIndex > 0) {
        const img = new Image();
        img.src = cards[selectedCardIndex - 1].imageUrl;
      }
    }
  }, [selectedCardIndex, cards]);

  const handleCardClick = (card: Card) => {
    const index = cards.findIndex(c => c.id === card.id);
    setSelectedCard(card);
    setSelectedCardIndex(index);
  };

  const handleCloseDetail = () => {
    setSelectedCard(null);
    setSelectedCardIndex(-1);
  };

  const handleNextCard = () => {
    if (selectedCardIndex < cards.length - 1) {
      const nextIndex = selectedCardIndex + 1;
      setSelectedCard(cards[nextIndex]);
      setSelectedCardIndex(nextIndex);
    }
  };

  const handlePreviousCard = () => {
    if (selectedCardIndex > 0) {
      const prevIndex = selectedCardIndex - 1;
      setSelectedCard(cards[prevIndex]);
      setSelectedCardIndex(prevIndex);
    }
  };

  if (loading) {
    return (
      <div className="card-gallery__loading">
        Loading cards...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-gallery__error">
        Error: {error}
      </div>
    );
  }

  const uniqueSets = [...new Set(cards.map(card => card.set))];
  const uniqueRarities = [...new Set(cards.map(card => card.rarity))];

  return (
    <div className="card-gallery">
      <header className="card-gallery__header">
        <h1 className="card-gallery__title">
          Riftbound TCG
        </h1>
        <p className="card-gallery__subtitle">
          Card Collection Manager
        </p>
      </header>

      <div className="card-gallery__stats">
        <h2 className="card-gallery__stats-title">Collection Statistics</h2>
        <div className="card-gallery__stats-grid">
          <div>
            <strong>Total Cards:</strong> {cards.length}
          </div>
          <div>
            <strong>Sets:</strong> {uniqueSets.join(', ')}
          </div>
          <div>
            <strong>Rarities:</strong> {uniqueRarities.join(', ')}
          </div>
        </div>
      </div>

      <div className="card-gallery__main">
        <CardGrid
          cards={cards}
          title="All Cards"
          onCardClick={handleCardClick}
        />
      </div>

      {selectedCard && (
        <CardDetailOverlay
          card={selectedCard}
          onClose={handleCloseDetail}
          onNext={handleNextCard}
          onPrevious={handlePreviousCard}
          hasNext={selectedCardIndex < cards.length - 1}
          hasPrevious={selectedCardIndex > 0}
        />
      )}

    </div>
  );
}

export default CardGallery;
