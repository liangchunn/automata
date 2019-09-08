export class Node {
  constructor(
    public label: string,
    public parent: Node | null,
    public children: Node[]
  ) {}
}

export class Tree {
  constructor(public rootNode: Node) {}

  // public static traverse(currentNode: Node, callback: (node: Node) => void) {
  //   for (const children of currentNode.children) {
  //     Tree.traverse(children, callback)
  //   }
  //   callback(currentNode)
  // }
}
