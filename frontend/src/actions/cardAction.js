export const LOAD_CARD = 'LOAD_CARD';

export function loadCard(cards, selectedCard = null) {
  return {
    type: LOAD_CARD,
    cards,
    selectedCard,
  };
}
