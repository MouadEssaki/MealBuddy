from groq import Groq
from pymongo import MongoClient
from bson import ObjectId
import json
import datetime
import re

# Configuration des clients
api_key = "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"
groq_client = Groq(api_key=api_key)
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["MealBuddyDb"]

def search_food(search_term):
    # Define the Groq prompt for searching foods
    search_prompt = f"""
    {{
        search_term: "{search_term}"
    }}

    Constraints:
    - quantity_description and quantity_measurement are mandatory fields.
    - Use Canadian dietary standards for portions (e.g., 1 cup = 250ml, 1 tbsp = 15ml).
    - Nutritional values must match the exact quantity_measurement (no approximations).
    - Return results [] only if no matches exist.
    - Prioritize clarity. Separate descriptive terms (e.g., 1 slice) from measurements (e.g., 30g).

    Generate a JSON response strictly adhering to the following structure when a user searches for a food keyword. The response must:

    - Use the exact keyword provided by the user in the `search_term` field (case-insensitive).
    - Search the Foods collection for ALL entries where:
        1. The name EXACTLY MATCHES the `search_term` (e.g., tomato for tomato).
        2. The name CONTAINS the `search_term` (e.g., tomato sauce for tomato).
    - Return an array of food objects, each containing:
        - `name`: Full English name of the food.
        - `category`: Category (e.g., fruit, beverage, snack).
        - `quantity_description`: Textual description of the portion (e.g., 1 medium, 1 cup).
        - `quantity_measurement`: Exact measurement with unit (e.g., 182g, 250ml).
        - `nutritional_info`: Nutritional data per portion, aligned with the Canadian Nutrition Chart, including:
        ```json
        nutritional_info {{
            calories: number (kcal),
            proteins: number (g),
            carbs: number (g),
            fats: number (g),
            fiber: number (g),
            sugars: number (g),
            sodium: number (mg),
            cholesterol: number (mg)
        }}
        ```

    Example Response for search_term tomato:

    ```json
    {{
    "search_term": "{search_term}",
    "results": [
    {{
        "name": "Tomato",
        "category": "vegetable",
        "quantity_description": "1 medium",
        "quantity_measurement": "123g",
        "nutritional_info": {{
        "calories": 22,
        "proteins": 1.1,
        "carbs": 4.8,
        "fats": 0.2,
        "fiber": 1.5,
        "sugars": 3.2,
        "sodium": 5,
        "cholesterol": 0
        }}
    }},
    {{
        "name": "Tomato Sauce",
        "category": "condiment",
        "quantity_description": "1/4 cup",
        "quantity_measurement": "60g",
        "nutritional_info": {{
        "calories": 15,
        "proteins": 0.5,
        "carbs": 3.5,
        "fats": 0.1,
        "fiber": 0.7,
        "sugars": 2.5,
        "sodium": 210,
        "cholesterol": 0
        }}
    }},
    {{
        "name": "Tomato Juice",
        "category": "beverage",
        "quantity_description": "1 cup",
        "quantity_measurement": "240ml",
        "nutritional_info": {{
        "calories": 40,
        "proteins": 1.0,
        "carbs": 9.0,
        "fats": 0.1,
        "fiber": 1.0,
        "sugars": 6.0,
        "sodium": 400,
        "cholesterol": 0
        }}
    }},
    {{
        "name": "Dried Tomatoes",
        "category": "snack",
        "quantity_description": "30g",
        "quantity_measurement": "30g",
        "nutritional_info": {{
        "calories": 80,
        "proteins": 3.0,
        "carbs": 18.0,
        "fats": 1.0,
        "fiber": 4.0,
        "sugars": 14.0,
        "sodium": 10,
        "cholesterol": 0
    }}
    }}
    ],
    "ai_generated": true
}}
    ```
    """
    
    # Try fetching from the MongoDB 'Foods' collection first
    foods_collection = db["Foods"]
    
    exact_match_foods = list(foods_collection.find({"name": {"$regex": f"^{search_term}$", "$options": "i"}}))
    partial_match_foods = list(foods_collection.find({"name": {"$regex": search_term, "$options": "i"}}))

    
    if exact_match_foods:
        return {
            "search_term": search_term,
            "results": partial_match_foods,
            "ai_generated": False,
            "searched_at": datetime.datetime.utcnow().isoformat()
        }
    
    # If no exact match, proceed with Groq API to generate results
    try:
        completion = groq_client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[{"role": "user", "content": search_prompt}],
            temperature=0.6,
            max_completion_tokens=4096
        )
        
        # Extract JSON from the Groq response
        generated_data = completion.choices[0].message.content
        print()
        json_match = re.search(r'```(?:json)?\n(.*?)\n```', generated_data, re.DOTALL)
        
        if json_match:
            food_json = json.loads(json_match.group(1))
            results = food_json["results"]
            
            # Insert the new food items into the database if they don't exist
            for food in results:
                existing_food = foods_collection.find_one({"name": food["name"]})
                if not existing_food:
                    # Insert new food if it doesn't exist
                    food_data = {
                        "name": food["name"].capitalize(),
                        "category": food["category"].capitalize(),
                        "quantity_description": food["quantity_description"],
                        "quantity_measurement": food["quantity_measurement"],
                        "nutritional_info": food["nutritional_info"]
                    }
                    foods_collection.insert_one(food_data)
            
            return {
                "search_term": search_term,
                "results": results,
                "ai_generated": True,
                "searched_at": datetime.datetime.utcnow().isoformat()
            }

        else:
            return {
                "search_term": search_term,
                "results": [],
                "ai_generated": True
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Example usage of the search function
#result = search_food("milk")
#print(result)
