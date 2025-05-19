// SHA-256 hash function using Web Crypto API
async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}


async function saveMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) {
        showConfirmation('Please enter a message.', false);
        return;
    }
    const res = await fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (data.success) {
        showConfirmation('Message saved securely!', true);
        input.value = '';
        fetchMessages();
    } else {
        showConfirmation(data.error || 'Error saving message.', false);
    }
}


async function verifyMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) {
        showConfirmation('Please enter a message to verify.', false);
        return;
    }
    const res = await fetch('/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (data.success) {
        showConfirmation(data.found ? 'Intact ✅' : 'Tampered ❌', data.found);
    } else {
        showConfirmation(data.error || 'Error verifying message.', false);
    }
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
    data.messages.forEach(({ message, hash }) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${message}</span><span class="hash">${hash}</span>`;
        list.appendChild(li);
    });
}


function showConfirmation(msg, success) {
    const el = document.getElementById('confirmation');
    el.textContent = msg;
    el.style.color = success ? '#16a34a' : '#dc2626';
}


async function clearAll() {
    if (confirm('Are you sure you want to delete all messages?')) {
        await fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ overwrite: true, messages: [] })
        });
        fetchMessages();
        showConfirmation('All messages cleared.', true);
    }
}

document.getElementById('saveBtn').addEventListener('click', saveMessage);
document.getElementById('verifyBtn').addEventListener('click', verifyMessage);
document.getElementById('clearAllBtn').addEventListener('click', clearAll);
window.addEventListener('DOMContentLoaded', fetchMessages);


const pinModal = document.getElementById('pinModal');
const pinInput = document.getElementById('pinInput');
const pinSubmitBtn = document.getElementById('pinSubmitBtn');
const pinError = document.getElementById('pinError');
const pinModalTitle = document.getElementById('pinModalTitle');

function showPinModal(setup = false) {
    pinModal.style.display = 'flex';
    pinInput.value = '';
    pinError.textContent = '';
    pinModalTitle.textContent = setup ? 'Set Access PIN' : 'Enter Access PIN';
    pinInput.focus();
}

function hidePinModal() {
    pinModal.style.display = 'none';
}

function isPinValid(pin) {
    return /^\d{4,8}$/.test(pin);
}


const accessBtn = document.getElementById('accessMessagesBtn');
if (accessBtn) {
    accessBtn.addEventListener('click', () => {
        const savedPin = localStorage.getItem('trustnote-pin');
        if (!savedPin) {
            showPinModal(true); // Setup PIN
        } else {
            showPinModal(false); // Enter PIN
        }
    });
}

if (pinSubmitBtn) {
    pinSubmitBtn.addEventListener('click', () => {
        const pin = pinInput.value.trim();
        if (!isPinValid(pin)) {
            pinError.textContent = 'PIN must be 4-8 digits.';
            return;
        }
        const savedPin = localStorage.getItem('trustnote-pin');
        if (!savedPin) {
            // Set PIN
            localStorage.setItem('trustnote-pin', pin);
            sessionStorage.setItem('trustnote-pin', pin);
            hidePinModal();
            window.location.href = 'messages.html';
        } else {
            // Check PIN
            if (pin === savedPin) {
                sessionStorage.setItem('trustnote-pin', pin);
                hidePinModal();
                window.location.href = 'messages.html';
            } else {
                pinError.textContent = 'Incorrect PIN.';
            }
        }
    });
}


const messagesSection = document.querySelector('.messages-section');
if (messagesSection) messagesSection.style.display = 'none';
