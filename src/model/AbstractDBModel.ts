class AbstractDBModel {
  id: string;
  rev: string;

  constructor(id: string, rev: string) {
    this.id = id;
    this.rev = rev;
  }
}

export default AbstractDBModel;