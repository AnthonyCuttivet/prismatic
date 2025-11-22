import { useState, useEffect, useMemo } from 'react';
import { fetchAllCards } from '@/services/riftbound_api';
import { Card } from '@/types/card';
import CardGrid from '@/components/CardGrid/CardGrid';
import CardDetailOverlay from '@/components/CardDetailOverlay/CardDetailOverlay';
import CardFilters from '@/components/CardFilters/CardFilters';

import './CardGallery.css';
import Footer from '../Footer/Footer';

function CardGallery() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(-1);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [selectedSet, setSelectedSet] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['fury', 'calm', 'mind', 'body', 'chaos', 'order']);
  const [energyRange, setEnergyRange] = useState<[number, number]>([0, 12]);
  const [mightRange, setMightRange] = useState<[number, number]>([0, 10]);
  const [powerRange, setPowerRange] = useState<[number, number]>([0, 4]);
  const [hidePromos, sethidePromos] = useState(false);
  const [showOnlyPromos, setShowOnlyPromos] = useState(false);

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

  const uniqueRarities = ['common', 'uncommon', 'rare', 'epic', 'showcase'];
  const uniqueSets = Array.from(new Set(cards.map(card => card.set)));
  const uniqueTypes = Array.from(new Set(cards.map(card => card.type.toLowerCase())));

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          card.name?.toLowerCase().includes(query) ||
          card.description?.toLowerCase().includes(query) ||
          card.artist?.toLowerCase().includes(query) ||
          card.id?.toLowerCase().includes(query) ||
          card.tags?.some(tag => tag.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      // Domain filter (multi-select)
      const hasMatchingDomain = selectedDomains.some(domain =>
        card.domain.includes(domain)
      ) || (card.domain.includes("all") && selectedDomains.length >= 1);
      if (!hasMatchingDomain) return false;

      // Rarity filter
      if (selectedRarity !== 'all' && card.rarity.toLowerCase() !== selectedRarity) {
        return false;
      }

      // Set filter
      if (selectedSet !== 'all' && card.set !== selectedSet) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && card.type.toLowerCase() !== selectedType) {
        return false;
      }

      // Energy range filter
      if (card.runeCost < energyRange[0] || card.runeCost > energyRange[1]) {
        return false;
      }

      // Might range filter
      const might = card.might || 0; // Add powerCost to your Card type
      if (might < mightRange[0] || might > mightRange[1]) {
        return false;
      }

      // Power range filter (assuming you have a powerCost field)
      const power = card.powerCost || 0; // Add powerCost to your Card type
      if (power < powerRange[0] || power > powerRange[1]) {
        return false;
      }

      // Promo filter
      if (hidePromos && card.tags?.includes('PROMO')) {
        return false;
      }

      // Promo Only filter
      if (showOnlyPromos && !card.tags?.includes('PROMO')) {
        return false;
      }

      return true;
    });
  }, [cards, searchQuery, selectedDomains, selectedRarity, selectedSet, selectedType, energyRange, mightRange, powerRange, hidePromos, showOnlyPromos]);

  useEffect(() => {
    filteredCards.forEach(card => {
      const img = new Image();
      img.src = card.imageUrl;
    });
  }, [filteredCards]);

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
    const index = filteredCards.findIndex(c => c.id === card.id);
    setSelectedCard(card);
    setSelectedCardIndex(index);
  };

  const handleCloseDetail = () => {
    setSelectedCard(null);
    setSelectedCardIndex(-1);
  };

  const handleNextCard = () => {
    if (selectedCardIndex < filteredCards.length - 1) {
      const nextIndex = selectedCardIndex + 1;
      setSelectedCard(filteredCards[nextIndex]);
      setSelectedCardIndex(nextIndex);
    }
  };

  const handlePreviousCard = () => {
    if (selectedCardIndex > 0) {
      const prevIndex = selectedCardIndex - 1;
      setSelectedCard(filteredCards[prevIndex]);
      setSelectedCardIndex(prevIndex);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRarity('all');
    setSelectedSet('all');
    setSelectedDomains(['fury', 'calm', 'mind', 'body', 'chaos', 'order']);
    setSelectedType('all');
    setEnergyRange([0, 12]);
    setMightRange([0, 10]);
    setPowerRange([0, 4]);
    sethidePromos(false);
    setShowOnlyPromos(false);
  };

  const activeFiltersCount =
  (searchQuery ? 1 : 0) +
  (6 - selectedDomains.length) +
  (selectedRarity !== 'all' ? 1 : 0) +
  (selectedSet !== 'all' ? 1 : 0) +
  (selectedType !== 'all' ? 1 : 0) +
  ((energyRange[0] > 0 || energyRange[1] < 12) ? 1 : 0) +
  ((mightRange[0] > 0 || mightRange[1] < 10) ? 1 : 0) +
  ((powerRange[0] > 0 || powerRange[1] < 4) ? 1 : 0) +
  (hidePromos ? 1 : 0) +
  (showOnlyPromos ? 1 : 0);

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

  return (
    <div className="card-gallery">
      <header className="card-gallery__header">
        <h1 className="card-gallery__title prismatic-text">
          Prismatic
        </h1>
        <p className="card-gallery__subtitle">
          A minimalistic Riftbound cards gallery
        </p>
      </header>

      <div className="card-gallery__main">
        <CardFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDomains={selectedDomains}
          onDomainsChange={setSelectedDomains}
          selectedRarity={selectedRarity}
          onRarityChange={setSelectedRarity}
          selectedSet={selectedSet}
          onSetChange={setSelectedSet}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          energyRange={energyRange}
          onEnergyChange={setEnergyRange}
          mightRange={mightRange}
          onMightChange={setMightRange}
          powerRange={powerRange}
          onPowerChange={setPowerRange}
          hidePromos={hidePromos}
          onhidePromosChange={sethidePromos}
          showOnlyPromos={showOnlyPromos}
          onShowOnlyPromosChange={setShowOnlyPromos}
          rarities={uniqueRarities}
          sets={uniqueSets}
          types={uniqueTypes}
          onReset={handleResetFilters}
          activeFiltersCount={activeFiltersCount}
        />
        <CardGrid
          cards={filteredCards}
          onCardClick={handleCardClick}
        />
      </div>

      <Footer />

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
