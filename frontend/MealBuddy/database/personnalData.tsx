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
