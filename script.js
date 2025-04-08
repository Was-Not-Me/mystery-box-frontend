const SERVER_URL = 'https://server-zd6g.onrender.com'; // <-- Change to your backend URL

document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const getBoxBtn = document.getElementById('getBoxBtn');
  const boxDisplay = document.getElementById('boxDisplay');
  const typeField = document.getElementById('type');
  const fileField = document.getElementById('fileField');
  const codeField = document.getElementById('codeField');

  // Show/hide fields based on selected type
  typeField.addEventListener('change', () => {
    if (typeField.value === 'code') {
      fileField.style.display = 'none';
      codeField.style.display = 'block';
    } else {
      fileField.style.display = 'block';
      codeField.style.display = 'none';
    }
  });

  // Upload form submit
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);

    try {
      const res = await fetch(`${SERVER_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert('Mystery box uploaded!');
        uploadForm.reset();
        fileField.style.display = 'block';
        codeField.style.display = 'none';
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Something went wrong during upload.');
    }
  });

  // Get random box
  getBoxBtn.addEventListener('click', async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/box`);
      const box = await res.json();

      let html = `<h4>${box.title}</h4>`;
      if (box.author && box.author.trim() !== '') {
        html += `<p class="text-muted">By: ${box.author}</p>`;
      }

      if (box.type === 'image') {
        html += `<img src="${SERVER_URL}${box.filePath}" class="img-fluid" alt="Mystery image">`;
      } else if (box.type === 'audio') {
        html += `<audio controls src="${SERVER_URL}${box.filePath}"></audio>`;
      } else if (box.type === 'code') {
        html += `<pre class="bg-light p-2 rounded"><code>${box.code}</code></pre>`;
      }

      boxDisplay.innerHTML = html;
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Failed to load mystery box.');
    }
  });
});
