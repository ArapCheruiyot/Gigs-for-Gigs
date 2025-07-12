document.addEventListener("DOMContentLoaded", () => {
  // ✅ Check auth and fetch service provider info
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      document.getElementById("welcome-message").textContent = `Welcome, ${user.displayName || "Friend"}`;

      const db = firebase.firestore();
      const doc = await db.collection("service_providers").doc(user.uid).get();

      if (doc.exists) {
        const data = doc.data();
        const formContainer = document.getElementById("registration-form-container");
        formContainer.style.display = "block";

        formContainer.innerHTML = `
          <div class="job-card">
            <img src="${data.passportUrl}" alt="Passport Photo" class="job-passport" />
            <h3>${data.fullName} (${data.alias})</h3>
            <p><strong>Skills:</strong> ${data.skills}</p>

            <div class="job-docs">
              <p><a href="${data.idCardUrl}" target="_blank">View ID Card</a></p>
              <p><a href="${data.conductUrl}" target="_blank">View Good Conduct</a></p>
            </div>

            <p class="badge">✅ Verified Service Provider</p>
          </div>
        `;

        const registerBtn = document.getElementById("register-btn");
        if (registerBtn) registerBtn.style.display = "none";
      }
    } else {
      window.location.href = "index.html";
    }
  });

  // ✅ Log out
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
      });
    });
  }

  // ✅ Tab switching logic
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-section").forEach(section => section.classList.remove("active"));

      button.classList.add("active");
      const target = button.getAttribute("data-target");
      document.getElementById(target).classList.add("active");
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabSections = document.querySelectorAll(".tab-section");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");

      // Remove active class from all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Hide all sections
      tabSections.forEach((section) => {
        section.classList.remove("active");
        section.style.display = "none";
      });

      // Show the target section
      const targetSection = document.getElementById(targetId) || document.getElementById(`${targetId}-section`);
      if (targetSection) {
        targetSection.classList.add("active");
        targetSection.style.display = "block";
      }
    });
  });
});
