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
