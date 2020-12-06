"use strict";

/*\\*                                                     *//*\
|*|                                                         |*|
|*| -~-~-~-~-~-~-~-~- CLICKER BY ARTRIDGE -~-~-~-~-~-~-~-~- |*|
|*|                                                         |*|
|*| Game Designer: Eddy Rashed      eddy.rashed@artridge.ch |*|
|*| Programmer: Oskar Zanota       oskar.zanota@artridge.ch |*|
|*|                                                         |*|
|*|                                                         |*|
\*//*                                                     *\\*/

let app = new Vue({
  el: '#main-container',
  data: {
    buildata: [],
    build: build,
    openBuildInfo: openBuildInfo
  }
})

let evt = 'ontouchstart' in document.documentElement ? 'onclick' : 'onmousedown';
let evtSpam = 'ontouchstart' in document.documentElement ? 'ontouchstart' : 'onmousedown';
if ('ontouchstart' in document.documentElement) {
  document.documentElement.style.setProperty('--hover-filter', 'brightness(1)');
  document.documentElement.style.setProperty('--hover-scale', 'scale(1)');
}
let refactorLevel = 0;
let refactorPrice = 7.5e9;
let specialBuildings = [9];
let builderNames = [
  "Robot-Y01",
  "Robot-C02",
  "Robot-G03",
  "Robot-O04",
  "Robot-P05",
  "Robot-B06",
  "Robot-R07",
  "Robot-D08"
];

for (let i=0; i<builderNames.length; i++) {
  document.getElementById("stats-refactor").children[0].innerHTML += `<li>${builderNames[i]} Clicks: <span data-end="" id="Builder${i}Clicks"></span></li>`;
  document.getElementById("stats-all").children[0].innerHTML += `<li>${builderNames[i]} Clicks: <span></span></li>`;
}

/*** ACHIEVEMENTS ***/
let achievements = [
  {
    description: "Refactor Mastery", // 24
    value: 0,
    step: 0,
    formatNumbers: false,
    specialNames: ["", "45m", "30m", "20m", "15m", "10m"],
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: true,
        func: () => {},
        description: "<b>Refactor Mastery</b>"
      },
      {
        n: 2, // 45min
        unlocked: false,
        permanent: true,
        func: () => {},
        description: "+10% $/s"
      },
      {
        n: 3, // 30min
        unlocked: false,
        permanent: true,
        func: () => {},
        description: "+10% $/s"
      },
      {
        n: 4, // 20min
        unlocked: false,
        permanent: true,
        func: () => {},
        description: "+10% $/s"
      },
      {
        n: 5, // 15min
        unlocked: false,
        permanent: true,
        func: () => {},
        description: "+10% $/s"
      },
      {
        n: 6, // 10min
        unlocked: false,
        permanent: true,
        func: () => {},
        description: "Unlock cheats (coming soon)"
      }
    ]
  },
  {
    description: "Money Mastery", // 10
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 150,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Money Mastery</b>"
      },
      {
        n: 1e3,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.01 },
        description: "+1% $/s"
      },
      {
        n: 1e4,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.01 },
        description: "+1% $/s"
      },
      {
        n: 1e5,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.01 },
        description: "+1% $/s"
      },
      {
        n: 1e6,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.01 },
        description: "+1% $/s"
      },
      {
       n: 1e7,
       unlocked: false,
       permanent: false,
       func: () => { mpsMultiplier += 0.01 },
       description: "+1% $/s"
     },
      {
        n: 1e8,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.01 },
        description: "+1% $/s"
      },
      {
        n: 1e9,
        unlocked: false,
        permanent: true,
        func: () => { mpsMultiplier += 0.01 },
        description: "+1% $/s"
      },
      {
        n: 1e11,
        unlocked: false,
        permanent: true,
        func: () => { mpsMultiplier += 0.01 },
        description: "+1% $/s"
      },
    ],
  },
  {
    description: "Click Mastery", // 19
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 100,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Click Mastery</b>"
      },
      {
        n: 400,
        unlocked: false,
        permanent: false,
        func: () => { clickStrength++; },
        description: "+1 Click Power"
      },
      {
        n: 1000,
        unlocked: false,
        permanent: false,
        func: () => { clickStrength++; },
        description: "+1 Click Power"
      },
      {
        n: 2000,
        unlocked: false,
        permanent: true,
        func: () => { clickStrength++; },
        description: "+1 Click Power"
      }
    ]
  },
  {
    description: "House Mastery", // 1 <img src='images/Projects/House/finished.png' style='width: 100%; height: 100%;'>
    value: 0,
    step: 0,
    levels: [
      {
        n: 1, // 1
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>House Mastery</b>"
      },
      {
        n: 3, // 5
        unlocked: false,
        permanent: false,
        func: () => { buildata[0].mps += 1 }, // buildata[0].cost -= 10;
        description: "+1$/s per House"
      },
      {
        n: 15, // 15
        unlocked: false,
        permanent: false,
        func: () => { buildata[0].mpc += 10 },
        description: "+10$ Build Profit"
      },
      {
        n: 25, // 25
        unlocked: false,
        permanent: false,
        func: () => { buildata[0].cost -= 10 },
        description: "-10$ Price"
      },
      {
        n: 50, // 50
        unlocked: false,
        permanent: false,
        func: () => { buildata[0].clicks -= 1 },
        description: "-1 Click"
      },
      {
        n: 100, // 100
        unlocked: false,
        permanent: false,
        func: () => { buildata[0].mps += 1 },
        description: "+1$/s per House"
      },
    ],
  },
  {
    description: "Village Mastery", // 2
    value: 0,
    step: 0,
    levels: [
      {
        n: 1, // 1
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Village Mastery</b>"
      },
      {
        n: 10, // 10
        unlocked: false,
        permanent: false,
        func: () => { buildata[1].mpc += 40 },
        description: "+40$ Build Profit"
      },
      {
        n: 25, // 25
        unlocked: false,
        permanent: false,
        func: () => { buildata[1].cost -= 50 },
        description: "-50$ Price"
      },
      {
        n: 50, // 50
        unlocked: false,
        permanent: false,
        func: () => { buildata[1].clicks -= 2 },
        description: "-2 Clicks"
      },
      {
        n: 100, // 100
        unlocked: false,
        permanent: false,
        func: () => { buildata[1].mps += 2 },
        description: "+2$/s per Village"
      },
    ],
  },
  {
    description: "City Mastery", // 3
    value: 0,
    step: 0,
    levels: [
      {
        n: 1, // 1
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>City Mastery</b>"
      },
      {
        n: 10, // 10
        unlocked: false,
        permanent: false,
        func: () => { buildata[2].mpc += 150 },
        description: "+150$ Build Profit"
      },
      {
        n: 25, // 25
        unlocked: false,
        permanent: false,
        func: () => { buildata[2].cost -= 300 },
        description: "-300$ Price"
      },
      {
        n: 50, // 50
        unlocked: false,
        permanent: false,
        func: () => { buildata[2].clicks -= 3 },
        description: "-3 Clicks"
      },
      {
        n: 100, // 100
        unlocked: false,
        permanent: false,
        func: () => { buildata[2].mps += 12 },
        description: "+12$/s per City"
      },
    ],
  },
  {
    description: "Region Mastery", // 4
    value: 0,
    step: 0,
    levels: [
      {
        n: 1, // 1
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Region Mastery</b>"
      },
      {
        n: 15, // 15
        unlocked: false,
        permanent: false,
        func: () => { buildata[3].mpc += 960 },
        description: "+960$ Build Profit"
      },
      {
        n: 25, // 25
        unlocked: false,
        permanent: false,
        func: () => { buildata[3].cost -= 1200 },
        description: "-1200$ Price"
      },
      {
        n: 50, // 50
        unlocked: false,
        permanent: false,
        func: () => { buildata[3].clicks -= 4 },
        description: "-4 Clicks"
      },
      {
        n: 100, // 100
        unlocked: false,
        permanent: false,
        func: () => { buildata[3].mps += 47 },
        description: "+47$/s per Region"
      },
    ],
  },
  {
    description: "Country Mastery", // 5
    value: 0,
    step: 0,
    levels: [
      {
        n: 1, // 1
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Country Mastery</b>"
      },
      {
        n: 10, // 10
        unlocked: false,
        permanent: false,
        func: () => { buildata[4].mpc += 4200 },
        description: "+4200$ Build Profit"
      },
      {
        n: 25, // 25
        unlocked: false,
        permanent: false,
        func: () => { buildata[4].cost -= 8400 },
        description: "-8400$ Price"
      },
      {
        n: 50, // 50
        unlocked: false,
        permanent: false,
        func: () => { buildata[4].clicks -= 5 },
        description: "-5 Clicks"
      },
      {
        n: 100, // 100
        unlocked: false,
        permanent: false,
        func: () => { buildata[4].mps += 300 },
        description: "300$/s per Country"
      },
    ],
  },
  {
    description: "Continent Mastery", // 6
    value: 0,
    step: 0,
    levels: [
      {
        n: 1, // 1
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Continent Mastery</b>"
      },
      {
        n: 15, // 15
        unlocked: false,
        permanent: false,
        func: () => { buildata[5].mpc += 33600 },
        description: "+33600$ Build Profit"
      },
      {
        n: 25, // 25
        unlocked: false,
        permanent: false,
        func: () => { buildata[5].cost -= 42000 },
        description: "-42000$ Price"
      },
      {
        n: 50, // 50
        unlocked: false,
        permanent: false,
        func: () => { buildata[5].clicks -= 6 },
        description: "-6 Clicks"
      },
      {
        n: 100, // 100
        unlocked: false,
        permanent: false,
        func: () => { buildata[5].mps += 1400 },
        description: "+1400$/s per Continent"
      },
    ],
  },
  {
    description: "Planet Mastery", // 7
    value: 0,
    step: 0,
    levels: [
      {
        n: 1, // 1
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Planet Mastery</b>"
      },
      {
        n: 10, // 10
        unlocked: false,
        permanent: false,
        func: () => { buildata[6].mpc += 272000 },
        description: "+272000$ Build Profit"
      },
      {
        n: 25, // 25
        unlocked: false,
        permanent: false,
        func: () => { buildata[6].cost -= 340000 },
        description: "-340000$ Price"
      },
      {
        n: 50, // 50
        unlocked: false,
        permanent: false,
        func: () => { buildata[6].clicks -= 7 },
        description: "-7 Clicks"
      },
      {
        n: 100, // 100
        unlocked: false,
        permanent: false,
        func: () => { buildata[6].mps += 9800 },
        description: "+9800$/s per Planet"
      },
    ],
  },
  {
    description: "Solar System Mastery", // 8
    value: 0,
    step: 0,
    levels: [
      {
        n: 1, // 1
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Solar System Mastery</b>"
      },
      {
        n: 15, // 15
        unlocked: false,
        permanent: false,
        func: () => { buildata[7].mpc += 1600000 },
        description: "+1600000$ Build Profit"
      },
      {
        n: 25, // 25
        unlocked: false,
        permanent: false,
        func: () => { buildata[7].cost -= 2000000 },
        description: "-2000000$ Price"
      },
      {
        n: 50, // 50
        unlocked: false,
        permanent: false,
        func: () => { buildata[7].clicks -= 8 },
        description: "-8 Clicks"
      },
      {
        n: 100, // 100
        unlocked: false,
        permanent: false,
        func: () => { buildata[7].mps += 49000 },
        description: "+49000$/s per Solar System"
      },
    ],
  },
  {
    description: "Galaxy Mastery", // 9
    value: 0,
    step: 0,
    levels: [
      {
        n: 1, // 1
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Galaxy Mastery</b>"
      },
      {
        n: 10, // 10
        unlocked: false,
        permanent: false,
        func: () => { buildata[8].mpc += 14400000 },
        description: "+14400000$ Build Profit"
      },
      {
        n: 25, // 25
        unlocked: false,
        permanent: false,
        func: () => { buildata[8].cost -= 18000000 },
        description: "-18000000$ Price"
      },
      {
        n: 50, // 50
        unlocked: false,
        permanent: false,
        func: () => { buildata[8].clicks -= 9 },
        description: "-9 Clicks"
      },
      {
        n: 100, // 100
        unlocked: false,
        permanent: false,
        func: () => { buildata[8].mps += 375000 },
        description: "+375000$/s per Galaxy"
      },
    ],
  },
  {
    description: `${builderNames[0]} Mastery`, // 11
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: `<b>${builderNames[0]} Mastery</b>`
      },
      {
        n: 6, 
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03 },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: `${builderNames[1]} Mastery`, // 12
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: `<b>${builderNames[1]} Mastery</b>`
      },
      {
        n: 10, 
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03 },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: `${builderNames[2]} Mastery`, // 13
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: `<b>${builderNames[2]} Mastery</b>`
      },
      {
        n: 8, 
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03 },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: `${builderNames[3]} Mastery`, // 14
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: `<b>${builderNames[3]} Mastery</b>`
      },
      {
        n: 16, 
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03 },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: `${builderNames[4]} Mastery`, // 15
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: `<b>${builderNames[4]} Mastery</b>`
      },
      {
        n: 8,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03 },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: `${builderNames[5]} Mastery`, // 16
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: `<b>${builderNames[5]} Mastery</b>`
      },
      {
        n: 7, 
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03 },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: `${builderNames[6]} Mastery`, // 17
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: `<b>${builderNames[6]} Mastery</b>`
      },
      {
        n: 8,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03 },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: `${builderNames[7]} Mastery`, // 18
    value: 0,
    step: 0,
    formatNumbers: true,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: `<b>${builderNames[7]} Mastery</b>`
      },
      {
        n: 9,
        unlocked: false,
        permanent: true,
        func: () => { mpsMultiplier += 0.03 },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: "Universal Bank Mastery", // 20
    value: 0,
    step: 0,
    formatNumbers: false,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Universal Bank Mastery</b>"
      },
      {
        n: 30,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "Now +2% $/s per Universal Bank"
      },
      {
        n: 40,
        unlocked: false,
        permanent: true,
        func: () => { mpsMultiplier += 0.3 },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: "Optimization Center Mastery", // 21
    value: 0,
    step: 0,
    formatNumbers: false,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Optimization Center Mastery</b>"
      },
      {
        n: 10,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03; },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: "Blueprint Storage Mastery", // 22
    value: 0,
    step: 0,
    formatNumbers: false,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Blueprint Storage Mastery</b>"
      },
      {
        n: 10,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03; },
        description: "+3% $/s"
      }
    ]
  },
  {
    description: "Celestial Tax Haven Mastery", // 23
    value: 0,
    step: 0,
    formatNumbers: false,
    levels: [
      {
        n: 1,
        unlocked: false,
        permanent: false,
        func: () => {},
        description: "<b>Celestial Tax Haven Mastery</b>"
      },
      {
        n: 10,
        unlocked: false,
        permanent: false,
        func: () => { mpsMultiplier += 0.03; },
        description: "+3% $/s"
      }
    ]
  }
];

