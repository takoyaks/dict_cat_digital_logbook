let escPressed = false;

document.addEventListener('keydown', function(event) {
  // If ESC is pressed, set flag true
  if (event.key === "Escape") {
    escPressed = true;
    // Reset after a short time, so user must press quickly
    setTimeout(() => { escPressed = false; }, 1000); // 1 second window
  }

  // If D is pressed while ESC was already pressed
  if (event.key.toLowerCase() === "d" && escPressed) {
    // Open a new tab
    window.open('admin.html', '_blank');
    escPressed = false; // Reset
  }
});