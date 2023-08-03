import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";
import { Logger } from "../observer/logger";
import { FileLogger } from "../observer/fileLogger";
import { ConsoleLogger } from "../observer/errorLogger";
const logger = new Logger();

const fileLogger = new FileLogger("app.log");
const consoleLogger = new ConsoleLogger();

logger.subscribe(fileLogger);
logger.subscribe(consoleLogger);

export class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
    socket.on(CardEvent.MAKE_COPY, this.makeCardCopy.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    try {
      const newCard = new Card(cardName, "");
      const lists = this.db.getData();

      const updatedLists = lists.map((list) =>
        list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
      );
      this.db.setData(updatedLists);
      this.updateLists();
      logger.log(`INFO: Creating card "${cardName}" in list "${listId}"`);
    } catch (error) {
      logger.log(`ERROR: Error creating card - ${error.message}`);
    }
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
    try {
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
      logger.log(`INFO: Reordering card in list "${sourceListId}"`);
    } catch (error) {
      logger.log(`ERROR: Error reorder card - ${error.message}`);
    }
  }

  private deleteCard(listId: string, cardId: string): void {
    try {
      const lists = this.db.getData();
      const listIndex = lists.findIndex((list) => list.id === listId);

      if (listIndex === -1) return;

      lists[listIndex].cards = lists[listIndex].cards.filter(
        (card) => card.id !== cardId
      );

      this.db.setData(lists);
      this.updateLists();
      logger.log(`INFO: Deleteting card "${cardId}" in list "${listId}"`);
    } catch (error) {
      logger.log(`ERROR: Error deleting card - ${error.message}`);
    }
  }

  private renameCard(name: string, listId: string, cardId: string) {
    try {
      const lists = this.db.getData();
      const listToUpdateIndex = lists.findIndex((list) => list.id === listId);

      if (listToUpdateIndex === -1) return;
      const listToUpdate = lists[listToUpdateIndex];
      const cardToUpdate = listToUpdate.cards?.find(
        (card) => card.id === cardId
      );

      if (!cardToUpdate) return;
      cardToUpdate.name = name;
      lists[listToUpdateIndex] = listToUpdate;
      this.db.setData(lists);
      this.updateLists();
      logger.log(`INFO: Renaming card "${cardId}" in list "${listId}"`);
    } catch (error) {
      logger.log(`ERROR: Error renaming card - ${error.message}`);
    }
  }

  private changeDescription(
    newDescription: string,
    listId: string,
    cardId: string
  ) {
    try {
      const lists = this.db.getData();
      const listToUpdateIndex = lists.findIndex((list) => list.id === listId);

      if (listToUpdateIndex === -1) return;
      const listToUpdate = lists[listToUpdateIndex];
      const cardToUpdate = listToUpdate.cards?.find(
        (card) => card.id === cardId
      );

      if (!cardToUpdate) return;
      cardToUpdate.description = newDescription;
      lists[listToUpdateIndex] = listToUpdate;
      this.db.setData(lists);
      this.updateLists();
      logger.log(
        `INFO: Change description of card "${cardId}" in list "${listId}"`
      );
    } catch (error) {
      logger.log(
        `ERROR: Error changing card description card - ${error.message}`
      );
    }
  }

  private makeCardCopy(listId: string, cardId: string) {
    try {
      const lists = this.db.getData();
      const listToUpdateIndex = lists.findIndex((list) => list.id === listId);

      if (listToUpdateIndex === -1) return;

      const listToUpdate = lists[listToUpdateIndex];
      const cardToCopy = listToUpdate.cards.find((card) => card.id === cardId);

      if (!cardToCopy) return;

      const clonedCard = cardToCopy.clone();

      listToUpdate.cards.push(clonedCard);
      lists[listToUpdateIndex] = listToUpdate;

      this.db.setData(lists);
      this.updateLists();
      logger.log(`INFO: Copy card "${cardId}" in list "${listId}"`);
    } catch (error) {
      logger.log(`ERROR: Error make copy of card - ${error.message}`);
    }
  }
}