for (let i=0; i<achievements.length; i++) {
  achievements[i].maxLevel = achievements[i].levels[achievements[i].levels.length - 1].n;
}

let achievementsPanel = -1;
let achievementsContainer = document.getElementById("achievements-container");
function displayAchievementIcons() {
  achievementsContainer.innerHTML = "";
  achievementsPanel = -1;
  for (let i = 0; i < achievements.length; i++) {
    const a = achievements[i];
    let div = document.createElement("div");
    div.classList.add("achievement");

    if (a.notified) {
      div.classList.add("achievement-border");
    } else {
      div.classList.remove("achievement-border");
    }

    div.innerHTML = `
      <span>${a.value >= a.levels[0].n || i === 0 && refactorLevel > 0 ? a.description : "?"}</span>
    `;
    div.setAttribute(evt, `openAchievement(${i})`);

    achievementsContainer.appendChild(div);
  }
}

// unlock achievement
function increaseAchievement(i,n) {
  let a = achievements[i];
  n = n ? n : 1;

  if (a.value < a.maxLevel) a.value += n;
  a.value = Math.min(a.value, a.maxLevel);
  
  for (let i = 0; i < a.levels.length; i++) {
    const l = a.levels[i];
    if (!l.unlocked && a.value >= l.n) {
      l.unlocked = true;
      l.func();
      if (i !== 0) a.notified = true;
      a.step = Math.max(a.step,i+1);
    }
  }
  updateBuildingMpc2();
}

window.setInterval(() => {
  achievementsPanel === -1 ? closeAchievements() : openAchievement(achievementsPanel);
}, 1000);

function openAchievement(n) {
  achievementsPanel = n;
  achievementsContainer.style.display = "block";
  const a = achievements[n];
  a.notified = false;
  const maxedOut = a.value >= a.maxLevel;
  const prevN = a.levels[a.step - 1] ? a.levels[a.step - 1].n : 0;
  const nOrMaxLevel = (a.levels[a.step] ? a.levels[a.step].n : a.maxLevel);
  const progress = Math.round(((a.step - 1) + (a.value - prevN) / (nOrMaxLevel - prevN)) / (a.levels.length - 1) * 100); // Math.round((a.step + (a.value - prevN) / (nOrMaxLevel - prevN)) / a.levels.length * 100)
  let labels = "";
  let checkpoints = "";
  for (let i=0; i<a.levels.length; i++) {
    const l = a.levels[i];
    const topPos = `calc((100% - 100px) * ${i / (a.levels.length - 1)} + 25px)`
    labels += `<p style="pointer-events: none; text-align: left; position: absolute; top: ${topPos}; left: 0px;">${n === 0 && refactorLevel > 0 ||a.value >= l.n ? `${l.description}` : `?`}</p>`
    checkpoints += `<div style="top: ${topPos};" class="${maxedOut ? "maxed-out" : ''} check ${i === 0 ? "first" : l.unlocked ? (l.permanent ? "unlocked-permanent" : "unlocked-notpermanent") : (l.permanent ? "notunlocked-permanent" : "notunlocked-notpermanent")}">
      <span class="check-label">${!!a.specialNames ? a.specialNames[i] : `${i === 0 ? "" : `${a.formatNumbers ? formatNumber(Math.round(l.n)) : l.n}`}`}</span>
    </div>`;
  }

  achievementsContainer.innerHTML = `
    <button class="hover-btn building-action-btn" style="width: 30px; height: 30px;" ${evt}="closeAchievements()">×</button>
    <div class="achievement-progress-background" ${!!a.specialNames ? "" : `onmouseenter="showToolTip([${a.value}, ${a.maxLevel}, ${a.formatNumbers}],1);"`} onmouseleave="hideToolTip();"></div>
    <div ${maxedOut ? `style="background-color: var(--col-success);"`: ""} class="achievement-progress" data-height="${progress !== 0 && !progress ? 100 : progress}"></div>
    <!--<div style="height: calc((100% - 100px) * ${1 / a.levels.length});" class="achievement-progress-hider"></div>-->
    <div class="achievement-labels">
      ${labels}
    </div>
    <div>
      ${checkpoints}
    </div>
  `;
}

