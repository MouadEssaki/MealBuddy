from flask import Blueprint, request, jsonify, current_app, Response
from bson import ObjectId
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone  # Import timezone
from functools import wraps

# Create a Blueprint for users
users_bp = Blueprint('users', __name__, url_prefix='/api')

# Secret key for JWT
SECRET_KEY = 'FTOURI'

# Hash passwords
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# Verify passwords
def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Generate JWT token
def generate_token(user_id):
    token = jwt.encode({
        'user_id': user_id,
        # 'exp': datetime.now(timezone.utc) + timedelta(hours=1)  # Use timezone-aware datetime
    }, SECRET_KEY, algorithm='HS256')
    return token

# Verify JWT token
def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return 'Token expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"error": "Token is missing!"}), 403
        
        # Split the header into parts
        parts = auth_header.split()
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            return jsonify({"error": "Invalid token format. Use Bearer <token>"}), 403
        
        token = parts[1]  # Get the token part
        user_id = verify_token(token)
        
        if isinstance(user_id, str) and (user_id in ['Token expired. Please log in again.', 'Invalid token. Please log in again.']):
            return jsonify({"error": user_id}), 403
        
        return f(user_id, *args, **kwargs)
    return decorated
# --------------------------------------------------------------------------
# Users Routes
# --------------------------------------------------------------------------

# Route test
@users_bp.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API Flask fonctionne avec MongoDB Compass !"})

# Get all users
@users_bp.route("/users", methods=["GET"])
@token_required
def get_users(user_id):
    db = current_app.config['db']
    users = list(db.users.find())  # Fetch all users from the users collection
    # Convert ObjectId to string manually using list comprehension
    users = [{**user, "_id": str(user["_id"])} for user in users]
    return jsonify(users)

# Get a specific user by ID
@users_bp.route("/users/<id>", methods=["GET"])
@token_required
def get_user(user_id, id):
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
@token_required
def update_user(user_id, id):
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
@token_required
def delete_user(user_id, id):
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
        token = generate_token(str(user['_id']))
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return jsonify({"message": "Login successful", "token": token, "user": user})
    else:
        return jsonify({"error": "Invalid email or password"}), 401