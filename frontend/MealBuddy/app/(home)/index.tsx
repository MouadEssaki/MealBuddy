import React, { useState, useCallback } from 'react';
import {
  IconRegistry,
  ApplicationProvider,
  Layout,
  Text,
  Icon,
} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { customTheme } from '../customTheme';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { format, addDays, subDays } from 'date-fns';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMealPlan } from '../../database/personnalData'; // Adjust the import path if needed

export default function App() {
  // Define selectedDate first so it’s available for fetching data
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [user, setUser] = useState('mahmoud');
  const [totalCalories, setTotalCalories] = useState(2500);
  const [consumedCalories, setConsumedCalories] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [alimentAdded, setAlimentAdded] = useState(false);

  // Function to fetch meal plan for the selected date
  const fetchMealPlan = async () => {
    try {
      const mealPlan = await getMealPlan(selectedDate);
      console.log('Meal plan:', mealPlan);
      const newConsumedCalories = {
        breakfast: mealPlan.meal?.Breakfast
          ? mealPlan.meal.Breakfast.reduce((sum, item) => sum + parseInt(item.calories, 10), 0)
          : 0,
        lunch: mealPlan.meal?.Lunch
          ? mealPlan.meal.Lunch.reduce((sum, item) => sum + parseInt(item.calories, 10), 0)
          : 0,
        dinner: mealPlan.meal?.Dinner
          ? mealPlan.meal.Dinner.reduce((sum, item) => sum + parseInt(item.calories, 10), 0)
          : 0,
      };
      console.log('Breakfast items:', mealPlan.meal?.Breakfast);
      setConsumedCalories(newConsumedCalories);
    } catch (err) {
      console.error(err);
    }
  };

  // Re-fetch the meal plan each time the screen gains focus,
  // or when the selectedDate or alimentAdded state changes.
  useFocusEffect(
    useCallback(() => {
      fetchMealPlan();
      console.log('Data re-fetched due to focus or state change');
    }, [selectedDate, alimentAdded])
  );

  const [macros, setMacros] = useState({
    carbs: { consumed: 100, goal: 300 },
    protein: { consumed: 50, goal: 150 },
    fat: { consumed: 30, goal: 80 },
  });

  const totalConsumed = Object.values(consumedCalories).reduce(
    (sum, value) => sum + value,
    0
  );
  const fillPercentage = (totalConsumed / totalCalories) * 100;

  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const navigation = useNavigation();

  const handleMealPress = (mealType: string) => {
    // Pass the meal type and selectedDate to the MealDetails screen
    navigation.navigate('MealDetails', { mealType, date: selectedDate });
  };

  // This function can be used after adding a new meal to toggle state and force a re-fetch
  const handleAddAliment = () => {
    setAlimentAdded((prev) => !prev);
  };

  // UI icons (if you use them later)
  const StarIcon = (props) => <Icon name="star" {...props} />;
  const ClockIcon = (props) => (
    <Icon name="clock-outline" {...props} fill="#555" />
  );
  const PersonIcon = (props) => (
    <Icon name="person-outline" {...props} fill="#555" />
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...customTheme }}>
          <Layout style={{ flex: 1, backgroundColor: customTheme.fond }}>
            <ScrollView
              contentContainerStyle={{ padding: 20, alignItems: 'center' }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.headerContainer}>
                <Text category="h1" style={styles.welcomeText}>
                  Dashboard
                </Text>
                <Text category="h5" style={styles.welcomeText}>
                  Bonjour, {user} !
                </Text>
              </View>

              <View style={styles.cardContainer}>
                <View style={styles.dateNavigation}>
                  <TouchableOpacity onPress={goToPreviousDay}>
                    <Text style={styles.arrow}>{'<'}</Text>
                  </TouchableOpacity>
                  <Text style={styles.dateText}>
                    {format(selectedDate, 'dd MMMM yyyy')}
                  </Text>
                  <TouchableOpacity onPress={goToNextDay}>
                    <Text style={styles.arrow}>{'>'}</Text>
                  </TouchableOpacity>
                </View>

                <Text category="h6" style={styles.budgetLabel}>
                  Calorie Budget
                </Text>
                <Text style={styles.budgetValue}>{totalCalories}</Text>

                <AnimatedCircularProgress
                  size={200}
                  width={20}
                  fill={fillPercentage}
                  tintColor={customTheme.vertClaire}
                  backgroundColor="#a9a9a940"
                  rotation={0}
                  lineCap="square"
                  style={styles.arcProgress}
                >
                  {(fill) => (
                    <View style={styles.progressContent}>
                      <Text style={styles.consumedText}>
                        {Math.round(totalConsumed)}
                      </Text>
                      <Text style={styles.remainingText}>
                        {totalCalories - totalConsumed} left
                      </Text>
                    </View>
                  )}
                </AnimatedCircularProgress>

                <View style={styles.mealsContainer}>
                  <Pressable
                    onPress={() => handleMealPress('Breakfast')}
                    style={styles.mealColumn}
                  >
                    <Text style={styles.mealTitle}>Breakfast</Text>
                    <Text style={styles.mealValue}>
                      {consumedCalories.breakfast}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleMealPress('Lunch')}
                    style={styles.mealColumn}
                  >
                    <Text style={styles.mealTitle}>Lunch</Text>
                    <Text style={styles.mealValue}>
                      {consumedCalories.lunch}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleMealPress('Dinner')}
                    style={styles.mealColumn}
                  >
                    <Text style={styles.mealTitle}>Dinner</Text>
                    <Text style={styles.mealValue}>
                      {consumedCalories.dinner}
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.macrosContainer}>
                  <View style={styles.macroColumn}>
                    <Text style={styles.macroLabel}>Carbs</Text>
                    <Text style={styles.macroValue}>
                      {macros.carbs.consumed}g / {macros.carbs.goal}g
                    </Text>
                    <AnimatedCircularProgress
                      size={50}
                      width={5}
                      fill={(macros.carbs.consumed / macros.carbs.goal) * 100}
                      tintColor="#FFA726"
                      backgroundColor="#a9a9a940"
                    />
                  </View>

                  <View style={styles.macroColumn}>
                    <Text style={styles.macroLabel}>Protein</Text>
                    <Text style={styles.macroValue}>
                      {macros.protein.consumed}g / {macros.protein.goal}g
                    </Text>
                    <AnimatedCircularProgress
                      size={50}
                      width={5}
                      fill={(macros.protein.consumed / macros.protein.goal) * 100}
                      tintColor="#66BB6A"
                      backgroundColor="#a9a9a940"
                    />
                  </View>

                  <View style={styles.macroColumn}>
                    <Text style={styles.macroLabel}>Fat</Text>
                    <Text style={styles.macroValue}>
                      {macros.fat.consumed}g / {macros.fat.goal}g
                    </Text>
                    <AnimatedCircularProgress
                      size={50}
                      width={5}
                      fill={(macros.fat.consumed / macros.fat.goal) * 100}
                      tintColor="#EF5350"
                      backgroundColor="#a9a9a940"
                    />
                  </View>
                </View>
              </View>

              <View
                style={{
                  marginTop: 20,
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: 10,
                  width: '100%',
                }}
              >
                <Text>Your Streak!</Text>
              </View>

              <View
                style={{
                  marginTop: 20,
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: 10,
                  width: '100%',
                }}
              >
                <Text category="h5" style={{ marginBottom: 20 }}>
                  Trending Recipes 📈
                </Text>
                {/* Trending recipes section */}
              </View>
            </ScrollView>
          </Layout>
        </ApplicationProvider>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  welcomeText: {
    fontWeight: 'bold',
    color: '#68AA64',
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFF4E4',
    padding: 20,
    borderRadius: 30,

  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#68AA64',
    padding: 1,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  budgetLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#68AA64',
    marginBottom: 5,
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  arcProgress: {
    marginVertical: 20,
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumedText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#68AA64',
    textAlign: 'center',
  },
  remainingText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginTop: 5,
  },
  mealsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  mealColumn: {
    flex: 1,
    alignItems: 'center',
  },
  mealTitle: {
    fontSize: 16,
    color: '#68AA64',
    fontWeight: 'bold',
  },
  mealValue: {
    fontSize: 18,
    color: '#333333',
    marginTop: 5,
  },
  macrosContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  macroColumn: {
    alignItems: 'center',
    flex: 1,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  macroValue: {
    fontSize: 14,
    color: '#333333',
    marginVertical: 5,
  },
});
