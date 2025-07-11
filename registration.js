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
          <input type="text" name="skills" placeholder="e.g. Cleaning, Cooking" required />

          <button type="submit">Submit Registration</button>
        </form>
      `;

      const form = document.getElementById("service-provider-form");
      form.addEventListener("submit", handleRegistrationFormSubmit);
    });
  }
});

// ✅ Declare only once (check before setting)
if (!window.CLOUD_NAME) window.CLOUD_NAME = "decckqobb";
if (!window.UPLOAD_PRESET) window.UPLOAD_PRESET = "gigs4gigs_unsigned";

// ✅ Cloudinary Upload Helper
async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${window.CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", window.UPLOAD_PRESET);

  const response = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
}

// ✅ Final Working Form Handler
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
      uploadToCloudinary(conductFile)
    ]);

    const user = firebase.auth().currentUser;
    if (user) {
      const db = firebase.firestore();
      await db.collection("service_providers").doc(user.uid).set({
        fullName,
        alias,
        skills,
        passportUrl,
        idCardUrl,
        conductUrl,
        registeredAt: new Date()
      });

      alert("✅ Registration successful!");
      form.style.display = "none";
      displayJobCard({
  fullName,
  alias,
  skills,
  passportUrl,
  idCardUrl,
  conductUrl
});

    } else {
      alert("❌ User not authenticated.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("❌ Something went wrong during registration.");
  } finally {
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit Registration";
  }
}
function displayJobCard(data) {
  const formContainer = document.getElementById("registration-form-container");

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
}
