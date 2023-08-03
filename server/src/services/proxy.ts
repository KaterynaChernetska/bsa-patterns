import { List } from "../data/models/list";
import { ReorderService } from "./reorder.service";

// PATTERN:{Proxy}
class ReorderServiceProxy {
  private reorderService: ReorderService;

  constructor(reorderService: ReorderService) {
    this.reorderService = reorderService;
  }

  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    console.log(
        "reorder cards:", 
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId
    );

    return this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
  }

  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    console.log(  "reorder lists:", items, startIndex, endIndex);
    return this.reorderService.reorder(items, startIndex, endIndex);
  }
}

export { ReorderServiceProxy };
