const layouts = [
  {
    dimensions: '3x3',
    exclude: []
  },
  {
    dimensions: '4x4',
    exclude: []
  },
  {
    dimensions: '5x5',
    exclude: []
  },
  {
    dimensions: '6x6',
    exclude: []
  },
  {
    dimensions: '7x7',
    exclude: []
  },
  {
    dimensions: '8x8',
    exclude: []
  },
  {
    dimensions: '3x5',
    exclude: []
  },
  {
    dimensions: '3x6',
    exclude: []
  },
  {
    dimensions: '3x3',
    exclude: [2,4,6]
  },
  {
    dimensions: '5x5',
    exclude: [0,4,20,24]
  },
  {
    dimensions: '5x5',
    exclude: [0,4,20,24,7,11,12,13,17]
  },
  {
    dimensions: '5x5',
    exclude: [2,10,14,22]
  },
  {
    dimensions: '5x5',
    exclude: [12]
  },
  {
    dimensions: '5x5',
    exclude: [1,3,5,7,9,11,13,15,17,19,21,23]
  },
  {
    dimensions: '5x5',
    exclude: [0,2,4,6,8,10,12,14,16,18,20,22,24]
  },
  {
    dimensions: '5x5',
    exclude: [7,12,17]
  },
  {
    dimensions: '5x5',
    exclude: [7,11,13,17]
  },
  {
    dimensions: '5x5',
    exclude: [1,3,5,9,11,13,15,19,21,23]
  },
  {
    dimensions: '5x5',
    exclude: [1,2,3,7,17,21,22,23]
  },
  {
    dimensions: '5x5',
    exclude: [0,1,3,4,5,6,8,9,15,16,18,19,20,21,23,24]
  },
  {
    dimensions: '4x7',
    exclude: [0,1,2,4,5,8,16,20,21,24,25,26]
  },
  {
    dimensions: '5x5',
    exclude: [5,6,7,8,13,16,17,18]
  },
  {
    dimensions: '3x5',
    exclude: [0,2,4,10,12,14]
  },
  {
    dimensions: '5x5',
    exclude: [0,1,3,4,5,9,15,19,20,21,23,24]
  },
  {
    dimensions: '7x7',
    exclude: [8,9,11,12,15,19,29,33,36,37,39,40]
  },
  {
    dimensions: '7x7',
    exclude: [0,1,5,6,7,13,35,41,42,43,47,48]
  },
  {
    dimensions: '9x9',
    exclude: [0,1,2,9,10,11,18,19,20,6,7,8,15,16,17,24,25,26,54,55,56,63,64,65,72,73,74,60,61,62,69,70,71,78,79,80,3,5,21,23,27,29,45,47,33,35,51,53,57,59,75,77]
  }
  {
    dimensions: '3x3',
    exclude: [3,5,6,8]
  },
  {
    dimensions: '3x3',
    exclude: [4]
  },
  {
    dimensions: '3x3',
    exclude: [1,3,5,7]
  },
  {
    dimensions: '3x3',
    exclude: [0,2,6,8]
  },
  {
    dimensions: '3x3',
    exclude: [4,7]
  },
  {
    dimensions: '4x4',
    exclude: [5,10]
  },
  {
    dimensions: '4x4',
    exclude: [3,12]
  },
  {
    dimensions: '4x4',
    exclude: [3,6,9,12]
  },
  {
    dimensions: '4x4',
    exclude: [0,3,12,15]
  },
  {
    dimensions: '4x4',
    exclude: [2,3,7,8,12,13]
  },
  {
    dimensions: '4x4',
    exclude: [0,3,6,8,12,13,15]
  },
  {
    dimensions: '4x4',
    exclude: [0,3,5,6,9,10,12,15]
  },
  {
    dimensions: '4x4',
    exclude: [0,1,4,5,10,11,14,15]
  },
  {
    dimensions: '4x4',
    exclude: [1,2,3,4,6,7,8,9,11,12,13,14]
  },
  {
    dimensions: '3x5',
    exclude: [0,2,12,14]
  },
  {
    dimensions: '5x2',
    exclude: [2,5,9]
  },
  {
    dimensions: '3x4',
    exclude: [4,6,8]
  },
  {
    dimensions: '5x5',
    exclude: [0,2,4,10,14,20,22,24]
  },
  {
    dimensions: '5x5',
    exclude: [0,2,4,10,12,14,20,22,24]
  },
  {
    dimensions: '5x5',
    exclude: [6,8,16,18]
  },
  {
    dimensions: '5x5',
    exclude: [6,8,11,13,16,18]
  },
  {
    dimensions: '5x5',
    exclude: [5,7,9,10,12,14,15,17,19]
  },
  {
    dimensions: '5x5',
    exclude: [0,2,4,7,10,11,13,14,17,20,22,24]
  },
  {
    dimensions: '5x5',
    exclude: [0,2,4,5,7,9,15,17,19,20,22,24]
  },
  {
    dimensions: '5x5',
    exclude: [0,4,5,6,8,9,15,16,18,19,20,24]
  },
  {
    dimensions: '5x5',
    exclude: [2,4,6,8,10,12,16,19,20,23,24]
  },
  {
    dimensions: '5x5',
    exclude: [0,1,5,6,7,9,10,14,15,17,18,19,23,24]
  }
];
layouts.forEach(e => {
  e.width = parseInt(e.dimensions[0]);
  e.height = parseInt(e.dimensions[2]);
});

