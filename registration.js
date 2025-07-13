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
  });
});
// Add this after setting formContainer.innerHTML
document.getElementById("submit-registration").addEventListener("click", async () => {
  const fullName = document.getElementById("fullName").value.trim();
  const alias = document.getElementById("alias").value.trim();
  const skills = document.getElementById("skills").value.trim();

  const passportFile = document.getElementById("passport").files[0];
  const idCardFile = document.getElementById("idCard").files[0];
  const conductFile = document.getElementById("conduct").files[0];

  // Simple validation
  if (!fullName || !alias || !skills || !passportFile || !idCardFile || !conductFile) {
    alert("❌ Please fill in all fields and upload all documents.");
    return;
  }

  // For now, just log the data to confirm
  console.log("📦 Form Data:");
  console.log({ fullName, alias, skills, passportFile, idCardFile, conductFile });

  alert("🚧 Upload and submission logic coming next...");
});