function closeAchievements() {
  achievementsContainer.style.display = "grid";
  displayAchievementIcons();
}

displayAchievementIcons();

let stats = {
  totalTime: 0,
  earnedMoney: 0,
  totalMoneySpent: 0,
  totalBuildingsBuilt: 0,
  totalPlayerBuildClicks: 0,
  totalBuildClicks: 0
}

for (let i = 0; i<8; i++) {
  stats[`Builder${i}Clicks`] = 0;
}

let statsAllTime = JSON.parse(JSON.stringify(stats));

var shortenedValues = true;

const updatePoorPeople = () => {
  let buildBtns = document.querySelectorAll(".build-buttons");
  for (let i = 0; i < buildBtns.length; i++) {
    const b = buildBtns[i];
    const buildingIndex = parseInt(b.parentNode.getAttribute("data-index"));

    if (money >= buildata[buildingIndex].cost * numPurchases) {
      b.style.color = "var(--col-text-bg)";
    } else {
      b.style.color = "var(--col-invalid)";
    }
  }

  let builderBtns = document.querySelectorAll(".builder-upgrade-btn");
  for (let i = 0; i < builderBtns.length; i++) {
    const b = builderBtns[i];
    const builder = builderData[i];
    if (builder.upgradesCurve[builder.ownershipData.level - 1]) {
      if (money >= builder.upgradesCurve[builder.ownershipData.level - 1].cost * numPurchases) {
        b.style.color = "var(--col-text-bg)";
      } else {
        b.style.color = "var(--col-invalid)";
      }
    }
  }

  let buyBuilder = document.querySelector("#buyBuilder");
  if (!!buyBuilder) {
    if (money >= builderData[builderIndex].cost) {
      buyBuilder.style.color = "var(--col-text-bg)";
    } else {
      buyBuilder.style.color = "var(--col-invalid)";
    }
  }
}

/*Object.defineProperty(window, "money", {
  get: function() {
    return this.internalMoney;
  },
  set: function(x) {
    window.internalMoney = x;
    updatePoorPeople();
  }
});*/

window.setInterval(updatePoorPeople, 1e3);

window.onload = () => {
  updatePoorPeople();
}

const randomName = () => {
  let adjectives = ["Universal", "Tyranical", "Shady", "Questionable", "Cool", "Insane", "Exciting", "Honorable", "Innovative", "Unethical", "Greedy", "Evil"];
  let a = adjectives[Math.floor(Math.random() * adjectives.length)]
  
  let names = ["Corporation", "Factory", "Empire", "Organization", "Business", "Firm", "Club", "Association", "Agency", "Realm", "Supremacy"];
  let n = names[Math.floor(Math.random() * names.length)]

  let username;
  if (usr()) {
    username = usr().displayName;
  } else {
    username = 'Guest';
  }
  let lastChar = username[username.length - 1];

  return `${username}'${lastChar === "s" ? "" : "s"} ${a} ${n}`
}

