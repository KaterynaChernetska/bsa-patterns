import type { Socket } from "socket.io";

import { ListEvent } from "../common/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";
import { FileLogger } from "../observer/fileLogger";
import { Logger } from "../observer/logger";
import { ConsoleLogger } from "../observer/errorLogger";
const logger = new Logger();

const fileLogger = new FileLogger("app.log");
const consoleLogger = new ConsoleLogger();

logger.subscribe(fileLogger);
logger.subscribe(consoleLogger);

export class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    try {
      const lists = this.db.getData();
      const reorderedLists = this.reorderService.reorder(
        lists,
        sourceIndex,
        destinationIndex
      );
      this.db.setData(reorderedLists);
      this.updateLists();
      logger.log(`INFO: Reordering lists`);
    } catch (error) {
      logger.log(`ERROR: Error reordering lists - ${error.message}`);
    }
  }

  private createList(name: string): void {
    try {
      const lists = this.db.getData();
      const newList = new List(name);
      this.db.setData(lists.concat(newList));
      this.updateLists();
      logger.log(`INFO: Creating list with name ${name}`);
    } catch (error) {
      logger.log(`ERROR: Error creating list - ${error.message}`);
    }
  }

  private deleteList(id: string): void {
    try {
      const lists = this.db.getData();
      const filteredLists = lists.filter((list) => list.id !== id);
      this.db.setData(filteredLists);
      this.updateLists();
      logger.log(`INFO: Deleting list ${id}`);
    } catch (error) {
      logger.log(`ERROR: Error deleting list - ${error.message}`);
    }
  }

  private renameList({ name, listId }): void {
    try {
      const lists = this.db.getData();
      const listToUpdate = lists.find((list) => list.id === listId);
      listToUpdate.name = name;
      this.db.setData(
        lists.map((list) => (list.id === listId ? listToUpdate : list))
      );
      this.updateLists();
      logger.log(`INFO: Renaming list ${listId}`);
    } catch (error) {
      logger.log(`ERROR: Error renaming list - ${error.message}`);
    }
  }
}
