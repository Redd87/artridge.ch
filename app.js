// Vue setup
let app = new Vue({
  el: '#app',
  data: {
    tab: 0,
    tabNames: ["Games", "About", "Account"],
    isSignedIn: false
  },
  watch: {
    tab: function (n) { // saves the current tab name in the window's location's hash
      window.location.hash = this.tabNames[n];
    }
  },
  beforeCreate: function() { // adds ability to press enter to perform login or signup
    let panels = document.querySelectorAll(".auth-method");
    let functions = ["login", "signup"]
    for (let i = 0; i<panels.length; i++) {
      let p = panels[i];
      let inputs = p.querySelectorAll("input");
      for (let j = 0; j<inputs.length; j++) {
        inputs[j].setAttribute("onkeyup", `if (event.key === "Enter") ${functions[i]}(this.parentNode);`);
      }
    }

    (() => {
      let images = document.querySelectorAll("img");
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        img.setAttribute("draggable", "false");
      }
    })();
  }
});

// Go to correct tab when loading the page
window.onload = () => {
  let n = app.tabNames.indexOf(window.location.hash.replace("#",""));
  if (n !== -1) app.tab = n;
}

// Firebase authentication
const usr = () => firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function(user) {
  window.setTimeout(() => {
    if (user) {
      app.isSignedIn = true;
    } else {
      app.isSignedIn = false;
    }
  },200);
});

// Login function called from HTML
function login(e) {
  let email = e.children[1].value;
  let password = e.children[2].value;
  let error = e.querySelector(".error-message");
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(e) {
    error.innerHTML = e.message + `<br><button onclick='resetPwd("${email}", this)'>Forgot your password?</button>`;
  });
}

function resetPwd(email, el) {
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      el.parentNode.style.color = "white";
      el.parentNode.innerHTML = `Password reset email sent to ${email}.`;
    })
    .catch((e) => {
      el.parentNode.innerHTML = `The email could not be sent.`;
    });
}

// Signup function called from HTML
function signup(e) {
  let username = e.children[1].value;
  let email = e.children[2].value;
  let password = e.children[3].value;
  let error = e.querySelector(".error-message");
  if (!!username.trim()) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      usr().updateProfile({
        displayName: username
      }).then(() => {
        updateDatabaseUser();
      }).catch((e) => {
        error.innerHTML = e.message;
      });
    }).catch((e) => {
      error.innerHTML = e.message;
    });
  } else {
    error.style.color = "red";
    error.innerHTML = "Invalid username.";
  }
}

// Changes the username of the current user. Called from the HTML.
function changeUsername(e) {
  let username = e.previousElementSibling.value;
  let msg = e.nextElementSibling.nextElementSibling;
  if (!!username.trim()) {
    usr().updateProfile({
      displayName: username
    }).then(() => {
      msg.style.color = "white";
      msg.innerHTML = "Username successfully updated!";
      updateDatabaseUser();
    }).catch((e) => {
      msg.style.color = "red";
      msg.innerHTML = e.message;
    });
  } else {
    msg.style.color = "red";
    msg.innerHTML = "Invalid username.";
  }
}

// Changes the password of the current user. Called from the HTML.
function changePassword(e) {
  let password = e.previousElementSibling.value;
  let msg = e.nextElementSibling.nextElementSibling;
  usr().updatePassword(password).then(() => {
    msg.style.color = "white";
    msg.innerHTML = "Password successfully updated!";
  }).catch((e) => {
    msg.style.color = "red";
    msg.innerHTML = e.message;
  });
}

// Updates data on Firebase Database regarding Firebase auth users
function updateDatabaseUser() {
  if (usr().uid) {
    firebase.database().ref(`users/${usr().uid}/username`).set(usr().displayName);
    firebase.database().ref(`users/${usr().uid}/email`).set(usr().email);
  }
}