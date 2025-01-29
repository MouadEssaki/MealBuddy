from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId

# Create a Blueprint for meal plans
meal_plans_bp = Blueprint('meal_plans', __name__, url_prefix='/api')

# --------------------------------------------------------------------------
# Meal Plans Routes
# --------------------------------------------------------------------------

# Route test
@meal_plans_bp.route("/", methods=["GET"])
def home():
    return jsonify({"message": "API Flask fonctionne avec MongoDB Compass !"})

# Get all meal plans
@meal_plans_bp.route("/MealPlans", methods=["GET"])
def get_meal_plans():
    db = current_app.config['db']
    plans = list(db.MealPlans.find())  # Fetch all plans from the MealPlans collection
    # Convert ObjectId to string manually
    plans = [{**plan, "_id": str(plan["_id"])} for plan in plans]
    return jsonify(plans)

# Get a specific meal plan by ID
@meal_plans_bp.route("/MealPlans/<id>", methods=["GET"])
def get_meal_plan_by_id(id):
    db = current_app.config['db']
    plan = db.MealPlans.find_one({"_id": ObjectId(id)})
    if plan:
        plan["_id"] = str(plan["_id"])  # Convert ObjectId to string
        return jsonify(plan)
    else:
        return jsonify({"error": "Meal plan not found"}), 404

# Add a new meal plan
@meal_plans_bp.route("/MealPlans", methods=["POST"])
def add_meal_plan():
    db = current_app.config['db']
    data = request.get_json()
    if 'name' not in data or 'meals' not in data:
        return jsonify({"error": "Required fields: name, meals"}), 400
    result = db.MealPlans.insert_one(data)
    return jsonify({"message": "Meal plan added successfully", "id": str(result.inserted_id)}), 201

# Delete a meal plan by its name
@meal_plans_bp.route("/MealPlans/<name>", methods=["DELETE"])
def delete_meal_plan(name):
    db = current_app.config['db']
    result = db.MealPlans.delete_one({"name": name})
    if result.deleted_count > 0:
        return jsonify({"message": "Meal plan deleted"})
    else:
        return jsonify({"error": "Meal plan not found"}), 404
