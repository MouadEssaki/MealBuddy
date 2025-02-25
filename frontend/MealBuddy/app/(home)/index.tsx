import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Text,
  SafeAreaView,
  Animated
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { format, addDays, subDays } from 'date-fns';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getMealPlan } from '../../database/personnalData';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { checkStreak } from '@/composants/checkStreak';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  vertClaire: '#68AA64',
  vert: '#105F3B',
  orange: '#E36820',
  beige: '#FFF4E4',
  white: '#FFFFFF',
  grey: '#F5F5F5'
};

export default function App() {
  // Define selectedDate first so it’s available for fetching data
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Define the user, totalCalories, consumedCalories, and alimentAdded states  
  const [user, setUser] = useState('mahmoud');
  const [totalCalories, setTotalCalories] = useState(2500);
  const [consumedCalories, setConsumedCalories] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [alimentAdded, setAlimentAdded] = useState(false);
  const [streak, setStreak] = useState(0);

  // Function to fetch meal plan for the selected date
  const fetchMealPlan = async () => {
    try {
      const mealPlan = await getMealPlan(selectedDate);

      // Initialize macro totals
      let totalCarbs = 0;
      let totalProtein = 0;
      let totalFat = 0;

      // Calculate calories and macros for each meal type
      const newConsumedCalories = {
        breakfast: mealPlan.meal?.Breakfast?.reduce((sum, item) => {
          totalCarbs += item.nutritional_info.carbs;
          totalProtein += item.nutritional_info.proteins;
          totalFat += item.nutritional_info.fats;
          return sum + item.nutritional_info.calories;
        }, 0) || 0,

        lunch: mealPlan.meal?.Lunch?.reduce((sum, item) => {
          totalCarbs += item.nutritional_info.carbs;
          totalProtein += item.nutritional_info.proteins;
          totalFat += item.nutritional_info.fats;
          return sum + item.nutritional_info.calories;
        }, 0) || 0,

        dinner: mealPlan.meal?.Dinner?.reduce((sum, item) => {
          totalCarbs += item.nutritional_info.carbs;
          totalProtein += item.nutritional_info.proteins;
          totalFat += item.nutritional_info.fats;
          return sum + item.nutritional_info.calories;
        }, 0) || 0,
      };

      // Update states
      setConsumedCalories(newConsumedCalories);
      setMacros(prev => ({
        ...prev,
        carbs: { ...prev.carbs, consumed: Number(totalCarbs.toFixed(1)) },
        protein: { ...prev.protein, consumed: Number(totalProtein.toFixed(1)) },
        fat: { ...prev.fat, consumed: Number(totalFat.toFixed(1)) },
      }));

    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('currentUser');

      if (!token || !userId) {
        console.log("Token ou ID utilisateur manquant");
        setLoading(false); // Arrêter le chargement si les données manquent
        return;
      }

      const response = await fetch(`https://mealbuddy-smartgroup2025.azurewebsites.net/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Réponse de l'API :", response);

      if (!response.ok) {
        console.log("Erreur lors de la récupération des données utilisateur :", response.status);
        setLoading(false); // Arrêter le chargement en cas d'erreur
        return;
      }

      const data = await response.json();
      console.log("Données utilisateur récupérées :", data);
      setLoading(false); // Arrêter le chargement en cas d'erreur

      // Mise à jour du state user avec les données spécifiques
      setUser({
        username: data.name,
        email: data.email,
        avatar: data.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
        bio: data.bio,
        goal: data.goal,
        preferences: data.preferences
      });
    } catch (error) {
      console.log("Erreur lors de la récupération des informations utilisateur :", error);
      setLoading(false); // Arrêter le chargement en cas d'erreur
    }
  };


  // Re-fetch the meal plan each time the screen gains focus,
  // or when the selectedDate or alimentAdded state changes.
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchMealPlan();
        checkStreak({
          totalCalories: totalCalories, // Your calorie goal
          setStreak // Your state setter
        });
      };
      fetchData();
    }, [selectedDate, alimentAdded])
  );

  useEffect(() => {
    checkStreak(selectedDate, totalCalories, setStreak);
    fetchUserInfo();
  }, []);

  const [macros, setMacros] = useState({
    carbs: { consumed: 0, goal: 300 },
    protein: { consumed: 0, goal: 150 },
    fat: { consumed: 0, goal: 80 },
  });

  // Calculate the total consumed calories and fill percentage
  const totalConsumed = Object.values(consumedCalories).reduce(
    (sum, value) => sum + value,
    0
  );

  // Calculate the fill percentage for the circular progress bar
  const fillPercentage = (totalConsumed / totalCalories) * 100;

  // Function to navigate to the previous day
  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  // Function to navigate to the next day
  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const navigation = useNavigation();

  // Function to handle meal press and navigate to the MealDetails screen
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <LinearGradient
          colors={[COLORS.vert, '#1a7a4e']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Dashboard</Text>
          {loading ? (
            <Text style={styles.greetingText}>Loading...</Text>
          ) : (
            <Text style={styles.greetingText}>Bonjour, {user.username} !</Text>
          )}
        </LinearGradient>

        {/* Date Navigation */}
        <View style={styles.dateCard}>
          <View style={styles.dateContainer}>
            <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}>
              <Icon name="chevron-left" size={28} color={COLORS.vert} />
            </TouchableOpacity>

            <Text style={styles.dateText}>
              {format(selectedDate, 'EEEE, MMM d')}
              {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                <Text style={{ color: COLORS.orange }}> (Today)</Text>
              )}
            </Text>

            <TouchableOpacity onPress={goToNextDay} style={styles.arrowButton}>
              <Icon name="chevron-right" size={28} color={COLORS.vert} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calorie Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.calorieHeader}>
            <Text style={styles.calorieTitle}>Calorie Budget</Text>
            <Text style={styles.calorieTotal}>{totalCalories} kcal</Text>
          </View>

          <View style={styles.progressContainer}>
            <AnimatedCircularProgress
              size={220}
              width={18}
              fill={fillPercentage}
              tintColor={COLORS.vertClaire}
              backgroundColor="#e8e8e8"
              rotation={0}
              lineCap="round"
            >
              {(fill) => (
                <View style={styles.progressContent}>
                  <Text style={styles.consumedCalories}>
                    {Math.round(totalConsumed)}
                    <Text style={styles.calorieUnit}>kcal</Text>
                  </Text>
                  <Text style={styles.remainingCalories}>
                    {totalConsumed > totalCalories
                      ? `${totalConsumed - totalCalories} kcal over`
                      : `${totalCalories - totalConsumed} kcal remaining`}
                  </Text>
                </View>
              )}
            </AnimatedCircularProgress>
          </View>

          {/* Meals Progress */}
          <View style={styles.mealsContainer}>
            {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
              <Pressable
                key={meal}
                style={styles.mealCard}
                onPress={() => handleMealPress(meal)}
              >
                <View style={styles.mealHeader}>
                  <Icon
                    name={meal === 'Breakfast' ? 'food-croissant' : meal === 'Lunch' ? 'food' : 'food-turkey'}
                    size={24}
                    color={COLORS.vert}
                  />
                  <Text style={styles.mealTitle}>{meal}</Text>
                </View>
                <Text style={styles.mealCalories}>
                  {consumedCalories[meal.toLowerCase()]} kcal
                </Text>
                <View style={styles.mealProgress}>
                  <View style={[styles.progressBar, {
                    width: `${(consumedCalories[meal.toLowerCase()] / (totalCalories / 3)) * 100}%`,
                    backgroundColor: COLORS.vertClaire
                  }]} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Macros Section */}
        <View style={styles.macrosCard}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <View style={styles.macrosGrid}>
            {Object.entries(macros).map(([macro, data], index) => (
              <View key={macro} style={styles.macroItem}>
                <AnimatedCircularProgress
                  size={80}
                  width={6}
                  fill={(data.consumed / data.goal) * 100}
                  tintColor={
                    macro === 'carbs' ? COLORS.orange :
                      macro === 'protein' ? COLORS.vertClaire : COLORS.vert
                  }
                  backgroundColor="#f3f3f3"
                >
                  {(fill) => (
                    <Text style={styles.macroValue}>
                      {data.consumed}g
                    </Text>
                  )}
                </AnimatedCircularProgress>
                <Text style={styles.macroLabel}>
                  {macro.charAt(0).toUpperCase() + macro.slice(1)}
                </Text>
                <Text style={styles.macroGoal}>{data.goal}g goal</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Streak & Recipes Sections */}
        <View style={styles.streakCard}>
          <Text style={styles.sectionTitle}>🔥 {streak} Day Streak!</Text>
          <View style={styles.streakContent}>
            {streak > 0 && (
              <Text style={styles.streakText}>
                You've met your calorie goal for {streak} consecutive days!
              </Text>
            )}
          </View>
        </View>

        <View style={styles.recipesCard}>
          <Text style={styles.sectionTitle}>📈 Trending Recipes</Text>
          {/* Add trending recipes here */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF4E4',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 18,
    color: '#FFF4E4',
    opacity: 0.9,
  },
  dateCard: {
    backgroundColor: '#FFF4E4',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: -10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    padding: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vert,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vert,
  },
  calorieTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.orange,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumedCalories: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.vert,
    textAlign: 'center',
  },
  calorieUnit: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  remainingCalories: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  mealsContainer: {
    marginTop: 20,
  },
  mealCard: {
    backgroundColor: '#FFF4E4',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.vert,
  },
  mealCalories: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  mealProgress: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  macrosCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.vert,
    marginBottom: 20,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.vert,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  macroGoal: {
    fontSize: 12,
    color: '#999',
  },
  streakCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  recipesCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});
