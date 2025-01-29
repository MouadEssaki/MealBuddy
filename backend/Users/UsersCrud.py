from flask import Blueprint, request, jsonify, current_app, Response
from bson import ObjectId
import bcrypt

# Create a Blueprint for users
users_bp = Blueprint('users', __name__, url_prefix='/api')

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

# Route test
@users_bp.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API Flask fonctionne avec MongoDB Compass !"})

# Get all users
@users_bp.route("/users", methods=["GET"])
def get_users():
    db = current_app.config['db']
    users = list(db.users.find())  # Fetch all users from the users collection
    # Convert ObjectId to string manually using list comprehension
    users = [{**user, "_id": str(user["_id"])} for user in users]
    return jsonify(users)

# Get a specific user by ID
@users_bp.route("/users/<id>", methods=["GET"])
def get_user(id):
    db = current_app.config['db']
    user = db.users.find_one({"_id": ObjectId(id)})
    if user:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404

# Create a new user
@users_bp.route("/users", methods=["POST"])
def create_user():
    db = current_app.config['db']
    data = request.get_json()
    if 'email' not in data or 'password' not in data:
        return jsonify({"error": "Required fields: email, password"}), 400
    data['password'] = hash_password(data['password'])
    result = db.users.insert_one(data)
    return jsonify({"message": "User created", "id": str(result.inserted_id)}), 201

# Update a user by ID
@users_bp.route("/users/<id>", methods=["PUT"])
def update_user(id):
    db = current_app.config['db']
    data = request.get_json()
    if 'password' in data:
        data['password'] = hash_password(data['password'])
    result = db.users.update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.matched_count > 0:
        return jsonify({"message": "User updated"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Delete a user by ID
@users_bp.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    db = current_app.config['db']
    result = db.users.delete_one({"_id": ObjectId(id)})
    if result.deleted_count > 0:
        return jsonify({"message": "User deleted"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

# User login
@users_bp.route("/login", methods=["POST"])
def login():
    db = current_app.config['db']
    data = request.get_json()
    user = db.users.find_one({"email": data.get('email')})
    if user and verify_password(data.get('password'), user['password']):
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return jsonify({"message": "Login successful", "user": user})
    else:
        return jsonify({"error": "Invalid email or password"}), 401
