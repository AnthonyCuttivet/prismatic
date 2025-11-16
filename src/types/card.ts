export interface Card {
    id: string;
    name: string;
    rarity: string;
    type: string;
    runeCost: number;
    might: number;
    description: string;
    imageUrl: string;
    domain: string[];
    set: string;
    cardNumber: string;
    artist: string;
    tags: string[];
    isFoil?:boolean;
}

export interface CardData {
    cards: Card[];
}