/*** BIG INIT FUNCTION ***/
function init(saveData) {

  achievementsPanel = -1;

  let s = !window.started && saveData;
  document.querySelector("#loading").style.opacity = "0";

  if (saveData) {
    window.corpName = saveData.corpName;
    
    document.querySelector("#name-prompt").style.display = "none";

    document.querySelector("#header p").innerHTML = corpName;
    document.querySelector("#name-setting").value = corpName;

    window.nameConfirmed = true;

    stats = JSON.parse(saveData.stats);
    statsAllTime = JSON.parse(saveData.statsAllTime);
  } else {
    document.querySelector("#name-prompt input").value = randomName();
  }

  if (s) {
    achievements = JSON.parse(saveData.achievements);
    for (let i = 0; i < achievements.length; i++) {
      const a = achievements[i];
      for (let j = 0; j < a.levels.length; j++) {
        const l = a.levels[j];
        if (typeof l.func === 'string') l.func = eval("(" + l.func + ")");
      }
    }
    displayAchievementIcons();

    specialBuildings = saveData.specialBuildings;
    refactorLevel = saveData.refactorLevel;
    document.getElementById("n-refactors").innerHTML = `Number of refactors: ${refactorLevel}`;

    refactorPrice = 7.5e9 + refactorLevel * 2.5e9;
  }

  /* MONEY */
  window.money = s ? saveData.money : 125; // starting money
  window.mps = 0; // starting money per second
  window.mpsMultiplier = s ? saveData.mpsMultiplier : (refactorLevel / 100) * 20 + 1; // for bonuses
  window.numPurchases = 1; // how many buildings to buy
  window.clickStrength = s ? saveData.clickStrength : 1; // by how much you increase a building
  window.deck = [1,10,100];
  window.deckIndex = 0;
  document.getElementById("deckInput").value = deck.join(", ")

  /*** BUILDINGS ***/
  window.buildata = [
    {
      name: "House",
      cost: 100,
      mps: 1,
      clicks: 10,
      mpc: 90,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false
    },
    {
      name: "Village",
      cost: 500,
      mps: 4,
      clicks: 17,
      mpc:450,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false
    },
    {
      name:"City",
      cost:3000,
      mps:25,
      clicks:26,
      mpc:2700,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false
    },
    {
      name:"Region",
      cost:12000,
      mps:95,
      clicks:37,
      mpc:10800,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false
    },
    {
      name:"Country",
      cost:84000,
      mps:600,
      clicks:50,
      mpc:75600,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false
    },
    {
      name:"Continent",
      cost:420000,
      mps:2800,
      clicks:65,
      mpc:378000,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false
    },
    {
      name:"Planet",
      cost:3400000,
      mps:19600,
      clicks:82,
      mpc:3060000,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false
    },
    {
      name:"Solar System",
      cost:20000000,
      mps:98000,
      clicks:101,
      mpc:18000000,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false
    },
    {
      name:"Galaxy",
      cost:180000000,
      mps:750000,
      clicks:122,
      mpc:162000000,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false
    },
    {
      name:"Universal Bank",
      cost: 50000,
      clicks: 50,
      mps: 0,
      mpc: 0,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false,
      specialData: {
        curve: [
          { cost: 50000, value: 1 },
          { cost: 100000, value: 1 },
          { cost: 150000, value: 1 },
          { cost: 200000, value: 1 },
          { cost: 250000, value: 1 },
          { cost: 300000, value: 1 },
          { cost: 350000, value: 1 },
          { cost: 400000, value: 1 },
          { cost: 500000, value: 1 },
          { cost: 750000, value: 1 },
          { cost: 1000000, value: 1 },
          { cost: 3000000, value: 1 },
          { cost: 6000000, value: 1 },
          { cost: 10000000, value: 1 },
          { cost: 15000000, value: 1 },
          { cost: 25000000, value: 1 },
          { cost: 35000000, value: 1 },
          { cost: 45000000, value: 1 },
          { cost: 55000000, value: 1 },
          { cost: 70000000, value: 1 },
          { cost: 85000000, value: 1 },
          { cost: 100000000, value: 1 },
          { cost: 150000000, value: 1 },
          { cost: 200000000, value: 1 },
          { cost: 250000000, value: 1 },
          { cost: 300000000, value: 1 },
          { cost: 350000000, value: 1 },
          { cost: 400000000, value: 1 },
          { cost: 450000000, value: 1 },
          { cost: 500000000, value: 2 },
          { cost: 550000000, value: 2 },
          { cost: 600000000, value: 2 },
          { cost: 650000000, value: 2 },
          { cost: 700000000, value: 2 },
          { cost: 750000000, value: 2 },
          { cost: 800000000, value: 2 },
          { cost: 850000000, value: 2 },
          { cost: 900000000, value: 2 },
          { cost: 950000000, value: 2 },
          { cost: 1000000000, value: 2 }
        ],
        valueLevel: 0,
        costLevel: 0,
        locked: true,
        func: n => {
          mpsMultiplier += n / 100;
          buildata[9].specialData.statsDescription = `+${n}% $/s per building`;
        },
        description: "Multiplies your $/s",
        statsDescription: "+1% $/s per building"
      }
    },
    {
      name:"Optimization Center",
      cost: 50000,
      clicks: 10,
      mps: 0,
      mpc: 0,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false,
      specialData: {
        curve: [
          { cost: 50000, value: 1 },
          { cost: 100000, value: 1 },
          { cost: 150000, value: 1 },
          { cost: 200000, value: 1 },
          { cost: 250000, value: 1 }
        ],
        valueLevel: 0,
        costLevel: 0,
        locked: true,
        func: n => { // increase all builders click per second
          for (let i = 0; i < builderData.length; i++) {
            let b = builderData[i];
            b.bonus += n;
          }
          updateAllBuilders();
        },
        description: "Increases all builders' click per second.",
        statsDescription: "+1 robot click per building"
      }
    },
    {
      name:"Blueprint Storage",
      cost: 50000,
      clicks: 100,
      mps: 0,
      mpc: 0,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false,
      specialData: {
        curve: [
          { cost: 50000, value: 2 },
          { cost: 100000, value: 2 },
          { cost: 150000, value: 2 },
          { cost: 200000, value: 2 },
          { cost: 250000, value: 2 }
        ],
        valueLevel: 0,
        costLevel: 0,
        locked: true,
        func: n => {
          for (let i = 0; i < buildata.length; i++) {
            let b = buildata[i];
            if (b.specialData) continue;
            b.cost -= n / 100 * b.originalCost;
          }
          window.setTimeout(updateAllBuildings, 10);
        },
        description: "Lowers all buildings' cost.",
        statsDescription: "-2% price per building"
      }
    },
    {
      name:"Celestial Tax Haven",
      cost: 50000,
      clicks: 100,
      mps: 0,
      mpc: 0,
      current: 0,
      shown: 0,
      bought: 0,
      built: 0,
      hasbuilder: -1,
      level: 1,
      infoOpen: false,
      specialData: {
        curve: [
          { cost: 50000, value: 2 },
          { cost: 100000, value: 2 },
          { cost: 150000, value: 2 },
          { cost: 200000, value: 2 },
          { cost: 250000, value: 2 }
        ],
        valueLevel: 0,
        costLevel: 0,
        locked: true,
        func: n => {
          mpsMultiplier += n / 100;
        },
        description: "Increases $/s",
        statsDescription: "+1% $/s per building"
      }
    }
  ];
  app.buildata = JSON.parse(JSON.stringify(buildata));
  

  for (let i = 0; i<specialBuildings.length; i++) {
    app.buildata[specialBuildings[i]].specialData.locked = false;
  }

  for (let i = 0; i<app.buildata.length; i++) {
    let b = app.buildata[i];
    b.mpc2 = b.mpc/b.clicks;
    b.originalCost = b.cost;
  }

  if (s) {
    app.buildata = JSON.parse(saveData.buildata);
    for (let i = 0; i < app.buildata.length; i++) {
      const b = app.buildata[i];
      if (b.specialData) {
        if (typeof b.specialData.func === 'string') b.specialData.func = eval("(" + b.specialData.func + ")");
      }
    }
  }

  /* BUILDERS */
  window.builderIndex = 0; // starting index for builders
  window.isPlacingBuilder = false; // wether the player is currently placing a builder or not
  window.currentPlacingBuilderIndex = -1; // the index of the builder that is currently being placed (-1 means no builder is currently being placed)
  window.builderData = [
    { // Builder 1
      cps: 2, // the base delay between clicks (100 is 1 second)
      cost: 250, // the price to buy this builder
      color: "#ffff00", // a random color for now but it can be changed to a specific color
      type: 0,
      upgradesCurve : [ // every upgrade available for this builder
        {cost: 500, value: 3}, // cost: price of the upgrade
        {cost: 1000, value: 4}, // value: the delay to wait between clicks (100 is one second, 3 is 0.03 seconds)
        {cost: 3000, value: 5},
        {cost: 6000, value: 6},
        {cost: 12000, value: 7}
      ]
    },
    { // Builder 2
      cps: 1,
      cost: 1250,
      color: "#00ffff",
      type: 0,
      upgradesCurve : [
        {cost: 2500, value: 2},
        {cost: 3750, value: 3},
        {cost: 5000, value: 4},
        {cost: 6250, value: 5},
        {cost: 7500, value: 6},
        {cost: 8750, value: 7},
        {cost: 10000, value: 8},
        {cost: 11250, value: 9},
        {cost: 12500, value: 10} 
     ]
    },
    { // Builder 3
      cps: 1,
      cost: 7000,
      color: "#00ff00",
      type: 0,
      upgradesCurve : [
       {cost: 15000, value: 2},
       {cost: 25000, value: 3},
       {cost: 40000, value: 5},
       {cost: 75000, value: 8},
       {cost: 175000, value: 11},
       {cost: 400000, value: 14},
       {cost: 1000000, value: 18}
      ]
    },
    { // Builder 4
      cps: 3,
      cost: 40000,
      color: "#ffa200",
      upgradesCurve : [
        {cost: 90000, value: 4},
        {cost: 160000, value: 6},
        {cost: 260000, value: 9},
        {cost: 380000, value: 11},
        {cost: 520000, value: 13},
        {cost: 710000, value: 14},
        {cost: 880000, value: 16},
        {cost: 1070000, value: 18},
        {cost: 1280000, value: 20},
        {cost: 1500000, value: 21},
        {cost: 1750000, value: 24},
        {cost: 2020000, value: 26},
        {cost: 2310000, value: 28},
        {cost: 2620000, value: 30},
        {cost: 3000000, value: 32}
      ]
    },
    { // Builder 5
      cps: 5,
      cost: 1250000,
      color: "#ff00ff",
      upgradesCurve : [
        {cost: 2250000, value: 9},
        {cost: 3500000, value: 12},
        {cost: 5000000, value: 16},
        {cost: 8000000, value: 19},
        {cost: 14000000, value: 23},
        {cost: 20000000, value: 26},
        {cost: 28000000, value: 30}
      ]
    },
    { // Builder 6
      cps: 7,
      cost: 5000000,
      color: "#0000ff",
      upgradesCurve : [
        {cost: 12500000, value: 12},
        {cost: 25000000, value: 16},
        {cost: 40000000, value: 21},
        {cost: 80000000, value: 25},
        {cost: 150000000, value: 30},
        {cost: 300000000, value: 35}
      ]
    },
    { // Builder 7
      cps: 7,
      cost: 12500000,
      color: "#ff0000",
      upgradesCurve : [
        {cost: 25000000, value: 11},
        {cost: 40000000, value: 15},
        {cost: 80000000, value: 20},
        {cost: 150000000, value: 25},
        {cost: 300000000, value: 30},
        {cost: 500000000, value: 35},
        {cost: 1000000000, value: 40}
      ]
    },
    { // Builder 8
      cps: 10,
      cost: 100000000,
      color: "#000000",
      upgradesCurve : [
        {cost: 150000000, value: 15},
        {cost: 250000000, value: 20},
        {cost: 400000000, value: 25},
        {cost: 700000000, value: 30},
        {cost: 950000000, value: 35},
        {cost: 1250000000, value: 40},
        {cost: 1600000000, value: 45},
        {cost: 2000000000, value: 50}
      ]
    }
  ];
  app.builderData = window.builderData;

  for (let i=0; i<builderData.length; i++) {
    let b = builderData[i];
    if (!b.type) {
      b.type = 0;
    }
    b.owned = false;
    b.bonus = 0;
  }

  document.getElementById("builders").innerHTML = "<div id='builders-container'></div>"

  if (s) {
    window.builderData = JSON.parse(saveData.builderData);
    window.builderIndex = saveData.builderIndex;

    for (let i = 0; i < builderData.length; i++) {
      if (builderData[i].owned) document.getElementById("builders-container").innerHTML += "<div class='builder'></div>";
    }
    updateAllBuilders();
  }

  // reset builders
  if (builderIndex < 8) {
    document.getElementById("builders").innerHTML += `
      <button style="color: var(--col-invalid);" id="buyBuilder" class="hover-btn" ${evt}="buyBuilder();">Buy Robot - ${formatNumber(builderData[builderIndex].cost)}$</button>
    `;
  }
  let purchaseContainer = document.getElementById("purchases");
  window.resetBuildingsContainer = () => {
    purchaseContainer.innerHTML = "";
    let maxedSpecialBuildings = [];
    
    let buildataCopy = JSON.parse(JSON.stringify(buildata));
    for (let i = 0; i < buildataCopy.length; i++) {
      buildataCopy[i].index = i;
    }
    buildataCopy.sort((a,b) => a.cost - b.cost);

    // specialBuildings
    for (let i=0; i<buildataCopy.length; i++) {
      const index = buildataCopy[i].index;
      const b = buildata[index];

      if (b.specialData && b.specialData.locked) continue;
      if (b.specialData && b.built === b.specialData.curve.length) {
        maxedSpecialBuildings.push(index);
        continue;
      }

      // display in container
      const div = document.createElement("div");
      div.setAttribute("class", "building");
      div.setAttribute("data-index", index);
      
      //purchaseContainer.appendChild(div);

      updateBuilding(div, index);
    }

    // refactor button
    /*purchaseContainer.innerHTML += `
      <div style="height: 60px;" id="refactor-container">
        <button ${evt}="refactor();" class="action hover-btn" id="refactor">
          <span class="text">Refactor</span>
          <span class="data">${numberWithSpaces(refactorPrice)}$</span>
        </button>
      </div>
    `;*/

    for (let i = 0; i < maxedSpecialBuildings.length; i++) {
      const index = maxedSpecialBuildings[i];
      const div = document.createElement("div");
      div.setAttribute("class", "building");
      div.setAttribute("data-index", index);
      
      purchaseContainer.appendChild(div);

      updateBuilding(div, index);
    }
  }
  resetBuildingsContainer();
  
  purchaseContainer.scroll(0,0);

  document.onkeyup = (e) => {
    if (!isNaN(e.key)) {
      let key = parseInt(e.key) - 1;
  
      if (key !== -1) {
        try {
          document.querySelector("#builders-container").children[key].children[2].dispatchEvent(new Event("mousedown"));
        } catch (e) {
          
        }
      }
    }
  
    if (e.key === "Control" || e.key === "Shift") {
      deckIndex = 0;
      numPurchases = deck[deckIndex];
      document.getElementById("setNumPurchases").innerHTML = `Buy ${deck[deckIndex]}`
      updateAllBuildings();
      updatePoorPeople();
    }
  };
  
  
  document.onkeydown = (e) => {
    if (e.key === "Control") {
      e.preventDefault();
      if (deck[2]) {
        deckIndex = 2;
        numPurchases = deck[2];
        document.getElementById("setNumPurchases").innerHTML = `Buy ${deck[2]}`
        updateAllBuildings();
      }
    } else if (e.key === "Shift") {
      if (deck[1]) {
        deckIndex = 1;
        numPurchases = deck[1];
        document.getElementById("setNumPurchases").innerHTML = `Buy ${deck[1]}`
        updateAllBuildings();
      }
    }
    updatePoorPeople();
  };

  window.started = true;
}

