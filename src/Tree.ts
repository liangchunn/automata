export class Node {
  constructor(
    public label: string,
    public parent: Node | null,
    public children: Node[]
  ) {}

  public static getDepth(n: Node) {
    if (!n.children.length) {
      return 0
    } else {
      let maxDepth = 0
      for (const child of n.children) {
        maxDepth = Math.max(maxDepth, Node.getDepth(child))
      }
      return maxDepth + 1
    }
  }
}

export class Tree {
  constructor(public rootNode: Node) {}
}
