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
// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Welcome message
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("welcome-message").textContent = `Welcome, ${user.displayName || "Friend"}`;
    } else {
      window.location.href = "index.html";
    }
  });

  // Log out
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
      });
    });
  }

  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove 'active' from all
      tabButtons.forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-section").forEach(section => section.classList.remove("active"));

      // Activate clicked tab
      button.classList.add("active");
      const target = button.getAttribute("data-target");
      document.getElementById(target).classList.add("active");
    });
  });
});
