const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = () => {
    const fileContent = reader.result;
    fetch('/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileContent })
    });
  };
  
  reader.readAsText(file);
});