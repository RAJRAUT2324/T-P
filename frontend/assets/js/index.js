const ai = document.getElementById('ai-assistant');
const msg = document.getElementById('ai-message');

ai.addEventListener('click', () => {
  // Toggle animation
  ai.classList.toggle('ai-active');

  // Toggle message
  msg.style.display = msg.style.display === 'block' ? 'none' : 'block';
});
