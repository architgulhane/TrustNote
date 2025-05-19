// messages.js: Only allow access if correct PIN is entered
(function() {
    // Check PIN in sessionStorage
    const pin = sessionStorage.getItem('trustnote-pin');
    const savedPin = localStorage.getItem('trustnote-pin');
    if (!pin || !savedPin || pin !== savedPin) {
        window.location.href = 'index.html';
        return;
    }

    async function fetchMessages() {
        const res = await fetch('/messages');
        const data = await res.json();
        const list = document.getElementById('messagesList');
        list.innerHTML = '';
        if (!data.success || !data.messages || data.messages.length === 0) {
            list.innerHTML = '<li>No messages saved yet.</li>';
            return;
        }
        data.messages.forEach(({ message, hash, timestamp }) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${message}</span><span class="hash">${hash}</span><span style="font-size:0.8em;color:#888;">${timestamp}</span>`;
            list.appendChild(li);
        });
    }

    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('trustnote-pin');
        window.location.href = 'index.html';
    });

    window.addEventListener('DOMContentLoaded', fetchMessages);
})();
