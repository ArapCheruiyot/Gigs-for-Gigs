document.addEventListener("DOMContentLoaded", () => {
  const postGigBtn = document.getElementById("post-gig-btn"); // Trigger button
  const gigFormContainer = document.getElementById("gig-form-container");

  if (postGigBtn) {
    postGigBtn.addEventListener("click", () => {
      gigFormContainer.style.display = "block";

      gigFormContainer.innerHTML = `
        <h3>Post a Gig</h3>
        <form id="gig-giver-form">
          <label>What gig can you give?</label>
          <p>I need someone to:</p>
          <textarea name="taskDescription" rows="4" placeholder="e.g. clean my garden, fix my window..." required></textarea>

          <label>Your Location</label>
          <input type="text" name="location" placeholder="e.g. Nakuru, Moi Flats" required />

          <label>Phone Number (optional but helpful)</label>
          <input type="tel" name="phone" placeholder="e.g. 07XXXXXXXX" />

          <button type="submit">Submit Gig</button>
        </form>
      `;

      const form = document.getElementById("gig-giver-form");
      form.addEventListener("submit", handleGigSubmission);
    });
  }
});
async function handleGigSubmission(e) {
  e.preventDefault();

  const form = e.target;
  const taskDescription = form.taskDescription.value.trim();
  const location = form.location.value.trim();
  const phone = form.phone.value.trim();
  const timestamp = new Date();

  try {
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("⚠️ You must be logged in to post a gig.");
      return;
    }

    const db = firebase.firestore();
    await db.collection("gigs").add({
      createdBy: user.uid,
      taskDescription,
      location,
      phone,
      postedAt: timestamp
    });

    alert("✅ Gig posted successfully!");
    form.reset();
    form.parentElement.style.display = "none";

  } catch (err) {
    console.error("❌ Error posting gig:", err);
    alert("Something went wrong. Try again.");
  }
}
