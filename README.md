# TrustNote – Secure Message Logger

TrustNote is a simple, privacy-focused web app for securely logging and verifying messages. It uses a Flask backend and a  JavaScript frontend. All messages are hashed with SHA-256 and stored locally in a flat JSON file. Access to saved messages is protected by a user-defined PIN.

## Features

- **Log and verify messages:** Enter a message, save it, and verify its integrity later.
- **SHA-256 hashing:** All messages are hashed before storage for tamper detection.
- **PIN-protected access:** Saved messages are only visible after entering a PIN.
- **No database required:** Uses a local `storage.json` file for storage.
- **Modern, responsive UI:** Clean, mobile-friendly design.
- **Clear All & Delete:** Remove all or individual messages easily.

## How it Works

1. **Save a message:**
   - Enter your message and click "Save Message". The app hashes and stores it securely.
2. **Verify a message:**
   - Enter a message and click "Verify Message" to check if it matches a saved hash.
3. **Access saved messages:**
   - Click "Access Saved Messages" and set a PIN (first time) or enter your PIN (subsequent times) to view all saved messages.
   - You can log out to lock the messages again.
   - 
## Project Structure

```
TrustNote/
├── backend.py           # Flask backend
├── storage.json         # Local message storage (auto-created)
└── frontend/
    ├── index.html       # Main page (log/verify)
    ├── messages.html    # Protected saved messages page
    ├── app.js           # Main JS logic
    ├── messages.js      # JS for protected page
    └── style.css        # Styles
```

## Security Notes
- **PINs are stored in localStorage (setup) and sessionStorage (access).**
- **This app is for personal/local use.** For production, use a real database and secure authentication.
- **All data is stored locally.**
## Saved Messages:
![Screenshot 2025-05-20 001717](https://github.com/user-attachments/assets/b30b5679-52cb-4e1c-b5b6-4c1c8c65d5ac)
