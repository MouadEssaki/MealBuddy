from flask import Flask
import pymongo
from Users.UsersCrud import users_bp
from MealLogs.MealLogsCrud import meal_logs_bp

def create_app():
    # Initialize Flask app
    app = Flask(__name__)

    # Configure MongoDB
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    app.config['db'] = client['MealBuddyDb']  # Attach database to app

    # Register Blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(meal_logs_bp)


    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)