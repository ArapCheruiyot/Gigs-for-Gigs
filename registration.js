// ✅ Add this near the top of registration.js
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.display_name || "Unknown Location";
}
document.addEventListener("DOMContentLoaded", () => {
  const registrationBtn = document.getElementById("register-btn");
  const formContainer = document.getElementById("registration-form-container");

  if (registrationBtn) {
    registrationBtn.addEventListener("click", () => {
      formContainer.style.display = "block";

      formContainer.innerHTML = `
        <h3>Service Provider Registration</h3>
        <form id="service-provider-form">
          <label>Full Name</label>
          <input type="text" name="fullName" required />

          <label>Preferred Alias</label>
          <input type="text" name="alias" required />

          <label>Passport Photo</label>
          <input type="file" name="passport" accept="image/*" required />

          <label>ID Card</label>
          <input type="file" name="idCard" accept="image/*" required />

          <label>Police Good Conduct</label>
          <input type="file" name="conduct" accept="image/*" required />

          <label>Skills (comma-separated)</label>
          <input type="text" name="skills" required />

          <button type="submit">Submit Registration</button>
        </form>
      `;

      const form = document.getElementById("service-provider-form");
      form.addEventListener("submit", handleRegistrationFormSubmit);
    });
  }
});

if (!window.CLOUD_NAME) window.CLOUD_NAME = "decckqobb";
if (!window.UPLOAD_PRESET) window.UPLOAD_PRESET = "gigs4gigs_unsigned";

async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${window.CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", window.UPLOAD_PRESET);

  const response = await fetch(url, { method: "POST", body: formData });
  const data = await response.json();
  return data.secure_url;
}

async function handleRegistrationFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const fullName = form.fullName.value;
  const alias = form.alias.value;
  const skills = form.skills.value;
  const passportFile = form.passport.files[0];
  const idCardFile = form.idCard.files[0];
  const conductFile = form.conduct.files[0];

  try {
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const [passportUrl, idCardUrl, conductUrl] = await Promise.all([
      uploadToCloudinary(passportFile),
      uploadToCloudinary(idCardFile),
      uploadToCloudinary(conductFile),
    ]);

    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();

      // Try to get user's location
      let location = "Not Set";
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
          );
          const { latitude, longitude } = position.coords;
          location = await reverseGeocode(latitude, longitude);
        } catch (err) {
          console.warn("Location permission denied or failed:", err);
        }
      }

      // Save everything
      await db.collection("service_providers").doc(user.uid).set({
        fullName,
        alias,
        skills,
        passportUrl,
        idCardUrl,
        conductUrl,
        status: "available",
        location, // <- Actual resolved location here
        registeredAt: new Date(),
      });

      alert("✅ Registration successful!");
      form.style.display = "none";

      displayJobCard({
        fullName,
        alias,
        skills,
        passportUrl,
        idCardUrl,
        conductUrl,
        status: "available",
        location,
      });
    } else {
      alert("❌ User not authenticated.");
    }
  } catch (err) {
    console.error("Registration failed:", err);
    alert("❌ Something went wrong.");
  } finally {
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit Registration";
  }
}

// ✅ Final version
function displayJobCard(data) {
  console.log("🔥 displayJobCard() called with data:", data);

  const formContainer = document.getElementById("registration-form-container");
  formContainer.style.display = "block";

  formContainer.innerHTML = `
    <div class="job-card">
      <div class="job-card-header">
        <img src="${data.passportUrl}" class="job-passport" />
        <div class="job-info">
          <h3>${data.fullName}</h3>
          <p class="alias">(${data.alias})</p>
        </div>
      </div>

      <div class="job-docs">
        <p><a href="${data.idCardUrl}" target="_blank">📎 View ID Card</a></p>
        <p><a href="${data.conductUrl}" target="_blank">📎 View Good Conduct</a></p>
      </div>

      <div class="status-toggle">
        <label for="availability-toggle">Availability:</label>
        <select id="availability-toggle">
          <option value="available" ${data.status === "available" ? "selected" : ""}>✅ Available</option>
          <option value="unavailable" ${data.status === "unavailable" ? "selected" : ""}>⛔ Not Available</option>
        </select>
      </div>

      <div class="location-display">
        <label for="location-input">Location:</label>
        <input type="text" id="location-input" value="${data.location || ""}" placeholder="Enter your location" />
      </div>

      <p class="badge">✅ Verified Service Provider</p>
    </div>
  `;

  const user = firebase.auth().currentUser;
  if (!user) return;

  const db = firebase.firestore();

  const statusSelect = document.getElementById("availability-toggle");
  if (statusSelect) {
    statusSelect.addEventListener("change", async (e) => {
  const newStatus = e.target.value;

  // ✅ Update Firestore with new status
  await db.collection("service_providers").doc(user.uid).update({ status: newStatus });
  alert("✅ Availability updated!");

  // ✅ If status is 'available', try to get location
  if (newStatus === "available") {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);

        const locationInput = document.getElementById("location-input");
        if (locationInput) locationInput.value = address;

        await db.collection("service_providers").doc(user.uid).update({ location: address });
        alert("📍 Location updated: " + address);
      }, (error) => {
        alert("⚠️ Could not get location.");
        console.error("Geolocation error:", error);
      });
    } else {
      alert("❌ Geolocation not supported in this browser.");
    }
  }
});

  }

  const locationInput = document.getElementById("location-input");
  if (locationInput) {
    locationInput.addEventListener("blur", async () => {
      const newLocation = locationInput.value.trim();
      if (newLocation) {
        await db.collection("service_providers").doc(user.uid).update({ location: newLocation });
        alert("📍 Location updated");
      }
    });
  }
}

// ✅ Show card if already logged in
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    const doc = await firebase.firestore().collection("service_providers").doc(user.uid).get();
    if (doc.exists) {
      displayJobCard(doc.data());
    }
  }
});
