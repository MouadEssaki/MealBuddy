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
calories = calculer_apport_calorique("homme", 70, 175, 25, "modéré", "prise")
print(f"Apport calorique recommandé : {calories:.0f} kcal/jour")
