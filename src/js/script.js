document.addEventListener('DOMContentLoaded', () => {
  const appForm = document.getElementById('appForm');

  if (appForm) {
    appForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent default form submission

      // Collect form data
      const formData = {
        name: document.getElementById('username')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        gender: document.getElementById('gender')?.value || '',
        municipality: document.getElementById('municipality')?.value || '',
        sector: document.getElementById('sector')?.value || '',
        purpose: document.getElementById('purpose')?.value || '',
        agree: document.getElementById('agree')?.checked || false
      };

      try {
        // Send data to the server
        const response = await fetch('/save-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Data saved successfully!');
          appForm.reset(); // Reset the form after successful submission
        } else {
          const errorMessage = await response.text();
          alert(`Failed to save data: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error saving data:', error);
        alert('An error occurred while saving data. Please try again later.');
      }
    });
  }

  // Enable full screen on pressing Enter key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable full-screen mode:', err);
      });
    }
  }, { once: true }); // Triggers only once
});
