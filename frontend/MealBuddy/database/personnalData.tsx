import React from 'react';
import { MMKV } from 'react-native-mmkv';

// Initialize MMKV storage
const storage = new MMKV();

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
export const getMealPlan = (date: string): MealPlan => {
    const data = storage.getString(date);
    if (data) {
        try {
            return JSON.parse(data) as MealPlan;
        } catch (error) {
            console.error('Failed to parse meal plan data:', error);
            return getDefaultMealPlan(date);
        }
    }
    return getDefaultMealPlan(date);
};

// Helper function to save/update the meal plan in storage.
export const saveMealPlan = (mealPlan: MealPlan): void => {
    try {
        storage.set(mealPlan.date, JSON.stringify(mealPlan));
    } catch (error) {
        console.error('Failed to save meal plan data:', error);
    }
};

/**
 * Adds a meal item to a specific meal (Breakfast, Lunch, or Dinner) on the given date.
 *
 * @param date - The date (e.g., "2025-02-12") used as the key in storage.
 * @param mealType - The meal type: 'Breakfast', 'Lunch', or 'Dinner'.
 * @param item - The meal item to add. This can be any structure. If an `id` property exists, it is used to check for duplicates.
 */
export const addMealItem = (
    date: string,
    mealType: MealType,
    item: any
): void => {
    const mealPlan = getMealPlan(date);

    // Optional: Avoid adding duplicates if an `id` property exists.
    if (item && item.id) {
        const exists = mealPlan.meal[mealType].some((mealItem) => mealItem.id === item.id);
        if (exists) {
            console.warn(
                `Meal item with id "${item.id}" already exists in ${mealType} for date ${date}.`
            );
            return;
        }
    }

    // Add the new item to the corresponding meal array.
    mealPlan.meal[mealType].push(item);
    saveMealPlan(mealPlan);
};

/**
 * Deletes a meal item from a specific meal on the given date by its id.
 *
 * @param date - The date used as the storage key.
 * @param mealType - The meal type: 'Breakfast', 'Lunch', or 'Dinner'.
 * @param itemId - The unique id of the meal item to remove.
 */
export const deleteMealItem = (
    date: string,
    mealType: MealType,
    itemId: string
): void => {
    const mealPlan = getMealPlan(date);

    // Remove any item whose id matches the provided itemId.
    mealPlan.meal[mealType] = mealPlan.meal[mealType].filter(
        (item) => item.id !== itemId
    );
    saveMealPlan(mealPlan);
};
