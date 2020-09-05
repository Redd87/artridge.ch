var counter = 0;
var tiles = document.getElementsByClassName("tile");
for (var i=0; i<tiles.length; i++) {
  var tile = tiles[i]
  tile.ontouchstart = function(e) {
    e.preventDefault();
    var arr = Array.prototype.slice.call(tiles);
    press(arr.indexOf(this))
    counter++
  };
  tile.onclick = function(e) {
    e.preventDefault();
    var arr = Array.prototype.slice.call(tiles);
    press(arr.indexOf(this))
    counter++;
  };
}

function press(index, preventAnim, preventWin) {
  dirx = [0,0,0,1,-1,-1,1,-1,1];
  diry = [0,1,-1,0,0,-1,-1,1,1];
  for (var i=0; i < dirx.length; i++) {
    var tileX = (index % 3) + diry[i];
    var tileY = Math.floor(index / 3) + dirx[i];
    if (tileX >= 0 && tileX <= 2 && tileY >= 0 && tileY <= 4) {
      var tile = tiles[(tileY * 3) + tileX]
      var col = tile.getAttribute('data-col');
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
    if (tiles[i].getAttribute('data-col') === "black") {
      won = false;
    }
  }
  if (won && !preventWin) {
    window.setTimeout(function() {
      document.querySelector('.popup span').innerHTML = counter;

      document.querySelector('.popup').style.transform = "translate(-50%,-50%) scale(1)";
      document.querySelector('.background').style.opacity = "1";

      counter = 0;
    }, 50);
  }
}

function closePopup() {
  document.querySelector('.popup').style.transform = "translate(-50%,-50%) scale(0)";
  document.querySelector('.background').style.opacity = "0";

  randomize(true);
}

window.setInterval(() => {
  var numPresses = document.getElementById("slider").value;
  document.getElementById("numPresses").innerHTML = numPresses;
}, 50)

function randomize(preventAnim) {
  for (var i=0; i<tiles.length; i++) {
    tiles[i].style.backgroundColor = "#ffffff";
    tiles[i].setAttribute('data-col', 'white');
  }
  for (var i=0; i<document.getElementById("slider").value; i++) {
    press(Math.floor(Math.random() * 15), preventAnim, true);
  }
  counter = 0;
}

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