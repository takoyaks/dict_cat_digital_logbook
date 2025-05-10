document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('appForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    const formData = {
      name: document.getElementById('username').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      gender: document.getElementById('gender').value,
      municipality: document.getElementById('municipality').value,
      sector: document.getElementById('sector').value,
      purpose: document.getElementById('purpose').value,
      agree: document.getElementById('agree').checked
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
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('An error occurred while saving data.');
    }
  });
});

