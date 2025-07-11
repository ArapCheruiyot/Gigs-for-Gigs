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

  // ✅ Form submission handler
  function handleRegistrationFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const fullName = form.fullName.value;
    const alias = form.alias.value;
    const skills = form.skills.value;

    // File inputs
    const passport = form.passport.files[0];
    const idCard = form.idCard.files[0];
    const conduct = form.conduct.files[0];

    // 🔔 Just show alert for now – integrate Cloudinary & Firebase later
    alert(`
      ✅ Form captured:
      Name: ${fullName}
      Alias: ${alias}
      Skills: ${skills}
      Passport: ${passport?.name}
      ID Card: ${idCard?.name}
      Conduct: ${conduct?.name}
    `);
  }
});
// CLOUDINARY INFO
const CLOUD_NAME = "decckqobb";
const UPLOAD_PRESET = "gigs4gigs_unsigned";

// Uploads a single image file to Cloudinary
async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  return data.secure_url; // This is the hosted image URL
}

// Handle form submission
async function handleRegistrationFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const fullName = form.fullName.value;
  const alias = form.alias.value;
  const skills = form.skills.value;

  // Get uploaded files
  const passportFile = form.passport.files[0];
  const idCardFile = form.idCard.files[0];
  const conductFile = form.conduct.files[0];

  try {
    // Show simple feedback
    form.querySelector("button[type='submit']").disabled = true;
    form.querySelector("button[type='submit']").innerText = "Submitting...";

    // Upload images to Cloudinary
    const [passportUrl, idCardUrl, conductUrl] = await Promise.all([
      uploadToCloudinary(passportFile),
      uploadToCloudinary(idCardFile),
      uploadToCloudinary(conductFile)
    ]);

    // Save data to Firestore
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

      alert("Registration successful!");
      form.style.display = "none";
    } else {
      alert("User not authenticated.");
    }
  } catch (err) {
    console.error(err);
    alert("Error during registration. Try again.");
  } finally {
    form.querySelector("button[type='submit']").disabled = false;
    form.querySelector("button[type='submit']").innerText = "Submit Registration";
  }
}
