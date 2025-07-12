// add-skills.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("skill-form");
  const skillInput = document.getElementById("new-skill");
  const skillList = document.getElementById("skill-list");

  // Wait for Firebase Auth to confirm user is logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const skill = skillInput.value.trim();
        if (!skill) return;

        try {
          // Add skill to Firestore under providers/{uid}/skills
          await addDoc(collection(db, "providers", uid, "skills"), {
            name: skill,
            addedAt: serverTimestamp()
          });

          // Optionally display it in the UI
          const li = document.createElement("li");
          li.textContent = skill;
          skillList.appendChild(li);

          skillInput.value = "";
        } catch (err) {
          console.error("Error adding skill:", err);
          alert("Failed to add skill. Try again.");
        }
      });

    } else {
      console.warn("User not logged in");
      form.innerHTML = "<p>Please log in to add skills.</p>";
    }
  });
});
