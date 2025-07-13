// ✅ Reverse Geocode Helper
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.display_name || "Unknown Location";
}

// ✅ Load after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const postGigBtn = document.getElementById("post-gig-btn");
  const gigFormContainer = document.getElementById("gig-form-container");
  const gigList = document.getElementById("gig-list");

  // ✅ Show form on button click
  if (postGigBtn) {
    postGigBtn.addEventListener("click", () => {
      gigFormContainer.style.display = "block";

      gigFormContainer.innerHTML = `
        <form id="gig-giver-form" class="gig-form-card">
          <label for="taskDescription">What gig can you give?</label>
          <p>I need someone to:</p>
          <textarea name="taskDescription" rows="4" placeholder="e.g. clean my compound..." required></textarea>
          <button type="submit">Submit Gig</button>
        </form>
      `;

      const form = document.getElementById("gig-giver-form");
      form.addEventListener("submit", handleGigSubmission);
    });
  }

  // ✅ Fetch and display existing gigs
  loadGigs();

  // ✅ Submission logic
  async function handleGigSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const taskDescription = form.taskDescription.value.trim();
    const timestamp = new Date();

    const user = firebase.auth().currentUser;
    if (!user) {
      alert("⚠️ You must be logged in.");
      return;
    }

    if (!navigator.geolocation) {
      alert("❌ Location not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const location = await reverseGeocode(latitude, longitude);

      try {
        const db = firebase.firestore();
        await db.collection("gigs").add({
          createdBy: user.uid,
          taskDescription,
          location,
          postedAt: timestamp
        });

        alert("✅ Gig posted successfully!");
        form.reset();
        gigFormContainer.style.display = "none";
        loadGigs(); // Refresh
      } catch (err) {
        console.error("❌ Error saving gig:", err);
        alert("Something went wrong.");
      }
    }, (err) => {
      console.error("Geolocation error:", err);
      alert("⚠️ Could not get your location.");
    });
  }

  // ✅ Load and display all gigs
  async function loadGigs() {
    const db = firebase.firestore();
    const snapshot = await db.collection("gigs").orderBy("postedAt", "desc").get();

    gigList.innerHTML = "";

    snapshot.forEach(doc => {
      const gig = doc.data();
      const dateStr = gig.postedAt.toDate().toLocaleString();

      const card = document.createElement("div");
      card.classList.add("gig-card");

      card.innerHTML = `
        <p><strong>📝 I need someone to:</strong><br> ${gig.taskDescription}</p>
        <p><strong>📍</strong> ${gig.location}</p>
        <p><small>🕒 ${dateStr}</small></p>
      `;

      gigList.appendChild(card);
    });
  }
});