// general update (each 10ms)
var combineMpsDisplay = false;
window.setInterval(function() {
  if (window.started) {
    // calculate mps
    mps = 0;
    for (let i=0; i<buildata.length; i++) {
      mps += buildata[i].mps * buildata[i].built;
    }
    
    // update money and money per second display
    document.getElementById("money").innerHTML = numberWithSpaces(Math.round(money)) + "$";
    document.getElementById("mps").innerHTML = numberWithSpaces(Math.round(mps * (combineMpsDisplay ? mpsMultiplier : 1))) + `$/s${combineMpsDisplay ? "" : " × " + round(mpsMultiplier, 2)}`;
    
    mps *= mpsMultiplier;
    // update builders
    for (let i=0; i<builderData.length; i++) {
      var b = builderData[i];
      if (b.owned && b.ownershipData.building != -1) {
        b.ownershipData.counter += 1;
        if (b.ownershipData.counter >= 100 / (b.cps + b.bonus)) {
          b.ownershipData.counter = 0;
          increaseBuild(b.ownershipData.building, getBuildingNode(b.ownershipData.building).children[0], true, i);
        }
      } else {
        b.counter = 0;
      }
    }

    if (money > achievements[1].value) {
      increaseAchievement(1, Math.abs(money - achievements[1].value));
    }

    /*let refactorBtn = document.querySelector("#refactor");
    if (money >= refactorPrice) {
      refactorBtn.classList.remove("refactor-disabled");
    } else {
      refactorBtn.classList.add("refactor-disabled");
    }*/
  }
}, 10);

// time spent in game
window.setInterval(() => {
  if (window.started) {
    stats.totalTime++;
    statsAllTime.totalTime++;
  }
}, 1000);

// add money per second to money
var mpsUpdateDelay = 1000;
var smoothMoneyIncome = true;
function updateMps() {
  if (window.started) {
    var moneyToAdd = mps * (mpsUpdateDelay / 1000);
    if (money + moneyToAdd !== money) money += moneyToAdd;
    stats.earnedMoney += moneyToAdd;
    statsAllTime.earnedMoney += moneyToAdd;
    if (smoothMoneyIncome && mps != 0) {
      mpsUpdateDelay = 1 / ((mps * mpsMultiplier) / 1000);
      mpsUpdateDelay = Math.max(mpsUpdateDelay, 10)
    } else {
      mpsUpdateDelay = 1000;
    }
  }
  
  window.setTimeout(updateMps, mpsUpdateDelay)
}
window.setTimeout(updateMps, mpsUpdateDelay);

// function executed on build
function build(i, e, event) {
  if (event) event.preventDefault();
  if (!isPlacingBuilder) {
    increaseBuild(i, e, false);
  } else {
    /*** REPLACE OTHER BUILDER ***/
    if (buildata[i].hasbuilder !== -1) { // if the building has a builder 
      let b = builderData[currentPlacingBuilderIndex];
      let other = builderData[buildata[i].hasbuilder];
      if (b.ownershipData.building === -1) { // and the builder you are placing is not on another building

        other.ownershipData.building = -1; // remove other builder

        b.ownershipData.building = i; // place new builder
        buildata[i].hasbuilder = currentPlacingBuilderIndex;
        getBuilderNode(currentPlacingBuilderIndex).classList.remove("pulse");
        currentPlacingBuilderIndex = -1;
        updateBuilding(e.parentNode, i);
        isPlacingBuilder = false;
      } else { // the building has a builder and the builder you are placing is on another building: swap
        if (other !== b) { // and it isn't the same one
          other.ownershipData.building = b.ownershipData.building;
          buildata[other.ownershipData.building].hasbuilder = builderData.indexOf(other);
          
          b.ownershipData.building = i;
          buildata[i].hasbuilder = currentPlacingBuilderIndex;
          
          getBuilderNode(currentPlacingBuilderIndex).classList.remove("pulse");
          currentPlacingBuilderIndex = -1;
          updateAllBuildings();
          isPlacingBuilder = false;
        }
      }
    /*** PLACE BUILDER ***/
    } else {
      isPlacingBuilder = false;
      var b = builderData[currentPlacingBuilderIndex];
      var index = b.ownershipData.building;
      var node = getBuildingNode(index);
      var hadBuilding = false;
      if (b.ownershipData.building != -1) {
        buildata[b.ownershipData.building].hasbuilder = -1; // remove on previous building
        hadBuilding = true;
      }
      b.ownershipData.building = i; // set builderdata building index to this building
      buildata[i].hasbuilder = currentPlacingBuilderIndex; // set buildingdata builder to this builder
      getBuilderNode(currentPlacingBuilderIndex).classList.remove("pulse"); // remove pulse animation from builder button
      currentPlacingBuilderIndex = -1; // no builder is being placed
      updateBuilding(e.parentNode, i);
      if (hadBuilding) updateBuilding(node, index);
    }
  }
}

function updateBuildingMpc2() {
  for (let i = 0; i < buildata.length; i++) {
    const b = buildata[i];
    b.mpc2 = b.mpc / b.clicks;
  }
}

// handle money when buying a building
function buyBuilding(i, e) {
  var b = buildata[i];
  let multiplier = b.specialData ? 1 : numPurchases;
  if (money >= b.cost * multiplier) {
    buildata[i].bought += multiplier;
    money -= b.cost * multiplier;

    stats.totalMoneySpent += b.cost * multiplier;
    statsAllTime.totalMoneySpent += b.cost * multiplier;

    if (b.specialData) {
      b.specialData.costLevel++;
      let newCost = b.specialData.curve[b.specialData.costLevel];
      if (newCost) {
        b.cost = newCost.cost;
      } else {
        b.specialData.disableBuy = true;
      }
      resetBuildingsContainer();
    }
    updateBuilding(e.parentNode, i);
  }
}

// handle money, building build percent, and UI changes when clicking to build
function increaseBuild(i, e, fromBuilder, bi) {
  var b = buildata[i];
  if (b.bought > 0) {
    b.current += 100 / b.clicks * (fromBuilder ? 1 : clickStrength);
    b.current = clamp(0,b.current,100);
    if (b.current > 99.5) b.current = Math.ceil(b.current);
    money += b.mpc2 * (fromBuilder ? 1 : clickStrength);
    stats.earnedMoney += b.mpc2 * (fromBuilder ? 1 : clickStrength);
    statsAllTime.earnedMoney += b.mpc2 / (fromBuilder ? 1 : clickStrength);
    if (!fromBuilder) {
      stats.totalPlayerBuildClicks++;
      statsAllTime.totalPlayerBuildClicks++;
      increaseAchievement(2);
    } else {
      stats[`Builder${bi}Clicks`]++;
      statsAllTime[`Builder${bi}Clicks`]++;
    }
    stats.totalBuildClicks += (fromBuilder ? 1 : clickStrength);
    statsAllTime.totalBuildClicks += (fromBuilder ? 1 : clickStrength);
    if (b.current >= 100) {
      if (!b.specialData) increaseAchievement(i + 3);
      b.built += 1;
      b.bought -= 1;
      b.current = 0;
      stats.totalBuildingsBuilt += 1;
      statsAllTime.totalBuildingsBuilt += 1;

      if (b.specialData) {
        b.specialData.func(b.specialData.curve[b.specialData.valueLevel].value);
        b.specialData.valueLevel++;
        increaseAchievement(i + 11);
        resetBuildingsContainer();
      }
    } else {
      if (!fromBuilder) {
        if ('ontouchstart' in document.documentElement) {
          let coords = e.getBoundingClientRect();
          explode(coords.x + coords.width / 2, coords.y + coords.height / 2);
        } else {
          explode(mouse()[0], mouse()[1]);
        }
      }
    }
  }
  updateBuilding(e.parentNode, i);
}

