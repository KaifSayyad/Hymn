import directoryTree from 'directory-tree';
import fs from 'fs';

// Function to filter out unnecessary files/folders
const filterOutUnwanted = (node) => {
  // List of patterns to exclude
  const excludePatterns = [
    'node_modules',  // Exclude node_modules folder
    'package-lock.json',  // Exclude package-lock file
    'yarn.lock',  // Exclude yarn lock file
    '.env',  // Exclude .env file
    'build',  // Exclude build folder
    'dist',  // Exclude dist folder
    'coverage',  // Exclude coverage folder
    'test',  // Exclude test files
    '.git',  // Exclude git folder
  ];

  // Check if the current node matches any of the exclude patterns
  if (excludePatterns.some(pattern => node.path.includes(pattern))) {
    return false;
  }

  // Recursively filter children nodes
  if (node.children) {
    node.children = node.children.filter(filterOutUnwanted);
  }

  return true;
};

// Function to map the directory structure
const mapDirectory = (directoryPath) => {
  const tree = directoryTree(directoryPath);
  
  // Filter out unwanted files/folders
  filterOutUnwanted(tree);

  return tree;
};

// Replace 'YOUR_DIRECTORY_PATH' with the path of the directory you want to map
const directoryPath = '.';  // e.g., './src'
const mappedTree = mapDirectory(directoryPath);

// Output the mapped directory tree
console.log(JSON.stringify(mappedTree, null, 2));
