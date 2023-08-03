import { LogSubscriber } from "./logger";

class ConsoleLogger implements LogSubscriber {
  receiveLog(log: string): void {
    if (log.includes("ERROR")) {
      console.error(log);
    }
  }
}

export { ConsoleLogger };
