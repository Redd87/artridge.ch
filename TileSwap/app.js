const layouts = [
  {
    dimensions: "3x3",
    exclude: []
  },
  {
    dimensions: "4x4",
    exclude: []
  },
  {
    dimensions: "5x5",
    exclude: []
  },
  {
    dimensions: "6x6",
    exclude: []
  },
  {
    dimensions: "7x7",
    exclude: []
  },
  {
    dimensions: "8x8",
    exclude: []
  },
  {
    dimensions: "3x5",
    exclude: []
  },
  {
    dimensions: "3x6",
    exclude: []
  },
  {
    dimensions: "5x5",
    exclude: [0,4,20,24]
  },
  {
    dimensions: "5x5",
    exclude: [0,4,20,24,7,11,12,13,17]
  },
  {
    dimensions: "5x5",
    exclude: [2,10,14,22]
  },
  {
    dimensions: "5x5",
    exclude: [12]
  },
  {
    dimensions: "5x5",
    exclude: [1,3,5,7,9,11,13,15,17,19,21,23]
  },
  {
    dimensions: "5x5",
    exclude: [0,2,4,6,8,10,12,14,16,18,20,22,24]
  },
  {
    dimensions: "5x5",
    exclude: [7,12,17]
  },
  {
    dimensions: "5x5",
    exclude: [7,11,13,17]
  },
  {
    dimensions: "5x5",
    exclude: [1,3,5,9,11,13,15,19,21,23]
  },
  {
    dimensions: "5x5",
    exclude: [1,2,3,7,17,21,22,23]
  },
  {
    dimensions: "5x5",
    exclude: [0,1,3,4,5,6,8,9,15,16,18,19,20,21,23,24]
  },
  {
    dimensions: "4x7",
    exclude: [0,1,2,4,5,8,16,20,21,24,25,26]
  }
];
layouts.forEach(e => {
  e.width = e.dimensions[0];
  e.height = e.dimensions[2];
});

let currentLayout = JSON.parse(JSON.stringify(layouts[0]));
let currentLayoutIndex = 0;
let tiles = []; 
let counter = 0;

function updateLayout() {
  let tileIndex = 0;
  let container = document.querySelector('#container');
  container.innerHTML = "";
  for (let i = 0; i < currentLayout.height; i++) {
    let row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < currentLayout.width; j++) {
      let tile = document.createElement('button');
      tile.classList.add('tile');
      tile.setAttribute('data-index', tileIndex);

      if (currentLayout.exclude.includes(tileIndex)) {
        tile.style.visibility = "hidden";
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
  tiles = document.querySelectorAll(".tile");
}

function press(index, preventAnim, preventWin) {
  dirx = [0,0,0,1,-1,-1,1,-1,1];
  diry = [0,1,-1,0,0,-1,-1,1,1];
  for (let i = 0; i < dirx.length; i++) {
    var tileX = (index % currentLayout.width) + diry[i];
    var tileY = Math.floor(index / currentLayout.width) + dirx[i];
    if (tileX >= 0 && tileX < currentLayout.width && tileY >= 0 && tileY < currentLayout.height) {
      const tile = tiles[(tileY * currentLayout.width) + tileX];
      const col = tile.getAttribute('data-col');
      if (col === "black") {
        tile.style.backgroundColor = "#ffffff";
        tile.setAttribute('data-col', 'white');
      } else {
        tile.style.backgroundColor = "#000000";
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
    if (tiles[i].getAttribute('data-col') === "black" && tiles[i].getAttribute('data-disabled') === "false") {
      won = false;
    }
  }
  if (won && !preventWin) {
    window.setTimeout(function() {
      document.querySelectorAll('.popup span')[0].innerHTML = counter;

      document.querySelectorAll('.popup')[0].style.transform = "translate(-50%,-50%) scale(1)";
      document.querySelectorAll('.background')[0].style.opacity = "1";

      counter = 0;
    }, 50);
  }
}

function closePopup(i, r) {
  document.querySelectorAll('.popup')[i].style.transform = "translate(-50%,-50%) scale(0)";
  document.querySelectorAll('.background')[i].style.opacity = "0";

  if (r) randomize(true);
}

window.setInterval(() => {
  const slider = document.getElementById("slider");
  const difficulties = ['very easy', 'easy', 'normal', 'hard', 'very hard'];
  document.getElementById("difficulty").innerHTML = difficulties[Math.floor((slider.value - 1) / (slider.max/difficulties.length))];
}, 50)

function randomize(preventAnim) {
  updateLayout();

  for (var i=0; i<tiles.length; i++) {
    tiles[i].style.backgroundColor = "#ffffff";
    tiles[i].setAttribute('data-col', 'white');
  }

  console.log('START');
  let previousTiles = [];
  for (var i=0; i<document.getElementById("slider").value; i++) {
    let index;
    while (true) {
      index = Math.floor(Math.random() * currentLayout.width * currentLayout.height);
      if (!currentLayout.exclude.includes(index) && !previousTiles.includes(index)) {
        press(index, preventAnim, true);
        previousTiles.push(index);
        console.log(index);
        if (previousTiles.length > 3) previousTiles.splice(0,1);
        break;
      }
    }
  }
  console.log(previousTiles);
  console.log('END');
  counter = 0;

  let allWhite = true;
  let allBlack = true;
  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    if (t.getAttribute('data-col') === 'white') allBlack = false;
    if (t.getAttribute('data-col') === 'black') allWhite = false;
  }
  if (allWhite || allBlack) randomize();
}

function setLayout(i) {
  currentLayout = JSON.parse(JSON.stringify(layouts[i === undefined ? Math.floor(Math.random() * layouts.length) : i]))
  updateLayout();
}

function changeLayout() {
  document.querySelectorAll('.popup')[1].style.transform = "translate(-50%,-50%) scale(1)";
  document.querySelectorAll('.background')[1].style.opacity = "1";
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
  }
  window.addEventListener('resize', func);
  window.addEventListener('load', func);
})();

(() => {
  let layoutsContainer = document.querySelector('#layouts');


  for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i];
    
    let el = document.createElement('div');
    el.classList.add('button');
    
    let index = 0;
    for (let y = 0; y < layout.height; y++) {
      for (let x = 0; x < layout.width; x++) {
        if (!layout.exclude.includes(index)) {
          let square = document.createElement('div');

          let xPos = x * 10 + 50 - layout.width * 5;
          let yPos = y * 10 + 50 - layout.height * 5;

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