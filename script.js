const SERVER_URL = 'https://server-zd6g.onrender.com'; //  Replace with your backend URL if needed

let adminAccess = false;

async function fetchBox() {
  try {
    const res = await fetch(`${SERVER_URL}/api/box`);
    const box = await res.json();
    const boxContainer = document.getElementById('mysteryBox');
    boxContainer.innerHTML = '';

    if (box.type === 'image') {
      boxContainer.innerHTML = `<h4>${box.title}</h4><img src="${SERVER_URL}${box.filePath}" class="img-fluid">`;
    } else if (box.type === 'audio') {
      boxContainer.innerHTML = `<h4>${box.title}</h4><audio controls src="${SERVER_URL}${box.filePath}"></audio>`;
    } else if (box.type === 'code') {
      boxContainer.innerHTML = `<h4>${box.title}</h4><pre>${box.code}</pre>`;
    }
  } catch (err) {
    alert("Failed to fetch box");
  }
}

function promptAdminPassword() {
  const password = prompt("Enter the admin password:");
  if (password === '16394) {  // Change this if needed
    adminAccess = true;
    loadFlagged();
  } else {
    alert("Incorrect password!");
  }
}

async function loadFlagged() {
  if (!adminAccess) {
    alert("You must be logged in as admin to view flagged boxes.");
    return;
  }

  try {
    const res = await fetch(`${SERVER_URL}/api/admin/flags`, {
      headers: {
        'admin-password': 'yourSecurePasswordHere'  // Send password in header
      }
    });
    const flagged = await res.json();
    const container = document.getElementById('flaggedBoxes');
    container.innerHTML = '';

    if (flagged.length === 0) {
      container.innerHTML = "<p>No flagged boxes 🎉</p>";
      return;
    }

    flagged.forEach(box => {
      let html = `<div class="border rounded p-3 mb-3">
        <strong>${box.title}</strong> ${box.author ? `by ${box.author}` : ''}<br>`;
      if (box.type === 'image') {
        html += `<img src="${SERVER_URL}${box.filePath}" class="img-fluid">`;
      } else if (box.type === 'audio') {
        html += `<audio controls src="${SERVER_URL}${box.filePath}"></audio>`;
      } else if (box.type === 'code') {
        html += `<pre class="bg-light p-2 rounded"><code>${box.code}</code></pre>`;
      }
      html += `
        <button class="btn btn-success mt-2 me-2" onclick="unflagBox('${box.id}')">✅ Approve</button>
        <button class="btn btn-danger mt-2" onclick="deleteBox('${box.id}')">🗑️ Delete</button>
      </div>`;
      container.innerHTML += html;
    });
  } catch (err) {
    alert("Failed to load flagged boxes");
  }
}

async function unflagBox(id) {
  await fetch(`${SERVER_URL}/api/admin/unflag/${id}`, {
    method: 'POST',
    headers: {
      'admin-password': 'yourSecurePasswordHere'  // Send password in header
    }
  });
  loadFlagged();
}

async function deleteBox(id) {
  if (!confirm("Delete this box permanently?")) return;
  await fetch(`${SERVER_URL}/api/admin/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'admin-password': 'yourSecurePasswordHere'  // Send password in header
    }
  });
  loadFlagged();
}
