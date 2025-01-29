from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from datetime import datetime

# Create a Blueprint for recipes
recipes_bp = Blueprint('recipes', __name__, url_prefix='/api')

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
# Recipes Routes
# --------------------------------------------------------------------------

# Get all recipes
@recipes_bp.route('/recipes', methods=['GET'])
def get_recipes():
    db = current_app.config['db']
    recipes = list(db.Recipes.find())  # Fetch all recipes from the Recipes collection
    parsed_recipes = [parse_json(recipe) for recipe in recipes]
    return jsonify(parsed_recipes)

# Get a specific recipe by ID
@recipes_bp.route('/recipes/<id>', methods=['GET'])
def get_recipe(id):
    db = current_app.config['db']
    try:
        recipe = db.Recipes.find_one({"_id": ObjectId(id)})
        if recipe:
            return jsonify(parse_json(recipe))
        return jsonify({"error": "Recipe not found"}), 404
    except:
        return jsonify({"error": "Invalid ID"}), 400

# Create a new recipe
@recipes_bp.route('/recipes', methods=['POST'])
def add_recipe():
    db = current_app.config['db']
    data = request.get_json()
    data["created_at"] = datetime.now()
    result = db.Recipes.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)}), 201

# Update a recipe by ID
@recipes_bp.route('/recipes/<id>', methods=['PUT'])
def update_recipe(id):
    db = current_app.config['db']
    try:
        data = request.get_json()
        result = db.Recipes.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Recipe not found"}), 404
        return jsonify({"modified": result.modified_count}), 200
    except:
        return jsonify({"error": "Invalid ID"}), 400

# Delete a recipe by ID
@recipes_bp.route('/recipes/<id>', methods=['DELETE'])
def delete_recipe(id):
    db = current_app.config['db']
    try:
        result = db.Recipes.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Recipe not found"}), 404
        return jsonify({"deleted": result.deleted_count}), 200
    except:
        return jsonify({"error": "Invalid ID"}), 400
