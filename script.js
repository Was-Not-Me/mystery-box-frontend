const SERVER_URL = 'https://your-backend-url.com'; // Replace with your Render backend URL

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  const typeField = document.getElementById('type');
  const fileField = document.getElementById('fileField');
  const codeField = document.getElementById('codeField');
  const boxDisplay = document.getElementById('boxDisplay');

  typeField.addEventListener('change', () => {
    if (typeField.value === 'code') {
      fileField.style.display = 'none';
      codeField.style.display = 'block';
    } else {
      fileField.style.display = 'block';
      codeField.style.display = 'none';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await fetch(`${SERVER_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      alert(res.ok ? "Uploaded!" : "Error: " + data.error);
      form.reset();
      fileField.style.display = 'block';
      codeField.style.display = 'none';
    } catch (err) {
      alert("Upload failed");
    }
  });

  document.getElementById('getBoxBtn').addEventListener('click', async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/box`);
      const box = await res.json();

      let html = `<h4>${box.title}</h4>`;
      if (box.author) html += `<p class="text-muted">By: ${box.author}</p>`;

      if (box.type === 'image') {
        html += `<img src="${SERVER_URL}${box.filePath}" class="img-fluid" alt="mystery image">`;
      } else if (box.type === 'audio') {
        html += `<audio controls src="${SERVER_URL}${box.filePath}"></audio>`;
      } else if (box.type === 'code') {
        html += `<pre class="bg-light p-3 rounded"><code>${box.code}</code></pre>`;
      }

      html += `<button class="btn btn-danger mt-2" onclick="flagBox('${box.id}')">🚩 Flag this box</button>`;
      boxDisplay.innerHTML = html;
    } catch {
      alert("No mystery boxes available!");
    }
  });
});

async function flagBox(id) {
  if (!confirm("Flag this box for review?")) return;
  try {
    const res = await fetch(`${SERVER_URL}/api/flag/${id}`, { method: 'POST' });
    alert("Box flagged for admin review.");
    document.getElementById('boxDisplay').innerHTML = '';
  } catch {
    alert("Failed to flag.");
  }
}
