document.addEventListener("DOMContentLoaded", () => {
  // Check auth state
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.getElementById("welcome-message").textContent = `Welcome, ${user.displayName || "Friend"}`;
    } else {
      window.location.href = "index.html";
    }
  });

  // Log out button
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
      });
    });
  }

  // Tab switching logic
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove active classes
      tabButtons.forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-section").forEach(section => section.classList.remove("active"));

      // Add active to selected tab
      button.classList.add("active");
      const target = button.getAttribute("data-target");
      document.getElementById(target).classList.add("active");
    });
  });
});
