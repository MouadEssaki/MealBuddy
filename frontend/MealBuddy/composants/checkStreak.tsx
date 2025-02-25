// utilities/streaks.ts
import { subDays, isBefore } from 'date-fns';
import { getMealPlan } from '../database/personnalData';

interface StreakCheckParams {
    totalCalories: number;
    setStreak: React.Dispatch<React.SetStateAction<number>>;
}

export const checkStreak = async ({
    totalCalories,
    setStreak
}: StreakCheckParams): Promise<void> => {
    let currentStreak = 0;
    let currentDate = subDays(new Date(), 1); // Start from yesterday
    let isValidDate = true;

    while (isValidDate) {
        try {
            // Safety check: Don't process dates before 2000
            if (isBefore(currentDate, new Date(2000, 0, 1))) {
                isValidDate = false;
                break;
            }

            const mealPlan = await getMealPlan(currentDate);

            const totalConsumed = ['Breakfast', 'Lunch', 'Dinner'].reduce((sum, mealType) => {
                const meals = mealPlan.meal?.[mealType] || [];
                return sum + meals.reduce((mealSum, item) =>
                    mealSum + (item.nutritional_info?.calories || 0), 0);
            }, 0);

            if (totalConsumed >= totalCalories) {
                currentStreak++;
                currentDate = subDays(currentDate, 1);
            } else {
                isValidDate = false;
            }
        } catch (error) {
            console.error('Error checking streak:', error);
            isValidDate = false;
        }
    }

    setStreak(currentStreak);
};