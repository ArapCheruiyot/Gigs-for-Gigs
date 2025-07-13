document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("register-btn");
  const formContainer = document.getElementById("registration-form-container");

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

    // 🧠 Attach click after form renders
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

        await db.collection("service_providers").doc(user.uid).set({
          fullName,
          alias,
          skills,
          passportUrl,
          idCardUrl,
          conductUrl,
          registeredAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("✅ Registration successful!");
      } catch (err) {
        console.error("❌ Upload failed:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  });
});

// 🧩 Upload to Cloudinary helper (reuse same setup)
async function uploadToCloudinary(file) {
  const cloudName = "decckqobb"; // ← your Cloudinary cloud name
  const uploadPreset = "gigs4gigs_unsigned"; // ← your preset (no auth needed)

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  return data.secure_url;
}
