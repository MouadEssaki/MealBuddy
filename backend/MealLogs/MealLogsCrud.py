from flask import Blueprint, request, jsonify, current_app, Response
from bson import ObjectId

# Create a Blueprint for meal logs
meal_logs_bp = Blueprint('meal_logs', __name__, url_prefix='/api')

# --------------------------------------------------------------------------
# Meal Logs Routes
# --------------------------------------------------------------------------

# Get all meal logs
@meal_logs_bp.route("/MealLogs", methods=["GET"])
def get_meal_logs():
    db = current_app.config['db']
    logs = list(db.MealLogs.find())  # Fetch all logs from the MealLogs collection
    # Convert ObjectId to string manually
    logs = [{**log, "_id": str(log["_id"])} for log in logs]
    return jsonify(logs)

# Get a specific meal log by ID
@meal_logs_bp.route("/MealLogs/<id>", methods=["GET"])
def get_meal_log_by_id(id):
    db = current_app.config['db']
    meal = db.MealLogs.find_one({"_id": ObjectId(id)})
    if meal:
        meal["_id"] = str(meal["_id"])  # Convert ObjectId to string
        return jsonify(meal)
    else:
        return jsonify({"error": "Meal not found"}), 404

# Add a new meal log
@meal_logs_bp.route("/MealLogs", methods=["POST"])
def add_meal_log():
    db = current_app.config['db']
    data = request.get_json()
    if 'nom' not in data or 'calories' not in data:
        return jsonify({"error": "Required fields: nom, calories"}), 400
    result = db.MealLogs.insert_one(data)
    return jsonify({"message": "Meal added successfully", "id": str(result.inserted_id)}), 201

# Delete a meal log by its name
@meal_logs_bp.route("/MealLogs/<nom>", methods=["DELETE"])
def delete_meal_log(nom):
    db = current_app.config['db']
    result = db.MealLogs.delete_one({"nom": nom})
    if result.deleted_count > 0:
        return jsonify({"message": "Meal deleted"})
    else:
        return jsonify({"error": "Meal not found"}), 404
