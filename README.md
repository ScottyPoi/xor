# Binary Tree Visualization

This project is a React application. It's written in TypeScript and uses D3 for the visualizations.

## Goal

The goal of the project is to offer insight into the concept of **location** and **distance** within a Distributed Hash-Table (DHT).

The application visualizes the keyspace of a DHT as a binary tree, and demonstrates the concepts of **location** and **distance** through interactive visualizations.

## Project Structure

The main components of the application are:

- `App.tsx`: This is the main component that wraps the application in an `ErrorBoundary` and a `BinaryTreeProvider`.
- `BinaryTreeProvider.tsx`: This component provides context for the binary tree data that is used throughout the application.
- `BinaryTreeVisualization.tsx`: This component is responsible for the visual representation of the binary tree.
- `TreeNode.tsx`: This component represents a single node in the binary tree.
- `HeatMap.tsx`: This component demonstrates **distance** with a heat map overlay.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository:

```sh
git clone https://github.com/ScottyPoi/binary-tree-visualization.git
```

2. Navigate into the project directory:

```sh
cd binary-tree-visualization
```

3. Install the dependencies:

```sh
npm i
```

1. Start the application:

```sh
npm start
```
The application will start and can be accessed at http://localhost:3000.

## Building

To build the project for production, use the following command:

npm run build

The built files will be in the build directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.