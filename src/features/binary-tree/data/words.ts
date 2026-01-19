export const XOR1 = `
# XOR
## The XOR (Exclusive OR) operation is a straightforward bitwise logic function. In the context of Kademlia, a peer-to-peer network algorithm, XOR serves a unique role as a distance metric:`;
export const XOR = `
## **Basic Function**:
### XOR compares two bits, outputting 1 if they differ and 0 if they are the same. For example, 1 ⊕ 0 = 1, but 1 ⊕ 1 = 0.
## **Kademlia Distance Metric**:
### It measures the 'distance' between node IDs or between a node ID and a data key in the Kademlia network. This distance is calculated by XORing the two IDs and interpreting the result as an integer.
## **Network Structure**:
### In Kademlia, this XOR distance shapes the network's topology, determining how nodes store and locate data. Nodes closer in XOR distance are more likely to have relevant data paths or information.
`;

export const BIN = `# XOR & BINARY TREES
## The XOR distance metric used in Kademlia conceptually aligns with the structure of a binary tree.

1. **Binary Tree Structure**: A binary tree is a hierarchical structure where each node has two children, commonly referred to as the left and right child. The position of each node in the tree is determined by a series of binary decisions (left or right) starting from the root.

2. **Binary Representation of Node IDs**: In Kademlia, each node has a unique binary ID. If we consider these IDs as paths in a binary tree, each bit in the ID determines a left or right branch at each level of the tree.

3. **XOR Distance and Tree Paths**: The XOR operation effectively measures the "distance" between two nodes by comparing their binary IDs bit by bit. The XOR metric identifies how similar or different two IDs are, which translates to how close or far they are in a conceptual binary tree.

4. **Common Ancestor and Distance**: In a binary tree, the distance between two nodes can be conceptualized as how far back you need to go to find a common ancestor. Nodes with more bits in common (a lower XOR distance) will have a common ancestor higher in the tree (closer to the root), indicating closeness in the tree's structure.
  
`;