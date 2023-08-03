import { randomUUID } from "crypto";

class Card {
  public id: string;

  public name: string;

  public description: string;

  public createdAt: Date;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.id = randomUUID();
  }

  // PATTERN:{PROTOTYPE}
  public clone(): Card {
    const clone = Object.create(this);
    clone.description = this.description;
    clone.createdAt = new Date();
    clone.id = randomUUID();
    clone.name = this.name;
    return clone;
  }
}

export { Card };
