from groq import Groq
from pymongo import MongoClient
from bson import ObjectId
import json
import datetime
import re
from urllib.parse import quote_plus

# Configuration des clients
api_key = "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"
groq_client = Groq(api_key=api_key)

# MongoDB Atlas username and password
username = "mahmouddabachi2004"
password = "mahmoud2004@"  # Replace with your actual password, if it has special characters

# URL-encode the password
encoded_password = quote_plus(password)

# MongoDB connection string with URL-encoded password
mongo_uri = f"mongodb+srv://{username}:{encoded_password}@cluster0.zwzvx.mongodb.net/?retryWrites=true&w=majority"

# Connect to MongoDB Atlas
mongo_client = MongoClient(mongo_uri)

# Specify the database name explicitly
db = mongo_client["MealBuddyDb"]

def generate_and_save_recipe(user_id, mandatory_ingredients, theme):
    # Génération du prompt dynamique
    recipe_prompt = f"""
        Generate a culinary recipe in JSON format strictly adhering to the following structure. The recipe must:

        Include only the ingredient NAMES specified by the user in the mandatory_ingredients field.

        Contain:

        A unique title.

        A mandatory user_id (the creator’s ID, provided by the user).

        An optional theme (e.g., 'Italian', 'keto').

        A mandatory_ingredients array listing the ingredient NAMES provided by the user (e.g., ["chicken", "garlic"]).

        An ingredients array detailing only the items in mandatory_ingredients, each with:

        name (same as in mandatory_ingredients),

        quantity (e.g., "200g"),

        category,

        nutritional_info per ingredient (pulled from the Foods collection).

        Logical steps using exclusively the listed ingredients.

        tags aligned with the theme and ingredients.

        ai_generated: true, created_at (current ISO date), shared_by: null.


        Constraints:

        The mandatory_ingredients array must use valid ingredient names that exist in the Foods collection.

        The system must map ingredient names to their corresponding category and nutritional_info from the Foods collection.

        Each ingredient’s nutritional_info must include:

        json
        Copy
        "nutritional_info": {{
        "calories": "number (kcal)",
        "proteins": "number (g)",
        "carbs": "number (g)",
        "fats": "number (g)",
        "fiber": "number (g)",
        "sugars": "number (g)",
        "sodium": "number (mg)",
        "cholesterol": "number (mg)"
        }}
        The recipe’s overall nutritional_info must aggregate values from all ingredients.

        Example Structure:

        json
        Copy
        {{
        "user_id": "USER_PROVIDED_ID", // Mandatory field from user input
        "title": "Garlic Herb Chicken",
        "theme": "low-carb",
        "mandatory_ingredients": ["chicken breast", "garlic", "olive oil"], 
        "ingredients": [
            {{
            "name": "chicken breast",
            "quantity": "300g",
            "quantity_description": "1 medium",
            "quantity_measurement": "300g",
            "category": "poultry",
            "nutritional_info": {{
                "calories": 165,
                "proteins": 31,
                "carbs": 0,
                "fats": 3.6,
                "fiber": 0,
                "sugars": 0,
                "sodium": 64,
                "cholesterol": 85
            }}
            }},
            {{
            "name": "garlic",
            "quantity": "3 cloves",
            "quantity_description": "3 cloves",
            "quantity_measurement": "9g",
            "category": "vegetable",
            "nutritional_info": {{
                "calories": 4,
                "proteins": 0.2,
                "carbs": 1,
                "fats": 0,
                "fiber": 0.1,
                "sugars": 0,
                "sodium": 1,
                "cholesterol": 0
            }}
            }}
        ],
        "steps": [
            "1. Marinate the chicken breast with minced garlic and olive oil.",
            "2. Grill for 6-8 minutes per side..."
        ],
        "nutritional_info": {{ // Aggregated totals
            "calories": 169,
            "proteins": 31.2,
            "carbs": 1,
            "fats": 3.6,
            "fiber": 0.1,
            "sugars": 0,
            "sodium": 65,
            "cholesterol": 85
        }},
        "tags": ["low-carb", "high-protein", "grilled"],
        "ai_generated": true,
        "shared_by": null,
        "created_at": "2024-07-21T12:00:00Z"
        }}

        here the recepe info:
        {{
        "user_id": ObjectId("{user_id}"), 
        "mandatory_ingredients": {mandatory_ingredients},  
        "theme": "{theme}"  // Theme of the recipe
        }}
        """

    try:
        # Génération de la recette avec Groq
        completion = groq_client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[{"role": "user", "content": recipe_prompt}],
            temperature=0.6,
            max_completion_tokens=4096
        )
        
        # Extraction et nettoyage du JSON
        generated_recipe = completion.choices[0].message.content

# Extract JSON using regex to handle code block formatting
        try:
            json_match = re.search(r'```(?:json)?\n(.*?)\n```', generated_recipe, re.DOTALL)
            if json_match:
                recipe_json = json.loads(json_match.group(1))
                print("Successfully parsed recipe:")
                print(recipe_json)
            else:
                print("No JSON found in the response")
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
        
        print(recipe_json)

        # Validation des ingrédients
        foods_collection = db["Foods"]
        recipes_collection = db["Recipes"]
        
        processed_ingredients = []
        total_nutrition = {
            "calories": 0,
            "proteins": 0,
            "carbs": 0,
            "fats": 0,
            "fiber": 0,
            "sugars": 0,
            "sodium": 0,
            "cholesterol": 0
        }

        # Traitement de chaque ingrédient
        for ingredient in recipe_json["ingredients"]:
            # Vérification dans Foods
            existing_food = foods_collection.find_one({"name": ingredient["name"].capitalize()})
            
            if not existing_food:
                new_food = {
                    "name": ingredient["name"].capitalize(),
                    "category": ingredient["category"].capitalize(),
                    "quantity_description" : ingredient["quantity_description"],
                    "quantity_measurement": ingredient["quantity_measurement"],
                    "nutritional_info": ingredient["nutritional_info"]
                }
                food_id = foods_collection.insert_one(new_food).inserted_id
            else:
                food_id = existing_food["_id"]
            
            # Mise à jour des données de la recette
            ingredient["food_id"] = str(food_id)
            processed_ingredients.append(ingredient)
            
            # Calcul des totaux nutritionnels
            for key in total_nutrition:
                total_nutrition[key] += ingredient["nutritional_info"].get(key, 0)

        # Préparation du document final
        recipe_data = {
            "user_id": ObjectId(user_id),
            "title": recipe_json["title"],
            "theme": theme,
            "mandatory_ingredients": mandatory_ingredients,
            "ingredients": processed_ingredients,
            "steps": recipe_json["steps"],
            "nutritional_info": total_nutrition,
            "tags": recipe_json["tags"],
            "ai_generated": True,
            "shared_by": None,
            "created_at": datetime.datetime.utcnow()
        }

        # Insertion dans la collection Recipes
        result = recipes_collection.insert_one(recipe_data)
        
        return {
            "status": "success",
            "recipe_id": str(result.inserted_id),
            "new_ingredients": len(processed_ingredients) - len(mandatory_ingredients)
        }

    except json.JSONDecodeError:
        return {"status": "error", "message": "Erreur de décodage JSON"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Exemple d'utilisation
result = generate_and_save_recipe(
   user_id="507f191e810c19729de860ea",
   mandatory_ingredients=["ananas","apple","banana","soy milk"],
   theme="baking"
)

print(result)