import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  vertClaire: '#68AA64',
  vert: '#105F3B',
  orange: '#E36820',
  beige: '#FFF4E4',
  white: '#FFFFFF',
  background: '#F9F9F9'
};

export default function DietPage() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const mealPlan = {
    Monday: {
      Breakfast: {
        title: 'Oatmeal with Berries',
        ingredients: ['1 cup rolled oats', '1 cup almond milk', '1/2 cup mixed berries', '1 tbsp honey'],
        steps: ['Boil almond milk', 'Add oats and simmer for 5 minutes', 'Top with berries and honey'],
        nutritional_info: { calories: 300, proteins: 8, carbs: 55, fats: 5 }
      },
      Lunch: {
        title: 'Grilled Chicken Salad',
        ingredients: ['200g chicken breast', '2 cups mixed greens', '1 tbsp olive oil', '1/4 cup cherry tomatoes'],
        steps: ['Grill chicken for 6-8 minutes per side', 'Toss greens with olive oil', 'Add sliced chicken and tomatoes'],
        nutritional_info: { calories: 500, proteins: 40, carbs: 10, fats: 30 }
      },
      Dinner: {
        title: 'Baked Salmon with Quinoa',
        ingredients: ['150g salmon fillet', '1 cup cooked quinoa', '1 cup steamed broccoli', '1 tsp lemon juice'],
        steps: ['Bake salmon at 400°F for 12-15 minutes', 'Cook quinoa per package', 'Steam broccoli and drizzle with lemon'],
        nutritional_info: { calories: 400, proteins: 30, carbs: 35, fats: 15 }
      }
    },
    Tuesday: {
      Breakfast: {
        title: 'Greek Yogurt Parfait',
        ingredients: ['1 cup Greek yogurt', '1/4 cup granola', '1/2 cup strawberries', '1 tsp chia seeds'],
        steps: ['Layer yogurt in a glass', 'Add granola and strawberries', 'Sprinkle chia seeds on top'],
        nutritional_info: { calories: 250, proteins: 20, carbs: 30, fats: 5 }
      },
      Lunch: {
        title: 'Turkey Wrap',
        ingredients: ['1 whole wheat tortilla', '100g turkey slices', '1/2 avocado', '1 cup spinach'],
        steps: ['Mash avocado and spread on tortilla', 'Layer turkey and spinach', 'Roll up and slice'],
        nutritional_info: { calories: 450, proteins: 25, carbs: 40, fats: 20 }
      },
      Dinner: {
        title: 'Vegetable Stir-Fry with Tofu',
        ingredients: ['200g firm tofu', '1 cup bell peppers', '1 cup snap peas', '2 tbsp soy sauce'],
        steps: ['Cube tofu and stir-fry in oil', 'Add veggies and cook for 5 minutes', 'Stir in soy sauce'],
        nutritional_info: { calories: 350, proteins: 20, carbs: 25, fats: 15 }
      }
    },
    Wednesday: {
      Breakfast: {
        title: 'Scrambled Eggs with Spinach',
        ingredients: ['2 large eggs', '1 cup spinach', '1 slice whole grain toast', '1 tsp butter'],
        steps: ['Scramble eggs with butter', 'Add spinach until wilted', 'Serve with toast'],
        nutritional_info: { calories: 280, proteins: 15, carbs: 20, fats: 15 }
      },
      Lunch: {
        title: 'Quinoa Buddha Bowl',
        ingredients: ['1 cup cooked quinoa', '1/2 cup chickpeas', '1 cup roasted veggies', '2 tbsp tahini'],
        steps: ['Roast veggies at 400°F for 20 minutes', 'Assemble quinoa, chickpeas, and veggies', 'Drizzle with tahini'],
        nutritional_info: { calories: 480, proteins: 18, carbs: 60, fats: 20 }
      },
      Dinner: {
        title: 'Beef Stir-Fry with Rice',
        ingredients: ['150g lean beef', '1 cup brown rice', '1 cup broccoli', '1 tbsp oyster sauce'],
        steps: ['Cook rice per package', 'Stir-fry beef and broccoli', 'Add oyster sauce and serve over rice'],
        nutritional_info: { calories: 420, proteins: 30, carbs: 50, fats: 10 }
      }
    },
    Thursday: {
      Breakfast: {
        title: 'Smoothie Bowl',
        ingredients: ['1 banana', '1 cup frozen mango', '1/2 cup almond milk', '1 tbsp almond butter'],
        steps: ['Blend banana, mango, and milk', 'Pour into a bowl', 'Top with almond butter'],
        nutritional_info: { calories: 320, proteins: 8, carbs: 60, fats: 10 }
      },
      Lunch: {
        title: 'Lentil Soup',
        ingredients: ['1 cup lentils', '1 carrot', '1 celery stalk', '2 cups vegetable broth'],
        steps: ['Chop veggies and simmer with lentils in broth', 'Cook for 30 minutes', 'Season to taste'],
        nutritional_info: { calories: 400, proteins: 20, carbs: 60, fats: 5 }
      },
      Dinner: {
        title: 'Grilled Pork with Sweet Potato',
        ingredients: ['150g pork chop', '1 medium sweet potato', '1 cup green beans', '1 tsp olive oil'],
        steps: ['Grill pork for 5-7 minutes per side', 'Bake sweet potato at 375°F for 40 minutes', 'Steam green beans'],
        nutritional_info: { calories: 450, proteins: 35, carbs: 40, fats: 15 }
      }
    },
    Friday: {
      Breakfast: {
        title: 'Avocado Toast with Egg',
        ingredients: ['1 slice sourdough bread', '1/2 avocado', '1 poached egg', '1 pinch chili flakes'],
        steps: ['Toast bread', 'Mash avocado and spread on toast', 'Top with poached egg and flakes'],
        nutritional_info: { calories: 300, proteins: 12, carbs: 25, fats: 18 }
      },
      Lunch: {
        title: 'Tuna Salad',
        ingredients: ['1 can tuna', '2 cups arugula', '1/4 cup cucumber', '1 tbsp vinaigrette'],
        steps: ['Drain tuna', 'Mix with arugula and cucumber', 'Toss with vinaigrette'],
        nutritional_info: { calories: 350, proteins: 30, carbs: 10, fats: 15 }
      },
      Dinner: {
        title: 'Chicken Pasta Primavera',
        ingredients: ['150g chicken breast', '1 cup whole wheat pasta', '1 cup mixed veggies', '1 tbsp pesto'],
        steps: ['Cook pasta', 'Sauté chicken and veggies', 'Mix with pesto and pasta'],
        nutritional_info: { calories: 500, proteins: 35, carbs: 55, fats: 15 }
      }
    },
    Saturday: {
      Breakfast: {
        title: 'Pancakes with Maple Syrup',
        ingredients: ['1 cup pancake mix', '3/4 cup milk', '1 tbsp maple syrup', '1/2 cup blueberries'],
        steps: ['Mix batter and cook pancakes', 'Top with syrup and blueberries'],
        nutritional_info: { calories: 350, proteins: 8, carbs: 65, fats: 5 }
      },
      Lunch: {
        title: 'Shrimp Tacos',
        ingredients: ['100g shrimp', '2 corn tortillas', '1/4 cup cabbage', '1 tbsp lime crema'],
        steps: ['Sauté shrimp', 'Assemble tacos with cabbage and crema'],
        nutritional_info: { calories: 400, proteins: 25, carbs: 45, fats: 10 }
      },
      Dinner: {
        title: 'Roasted Lamb with Couscous',
        ingredients: ['150g lamb leg', '1 cup couscous', '1 cup zucchini', '1 tsp rosemary'],
        steps: ['Roast lamb with rosemary at 375°F for 25 minutes', 'Cook couscous', 'Sauté zucchini'],
        nutritional_info: { calories: 480, proteins: 40, carbs: 45, fats: 15 }
      }
    },
    Sunday: {
      Breakfast: {
        title: 'Chia Pudding',
        ingredients: ['3 tbsp chia seeds', '1 cup coconut milk', '1/2 cup mango', '1 tsp honey'],
        steps: ['Mix chia seeds with milk and let sit overnight', 'Top with mango and honey'],
        nutritional_info: { calories: 280, proteins: 6, carbs: 35, fats: 15 }
      },
      Lunch: {
        title: 'Caprese Salad with Chicken',
        ingredients: ['150g chicken breast', '1 cup mozzarella', '1 tomato', '1 tbsp balsamic glaze'],
        steps: ['Grill chicken', 'Slice tomato and mozzarella', 'Drizzle with glaze'],
        nutritional_info: { calories: 450, proteins: 40, carbs: 10, fats: 25 }
      },
      Dinner: {
        title: 'Stuffed Bell Peppers',
        ingredients: ['2 bell peppers', '1 cup ground turkey', '1/2 cup rice', '1/2 cup tomato sauce'],
        steps: ['Cook rice and turkey', 'Mix with sauce and stuff peppers', 'Bake at 375°F for 30 minutes'],
        nutritional_info: { calories: 420, proteins: 30, carbs: 45, fats: 12 }
      }
    }
  };

  const getMealColor = (mealName) => {
    switch (mealName.toLowerCase()) {
      case 'breakfast': return COLORS.orange;
      case 'lunch': return COLORS.vert;
      case 'dinner': return COLORS.vertClaire;
      default: return COLORS.vert;
    }
  };

  const calculateDailySummary = (day) => {
    const meals = mealPlan[day];
    return Object.values(meals).reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.nutritional_info.calories,
        proteins: totals.proteins + meal.nutritional_info.proteins,
        carbs: totals.carbs + meal.nutritional_info.carbs,
        fats: totals.fats + meal.nutritional_info.fats,
      }),
      { calories: 0, proteins: 0, carbs: 0, fats: 0 }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LinearGradient
          colors={[COLORS.vert, '#1a7a4e']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>7-Day Meal Plan</Text>
        </LinearGradient>

        {/* Day Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {days.map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.selectedDayButton
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[
                styles.dayText,
                selectedDay === day && styles.selectedDayText
              ]}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Meal Cards */}
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {mealPlan[selectedDay] ? (
            Object.entries(mealPlan[selectedDay]).map(([mealName, mealData]) => (
              <TouchableOpacity
                key={mealName}
                style={[
                  styles.mealCard,
                  { backgroundColor: getMealColor(mealName) }
                ]}
                onPress={() => setSelectedMeal({ mealName, ...mealData })} // Set selected meal
              >
                <View style={styles.mealHeader}>
                  <Icon
                    name={mealName === 'Breakfast' ? 'food-croissant' :
                      mealName === 'Lunch' ? 'food' : 'food-turkey'}
                    size={24}
                    color={COLORS.white}
                  />
                  <Text style={styles.mealTitle}>{mealName}</Text>
                </View>
                <Text style={styles.mealSubtitle}>{mealData.title}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No meal plan available for {selectedDay}</Text>
          )}

          {/* Meal Details Section */}
          {selectedMeal && (
            <View style={styles.mealDetailsCard}>
              <Text style={styles.mealDetailsTitle}>{selectedMeal.mealName}: {selectedMeal.title}</Text>
              <Text style={styles.mealDetailsSubtitle}>Ingredients:</Text>
              {selectedMeal.ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.mealDetailsText}>• {ingredient}</Text>
              ))}
              <Text style={styles.mealDetailsSubtitle}>Steps:</Text>
              {selectedMeal.steps.map((step, index) => (
                <Text key={index} style={styles.mealDetailsText}>{index + 1}. {step}</Text>
              ))}
              <Text style={styles.mealDetailsSubtitle}>Nutritional Info:</Text>
              <Text style={styles.mealDetailsText}>
                Calories: {selectedMeal.nutritional_info.calories} | 
                Protein: {selectedMeal.nutritional_info.proteins}g | 
                Carbs: {selectedMeal.nutritional_info.carbs}g | 
                Fats: {selectedMeal.nutritional_info.fats}g
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedMeal(null)} // Close the details
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Nutrition Summary Card */}
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionTitle}>Daily Summary</Text>
            {mealPlan[selectedDay] ? (
              (() => {
                const summary = calculateDailySummary(selectedDay);
                return (
                  <View style={styles.nutritionRow}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{summary.calories}</Text>
                      <Text style={styles.nutritionLabel}>Calories</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{summary.proteins}g</Text>
                      <Text style={styles.nutritionLabel}>Protein</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{summary.carbs}g</Text>
                      <Text style={styles.nutritionLabel}>Carbs</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{summary.fats}g</Text>
                      <Text style={styles.nutritionLabel}>Fats</Text>
                    </View>
                  </View>
                );
              })()
            ) : (
              <Text style={styles.noDataText}>No nutritional data available</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.vert,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
  },
  daysContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dayButton: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: COLORS.beige,
  },
  selectedDayButton: {
    backgroundColor: COLORS.vertClaire,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.vert,
  },
  selectedDayText: {
    color: COLORS.white,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  mealCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  mealSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  mealDetailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mealDetailsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.vert,
    marginBottom: 12,
  },
  mealDetailsSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.vert,
    marginTop: 8,
    marginBottom: 4,
  },
  mealDetailsText: {
    fontSize: 14,
    color: COLORS.vert,
    marginLeft: 8,
    marginBottom: 4,
  },
  closeButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  nutritionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.vert,
    marginBottom: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.vert,
  },
  nutritionLabel: {
    fontSize: 12,
    color: COLORS.vert,
    opacity: 0.8,
    marginTop: 4,
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.vert,
    textAlign: 'center',
    marginVertical: 20,
  },
});