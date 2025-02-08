from flask import Flask
import pymongo
from urllib.parse import quote_plus  # Add this to encode the password

from Users.UsersCrud import users_bp
from MealLogs.MealLogsCrud import meal_logs_bp
from ShoppingLists.ShoppingListsCrud import shopping_lists_bp
from MealPlans.MealPlansCrud import meal_plans_bp
from Recipes.RecipesCrud import recipes_bp
from Foods.FoodsCrud import foods_bp

def create_app():
    # Initialize Flask app
    app = Flask(__name__)

    # MongoDB username and password
    username = "mahmouddabachi2004"
    password = "mahmoud2004@"  # Replace with your actual password, if it has special characters

    # URL-encode the password
    encoded_password = quote_plus(password)

    # MongoDB connection string with URL-encoded password
    mongo_uri = f"mongodb+srv://{username}:{encoded_password}@cluster0.zwzvx.mongodb.net/?retryWrites=true&w=majority"

    # Connect to MongoDB Atlas
    client = pymongo.MongoClient(mongo_uri)

    # Specify the database name explicitly
    db = client["MealBuddyDb"]  # Replace with your actual database name
    app.config['db'] = db

    # Register Blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(meal_logs_bp)
    app.register_blueprint(shopping_lists_bp)
    app.register_blueprint(meal_plans_bp)
    app.register_blueprint(recipes_bp)
    app.register_blueprint(foods_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000)
