// ✅ Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const gigList = document.getElementById("gig-list");
  const matchedContainer = document.getElementById("matched-job-cards");

  // 📦 Listen for hover on any gig card (using event delegation)
  gigList.addEventListener("mouseover", async (event) => {
    const card = event.target.closest(".gig-card");
    if (!card) return;

    matchedContainer.innerHTML = "<p>🔄 Matching available service providers...</p>";

    try {
      const db = firebase.firestore();
      const snapshot = await db.collection("workers")
        .where("status", "==", "available")
        .get();

      matchedContainer.innerHTML = ""; // Clear loading text

      if (snapshot.empty) {
        matchedContainer.innerHTML = "<p>😞 No available service providers found.</p>";
        return;
      }

      snapshot.forEach(doc => {
        const worker = doc.data();
        const div = document.createElement("div");
        div.classList.add("job-card"); // reuse existing job-card styling

        div.innerHTML = `
          <div class="job-card-header">
            <img class="job-passport" src="${worker.passportUrl}" alt="Photo" />
            <div class="job-info">
              <h3>${worker.fullName}</h3>
              <p class="alias">@${worker.alias}</p>
            </div>
          </div>
          <div class="badge">📍 ${worker.location}</div>
        `;

        matchedContainer.appendChild(div);
      });

    } catch (err) {
      console.error("🔥 Error fetching available workers:", err);
      matchedContainer.innerHTML = "<p>⚠️ Error loading matches.</p>";
    }
  });

  // 🚫 Optional: Clear matched cards when not hovering
  gigList.addEventListener("mouseout", (event) => {
    if (event.relatedTarget && !event.relatedTarget.closest(".gig-card")) {
      matchedContainer.innerHTML = "";
    }
  });
});
