
import pymongo
from bson import ObjectId
from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)
myClient = pymongo.MongoClient("mongodb://localhost:27017/")
myDb = myClient["MealBuddyDb"]

# Collections

foods_collection = myDb["Foods"]

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

# Foods CRUD
@app.route('/foods', methods=['GET'])
def get_foods():
    foods = list(foods_collection.find())
    return jsonify([parse_json(food) for food in foods])

@app.route('/foods/<id>', methods=['GET'])
def get_food(id):
    try:
        food = foods_collection.find_one({"_id": ObjectId(id)})
        if food:
            return parse_json(food)
        return jsonify({"error": "Food not found"}), 404
    except:
        return jsonify({"error": "Invalid ID"}), 400

@app.route('/foods', methods=['POST'])
def add_food():
    data = request.get_json()
    result = foods_collection.insert_one(data)
    return jsonify({"_id": str(result.inserted_id)}), 201

@app.route('/foods/<id>', methods=['PUT'])
def update_food(id):
    try:
        data = request.get_json()
        result = foods_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Food not found"}), 404
        return jsonify({"modified": result.modified_count}), 200
    except:
        return jsonify({"error": "Invalid ID"}), 400

@app.route('/foods/<id>', methods=['DELETE'])
def delete_food(id):
    try:
        result = foods_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Food not found"}), 404
        return jsonify({"deleted": result.deleted_count}), 200
    except:
        return jsonify({"error": "Invalid ID"}), 400
    

if __name__ == '__main__':
    app.run()