const dirx = [0,0,0,1,-1,-1,1,-1,1];
const diry = [0,1,-1,0,0,-1,-1,1,1];
const copy = (val) => JSON.parse(JSON.stringify(val));

let currentLayout = copy(layouts[0]);
let currentLayoutIndex = 0;
let tiles = []; 
let counter = 0;

const app = new Vue({
  el: '#app',
  data: {
    screen: 'freeplay',
    gameModes: [
      {
        title: 'freeplay',
        fn: () => {
          app.screen = 'freeplay'
        }
      },
      {
        title: 'puzzles',
        fn: () => {
          app.screen = 'puzzles'
        }
      },
      {
        title: 'challenges',
        fn: () => {
          app.screen = 'challenges'
        }
      }
    ]
  }
});

function updateLayout() {
  updateTileSize();

  let tileIndex = 0;
  let container = document.querySelector('#container');
  container.innerHTML = '';
  for (let i = 0; i < currentLayout.height; i++) {
    let row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < currentLayout.width; j++) {
      let tile = document.createElement('button');
      tile.classList.add('tile');
      tile.setAttribute('data-index', tileIndex);

      if (currentLayout.exclude.includes(tileIndex)) {
        tile.setAttribute('data-disabled', true);
      } else {
        const func = (e) => {
          e.preventDefault();
          press(Array.from(tiles).indexOf(e.target));
          counter++;
        }
        tile.addEventListener('ontouchstart' in document.documentElement ? 'touchstart' : 'click', func);
        tile.setAttribute('data-disabled', false);
      }

      row.appendChild(tile);
      tileIndex++;
    }
    container.appendChild(row);
  }
  tiles = document.querySelectorAll('.tile');
}

function press(index, preventAnim, preventWin) {
  for (let i = 0; i < dirx.length; i++) {
    var tileX = (index % currentLayout.width) + diry[i];
    var tileY = Math.floor(index / currentLayout.width) + dirx[i];
    if (tileX >= 0 && tileX < currentLayout.width && tileY >= 0 && tileY < currentLayout.height) {
      const tile = tiles[(tileY * currentLayout.width) + tileX];
      const col = tile.getAttribute('data-col');
      if (col === 'black') {
        tile.setAttribute('data-col', 'white');
      } else {
        tile.setAttribute('data-col', 'black');
      }
      if (!preventAnim) {
        const duration = 0.3;
        const delay = 0.08;
        TweenMax.to(tile, duration, {scaleY: 1.6, ease: Expo.easeOut});
        TweenMax.to(tile, duration, {scaleX: 1.2, scaleY: 1, ease: Back.easeOut, easeParams: [3], delay: delay});
        TweenMax.to(tile, duration * 1.25, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [6], delay: delay * 3 });
      }
    }
  }
  let won = true;
  for (let i=0; i<tiles.length; i++) {
    if (tiles[i].getAttribute('data-col') === 'black' && tiles[i].getAttribute('data-disabled') === 'false') {
      won = false;
    }
  }
  if (won && !preventWin) {
    window.setTimeout(function() {
      document.querySelectorAll('.popup span')[0].innerHTML = counter;

      document.querySelectorAll('.popup')[0].style.transform = 'translate(-50%,-50%) scale(1)';
      document.querySelectorAll('.background')[0].style.display = 'block';

      window.setTimeout(() => {
        document.querySelectorAll('.background')[0].style.opacity = '1';
      }, 10);

      counter = 0;
    }, 50);
  }
}

function closePopup(i, r) {
  document.querySelectorAll('.popup')[i].style.transform = 'translate(-50%,-50%) scale(0)';
  document.querySelectorAll('.background')[i].style.opacity = '0';
  window.setTimeout(() => {
    document.querySelectorAll('.background')[i].style.display = 'none';
  }, 300);

  if (r) randomize(true);
}

