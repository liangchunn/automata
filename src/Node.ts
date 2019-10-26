export class Node {
  constructor(
    public label: string,
    public parent: Node | null,
    public children: Node[]
  ) {}
}
