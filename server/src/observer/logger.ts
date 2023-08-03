

interface LogSubscriber {
  receiveLog(log: string): void;
}
class Logger {
  private subscribers: LogSubscriber[] = [];

  public subscribe(subscriber: LogSubscriber): void {
    this.subscribers.push(subscriber);
  }

  public log(log: string): void {
   
    this.subscribers.forEach((subscriber) => subscriber.receiveLog(log));
  }
}

export { Logger, LogSubscriber };
