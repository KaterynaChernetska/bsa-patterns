import { Server, Socket } from "socket.io";

import { ListEvent } from "../common/enums";
import { Database } from "../data/database";
import { ReorderService } from "../services/reorder.service";
import { ReorderServiceProxy } from "../services/proxy";

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ReorderServiceProxy;

  protected io: Server;

  public constructor(
    io: Server,
    db: Database,
    reorderService: ReorderServiceProxy
  ) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }
}

export { SocketHandler };
