from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
import bcrypt

# Create a Blueprint for users
users_bp = Blueprint('users', __name__, url_prefix='/api')

# Helper function to serialize MongoDB documents
def parse_json(data):
    if isinstance(data, list):
        return [parse_json(item) for item in data]
    elif isinstance(data, dict):
        return {key: parse_json(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Hash passwords
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Verify passwords
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# --------------------------------------------------------------------------
# Users Routes
# --------------------------------------------------------------------------

@users_bp.route('/users', methods=['GET'])
def get_users():
    db = current_app.config['db']
    users = list(db.users.find())
    return jsonify(parse_json(users))

@users_bp.route('/users/<id>', methods=['GET'])
def get_user(id):
    db = current_app.config['db']
    user = db.users.find_one({"_id": ObjectId(id)})
    return jsonify(parse_json(user)) if user else jsonify({"error": "User not found"}), 404

@users_bp.route('/users', methods=['POST'])
def create_user():
    db = current_app.config['db']
    data = request.get_json()
    data['password'] = hash_password(data['password'])
    result = db.users.insert_one(data)
    return jsonify({"message": "User created", "id": str(result.inserted_id)}), 201

@users_bp.route('/users/<id>', methods=['PUT'])
def update_user(id):
    db = current_app.config['db']
    data = request.get_json()
    if 'password' in data:
        data['password'] = hash_password(data['password'])
    result = db.users.update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": "User updated"}) if result.matched_count > 0 else jsonify({"error": "User not found"}), 404

@users_bp.route('/users/<id>', methods=['DELETE'])
def delete_user(id):
    db = current_app.config['db']
    result = db.users.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "User deleted"}) if result.deleted_count > 0 else jsonify({"error": "User not found"}), 404

@users_bp.route('/login', methods=['POST'])
def login():
    db = current_app.config['db']
    data = request.get_json()
    user = db.users.find_one({"email": data.get('email')})
    if user and verify_password(data.get('password'), user['password']):
        return jsonify({"message": "Login successful", "user": parse_json(user)})
    else:
        return jsonify({"error": "Invalid email or password"}), 401