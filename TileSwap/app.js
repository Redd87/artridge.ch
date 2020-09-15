const layouts = [
  {
    width: 3,
    height: 5,
    exclude: []
  },
  {
    width: 7,
    height: 7,
    exclude: [17,23,25,31]
  }
];

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
        var duration = 0.3;
        var delay = 0.08;
        TweenMax.to(tile, duration, {scaleY: 1.6, ease: Expo.easeOut});
        TweenMax.to(tile, duration, {scaleX: 1.2, scaleY: 1, ease: Back.easeOut, easeParams: [3], delay: delay});
        TweenMax.to(tile, duration * 1.25, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [6], delay: delay * 3 });
      }
    }
  }
  var won = true;
  for (var i=0; i<tiles.length; i++) {
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
  var numPresses = document.getElementById("slider").value;
  document.getElementById("numPresses").innerHTML = numPresses;
}, 50)

function randomize(preventAnim) {
  updateLayout();

  for (var i=0; i<tiles.length; i++) {
    tiles[i].style.backgroundColor = "#ffffff";
    tiles[i].setAttribute('data-col', 'white');
  }
  for (var i=0; i<document.getElementById("slider").value; i++) {
    let index = Math.floor(Math.random() * currentLayout.width * currentLayout.height);
    if (!currentLayout.exclude.includes(index)) press(index, preventAnim, true);
  }
  counter = 0;
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
    let controls = document.querySelector('#controls');
    if (window.innerWidth > window.innerHeight) {
      document.body.appendChild(controls);
    } else {
      document.querySelector('#main').appendChild(controls);
    }
  }
  window.addEventListener('resize', func);
  window.addEventListener('load', func);
})();

(() => {
  let layoutsContainer = document.querySelector('#layouts');


  for (let i = 0; i < layouts.length; i++) {
    const layout = layouts[i];
    
    let el = document.createElement('button');
    el.innerHTML = `${layout.width}x${layout.height}`;
    el.addEventListener('click', () => {
      setLayout(i);
      randomize(true);
      closePopup(1);
    });

    layoutsContainer.appendChild(el);
  }
})();