// update the building's HTML node when interacting whith it
function updateBuilding(e, i) {

  /*
  const b = buildata[i];

  let img = `images/Projects/${b.name}/`;
  if (b.current === 0) {
    if (b.bought === 0 && b.built === 0) {
      img += 'not-bought-not-built';
    } else if (b.bought === 1 && b.built === 0) {
      img += 'bought-not-built';
    } else {
      img += 'finished';
    }
  } else {
    img += `click${Math.ceil(b.current / 10)}`;
  }
  img += '.png';
  img = '';

  const statsTable = b.specialData ? `
  <tr>
    <td colspan="2">${b.specialData.statsDescription}</td>
  </tr>
  <tr>
    <td>Clicks: ${formatNumber(b.clicks)}</td>
    <td>Availability: ${b.specialData.curve.length}</td>
  </tr>
  ` : `
    <tr>
      <td>$/s: ${formatNumber(b.mps)}</td>
      <td>$/click: ${formatNumber(round(b.mpc2,1))}</td>
    </tr>
    <tr>
      <td>Clicks: ${formatNumber(b.clicks)}</td>
      <td>Build Profit: ${formatNumber(b.mpc)}</td>
    </tr>
  `
  if (b.specialData) e.style.backgroundColor = "var(--col-background)";
  let disableBuy = b.specialData && b.specialData.disableBuy;
  e.innerHTML = `
    <button `+ ((b.hasbuilder!=-1) ? `style="background-image: url(${img}); border: var(--border-width) solid `+ builderData[b.hasbuilder].color +';"' : `style="background-image: url(${img});"`) +` ${evtSpam}="build(`+ i +`, this, event)" class="build-btn`+ ((b.hasbuilder!=-1) ? " border" : "") +`"></button>
    <p class="building-name">${b.name} ${b.built}<i class="fas fa-store-alt"></i> ${b.bought}<i class="fas fa-store-alt-slash"></i></p>
    <div class="build-info-button" ${evt}="openBuildInfo(this, ${i})">${b.infoOpen ? "×" : "?"}</div>
    <div class="build-info-wrapper ${b.infoOpen ? 'open-build-info-wrapper' : ''}">
      <table>
        ${statsTable}
      </table>
    </div>
    <button style="color: var(--col-${money >= b.cost ? "text-bg": "invalid"});" ${disableBuy ? "disabled" : ""} ${evtSpam}="buyBuilding(`+ i +`, this)" class="build-buttons building-action-btn hover-btn buy-btn">
      ${disableBuy ? 'Max' : 'Buy'} ${disableBuy ? "" : `${b.specialData ? 1 : formatNumber(numPurchases)} - ${formatNumber(round(b.cost * (b.specialData ? 1 : numPurchases),2))}$`}
    </button><br>
    <p class="build-perc-counter">`+ Math.round(b.current) +`%</p>
    <progress class="build-perc" value="`+ b.current / 100 +`"></progress>
  `;*/
}

function openBuildInfo(e, i) {
  let wrapper = e.nextElementSibling;
  let b = buildata[i];
  b.infoOpen = !b.infoOpen;
  if (b.infoOpen) {
    e.innerHTML = "×";
    wrapper.classList.add("open-build-info-wrapper");
  } else {
    e.innerHTML = "?";
    wrapper.classList.remove("open-build-info-wrapper");
  }
}

function updateAllBuildings() {
  let nodes = document.querySelector("#purchases").children;
  for (let i=0; i<nodes.length; i++) {
    if (nodes[i].id !== "refactor-container") {
      updateBuilding(nodes[i], parseInt(nodes[i].getAttribute("data-index")));
    }
  }
}

let tooltip = document.querySelector(".tooltip");
function showToolTip(i, type) {

  switch (type) {
    case 0:
      let b = buildata[i];

      if (!b.specialData) {
        tooltip.innerHTML = `
          <span style="font-weight: bold;">${b.name} stats:</span><br>
          MPS: ${formatNumber(b.mps)}$/sec<br>
          Total build profit: ${formatNumber(b.mpc)}$<br>
          Clicks to build: ${formatNumber(b.clicks)} clicks
        `;
      } else {
        tooltip.innerHTML = `
          <span style="font-weight: bold;">${b.name} stats:</span><br>
          ${b.specialData.description}<br>
          Clicks to build: ${formatNumber(b.clicks)} clicks<br>
        `;
      }
      break;
  
    case 1:
      tooltip.innerHTML = `${i[2] ? formatNumber(Math.round(i[0])) : i[0]} / ${i[2] ? formatNumber(i[1]) : i[1]}`;
      break;

    case 2:
      tooltip.innerHTML = i;
      break;
  }

  tooltip.style.display = "block";
}

function hideToolTip() {
  tooltip.style.display = "none";
}


function updateAllBuilders() {
  let builderNodes = document.querySelector("#builders-container").children;
  for (var i=0; i<builderNodes.length; i++) {
    let n = builderNodes[i];
    let b = builderData[i];
    let maxedOut = b.ownershipData.level - 1 === b.upgradesCurve.length;
    n.innerHTML = `
      <p style="grid-area: name; margin: 0; margin-top: 7px;">${b.ownershipData.name}.${b.ownershipData.level}</p>
      <br>
      <button class="hover-btn builderAction builder-place-btn" ${evt}="placeBuilder(${i}, this)"><div style="background-color: ${b.color};"><i class="fas fa-robot"></i></div></button>
      <button class="hover-btn builderAction builder-remove-btn" ${evt}="removeBuilder(${i})">Remove</button>
      <div class="builder-info"><span>${b.cps + b.bonus}</span> clicks/s</div>
      <button ${maxedOut ? "" : `style="color: var(--col-${money >= b.upgradesCurve[b.ownershipData.level - 1].cost ? "text-bg": "invalid"});"`} class="hover-btn builderAction builder-upgrade-btn" ${evtSpam}="upgradeBuilder(${i}, this)" ${maxedOut ? "disabled" : ""}>${!maxedOut ? `Upgrade (+${b.upgradesCurve[b.ownershipData.level - 1].value - b.cps}) - ${formatNumber(b.type === 0 ? b.upgradesCurve[b.ownershipData.level - 1].cost : b.upgradesCurve.cost)}$` : "Max"}</button>
    `
  }
  let el = document.getElementById("buyBuilder");
  if (el) el.innerHTML = "Buy Robot - "+ formatNumber(builderData[builderIndex].cost) +"$";
}

// handle money and add a builder when buying a builder
function buyBuilder() {
  var buyButton = document.getElementById("buyBuilder");
  var b = builderData[builderIndex];
  if (builderIndex <= builderData.length && money >= b.cost) {

    if (builderIndex + 1 === builderData.length) {
      buyButton.parentNode.removeChild(buyButton);
    } else {
      buyButton.innerHTML = "Buy Robot - "+ formatNumber(builderData[builderIndex + 1].cost) +"$";
    }

    increaseAchievement(12 + builderIndex);

    money -= b.cost;
    stats.totalMoneySpent += b.cost;
    statsAllTime.totalMoneySpent += b.cost;
    b.owned = true;
    b.ownershipData = {
      building: -1,
      name: builderNames[builderIndex],
      counter: 0,
      level: 1
    }

    document.getElementById("builders-container").innerHTML += `
      <div class="builder">
        <p style="grid-area: name; margin: 0; margin-top: 7px;">${b.ownershipData.name}.1</p>
        <br>
        <button class="hover-btn builderAction builder-place-btn" ${evt}="placeBuilder(`+ builderIndex +`, this)"><div style="background-color: ${b.color};"><i class="fas fa-robot"></i></div></button>
        <button class="hover-btn builderAction builder-remove-btn" ${evt}="removeBuilder(`+ builderIndex +`)">Remove</button>
        <div class="builder-info"><span>${b.cps + b.bonus}</span> clicks/s</div>
        <button style="color: var(--col-${money >= b.upgradesCurve[b.ownershipData.level - 1].cost ? "text-bg": "invalid"});" class="hover-btn builderAction builder-upgrade-btn" ${evtSpam}="upgradeBuilder(`+ builderIndex +`, this)">
          Upgrade (+${b.upgradesCurve[b.ownershipData.level - 1].value - b.cps}) - ${formatNumber(b.type === 0 ? b.upgradesCurve[0].cost : b.upgradesCurve.cost)}$
        </button>
      </div>
    `
    builderIndex += 1;
  }
}

function getBuildingNode(n) {
  let buildings = document.querySelectorAll(".building");
  for (let i = 0; i < buildings.length; i++) {
    const b = buildings[i];
    if (n === parseInt(b.getAttribute("data-index"))) {
      return b;
    }
  }
  return undefined;
}