window.setInterval(() => {
  const slider = document.getElementById('slider');
  const difficulties = ['very easy', 'easy', 'normal', 'hard', 'very hard'];
  document.getElementById('difficulty').innerHTML = difficulties[Math.floor((slider.value - 1) / (slider.max/difficulties.length))];
}, 50)

function randomize(preventAnim) {
  updateLayout();

  for (var i=0; i<tiles.length; i++) {
    tiles[i].setAttribute('data-col', 'white');
  }

  let previousTiles = [];
  for (var i=0; i<document.getElementById('slider').value; i++) {
    let index;
    while (true) {
      index = Math.floor(Math.random() * currentLayout.width * currentLayout.height);
      if (!currentLayout.exclude.includes(index) && !previousTiles.includes(index)) {
        press(index, preventAnim, true);
        previousTiles.push(index);
        if (previousTiles.length > 3) previousTiles.splice(0,1);
        break;
      }
    }
  }
  counter = 0;

  let allWhite = true;
  let allBlack = true;
  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    if (t.getAttribute('data-col') === 'white') allBlack = false;
    if (t.getAttribute('data-col') === 'black') allWhite = false;
  }
  if (allWhite || allBlack) randomize(preventAnim);
}

function setLayout(i) {
  currentLayout = copy(layouts[i === undefined ? Math.floor(Math.random() * layouts.length) : i])
  updateLayout();
}

function changeLayout() {
  document.querySelectorAll('.popup')[1].style.transform = 'translate(-50%,-50%) scale(1)';
  document.querySelectorAll('.background')[1].style.display = 'block';
  window.setTimeout(() => {
    document.querySelectorAll('.background')[1].style.opacity = '1';
  },10);
}

updateLayout();
randomize(true);
  

function share() {
  var text = 'Play Tile Swap!';
  if ('share' in navigator) {
    navigator.share({
      title: document.title,
      text: text,
      url: location.href,
    });
  } else {
    // Here we use the WhatsApp API as fallback; remember to encode your text for URI
    location.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text + ' - ') + location.href
  }
}

if ('ontouchstart' in document.documentElement) {
  document.addEventListener('touchstart', (e) => {
    e.preventDefault();
  });
}

(() => {
  const func = (e) => {
    let parent = document.querySelector('#controls');
    let buttons = parent.querySelector('.buttons');
    let difficulty = parent.querySelector('.difficulty');
    if (window.innerWidth > window.innerHeight) {
      parent.insertBefore(buttons, difficulty);
    } else {
      parent.insertBefore(difficulty, buttons);
    }

    updateTileSize();
  }
  window.addEventListener('resize', func);
  window.addEventListener('load', func);
})();

function updateTileSize() {
  if (window.innerWidth > window.innerHeight) {
    const width = 1 / Math.max(currentLayout.width, 6) * 450 * Math.max(window.innerWidth / 1500, 1);
    document.documentElement.style.setProperty('--tile-size', width + 'px');
  }
}

(() => {
  let layoutsContainer = document.querySelector('#layouts');


  for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i];
    
    let el = document.createElement('div');
    el.classList.add('button');
    
    let index = 0;
    const tileSize = 11;
    for (let y = 0; y < layout.height; y++) {
      for (let x = 0; x < layout.width; x++) {
        if (!layout.exclude.includes(index)) {
          let square = document.createElement('div');

          let xPos = x * tileSize + 50 - layout.width * tileSize / 2;
          let yPos = y * tileSize + 50 - layout.height * tileSize / 2;

          square.style.transform = `translate(${xPos}px, ${yPos}px)`;

          el.appendChild(square);
        }
        index++;
      }
    }

    el.addEventListener('click', () => {
      setLayout(i);
      randomize(true);
      closePopup(1);
    });

    layoutsContainer.appendChild(el);
  }
})();

function setAll(white) {
  document.querySelectorAll('.tile').forEach(e => {
    e.setAttribute('data-col', white ? 'white' : 'black')
  });
}

function pressAll() {
  document.querySelectorAll('.tile').forEach((e, i) => {
    if (e.getAttribute('data-disabled') === 'false') {
      press(i, true, true);
    }
  });
}

function pressOnGrid(grid, index) {
  grid = copy(grid);
  
  const width = grid[0].length;
  const height = grid.length;

  for (let i = 0; i < dirx.length; i++) {
    const tileX = (index % width) + diry[i];
    const tileY = Math.floor(index / width) + dirx[i];
    if (tileX >= 0 && tileX < width && tileY >= 0 && tileY < height) {
      if (grid[tileY][tileX] === 0) {
        grid[tileY][tileX] = 1;
      } else {
        grid[tileY][tileX] = 0;
      }
    }
  }

  return grid;
}

