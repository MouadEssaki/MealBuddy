import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

// Define the meal types.
type MealType = 'Breakfast' | 'Lunch' | 'Dinner';

// Define the meal plan structure for a given date.
export interface MealPlan {
    date: string;
    meal: {
        Breakfast: any[];
        Lunch: any[];
        Dinner: any[];
    };
}

// Helper function to format the date to "YYYY-MM-DD".
const formatDate = (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    console.log(dateInput);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date provided");
    }
    // Returns the date portion only.
    return date.toISOString().split('T')[0];
};

// Returns a default meal plan for a given date.
const getDefaultMealPlan = (date: string): MealPlan => ({
    date,
    meal: {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
    },
});

// Helper function to get the meal plan for a specific date from storage.
export const getMealPlan = async (date: string | Date): Promise<MealPlan> => {
    const formattedDate = formatDate(date);
    try {
        const data = await AsyncStorage.getItem(formattedDate);
        return data ? (JSON.parse(data) as MealPlan) : getDefaultMealPlan(formattedDate);
    } catch (error) {
        console.error('Failed to retrieve meal plan data:', error);
        return getDefaultMealPlan(formattedDate);
    }
};

// Helper function to save/update the meal plan in storage.
export const saveMealPlan = async (mealPlan: MealPlan): Promise<void> => {
    // Ensure the date stored is formatted correctly.
    mealPlan.date = formatDate(mealPlan.date);
    try {
        await AsyncStorage.setItem(mealPlan.date, JSON.stringify(mealPlan));
    } catch (error) {
        console.error('Failed to save meal plan data:', error);
    }
};

/**
 * Adds a meal item to a specific meal (Breakfast, Lunch, or Dinner) on the given date.
 *
 * @param date - The date (e.g., "2025-02-12") used as the key in storage.
 * @param mealType - The meal type: 'Breakfast', 'Lunch', or 'Dinner'.
 * @param item - The meal item to add. If an `id` property doesn't exist, a new UUID is generated.
 */
export const addMealItem = async (
    date: string | Date,
    mealType: MealType,
    item: any
): Promise<void> => {
    console.log("date: ");

    console.log(mealType);
    const formattedDate = formatDate(date);
    const mealPlan = await getMealPlan(formattedDate);

    if (!item.id) {
        item.id = uuid.v4();
    }

    const exists = mealPlan.meal[mealType].some((mealItem) => mealItem.id === item.id);
    if (exists) {
        console.warn(
            `Meal item with id "${item.id}" already exists in ${mealType} for date ${formattedDate}.`
        );
        return;
    }

    mealPlan.meal[mealType].push(item);
    await saveMealPlan(mealPlan);
};

export const syncMealWithAPI = async (date, mealType, mealItem) => {
    try {
        // Retrieve token and user ID from AsyncStorage
        const token = await AsyncStorage.getItem('authToken');
        const userId = await AsyncStorage.getItem('currentUser');
        const formattedDate = formatDate(date); // Format date to YYYY-MM-DD

        // Prepare common meal data
        const commonMealData = {
            nom: mealItem.name,
            time: mealType,
            calories: Math.round(mealItem.nutritional_info.calories),
            nutrients: {
                protein: Math.round(mealItem.nutritional_info.proteins || 0),
                carbs: Math.round(mealItem.nutritional_info.carbs || 0),
                fats: Math.round(mealItem.nutritional_info.fats || 0),
            },
        };
        /*TEMPLATE
        {
            "user_id": "67bea1073032029d61862a54",
            "date": "2025-02-26",
            "meals": [
              {
                "nom": "Omelette Breakfast",  // Nom du repas
                "time": "Breakfast",
                "calories": 300,  // Calories du repas
                "nutrients": {
                  "protein": 20,
                  "carbs": 25,
                  "fats": 10
                },
                "items": [
                  { 
                    "nom": "Omelette",  // Nom de l'élément
                    "quantity": 150,
                    "calories": 120  // Calories de l'élément
                  },
                  { 
                    "nom": "Whole wheat bread",  // Nom de l'élément
                    "quantity": 50,
                    "calories": 180  // Calories de l'élément
                  }
                ],
                "recipe_id": "1"
              }
            ]
        }*/
          


        // Prepare specific meal data based on type
        let specificMealData = {};
        if (mealItem.type === 'food') {
            specificMealData = {
                food_id: mealItem._id,
                quantity: parseInt(mealItem.quantity_measurement.match(/\d+/)[0]),
            };
        } else if (mealItem.type === 'recipe') {
            specificMealData = {
                recipe_id: mealItem._id,
                items: mealItem.items.map(item => ({
                    nom: item.name,
                    quantity: item.quantity,
                    calories: item.calories,
                })),
            };
        } else {
            specificMealData = {
                food_id: mealItem._id,
                quantity: parseInt(mealItem.quantity_measurement.match(/\d+/)[0]),
            };
            //throw new Error('Invalid meal type');
        }

        // Combine common and specific data into the final mealData structure
        const mealData = {
            user_id: userId,
            date: formattedDate,
            meals: [{ ...commonMealData, ...specificMealData }],
        };

        // Check if a meal log already exists for this date
        const existingLogResponse = await fetch(
            `https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs?date=${formattedDate}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        let mealLogId;
        if (existingLogResponse.ok) {
            const existingLogs = await existingLogResponse.json();
            mealLogId = existingLogs.length > 0 ? existingLogs[0]._id : null;
        }

        // Determine the URL and method (POST to create, PATCH to update)
        const url = mealLogId
            ? `https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs/${mealLogId}`
            : 'https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs';
        const method = mealLogId ? 'PATCH' : 'POST';

        // Send the request to the API
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(mealData),
        });

        if (!response.ok) {
            throw new Error('Failed to sync with the API');
        }

        console.log('Meal synced successfully');
    } catch (error) {
        console.error('Error during synchronization:', error);
        throw error; // Re-throw the error to handle it in handleAddToDay
    }
};

/**
 * Deletes a meal item from a specific meal on the given date by its id.
 *
 * @param date - The date used as the storage key.
 * @param mealType - The meal type: 'Breakfast', 'Lunch', or 'Dinner'.
 * @param itemId - The unique id of the meal item to remove.
 */
export const deleteMealItem = async (
    date: string | Date,
    mealType: MealType,
    itemId: string
): Promise<void> => {
    const formattedDate = formatDate(date);
    const mealPlan = await getMealPlan(formattedDate);

    mealPlan.meal[mealType] = mealPlan.meal[mealType].filter(
        (item) => item.id !== itemId
    );

    await saveMealPlan(mealPlan);
};


//delete all data from all dates for log out
export const deleteAllData = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Failed to delete all data:', error);
    }
};

//TODO : import all data from mongodb database when login
export const importAllData = async () => {
    try {
        const response = await fetch("https://mealbuddy-smartgroup2025.azurewebsites.net/api/mealplan");
        const data = await response.json();
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            await AsyncStorage.setItem(data[i].date, JSON.stringify(data[i]));
        }
    } catch (error) {
        console.error('Failed to import all data:', error);
    }
};
