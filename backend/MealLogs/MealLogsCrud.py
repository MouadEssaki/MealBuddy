from flask import Blueprint, request, jsonify, current_app, Response
from bson import ObjectId
from ..Users.UsersCrud import token_required

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

@meal_logs_bp.route("/MealLogs/current", methods=["GET"])
@token_required
def get_user_meal_logs(user_id):
    db = current_app.config['db']
    logs = list(db.MealLogs.find({"user_id": user_id}))
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


@meal_logs_bp.route("/MealLogs", methods=["GET"]) #l'appel se fait avec un param classique ( MealLogs?date=...) d'ou le request.args.get
@token_required
def get_meal_logs_by_date(user_id):
    db = current_app.config['db']
    date = request.args.get('date')
    query = {"user_id": user_id}
    if date:
        query["date"] = date
    logs = list(db.MealLogs.find(query))
    logs = [{**log, "_id": str(log["_id"])} for log in logs]
    return jsonify(logs)

# Add a new meal log
@meal_logs_bp.route("/MealLogs", methods=["POST"])
def add_meal_log():
    db = current_app.config['db']
    data = request.get_json()
    if 'nom' not in data or 'calories' not in data:
        return jsonify({"error": "Required fields: nom, calories"}), 400
    result = db.MealLogs.insert_one(data)
    return jsonify({"message": "Meal added successfully", "id": str(result.inserted_id)}), 201

#PATCH permet d'update sans avoir à tout envoyer (aka plus rapide)
@meal_logs_bp.route("/MealLogs/<id>", methods=["PATCH"])
@token_required
def update_meal_log(user_id, id):
    db = current_app.config['db']
    data = request.get_json()
    result = db.MealLogs.update_one(   #updateOne fait que si ya pas il créer (me semble)
        {"_id": ObjectId(id), "user_id": user_id},
        {"$push": {"meals": {"$each": data.get("meals", [])}}}  #le $push permet tt simplement d'ajouter à la liste
    )
    if result.modified_count > 0:
        return jsonify({"message": "Meal log updated"})
    return jsonify({"error": "Meal log not found"}), 404

# Delete a meal log by its name
@meal_logs_bp.route("/MealLogs/<nom>", methods=["DELETE"])
def delete_meal_log(nom):
    db = current_app.config['db']
    result = db.MealLogs.delete_one({"nom": nom})
    if result.deleted_count > 0:
        return jsonify({"message": "Meal deleted"})
    else:
        return jsonify({"error": "Meal not found"}), 404
