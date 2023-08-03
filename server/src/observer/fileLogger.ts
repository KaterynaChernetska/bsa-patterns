import { LogSubscriber } from "./logger";
import * as fs from "fs";

class FileLogger implements LogSubscriber {
  private fileName: string;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  receiveLog(log: string): void {
    fs.appendFileSync(this.fileName, log + "\n");
  }
}

export { FileLogger };
