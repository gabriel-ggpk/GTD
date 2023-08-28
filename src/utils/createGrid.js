import * as THREE from "three";

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGrid(size) {
  const {path,lastDirection,newOffset} = createRandomPath(size);

  // Calculate the starting point (top-left corner) for the middle 3x3 grid
  const centerStartX = Math.floor((size - 2) / 2);
  const centerStartY = Math.floor((size - 2) / 2);
  const center = []
  
  // Define the middle 2x2 grid in the bigger grid with specific values (e.g., 1)
  for (let i = centerStartX; i < centerStartX + 2; i++) {
    for (let j = centerStartY; j < centerStartY + 2; j++) {
      center.push([i,j]);
    }
  }

  const map = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => {
      const isPath = path.some((pos) => pos[0] === row && pos[1] === column);
      const isCenter = center.some((pos) => pos[0] === row && pos[1] === column);
      return {
        data: {
          material: new THREE.MeshStandardMaterial({
            color: isPath && !isCenter ? 0xb87333 : isCenter? 0xfff0ff: 0x63a375,
          }),
          geometry: new THREE.BoxGeometry(
            1,
            isPath || isCenter ? 0.8 : scaleCloseToOne(getRandom(1, 4), 2.5),
            1
          ),
          position: [row,column]
        },
      };
    })
  );

  return {map,path,lastDirection,nextOffset:newOffset}
}

 function addGrid(grid,size){
   const startingPoint = grid.path.slice(-1)[0]
   const offset = grid.nextOffset;
   const lastDirection= grid.lastDirection

  const {path:newPath,lastDirection:newLastDirection,newOffset} = createRandomPath(size,startingPoint,lastDirection,offset);
  const newMap = Array.from({ length: size }, (_, row) =>
  Array.from({ length: size }, (_, column) => {
    const isPath = newPath.some((pos) => pos[0] === row && pos[1] === column);
    return {
      data: {
        material: new THREE.MeshStandardMaterial({
          color: isPath  ? 0xb87333 :  0x63a375,
        }),
        geometry: new THREE.BoxGeometry(
          1,
          isPath ? 0.8 : scaleCloseToOne(getRandom(1, 4), 2.5),
          1
        ),
        position:[row+offset[0]*size,column+offset[1]*size]
      },
    };
  })
);
grid.map.push(...newMap)
grid.path.push(...newPath)
grid.lastDirection = newLastDirection;
grid.nextOffset = newOffset
 }

export {createGrid,addGrid};

function createRandomPath(size,startingPoint = undefined, lastDir=[0,0],offset = [0,0] ) {
  // Starting position at the center of the grid
  let x = Math.floor(size / 2);
  let y = Math.floor(size / 2);
  let forbidenEdge = [];
  if(startingPoint){

    x = startingPoint[0]
    y = startingPoint[1]

    if (lastDir[1] === -1) {
      forbidenEdge.push('up')
      y = size-1
      
    }
    if(lastDir[0] === -1) {
      forbidenEdge.push('left')
      x = size-1
 
    }
     if(lastDir[1] === 1) {
      forbidenEdge.push('down')
      y = 0
      
    }
    
     if(lastDir[0] === 1) {
      forbidenEdge.push('right')
      x = 0
   
    }
  }
  // Initialize the grid to mark visited cells
  const visited = Array.from(Array(size), () =>
    Array(size).fill(false)
  );

  let lastDirection = [0,0]

  // Store the path as an array of [x, y] coordinates
  const path = [[x, y]];

  // Mark the starting position as visited
  visited[x][y] = true;

  // Continue moving until reaching the border
  while ((x !== 0 || forbidenEdge.includes('right')) 
      && (x !== size - 1|| forbidenEdge.includes('left')) 
      && (y !== 0|| forbidenEdge.includes('down')) 
      && (y !== size - 1|| forbidenEdge.includes('up'))) {
    let directions = [0, 1, 2, 3]; // 0: up, 1: down, 2: left, 3: right
    let validDirections = [];

    // Check which directions are valid (not visited and within the grid boundaries)
    for (const direction of directions) {
      switch (direction) {
        case 0: // Move up

          if (y > 0 && !visited[x][y - 1] && !visited[x-1]?.[y - 1] && !visited[x+1]?.[y - 1] && !visited[x]?.[y - 2]) {
            validDirections.push(0);
          }
          break;
        case 1: // Move down
          if (y < size - 1 && !visited[x][y + 1] && !visited[x-1]?.[y + 1] && !visited[x+1]?.[y + 1] && !visited[x]?.[y + 2]) {
            validDirections.push(1);
          }
          break;
        case 2: // Move left
          if (x > 0 && !visited[x - 1]?.[y] && !visited[x-1]?.[y - 1] && !visited[x-1]?.[y + 1] && !visited[x - 2]?.[y ]) {
            validDirections.push(2);
          }
          break;
        case 3: // Move right
          if (x < size - 1 && !visited[x + 1]?.[y] && !visited[x+1]?.[y - 1] && !visited[x+1]?.[y+ 1] && !visited[x+2]?.[y]) {
            validDirections.push(3);
          }
          break;
      }
    }

    // If there are no valid directions, backtrack to the previous cell
    if (validDirections.length === 0) {
      path.pop();
      const [prevX, prevY] = path[path.length - 1];
      x = prevX;
      y = prevY;
      continue;
    }

    // Randomly choose a valid direction
    const direction = validDirections[getRandom(0, validDirections.length - 1)];
    // Move according to the chosen direction
    switch (direction) {
      case 0: // Move up
        y--;
        lastDirection = [0,-1]
        break;
      case 1: // Move down
        y++;
        lastDirection = [0,1]
        break;
      case 2: // Move left
        x--;
        lastDirection = [-1,0]
        break;
      case 3: // Move right
        x++;
        lastDirection = [1,0]
        break;
    }
    // Mark the new position as visited
    visited[x][y] = true;
    
    // Add the current position to the path array
    path.push([x, y]);

  }

  const newOffset = [offset[0]+lastDirection[0],offset[1]+lastDirection[1]]


  // Return the full path as an array of [x, y] coordinates
  return {path,lastDirection,newOffset};
}

function scaleCloseToOne(value, scaleFactor) {
  // Ensure scaleFactor is greater than 1 to avoid negative values
  if (scaleFactor <= 1) {
    throw new Error("scaleFactor should be greater than 1.");
  }

  // Scale the value logarithmically
  const scaledValue = Math.log(value) / Math.log(scaleFactor);

  // Ensure the scaled value is greater than 1
  return Math.max(scaledValue, 1);
}
