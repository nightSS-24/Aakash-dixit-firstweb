// Frontend JavaScript for login page
document.getElementById('loginForm').addEventListener('submit', function(event) {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (!username || !password) {
    alert('Please enter both username and password.');
    event.preventDefault();
  }
});

// Display error message if login failed
window.addEventListener('load', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorDiv = document.getElementById('errorMessage');
  
  if (error === 'invalid') {
    errorDiv.textContent = 'Invalid username or password. Please try again.';
    errorDiv.classList.add('show');
  } else if (error === 'server') {
    errorDiv.textContent = 'Server error. Please try again later.';
    errorDiv.classList.add('show');
  }
});