function getBuilderNode(n) {
  let buildings = document.querySelectorAll(".builder");
  for (let i = 0; i < buildings.length; i++) {
    const b = buildings[i];
    if (n === i) {
      return b.children[2];
    }
  }
  return undefined;
}

// handle builder placement on buildings
function placeBuilder(i, e) {
  if (isPlacingBuilder) {
    if (getBuilderNode(currentPlacingBuilderIndex) === e) {
      e.classList.remove("pulse");
      currentPlacingBuilderIndex = -1;
      isPlacingBuilder = false;
    } else {
      e.classList.add("pulse");
      getBuilderNode(currentPlacingBuilderIndex).classList.remove("pulse");
      currentPlacingBuilderIndex = i;
    }
  } else {
    isPlacingBuilder = true;
    e.classList.add("pulse");
    currentPlacingBuilderIndex = i;
  }
}

// remove builder from the building it is currently placed on
function removeBuilder(i) {
  if (builderData[i].ownershipData.building !== -1) {
    buildata[builderData[i].ownershipData.building].hasbuilder = -1;
    updateBuilding(getBuildingNode(builderData[i].ownershipData.building), builderData[i].ownershipData.building);
    builderData[i].ownershipData.building = -1;
  }
}

// handle money, builder stats, UI changes when upgrading a builder
function upgradeBuilder(i, e) {
  var b = builderData[i];
  var didUpgrade = false;
  var maxLevel = false;

  if (b.ownershipData.level <= b.upgradesCurve.length) {
    if (money >= b.upgradesCurve[b.ownershipData.level - 1].cost) {
      money -= b.upgradesCurve[b.ownershipData.level - 1].cost;
      stats.totalMoneySpent += b.cost;
      statsAllTime.totalMoneySpent += b.cost;
      b.cps = b.upgradesCurve[b.ownershipData.level - 1].value;
      didUpgrade = true;

      if (b.ownershipData.level === b.upgradesCurve.length) {
        maxLevel = true;
      } else {
        e.innerHTML = `Upgrade (+${b.upgradesCurve[b.ownershipData.level].value - b.cps}) - ${formatNumber(b.upgradesCurve[b.ownershipData.level].cost)}$`;
      }
    }
  }

  if (didUpgrade) {
    increaseAchievement(12 + i);
    b.ownershipData.level++;
    e.parentNode.children[4].children[0].innerHTML = b.cps + b.bonus;
    if (maxLevel) {
      //e.parentNode.children[0].innerHTML = builderNames[i] +" (Max lvl / "+ round(b.cps, 0) +"cps)";
      e.parentNode.children[0].innerHTML = `${b.ownershipData.name}.${b.ownershipData.level}`;
      e.disabled = true;
      e.classList.remove("action");
      e.innerHTML = "Max";
    } else {
      // e.parentNode.children[0].innerHTML = builderNames[i] +" (lvl "+ b.ownershipData.level +" / "+ round(b.cps, 0) +"cps)";
      e.parentNode.children[0].innerHTML = `${b.ownershipData.name}.${b.ownershipData.level}`;
    }
  }

  
}

function updateBuyDeck(e) {
  updatePoorPeople();
  try {
    var result = JSON.parse(`[${e.value}]`);
    if (deck.length < 1) return;
    deck = result;
    numPurchases = result[0];
    deckIndex = 0;
    document.getElementById("setNumPurchases").innerHTML = `Buy ${deck[0]}`
    updateAllBuildings();
  } catch (err) {
    e.value = "1, 10, 100";
  }
}

function increaseDeck() {
  if (isNaN(deckIndex)) deckIndex = 0;
  deckIndex++;
  deckIndex = deckIndex % deck.length;
  numPurchases = deck[deckIndex];
  document.getElementById("setNumPurchases").innerHTML =  `Buy ${deck[deckIndex]}`;
  updateAllBuildings();
}

// open settings modal
var container = document.getElementById("settings-container");
var background = document.getElementById("settings-background");
function openSettings() {
  container.style.display = "block";
  background.style.display = "block";

  window.setTimeout(function() {
    container.style.transform = "translate(-50%, -50%) scale(1)"
    background.style.opacity = "1";
  }, 10);
}

// close settings modal
function closeSettings() {
  container.style.transform = "translate(-50%, -50%) scale(0)"
  background.style.opacity = "0";

  window.setTimeout(function() {
    container.style.display = "none";
    background.style.display = "none";
  }, 300);
}

// open stats modal
var statsContainer = document.getElementById("stats-container");
var statsBackground = document.getElementById("stats-background");
function openStats() {
  statsContainer.style.display = "block";
  statsBackground.style.display = "block";

  window.setTimeout(function() {
    statsContainer.style.transform = "translate(-50%, -50%) scale(1)"
    statsBackground.style.opacity = "1";
  }, 10);

  function updateStats() {
    var keys = Object.keys(stats);
    for (var i=0; i<keys.length; i++) {
      let e = document.getElementById(keys[i])
      let end = e.getAttribute("data-end")
      e.innerHTML = end !== "s" ? numberWithSpaces(Math.round(stats[keys[i]])) : secondsToDDHHMMSS(stats[keys[i]]);
      e.innerHTML += end === "s" ? "" : end;

      let index = Array.from(e.parentNode.parentNode.children).indexOf(e.parentNode);

      let allTimeEl = document.getElementById("stats-all").children[0].children[index].children[0];
      allTimeEl.innerHTML = end !== "s" ? numberWithSpaces(Math.round(statsAllTime[keys[i]])) : secondsToDDHHMMSS(statsAllTime[keys[i]]);
      allTimeEl.innerHTML += end === "s" ? "" : end;
    }
  }

  updateStats();

  window.statsUpdate = window.setInterval(updateStats, 1000);
}

// close settings modal
function closeStats() {
  statsContainer.style.transform = "translate(-50%, -50%) scale(0)"
  statsBackground.style.opacity = "0";

  window.setTimeout(function() {
    statsContainer.style.display = "none";
    statsBackground.style.display = "none";
  }, 300);

  window.clearInterval(statsUpdate);
}

function setStatsPanel(n) {
  switch (n) {
    case 0:
      document.getElementById('stats-refactor').style.display = 'block';
      document.getElementById('stats-all').style.display = 'none';

      document.getElementById("stats-btn-background").style.left = "30px";
      break;
    case 1:
      document.getElementById('stats-refactor').style.display = 'none';
      document.getElementById('stats-all').style.display = 'block';

      document.getElementById("stats-btn-background").style.left = "50%";
      break;
  }

}

function refactor() {
  if (money >= refactorPrice) {
    let container = document.querySelector("#refactor-confirm");
    let background = document.querySelector("#refactor-confirm-background");
    container.style.display = "block";
    background.style.display = "block";

    window.setTimeout(function() {
      container.style.transform = "translate(-50%, -50%) scale(1)"
      background.style.opacity = "1";
    }, 10);
  }
}

function closeRefactorConfirm() {
  let container = document.querySelector("#refactor-confirm");
  let background = document.querySelector("#refactor-confirm-background");
  container.style.transform = "translate(-50%, -50%) scale(0)"
  background.style.opacity = "0";

  window.setTimeout(function() {
    container.style.display = "none";
    background.style.display = "none";
  }, 300);
}

function confirmRefactor() {
  let refactorTime = stats.totalTime;
  let times = [1440,45,30,20,15,10];
  let underTime = -1;

  statsAllTime.totalMoneySpent += refactorPrice;

  for (let i = 0; i < times.length; i++) {
    if (refactorTime / 60 <= times[i]) {
      underTime = times[i];
    }
  }

  let level = times.indexOf(underTime) + 1;

  while (achievements[0].value < level) {
    increaseAchievement(0);
  }
  
  refactorLevel++;
  refactorPrice += 2.5e9;

  // update nbr of refactors stat
  document.getElementById("n-refactors").innerHTML = `Number of refactors: ${refactorLevel}`

  // reset current refactor stats
  let keys = Object.keys(stats);
  for (let i=0; i<keys.length; i++) {
    stats[keys[i]] = 0;
  }

  // Congratulations prompt
  let container = document.querySelector("#refactor-prompt");
  let background = document.querySelector("#refactor-prompt-background");
  let options = document.querySelector("#refactor-options");

  if (specialBuildings.length >= 4) {
    container.querySelector("span").innerHTML = ""
  } else {
    container.querySelector("span").innerHTML = "You can now choose a special building to unlock:"
  }

  options.innerHTML = "";

  for (let i = 0; i < buildata.length; i++) {
    let b = buildata[i];
    if (!b.specialData) continue;
    if (!b.specialData.locked) continue;
    options.innerHTML += `
      <div class="refactor-prompt-option">
        <button class="hover-btn" ${evt}="setRefactorOption(${i},this)"></button>
        <br><br><b>${b.name}</b><br><br>${b.specialData.description}
      </div>
    `;
  }

  // open refactor prompt
  container.style.display = "block";
  background.style.display = "block";

  window.setTimeout(function() {
    container.style.transform = "translate(-50%, -50%) scale(1)"
    background.style.opacity = "1";
  }, 10);
}

