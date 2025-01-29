from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from datetime import datetime

# Create a Blueprint for shopping lists
shopping_lists_bp = Blueprint('shopping_lists', __name__, url_prefix='/api')

# --------------------------------------------------------------------------
# Shopping Lists Routes
# --------------------------------------------------------------------------

# Get all shopping lists
@shopping_lists_bp.route("/ShoppingLists", methods=["GET"])
def get_shopping_lists():
    db = current_app.config['db']
    shopping_lists = list(db.ShoppingLists.find())
    shopping_lists = [
        {
            **shopping_list,
            "_id": str(shopping_list["_id"]),
            "user_id": str(shopping_list["user_id"])  # Convert user_id to string
        }
        for shopping_list in shopping_lists
    ]
    return jsonify(shopping_lists)

# Get a specific shopping list by ID
@shopping_lists_bp.route("/ShoppingLists/<id>", methods=["GET"])
def get_shopping_list_by_id(id):
    db = current_app.config['db']
    shopping_list = db.ShoppingLists.find_one({"_id": ObjectId(id)})
    if shopping_list:
        shopping_list["_id"] = str(shopping_list["_id"])
        shopping_list["user_id"] = str(shopping_list["user_id"])  # Convert user_id to string
        return jsonify(shopping_list)
    else:
        return jsonify({"error": "Shopping list not found"}), 404

# Add a new shopping list
@shopping_lists_bp.route("/ShoppingLists", methods=["POST"])
def add_shopping_list():
    db = current_app.config['db']
    data = request.get_json()

    # Validation des données
    if 'user_id' not in data or 'items' not in data or 'date' not in data:
        return jsonify({"error": "Required fields: user_id, items, date"}), 400
    
    # Vérifier que 'items' est une liste et chaque élément a les bonnes clés
    if not isinstance(data['items'], list):
        return jsonify({"error": "'items' must be an array"}), 400
    for item in data['items']:
        if 'name' not in item or 'quantity' not in item:
            return jsonify({"error": "Each item must have 'name' and 'quantity'"}), 400

    # Convertir 'date' en format Date (si elle n'est pas déjà un objet Date)
    if isinstance(data['date'], str):
        try:
            data['date'] = datetime.fromisoformat(data['date'])
        except ValueError:
            return jsonify({"error": "Invalid date format, should be ISO 8601"}), 400

    # Ajouter la nouvelle liste de courses
    result = db.ShoppingLists.insert_one(data)
    return jsonify({"message": "Shopping list added successfully", "id": str(result.inserted_id)}), 201

# Update a shopping list by ID
@shopping_lists_bp.route("/ShoppingLists/<id>", methods=["PUT"])
def update_shopping_list(id):
    db = current_app.config['db']
    data = request.get_json()

    # Mise à jour de la liste de courses
    result = db.ShoppingLists.update_one({"_id": ObjectId(id)}, {"$set": data})
    if result.modified_count > 0:
        return jsonify({"message": "Shopping list updated"})
    else:
        return jsonify({"error": "Shopping list not found or no change made"}), 404

# Delete a shopping list by ID
@shopping_lists_bp.route("/ShoppingLists/<id>", methods=["DELETE"])
def delete_shopping_list(id):
    db = current_app.config['db']
    result = db.ShoppingLists.delete_one({"_id": ObjectId(id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Shopping list deleted"})
    else:
        return jsonify({"error": "Shopping list not found"}), 404
