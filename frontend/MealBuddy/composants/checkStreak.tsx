import { subDays } from 'date-fns';
import { getMealPlan } from '../database/personnalData'; // Adjust the import path as necessary

export const checkStreak = async (selectedDate, totalCalories, setStreak) => {
    let currentStreak = 0;
    let currentDate = new Date(selectedDate);
    let shouldContinue = true;

    while (shouldContinue) {
        try {
            const mealPlan = await getMealPlan(currentDate);
            const totalConsumed = ['Breakfast', 'Lunch', 'Dinner'].reduce((sum, mealType) => {
                const meals = mealPlan.meal?.[mealType] || [];
                return sum + meals.reduce((mealSum, item) => mealSum + item.nutritional_info.calories, 0);
            }, 0);

            if (totalConsumed >= totalCalories) {
                currentStreak++;
                currentDate = subDays(currentDate, 1); // Check previous day
            } else {
                shouldContinue = false;
            }
        } catch (error) {
            console.error('Error checking streak:', error);
            shouldContinue = false;
        }

        // Safety check to prevent infinite loops
        if (currentStreak > 30) shouldContinue = false;
    }

    setStreak(currentStreak);
};
