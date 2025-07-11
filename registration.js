// Check registration status (mockup — replace with real check from Firebase later)
const user = firebase.auth().currentUser;
const registrationBtn = document.getElementById("register-btn");
const formContainer = document.getElementById("registration-form-container");

registrationBtn.addEventListener("click", () => {
  // Show the registration form on click
  formContainer.style.display = "block";

  // Inject the form (or you can load it from another HTML if needed)
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

  // Attach form submission logic
  document.getElementById("service-provider-form").addEventListener("submit", handleRegistrationFormSubmit);
});
