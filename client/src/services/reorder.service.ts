import type { DraggableLocation } from "@hello-pangea/dnd";

import { Card, List } from "../common/types";

export const reorderLists = (
  items: List[],
  startIndex: number,
  endIndex: number
): List[] => {
  const removed = items.splice(startIndex, 1)[0];
  items.splice(endIndex, 0, removed);
  return items;
};

const getCardsByListId = (lists: List[], listId: string): Card[] => {
  const list = lists.find((list) => list.id === listId);
  return list?.cards || [];
};
export const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const current: Card[] = getCardsByListId(lists, source.droppableId);

  const next: Card[] = getCardsByListId(lists, destination.droppableId);

  const target: Card = current[source.index];

  if (source.droppableId === destination.droppableId) {
    const reordered: Card[] = moveCardWithinList(
      current,
      source.index,
      destination.index
    );
    return lists.map((list) =>
      list.id === source.droppableId ? { ...list, cards: reordered } : list
    );
  } else {
    const { newSourceList, newDestinationList } = moveCardBetweenLists(
      lists,
      current,
      next,
      source,
      destination,
      target
    );
    return lists.map((list) =>
      list.id === source.droppableId
        ? newSourceList
        : list.id === destination.droppableId
        ? newDestinationList
        : list
    );
  }
};

const moveCardWithinList = (
  cards: Card[],
  startIndex: number,
  endIndex: number
): Card[] => {
  const [removed] = cards.splice(startIndex, 1);
  cards.splice(endIndex, 0, removed);
  return cards;
};

const moveCardBetweenLists = (
  lists: List[],
  sourceList: Card[],
  destinationList: Card[],
  source: DraggableLocation,
  destination: DraggableLocation,
  target: Card
) => {
  const newSourceList = {
    ...lists.find((list) => list.id === source.droppableId),
  };
  const newDestinationList = {
    ...lists.find((list) => list.id === destination.droppableId),
  };

  newSourceList.cards = removeCardFromList(sourceList, source.index);
  newDestinationList.cards = addCardToList(
    destinationList,
    destination.index,
    target
  );

  return { newSourceList, newDestinationList };
};

const removeCardFromList = (cards: Card[], index: number): Card[] => {
  return cards.slice(0, index).concat(cards.slice(index + 1));
};

export const addCardToList = (
  cards: Card[],
  index: number,
  card: Card
): Card[] => {
  return cards.slice(0, index).concat(card).concat(cards.slice(index));
};
