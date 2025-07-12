// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const skillForm = document.getElementById('skill-form');
  const newSkillInput = document.getElementById('new-skill');
  const skillList = document.getElementById('skill-list');

  const auth = firebase.auth();
  const db = firebase.firestore();

  // Wait for the user to be authenticated
  auth.onAuthStateChanged(user => {
    if (user) {
      const userId = user.uid;
      const skillsRef = db.collection('serviceProviders').doc(userId).collection('skills');

      // Load skills from Firestore
      skillsRef.get().then(snapshot => {
        snapshot.forEach(doc => {
          const li = document.createElement('li');
          li.textContent = doc.data().name;
          skillList.appendChild(li);
        });
      });

      // Handle skill form submission
      skillForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const skillName = newSkillInput.value.trim();
        if (!skillName) return;

        // Add skill to Firestore
        skillsRef.add({ name: skillName }).then(docRef => {
          const li = document.createElement('li');
          li.textContent = skillName;
          skillList.appendChild(li);
          newSkillInput.value = '';
        }).catch(err => {
          console.error('Error adding skill:', err);
        });
      });

    } else {
      console.log('User not logged in');
    }
  });
});
