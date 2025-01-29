from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from datetime import datetime

# Create a Blueprint for foods
foods_bp = Blueprint('foods', __name__, url_prefix='/api')

# Helper to recursively convert ObjectId to string
def parse_json(data):
    if isinstance(data, dict):
        for key in data:
            if isinstance(data[key], ObjectId):
                data[key] = str(data[key])
            elif isinstance(data[key], list):
                data[key] = [parse_json(item) for item in data[key]]
            elif isinstance(data[key], dict):
                data[key] = parse_json(data[key])
        return data
    elif isinstance(data, list):
        return [parse_json(item) for item in data]
    else:
        return data

# --------------------------------------------------------------------------
# Foods Routes
# --------------------------------------------------------------------------

# Get all foods
@foods_bp.route('/foods', methods=['GET'])
def get_foods():
    db = current_app.config['db']
    foods = list(db.Foods.find())  # Fetch all foods from the Foods collection
    return jsonify([parse_json(food) for food in foods])

# Get a specific food by ID
@foods_bp.route('/foods/<id>', methods=['GET'])
def get_food(id):
    db = current_app.config['db']
    try:
        food = db.Foods.find_one({"_id": ObjectId(id)})
        if food:
            return jsonify(parse_json(food))
        return jsonify({"error": "Food not found"}), 404
    except:
        return jsonify({"error": "Invalid ID"}), 400

# Create a new food
@foods_bp.route('/foods', methods=['POST'])
def add_food():
    db = current_app.config['db']
    data = request.get_json()
    result = db.Foods.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)}), 201

# Update a food by ID
@foods_bp.route('/foods/<id>', methods=['PUT'])
def update_food(id):
    db = current_app.config['db']
    try:
        data = request.get_json()
        result = db.Foods.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Food not found"}), 404
        return jsonify({"modified": result.modified_count}), 200
    except:
        return jsonify({"error": "Invalid ID"}), 400

# Delete a food by ID
@foods_bp.route('/foods/<id>', methods=['DELETE'])
def delete_food(id):
    db = current_app.config['db']
    try:
        result = db.Foods.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Food not found"}), 404
        return jsonify({"deleted": result.deleted_count}), 200
    except:
        return jsonify({"error": "Invalid ID"}), 400
