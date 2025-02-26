from flask import Flask, request, jsonify
import pymongo
from urllib.parse import quote_plus  # Add this to encode the password

from Users.UsersCrud import users_bp
from MealLogs.MealLogsCrud import meal_logs_bp
from ShoppingLists.ShoppingListsCrud import shopping_lists_bp
from MealPlans.MealPlansCrud import meal_plans_bp
from Recipes.RecipesCrud import recipes_bp
from Foods.FoodsCrud import foods_bp

from MealPlans.test import calculer_apport_calorique  
from Research.Research import search_food
from Recipes.recepeGenerator import generate_and_save_recipe
from MealPlans.test import generate_weekly_meal_plan
from MealPlans.test import calculer_apport_calorique
from MealPlans.test import parse_response
from MealPlans.test import parse_quantity
# modif des fichiers pour aucune e3execution car sinon serveur mort

def create_app():

    print("entry point reached")
    # Initialize Flask app
    app = Flask(__name__)

    # MongoDB username and password
    username = "mahmouddabachi2004"
    password = "mahmoud2004@"  # Replace with your actual password, if it has special characters

    # URL-encode the password
    encoded_password = quote_plus(password)

    # MongoDB connection string with URL-encoded password
    mongo_uri = f"mongodb+srv://{username}:{encoded_password}@cluster0.zwzvx.mongodb.net/?retryWrites=true&w=majority"

    try:
        # Connect to MongoDB Atlas
        client = pymongo.MongoClient(mongo_uri)
        # Specify the database name explicitly
        db = client["MealBuddyDb"]  # Replace with your actual database name
        app.config['db'] = db
        print("✅ Successfully connected to MongoDB")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        raise

    

    # Register Blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(meal_logs_bp)
    app.register_blueprint(shopping_lists_bp)
    app.register_blueprint(meal_plans_bp)
    app.register_blueprint(recipes_bp)
    app.register_blueprint(foods_bp)



   
    return app



# deplacé ici pcq azure arrive pas a atteindre et possiblement pour les routes fonctionnelles.
app = create_app()

@app.route("/api/utils/calculerApportCal",methods=["POST"])
def CalculerApportCal():
    data = request.get_json()
    #TODO validation des données

    resultat = calculer_apport_calorique(data["sexe"],data["poids"],data["taille"],data["age"],data["activite"],data["objectif"]) #TODO naming etc (ag ou fr)
    return jsonify({"message":f"Data succesfully recieved, resulting amount are: {resultat} calories", "cal":f"{resultat}"}), 200

@app.route("/api/utils/search_food",methods=["POST"])
def SearchFood():
    data = request.get_json()
    #TODO validation des données

    resultat = search_food(data["search_term"])
    return jsonify({"message":f"Data succesfully recieved","results":f"{resultat['results']}"}), 200

@app.route('/api/utils/generate_recipe', methods=['POST'])
def generate_recipe():
    data = request.get_json()
    
    user_id = data.get("user_id")
    mandatory_ingredients = data.get("mandatory_ingredients", [])
    theme = data.get("theme", "")
    
    # Validate input data
    if not user_id or not mandatory_ingredients:
        return jsonify({"error": "user_id and mandatory_ingredients are required"}), 400

    # Call the generate_and_save_recipe function
    result = generate_and_save_recipe(user_id, mandatory_ingredients, theme)
    
    if result['status'] == 'success':
        return jsonify({"recipe_id": result['recipe_id'], "new_ingredients": result['new_ingredients']}), 201
    else:
        return jsonify({"error": result['message']}), 500
    
@app.route('/api/utils/generate_meal_plan', methods=['POST'])
def generate_meal_plan():
    data = request.get_json()
    
    user_id = data.get("user_id")
    sexe = data.get("sexe")
    poids = data.get("poids")
    taille = data.get("taille")
    age = data.get("age")
    niveau_activite = data.get("niveau_activite")
    objectif = data.get("objectif")
    preferences = data.get("preferences", [])
    
    # Validate input data
    if not user_id or not sexe or not poids or not taille or not age or not niveau_activite or not objectif:
        return jsonify({"error": "Missing required fields"}), 400

    # Call the generate_weekly_meal_plan function
    result = generate_weekly_meal_plan(user_id, sexe, poids, taille, age, niveau_activite, objectif, preferences)
    
    return jsonify(result), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000) #rm du port car azure choisit    host='0.0.0.0', port=8000
