document.addEventListener("DOMContentLoaded", async () => {
  const registerBtn = document.getElementById("register-btn");
  const formContainer = document.getElementById("registration-form-container");

  // 🔥 Firebase auth state
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) return;

    const db = firebase.firestore();
    const docRef = db.collection("service_providers").doc(user.uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      console.log("🔥 Data from Firestore after login:", data);
      displayJobCard(data);
    } else {
      registerBtn.style.display = "block";
    }
  });

  // 🧾 Show form on button click
  registerBtn.addEventListener("click", () => {
    formContainer.style.display = "block";

    formContainer.innerHTML = `
      <div class="job-card">
        <h2>Service Provider Registration</h2>

        <label for="fullName">Full Name:</label>
        <input type="text" id="fullName" placeholder="Enter full name" />

        <label for="alias">Alias (Nickname):</label>
        <input type="text" id="alias" placeholder="Enter alias" />

        <label for="skills">Skills:</label>
        <input type="text" id="skills" placeholder="E.g., Carpenter, Dancer" />

        <label for="passport">Upload Passport Photo:</label>
        <input type="file" id="passport" accept="image/*" />

        <label for="idCard">Upload ID Card:</label>
        <input type="file" id="idCard" accept="image/*" />

        <label for="conduct">Upload Good Conduct:</label>
        <input type="file" id="conduct" accept="image/*" />

        <button id="submit-registration">Submit Registration</button>
      </div>
    `;

    // 📦 Submit form logic
    document.getElementById("submit-registration").addEventListener("click", async () => {
      const fullName = document.getElementById("fullName").value.trim();
      const alias = document.getElementById("alias").value.trim();
      const skills = document.getElementById("skills").value.trim();

      const passportFile = document.getElementById("passport").files[0];
      const idCardFile = document.getElementById("idCard").files[0];
      const conductFile = document.getElementById("conduct").files[0];

      if (!fullName || !alias || !skills || !passportFile || !idCardFile || !conductFile) {
        alert("❌ Please fill in all fields and upload all documents.");
        return;
      }

      try {
        const passportUrl = await uploadToCloudinary(passportFile);
        const idCardUrl = await uploadToCloudinary(idCardFile);
        const conductUrl = await uploadToCloudinary(conductFile);

        const user = firebase.auth().currentUser;
        const db = firebase.firestore();

        const data = {
          fullName,
          alias,
          skills,
          passportUrl,
          idCardUrl,
          conductUrl,
          registeredAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection("service_providers").doc(user.uid).set(data);
        alert("✅ Registration successful!");

        formContainer.style.display = "none";
        displayJobCard(data); // 🪪 Show the card
      } catch (err) {
        console.error("❌ Upload failed:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  });
});

// ☁️ Upload helper
async function uploadToCloudinary(file) {
  const cloudName = "decckqobb"; // Your Cloudinary cloud name
  const uploadPreset = "gigs4gigs_unsigned"; // Your unsigned preset

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url;
}
function displayJobCard(data) {
  const formContainer = document.getElementById("registration-form-container");
  formContainer.style.display = "block";

  const {
    fullName = "",
    alias = "",
    skills = "",
    passportUrl = "",
    idCardUrl = "#",
    conductUrl = "#"
  } = data;

  formContainer.innerHTML = `
    <div class="job-card">
      <div class="job-card-header">
        <img src="${passportUrl}" alt="Passport" class="job-passport" />
        <div class="job-info">
          <h3>${fullName}</h3>
          <p class="alias">(${alias})</p>
        </div>
      </div>

      <div class="job-docs">
        <p><a href="${idCardUrl}" target="_blank">📎 View ID Card</a></p>
        <p><a href="${conductUrl}" target="_blank">📎 View Good Conduct</a></p>
      </div>

      <div class="skills">🛠️ Skills: ${skills}</div>

      <p class="badge">✅ Verified Service Provider</p>
    </div>
  `;
}
