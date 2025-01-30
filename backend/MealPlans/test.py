from groq import Groq
from pymongo import MongoClient
from bson import ObjectId
import datetime

import json

groq_client = Groq(api_key="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")
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["MealBuddyDb"]

def generate_weekly_meal_plan(user_id, sexe, poids, taille, age, niveau_activite, objectif, preferences):
    # 1. Calcul des calories et récupération des aliments existants
    calories = calculer_apport_calorique(sexe, poids, taille, age, niveau_activite, objectif)
    valid_ingredients = list(db.Foods.find({}, {"name": 1, "category": 1, "nutritional_info": 1}))
    
    # 2. Génération du plan jour par jour
    meal_plan = {
        "user_id": ObjectId(user_id),
        "week_start_date": datetime.date.today().isoformat(),
        "meals": [],
        "shopping_list": {}
    }

    base_prompt = f"""Generate ONE DAY of meal plan as JSON with:
    - 3 meals (breakfast/lunch/dinner)
    - Theme: {preferences}
    - Daily calories: {calories:.0f}±100kcal
    - Use ONLY these ingredients: {[i['name'] for i in valid_ingredients]}
    - Structure: {{"day": "Monday", "meals": [{{"type": "...", "title": "...", 
      "ingredients": [{{"name": "...", "quantity": "...", "category": "..."}}]}}]}}"""

    for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]:
        response = groq_client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[{"role": "user", "content": f"{base_prompt}. Today is {day}"}],
            temperature=0.7,
            max_tokens=4096
        )
        
        # Extraction et validation du JSON
        daily_meals = parse_response(response.choices[0].message.content)
        meal_plan["meals"].append(daily_meals)
        
        # Mise à jour de la liste de courses
        for meal in daily_meals["meals"]:
            for ing in meal["ingredients"]:
                key = (ing["name"], ing["category"])
                meal_plan["shopping_list"][key] = meal_plan["shopping_list"].get(key, 0) + parse_quantity(ing["quantity"])

    # Conversion finale de la shopping list
    meal_plan["shopping_list"] = [{
        "name": name,
        "category": cat,
        "total_quantity": f"{qty}g" if isinstance(qty, (int, float)) else qty
    } for (name, cat), qty in meal_plan["shopping_list"].items()]

    # Sauvegarde dans MongoDB
    db.MealPlans.insert_one(meal_plan)
    return meal_plan

# Fonctions utilitaires
def parse_response(text):
    try:
        # Logique simplifiée d'extraction JSON
        print(text)
        return json.loads(text.split("```json")[1].split("```")[0])
    
    except:
        raise ValueError("Failed to parse AI response")

def parse_quantity(qty_str):
    # Conversion simple pour l'agrégation
    if 'g' in qty_str:
        return float(qty_str.replace('g', ''))
    elif 'ml' in qty_str:
        return float(qty_str.replace('ml', ''))
    return 1  # Pour les unités

def calculer_apport_calorique(sexe: str, poids: float, taille: float, age: int, niveau_activite: str, objectif: str) -> float:
    
    """
  Calcule l'apport calorique journalier recommandé en fonction du sexe, poids, taille, âge, niveau d'activité et objectif.
    :param sexe: "homme" ou "femme"
    :param poids: Poids en kg
    :param taille: Taille en cm
    :param age: Âge en années
    :param niveau_activite: "sédentaire", "léger", "modéré", "actif", "très actif"
    :param objectif: "perte", "maintien", "prise"
    :return: Apport calorique journalier recommandé en kcal
    """
 # Formule de Mifflin-St Jeor
    if sexe.lower() == "homme":
        bmr = 10 * poids + 6.25 * taille - 5 * age + 5
    elif sexe.lower() == "femme":
        bmr = 10 * poids + 6.25 * taille - 5 * age - 161
    else:
        raise ValueError("Le sexe doit être 'homme' ou 'femme'.")
    
    # Facteurs d'activité
    facteurs_activite = {
            "sédentaire": 1.2,
            "léger": 1.375,
            "modéré": 1.55,
            "actif": 1.725,
            "très actif": 1.9
        }
    
    if niveau_activite not in facteurs_activite:
        raise ValueError("Niveau d'activité invalide. Choisissez parmi : 'sédentaire', 'léger', 'modéré', 'actif', 'très actif'.")

 # Calcul du TDEE
    tdee = bmr * facteurs_activite[niveau_activite]
    
 # Ajustement selon l'objectif
    ajustements = {
        "perte": -500,
        "maintien": 0,
        "prise": 500
        }
    
    if objectif not in ajustements:
        raise ValueError("Objectif invalide. Choisissez parmi : 'perte', 'maintien', 'prise'.")
    return tdee + ajustements[objectif]

# Exemple d'utilisation
#calories = calculer_apport_calorique("homme", 70, 175, 25, "modéré", "prise")
#print(f"Apport calorique recommandé : {calories:.0f} kcal/jour")

print(generate_weekly_meal_plan("679bc2f59331b387d24f2811","Homme",70,168,19,"sédentaire","perte","vegan, keto, bio"))