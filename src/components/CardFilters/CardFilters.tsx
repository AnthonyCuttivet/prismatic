import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import './CardFilters.css';

interface CardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDomains: string[];
  onDomainsChange: (domains: string[]) => void;
  selectedRarity: string;
  onRarityChange: (rarity: string) => void;
  selectedSet: string;
  onSetChange: (set: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  energyRange: [number, number];
  onEnergyChange: (range: [number, number]) => void;
  mightRange: [number, number];
  onMightChange: (range: [number, number]) => void;
  powerRange: [number, number];
  onPowerChange: (range: [number, number]) => void;
  hidePromos: boolean;
  onhidePromosChange: (show: boolean) => void;
  showOnlyPromos: boolean;
  onShowOnlyPromosChange: (show: boolean) => void;
  rarities: string[];
  sets: string[];
  types: string[];
  onReset: () => void;
  activeFiltersCount: number;
}

const DOMAINS = [
  { id: 'fury', name: 'Fury', icon: '/assets/icons/dom_fury.png', color: '#d01b23' },
  { id: 'calm', name: 'Calm', icon: '/assets/icons/dom_calm.png', color: '#488c38' },
  { id: 'mind', name: 'Mind', icon: '/assets/icons/dom_mind.png', color: '#0f6fa6' },
  { id: 'body', name: 'Body', icon: '/assets/icons/dom_body.png', color: '#e87500' },
  { id: 'chaos', name: 'Chaos', icon: '/assets/icons/dom_chaos.png', color: '#643d8a' },
  { id: 'order', name: 'Order', icon: '/assets/icons/dom_order.png', color: '#caad16' },
];

function CardFilters({
  searchQuery,
  onSearchChange,
  selectedDomains,
  onDomainsChange,
  selectedRarity,
  onRarityChange,
  selectedSet,
  onSetChange,
  selectedType,
  onTypeChange,
  energyRange,
  onEnergyChange,
  mightRange,
  onMightChange,
  powerRange,
  onPowerChange,
  hidePromos,
  onhidePromosChange,
  showOnlyPromos,
  onShowOnlyPromosChange,
  rarities,
  sets,
  types,
  onReset,
  activeFiltersCount
}: CardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDomain = (domainId: string) => {
    if (selectedDomains.includes(domainId)) {
      onDomainsChange(selectedDomains.filter(d => d !== domainId));
    } else {
      onDomainsChange([...selectedDomains, domainId]);
    }
  };

  return (
    <div className="card-filters">
      {/* Search Bar - Always Visible */}
      <div className="card-filters__search-section">
        <div className="card-filters__search-wrapper">
          <Search className="card-filters__search-icon" />
          <Input
            type="text"
            placeholder="Search cards"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="card-filters__search-input"
          />
        </div>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="card-filters__toggle"
        >
          {isExpanded ? (
            <>
              Hide Filters <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Filters <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Collapsible Filters */}
      {isExpanded && (
        <div className="card-filters__content">
          {/* Domains */}
          <div className="card-filters__section">
            <Label className="card-filters__label">Domains</Label>
            <div className="card-filters__domains">
              {DOMAINS.map(domain => (
                <button
                  key={domain.id}
                  onClick={() => toggleDomain(domain.id)}
                  className={`card-filters__domain-button ${
                    selectedDomains.includes(domain.id) ? 'card-filters__domain-button--active' : ''
                  }`}
                  style={{
                    '--domain-color': domain.color
                  } as React.CSSProperties}
                >
                  <img src={domain.icon} alt={domain.name} className="card-filters__domain-icon" />
                </button>
              ))}
            </div>
          </div>

          {/* Row 1: Set, Card Type, Rarity */}
          <div className="card-filters__row">
            <div className="card-filters__field">
              <Label className="card-filters__label">Set</Label>
              <Select value={selectedSet} onValueChange={onSetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sets</SelectItem>
                  {sets.map(set => (
                    <SelectItem key={set} value={set}>{set}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="card-filters__field">
              <Label className="card-filters__label">Card Type</Label>
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Card Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Card Types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      <img src={`/assets/icons/type_${type}.png`} alt="" className="select__icon" />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="card-filters__field">
              <Label className="card-filters__label">Rarity</Label>
              <Select value={selectedRarity} onValueChange={onRarityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Rarities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  {rarities.map(rarity => (
                    <SelectItem key={rarity} value={rarity}>
                      <img src={`/assets/icons/rarity_${rarity}.png`} alt="" className="select__icon" />
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sliders Section */}
          <div className="card-filters__sliders">
            {/* Energy Slider */}
            <div className="card-filters__slider-group">
              <div className="card-filters__slider-header">
                <Label className="card-filters__label">Rune Cost (0-12)</Label>
                <span className="card-filters__slider-value">
                  {(energyRange[0] === 0 && energyRange[1] === 12) ? 'Any' : `${energyRange[0]}-${energyRange[1]}`}
                </span>
              </div>
              <Slider
                min={0}
                max={12}
                step={1}
                value={energyRange}
                onValueChange={(value) => onEnergyChange(value as [number, number])}
                className="card-filters__slider"
              />
              <div className="card-filters__slider-labels">
                <span>0</span>
                <span>6</span>
                <span>12</span>
              </div>
            </div>

            {/* Might Slider */}
            <div className="card-filters__slider-group">
              <div className="card-filters__slider-header">
                <Label className="card-filters__label">Might (0-10)</Label>
                <span className="card-filters__slider-value">
                  {(mightRange[0] === 0 && mightRange[1]) === 10 ? 'Any' : `${mightRange[0]}-${mightRange[1]}`}
                </span>
              </div>
              <Slider
                min={0}
                max={10}
                step={1}
                value={mightRange}
                onValueChange={(value) => onMightChange(value as [number, number])}
                className="card-filters__slider"
              />
              <div className="card-filters__slider-labels">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Power Slider */}
            <div className="card-filters__slider-group">
              <div className="card-filters__slider-header">
                <Label className="card-filters__label">Power (0-4)</Label>
                <span className="card-filters__slider-value">
                  {(powerRange[0] === 0 && powerRange[1]) === 4 ? 'Any' : `${powerRange[0]}-${powerRange[1]}`}
                </span>
              </div>
              <Slider
                min={0}
                max={4}
                step={1}
                value={powerRange}
                onValueChange={(value) => onPowerChange(value as [number, number])}
                className="card-filters__slider"
              />
              <div className="card-filters__slider-labels">
                <span>0</span>
                <span>2</span>
                <span>4</span>
              </div>
            </div>
          </div>

          <div className="card-filters__bottom">
            <div className="card-filters__promo-toggle">
              <Switch
                checked={hidePromos}
                onCheckedChange={onhidePromosChange}
                id="show-promos"
              />
              <Label htmlFor="show-promos" className="card-filters__label">
                Hide Promos
              </Label>
            </div>

            <div className="card-filters__promo-toggle">
              <Switch
                checked={showOnlyPromos}
                onCheckedChange={onShowOnlyPromosChange}
                id="show-promos"
                className="[--primary:theme(colors.yellow.500)]"
              />
              <Label htmlFor="show-promos" className="card-filters__label" style={{color: "gold"}}>
                Show Only Promos
              </Label>
            </div>

            <Button
              variant="outline"
              onClick={onReset}
              className="card-filters__reset"
              disabled={activeFiltersCount === 0}
            >
              Reset Filters {`(${activeFiltersCount})`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardFilters;