function solveCurrentGrid() {
  return solveGrid(getGrid());
}

function solveGrid(grid) {
  originalGrid = copy(grid);

  const width = grid[0].length;
  const height = grid.length;
  const size = width * height;

  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(i);
  }

  let movePatterns = []
  for (let i = 1; i <= size; i++) {
    const perm = getPermutations(array, i);
    for (pattern of perm) {
      grid = copy(originalGrid);
      moves = [];
      for (index of pattern) {
        const tileX = (index % width);
        const tileY = Math.floor(index / width);
        if (grid[tileY][tileX] !== 2) {
          grid = pressOnGrid(grid, index);
          moves.push(index);
        }
        if (isGridSolved(grid)) {
          movePatterns.push(moves);
          moves = [];
        }
      }
    }
  }
  return movePatterns;
}

function setState(grid) {
  if (typeof grid === 'string') {
    setState(stringToGrid(grid));
  } else {
    const tiles = document.querySelectorAll('.tile');
    let index = 0;
    for (row of grid) {
      for (cell of row) {
        if (cell === 2) {
          tiles[index].setAttribute('data-disabled', 'true');
        } else {
          tiles[index].removeAttribute('data-disabled');
        }
        tiles[index].setAttribute('data-col', cell ? 'white' : 'black')
        index++;
      }
    }
  }
}

function isSolved() {
  return isGridSolved(getGrid());
}

function isGridSolved(grid) {
  let allWhite = true;
  for (row of grid) {
    for (tile of row) {
      if (tile !== 1) allWhite = false;
    }
  }
  return allWhite;
}

function getPermutations(array, size) {

  function p(t, i) {
      if (t.length === size) {
          result.push(t);
          return;
      }
      if (i + 1 > array.length) {
          return;
      }
      p(t.concat(array[i]), i + 1);
      p(t, i + 1);
  }

  var result = [];
  p([], 0);
  return result;
}

function getGrid() {
  const rows = document.querySelectorAll('.row');
  const grid = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const tiles = row.querySelectorAll('.tile');
    const arr = [];
    for (let j = 0; j < tiles.length; j++) {
      const tile = tiles[j];
      if (tile.getAttribute('data-disabled') === 'true') {
        arr.push(2);
      } else {
        if (tile.getAttribute('data-col') === 'white') {
          arr.push(1);
        } else {
          arr.push(0);
        }
      }
    }
    grid.push(arr);
  }
  return grid;
}

function getAllStates() {
  const size = currentLayout.width * currentLayout.height;
  const max = parseInt("1".repeat(size), 2);
  const states = [];
  for (let i = 0; i < max; i++) {
    states.push(i.toString(2).padStart(size, '0'))
  }
  return states;
}

function stringToGrid(str) {
  const grid = [];
  const w = currentLayout.width;
  for (let i = 0; i < str.length; i += w) {
    grid.push(str.slice(i, i + w).split('').map(e => parseInt(e)));
  }
  return grid;
}

function gridToString(grid) {
  let str = '';
  for (row of grid) {
    for (cell of row) {
      str += cell;
    }
  }
  return str;
}

function getHardestLayout() {
  const allLayouts = getAllStates();
  const allMoves = [];
  let sum = 0;
  let longest = 0;
  for (let i = 0; i < allLayouts.length; i++) {
    let layout = allLayouts[i];
    layout = stringToGrid(layout)

    setState(layout);

    const solutions = solveCurrentGrid();
    let min = solutions[0]?.length;
    for (solution of solutions) {
      if (solution.length < min) min = solution.length;
    }
    if (min > longest) longest = min;
    allMoves.push(min);
    sum += min;
  }
  console.log('LONGEST: ', longest);
  console.log('AVERAGE: ', sum / allMoves.length);
  return allMoves;
}

function help() {
  console.table({
    'setAll(white)': 'sets all the tiles of the current layout to black, or white if the first parameter is truthy',
    'getGrid()': 'returns a bidimentional representation of the current grid',
    'setState()': 'sets the state of the current layout to the grid passed as the first parameter',
    'isGridSolved(grid)': 'checks if the grid passed as the first parameter is solved',
    'isSolved()': 'checks if the current layout is solved',
    'solveGrid(grid)': 'returns an array of possible move combinations that can solve the grid passed as parameter',
    'solveCurrentGrid()': 'executes solveGrid on the current layout',
    'pressOnGrid(grid, index)': 'returns a copy of the grid passed as parameter after performing a press at the given index',
    'pressAll()': 'presses each tile of the current layout'
  })
}
