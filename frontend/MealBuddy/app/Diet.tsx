import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

// Constants
const COLORS = {
  primary: '#105F3B',
  secondary: '#68AA64',
  accent: '#E36820',
  background: '#F9F9F9',
  surface: '#FFFFFF',
  light: '#FFF4E4',
  text: '#333333',
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

// Move mealPlan data to a separate file in a real app
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

const DietPage = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState(null);

  const dailyMeals = useMemo(() => mealPlan[selectedDay], [selectedDay]);
  const dailySummary = useMemo(() => calculateDailySummary(selectedDay), [selectedDay]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedMeal(null); // Reset meal selection when day changes
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />

        <DaySelector
          days={DAYS}
          selectedDay={selectedDay}
          onSelectDay={handleDaySelect}
        />

        <ScrollView contentContainerStyle={styles.contentContainer}>
          {dailyMeals ? (
            MEAL_TYPES.map((mealType) => (
              <MealCard
                key={mealType}
                mealType={mealType}
                mealData={dailyMeals[mealType]}
                onPress={() => setSelectedMeal({ mealType, ...dailyMeals[mealType] })}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>No meal plan available</Text>
          )}

          <NutritionSummary summary={dailySummary} />
        </ScrollView>

        <MealDetailsModal
          visible={!!selectedMeal}
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      </View>
    </SafeAreaView>
  );
};

// Sub-components
const Header = () => (
  <LinearGradient
    colors={[COLORS.primary, '#1a7a4e']}
    style={styles.header}
  >
    <Text style={styles.headerTitle}>7-Day Meal Plan</Text>
  </LinearGradient>
);

const DaySelector = ({ days, selectedDay, onSelectDay }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.daysContainer}
  >
    {days.map((day) => (
      <TouchableOpacity
        key={day}
        style={[
          styles.dayButton,
          selectedDay === day && styles.selectedDayButton
        ]}
        onPress={() => onSelectDay(day)}
        accessibilityRole="button"
        accessibilityLabel={`Select ${day}`}
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
);

const MealCard = ({ mealType, mealData, onPress }) => {
  const mealColor = getMealColor(mealType);

  return (
    <TouchableOpacity
      style={[styles.mealCard, { backgroundColor: mealColor }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${mealType} details`}
    >
      <View style={styles.mealHeader}>
        <Icon
          name={mealType === 'Breakfast' ? 'food-croissant' :
            mealType === 'Lunch' ? 'food' : 'food-turkey'}
          size={24}
          color={COLORS.surface}
        />
        <Text style={styles.mealTitle}>{mealType}</Text>
      </View>
      <Text style={styles.mealSubtitle}>{mealData.title}</Text>
    </TouchableOpacity>
  );
};

const NutritionSummary = ({ summary }) => (
  <View style={styles.nutritionCard}>
    <Text style={styles.nutritionTitle}>Daily Summary</Text>
    <View style={styles.nutritionGrid}>
      <NutritionItem value={summary.calories} label="Calories" />
      <NutritionItem value={summary.proteins} label="Protein (g)" />
      <NutritionItem value={summary.carbs} label="Carbs (g)" />
      <NutritionItem value={summary.fats} label="Fats (g)" />
    </View>
  </View>
);

const NutritionItem = ({ value, label }) => (
  <View style={styles.nutritionItem}>
    <Text style={styles.nutritionValue}>{value}</Text>
    <Text style={styles.nutritionLabel}>{label}</Text>
  </View>
);

const MealDetailsModal = ({ visible, meal, onClose }) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <ScrollView contentContainerStyle={styles.modalScroll}>
          <Text style={styles.modalTitle}>
            {meal?.mealType}: {meal?.title}
          </Text>

          <SectionTitle>Ingredients</SectionTitle>
          {meal?.ingredients.map((ingredient, index) => (
            <Text key={`ing-${index}`} style={styles.modalText}>
              • {ingredient}
            </Text>
          ))}

          <SectionTitle>Steps</SectionTitle>
          {meal?.steps.map((step, index) => (
            <Text key={`step-${index}`} style={styles.modalText}>
              {index + 1}. {step}
            </Text>
          ))}

          <SectionTitle>Nutritional Info</SectionTitle>
          <Text style={styles.modalText}>
            Calories: {meal?.nutritional_info.calories} |
            Protein: {meal?.nutritional_info.proteins}g |
            Carbs: {meal?.nutritional_info.carbs}g |
            Fats: {meal?.nutritional_info.fats}g
          </Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close meal details"
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const SectionTitle = ({ children }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

// Helper functions
const getMealColor = (mealType) => {
  switch (mealType.toLowerCase()) {
    case 'breakfast': return COLORS.accent;
    case 'lunch': return COLORS.primary;
    case 'dinner': return COLORS.secondary;
    default: return COLORS.primary;
  }
};

const calculateDailySummary = (day) => {
  const meals = Object.values(mealPlan[day]);
  return meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.nutritional_info.calories,
    proteins: acc.proteins + meal.nutritional_info.proteins,
    carbs: acc.carbs + meal.nutritional_info.carbs,
    fats: acc.fats + meal.nutritional_info.fats,
  }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingVertical: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.surface,
    textAlign: 'center',
  },
  daysContainer: {
    paddingVertical: 12,
  },
  dayButton: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: COLORS.light,
  },
  selectedDayButton: {
    backgroundColor: COLORS.secondary,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  selectedDayText: {
    color: COLORS.surface,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  mealCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
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
    color: COLORS.surface,
  },
  mealSubtitle: {
    fontSize: 14,
    color: COLORS.surface,
    opacity: 0.9,
  },
  nutritionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  nutritionLabel: {
    fontSize: 12,
    color: COLORS.text,
    opacity: 0.8,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 24,
  },
  modalScroll: {
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 4,
  },
  closeButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 14,
    alignSelf: 'stretch',
    marginTop: 24,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surface,
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default DietPage;