let refactorOption = -1;
function setRefactorOption(i,e) {
  refactorOption = i;

  let selectedOptions = document.querySelectorAll(".selected-option");
  for (let i = 0; i < selectedOptions.length; i++) {
    selectedOptions[i].classList.remove("selected-option");
  }
  e.classList.add("selected-option");
}

function confirmRefactorPrompt() {
  if (refactorOption !== -1 || specialBuildings.length >= 4) {
    if (refactorOption !== -1) specialBuildings.push(refactorOption);
    refactorOption = -1;
    
    let refactorAchievementValue = achievements[0].value;
    init();
    closeAchievements();
    
    // reset achievements
    for (let i = 0; i < achievements.length; i++) {
      const a = achievements[i];
      a.value = 0;
      a.step = 0;
      if (i !== 0) a.notified = false;
      for (let j = 0; j < a.levels.length; j++) {
        let l = a.levels[j];

        if (!l.permanent) l.unlocked = false;
        if (l.permanent && l.unlocked) l.func();
      }
    }

    achievements[0].value = refactorAchievementValue;

    let container = document.querySelector("#refactor-prompt");
    let background = document.querySelector("#refactor-prompt-background");
    
    container.style.transform = "translate(-50%, -50%) scale(0)"
    background.style.opacity = "0";

    window.setTimeout(function() {
      container.style.display = "none";
      background.style.display = "none";
    }, 300);
  }
}

/**  HELPER FUNCTIONS **/
// clamp function
function clamp(a, b, c){
  return Math.max(b,Math.min(c,a));
}

// prevent right click, and turn it into a left click (jQuery)
document.addEventListener('contextmenu', (e) => {
  if (e.which === 3) {
    e.preventDefault();
    //document.dispatchEvent(new Event('mousedown'));
  }
})

// adds spaces each three digits in big numbers
function formatNumber(n) {
  if (shortenedValues) { // shortened values
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(2) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(2) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(2) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(2) + "T";
  } else { // or spaced values
    return numberWithSpaces(n);
  }
}

function numberWithSpaces(n) {
  let parts = n.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

function secondsToDDHHMMSS(s) {
  var fm = [
    { n: Math.floor(s / 60 / 60 / 24), e: "d" }, // DAYS
    { n: Math.floor(s / 60 / 60) % 24, e: "h" }, // HOURS
    { n: Math.floor(s / 60) % 60, e: "m" }, // MINUTES
    { n: s % 60, e: "s" } // SECONDS
  ];
  return fm.map((v) => { 
    return ((v.n < 10) ? '0' : '') + v.n + v.e + ' '; 
  }).join('');
}

// returns a random color hex (and prevents light colors from being generated)
/*function randomColor() {
  var c = [0,1,2,3,4,5,6,7,8,9,"a","b","c","d","e"]
  var str = "#"
  for (var i=0;i<6;i++) {
    str += c[Math.floor(Math.random() * c.length)]
  }
  return str
}*/

// round floats with a specific precision
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

(() => {
  let style = document.createElement("style");

  for (let i=0; i<=100; i++) {
    style.innerHTML += `[data-height='${i}']{ height: calc((100% - 100px) * (${i} / 100)) !important; }`
  }
  document.head.appendChild(style);
})();

/*** PARTICLES ***/
var enableParticles = true;
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
setupCanvas(ctx);

let particles = [];

function update() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  cls();

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.dy += 0.7;

    p.x += p.dx;
    p.y += p.dy;

    if (window.enableParticles) rectfill(p.x, p.y, 3, 3, getComputedStyle(document.documentElement).getPropertyValue('--col-success'));

    if (p.x > window.innerWidth || p.x < 0 || p.y > window.innerHeight || p.y < 0) particles.splice(i, 1);
  }

  let width = tooltip.getBoundingClientRect().width;
  let x = mouse()[0];
  let y = mouse()[1];

  if (x + width > window.innerWidth) {
    tooltip.style.left = `${x - width}px`;
  } else {
    tooltip.style.left = `${x}px`;
  }
  tooltip.style.top = `${y + 14}px`;
}

function explode(x,y) {
  for (let i = 0; i < 10; i ++) {
    particles.push({
      x: x,
      y: y,
      dx: (Math.random() * 10 + 1) * (Math.random() < 0.5 ? -1 : 1),
      dy: (Math.random() * 10 + 1) * (Math.random() < 0.5 ? -1 : 1)
    });
  }
}

function resetSettings() {
  let defaultSettings = [true, true, false, true];
  let checkBoxes = document.getElementById("settings-container").querySelectorAll("input[type=checkbox]");
  for (let i=0; i<checkBoxes.length; i++) {
    const d = defaultSettings[i];
    const c = checkBoxes[i];
    if (c.checked !== d) c.dispatchEvent(new Event("change"));
    c.checked = d;
  }

  let deckInput = document.getElementById("deckInput");
  deckInput.value = "1, 10, 100";
  deckInput.dispatchEvent(new Event("change"));
}

/*** FIREBASE AUTH ***/
const usr = () => firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function(user) {
  let mainSettings = document.querySelector("#main-settings");
  if (user) {

    mainSettings.innerHTML = `
      <button class="hover-btn" onclick="resetSettings();">Reset Settings to Default</button>
      <button class="hover-btn" onclick="resetGameSave();">Reset Game Save</button><br>
      <p>You are logged in as <a target="_blank" href="https://artridgegames.github.io/artridge.ch#Account">${usr().displayName}</a>.</p>
    `;

    firebase.database().ref(`users/${user.uid}/game-data/clicker`).once("value", (snap) => {
      if (!window.started) init(snap.val());
    });
  } else {
    mainSettings.innerHTML = `
      <button class="hover-btn" onclick="resetSettings();">Reset Default Settings</button><br>
      <p>Please sign up or log in on <a target="_blank" href="https://artridgegames.github.io/artridge.ch#Account">artridge.ch</a> to save your progress.</p>
    `;
    if (!window.started) init();
  }
});

function resetGameSave() {
  if (usr()) {
    firebase.database().ref(`users/${usr().uid}/game-data/clicker`).remove()
    .then(() => {
      window.location.reload();
    })
    .catch((e) => {
      alert("An error occurred. Please try again.");
      console.error(e);
    });
  }
}

function confirmName(name) {
  window.corpName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  document.querySelector("#header p").innerHTML = corpName;
  document.querySelector("#name-setting").value = corpName;

  let prompt = document.querySelector("#name-prompt");
  prompt.style.opacity = "0";
  window.setTimeout(() => {
    prompt.style.display = "none";
  },500);

  window.nameConfirmed = true;
}

function randomizeName(e) {
  let input = e.previousElementSibling;
  input.value = randomName();
  input.dispatchEvent(new Event("keyup"));
}

document.querySelector("#name-setting").addEventListener('keyup', e => {
  window.corpName = e.srcElement.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  document.querySelector("#header p").innerHTML = corpName;
});

window.setInterval(() => {
  if (usr() && window.nameConfirmed) {
    firebase.database().ref(`users/${usr().uid}/game-data/clicker`).set({
      money: money,
      mps: mps,
      corpName: window.corpName,
      refactorLevel: refactorLevel,
      specialBuildings: specialBuildings,
      mpsMultiplier: mpsMultiplier,
      clickStrength: clickStrength,
      builderIndex: builderIndex,
      buildata: JSON.stringify(buildata, (_k, v) => {
        if (typeof v === 'function') {
          return v.toString();
        }
        return v;
      }),
      builderData: JSON.stringify(builderData),
      achievements: JSON.stringify(achievements, (_k, v) => {
        if (typeof v === 'function') {
          return v.toString();
        }
        return v;
      }),
      stats: JSON.stringify(stats),
      statsAllTime: JSON.stringify(statsAllTime)
    }).catch(e => {
      console.error(e);
    })
  }
}, 2000);

(() => {
  const func = () => {
    if ('ontouchstart' in document.documentElement) {
      document.querySelectorAll('*[onmousedown]').forEach((e) => {
        let attr = evt;
        if (e.id === 'setNumPurchases') {
          attr = evtSpam;
        }
        e.setAttribute(attr, e.onmousedown.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]);
        e.removeAttribute('onmousedown');
        e.onmousedown = undefined;
      });
    }
  }
  window.addEventListener('load', func);
})();

(() => {
  const func = (e) => {
    let isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !window.MSStream
    if (isIOS || navigator.userAgent.match(/Android/i)) {
      document.documentElement.style.setProperty('--main-grid-columns', '10% 12.5% 47% 12.5% 10%');
      document.documentElement.style.setProperty('--font-size-veri-smol', '12px');
      document.documentElement.style.setProperty('--font-size-smol', '16px');
      document.documentElement.style.setProperty('--font-size-medium', '28px');
      document.documentElement.style.setProperty('--font-size-big', '52px');
    } else {
      document.documentElement.style.setProperty('--main-grid-columns', '1fr 2fr 5fr 2fr 1fr');
    }
  }
  window.addEventListener('resize', func);
  window.addEventListener('load', func);
})();