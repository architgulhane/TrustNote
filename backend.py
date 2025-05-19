from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import hashlib
import json
import os
from datetime import datetime

app = Flask(__name__, static_folder='frontend')
CORS(app)  # Enable CORS for all routes

STORAGE_FILE = 'storage.json'

def sha256_hash(message):
    return hashlib.sha256(message.encode('utf-8')).hexdigest()

def read_storage():
    if not os.path.exists(STORAGE_FILE):
        return []
    with open(STORAGE_FILE, 'r', encoding='utf-8') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def write_storage(data):
    with open(STORAGE_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route('/save', methods=['POST'])
def save_message():
    data = request.get_json()
    # Overwrite support for clear/delete
    if data.get('overwrite'):
        write_storage(data.get('messages', []))
        return jsonify({'success': True})
    # Only handle save if 'message' is present and not empty
    message = data.get('message')
    if message is None or not isinstance(message, str) or not message.strip():
        return jsonify({'success': False, 'error': 'No message provided.'}), 400
    message = message.strip()
    hash_val = sha256_hash(message)
    timestamp = datetime.utcnow().isoformat() + 'Z'
    storage = read_storage()
    # Prevent duplicate messages (optional, can remove if not needed)
    for entry in storage:
        if entry['message'] == message:
            return jsonify({'success': False, 'error': 'Message already exists.'}), 409
    storage.append({'message': message, 'hash': hash_val, 'timestamp': timestamp})
    write_storage(storage)
    return jsonify({'success': True, 'hash': hash_val, 'timestamp': timestamp})

@app.route('/verify', methods=['POST'])
def verify_message():
    data = request.get_json()
    message = data.get('message', '').strip()
    if not message:
        return jsonify({'success': False, 'error': 'No message provided.'}), 400
    hash_val = sha256_hash(message)
    storage = read_storage()
    found = any(entry['hash'] == hash_val for entry in storage)
    return jsonify({'success': True, 'found': found})

@app.route('/messages', methods=['GET'])
def get_messages():
    storage = read_storage()
    return jsonify({'success': True, 'messages': storage})

# Serve static frontend files
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
