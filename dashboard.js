// Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyBQSl1HtlJBPRBcgt5culdCDj_cBVN40Io",
  authDomain: "offer-upload.firebaseapp.com",
  projectId: "offer-upload",
  storageBucket: "offer-upload.firebasestorage.app",
  messagingSenderId: "147934510488",
  appId: "1:147934510488:web:e926fae880569d9475bfed",
  measurementId: "G-X568GL5EJT"
};

firebase.initializeApp(firebaseConfig);

// Update welcome message with user's name
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("welcome-message").textContent = `Welcome, ${user.displayName || "Friend"}`;
  } else {
    // If not logged in, redirect to login
    window.location.href = "index.html";
  }
});

// Log out
document.getElementById("logout-btn").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
});

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    // Switch active tab button
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Switch active section
    document.querySelectorAll('.tab-section').forEach(section => section.classList.remove('active'));
    const target = button.dataset.target;
    document.getElementById(target).classList.add('active');
  });
});
