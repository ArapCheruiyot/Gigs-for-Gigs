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
