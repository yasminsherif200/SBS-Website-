// public/script.js
const form = document.getElementById('sendForm');
const status = document.getElementById('status');
const output = document.getElementById('resultOutput');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Preparing...';
  output.textContent = '';

  const formData = new FormData();
  const emailsText = document.getElementById('emailsText').value;
  const subject = document.getElementById('subject').value;
  const body = document.getElementById('body').value;
  const csvFile = document.getElementById('csvFile').files[0];
  const images = document.getElementById('images').files;

  if (!subject) {
    alert('Please provide a subject.');
    return;
  }

  formData.append('emailsText', emailsText);
  formData.append('subject', subject);
  formData.append('body', body);

  if (csvFile) formData.append('csvFile', csvFile);

  for (let i = 0; i < images.length && i < 2; i++) {
    formData.append('images', images[i]);
  }

  status.textContent = 'Sending... this may take a while for many recipients';
  try {
    const resp = await fetch('/send', { method: 'POST', body: formData });
    const data = await resp.json();
    if (!data.success) {
      status.textContent = 'Error: ' + (data.error || 'Unknown');
      output.textContent = JSON.stringify(data, null, 2);
    } else {
      status.textContent = `Done — total recipients: ${data.total}`;
      output.textContent = JSON.stringify(data.results, null, 2);
    }
  } catch (err) {
    status.textContent = 'Network or server error';
    output.textContent = String(err);
  }
});
