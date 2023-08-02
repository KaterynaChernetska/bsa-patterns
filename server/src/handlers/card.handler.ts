import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, "");
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );
    this.db.setData(updatedLists);
    this.updateLists();
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }
  private deleteCard(listId: string, cardId: string): void {
    const lists = this.db.getData();
    const listIndex = lists.findIndex((list) => list.id === listId);

    if (listIndex === -1) return;

    lists[listIndex].cards = lists[listIndex].cards.filter(
      (card) => card.id !== cardId
    );

    this.db.setData(lists);
    this.updateLists();
  }

  private renameCard(name: string, listId: string, cardId: string) {
    console.log(name);
    console.log(listId);
    console.log("cardId", cardId);
    const lists = this.db.getData();
    const listToUpdate = lists.find((list) => list.id === listId);
    const cardToUpdate = listToUpdate.cards.find((card) => card.id === cardId);
    cardToUpdate.name = name;
    this.db.setData(
      lists.map((list) => (list.id === listId ? listToUpdate : list))
    );
    this.updateLists();
  }

  private changeDescription(
    newDescription: string,
    listId: string,
    cardId: string
  ) {
    const lists = this.db.getData();
    const listToUpdate = lists.find((list) => list.id === listId);
    const cardToUpdate = listToUpdate.cards?.find((card) => card.id === cardId);

    cardToUpdate.description = newDescription;
    this.db.setData(
      lists.map((list) => (list.id === listId ? listToUpdate : list))
    );
    this.updateLists();
  }
}
