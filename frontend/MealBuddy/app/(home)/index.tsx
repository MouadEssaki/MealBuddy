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
import { format, addDays, subDays, set } from 'date-fns';
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: '',
    bio: '',
    goal: '',
    preferences: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    activityLevel: '',
    nutritionalGoals: {
      calories: '',
      protein: '',
      carbs: '',
      fats: ''
    }
  });
  const [consumedCalories, setConsumedCalories] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  const [alimentAdded, setAlimentAdded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalCalories, setTotalCalories] = useState(2500);
  const [macros, setMacros] = useState({
    carbs: { consumed: 0, goal: 300 },
    protein: { consumed: 0, goal: 150 },
    fat: { consumed: 0, goal: 80 },
  });

  const flameAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnimation, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const flameScale = flameAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const fetchMealPlan = async () => {
    try {
      const mealPlan = await getMealPlan(selectedDate);
      let totalCarbs = 0;
      let totalProtein = 0;
      let totalFat = 0;

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
        setLoading(false);
        return;
      }

      const response = await fetch(`https://mealbuddy-smartgroup2025.azurewebsites.net/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.log("Erreur lors de la récupération des données utilisateur :", response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser({
        username: data.username,
        email: data.email,
        avatar: data.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
        bio: data.bio,
        goal: data.goal,
        preferences: data.preferences,
        age: data.age || '',
        height: data.height || '',
        weight: data.weight || '',
        gender: data.gender || '',
        activityLevel: data.activityLevel || '',
        nutritionalGoals: {
          calories: data.nutritionalGoals?.calories || '',
          protein: data.nutritionalGoals?.protein || '',
          carbs: data.nutritionalGoals?.carbs || '',
          fats: data.nutritionalGoals?.fats || ''
        }
      });

      setTotalCalories(Number(data.nutritionalGoals?.calories) || NaN);
      setMacros({
        carbs: { ...macros.carbs, goal: Number(data.nutritionalGoals?.carbs) || NaN },
        protein: { ...macros.protein, goal: Number(data.nutritionalGoals?.protein) || NaN },
        fat: { ...macros.fat, goal: Number(data.nutritionalGoals?.fats) || NaN },
      });
      setLoading(false);
    } catch (error) {
      console.log("Erreur lors de la récupération des informations utilisateur :", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchMealPlan();
        checkStreak({ totalCalories, setStreak });
      };
      fetchData();
    }, [selectedDate, alimentAdded])
  );

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const totalConsumed = Object.values(consumedCalories).reduce(
    (sum, value) => sum + value, 0
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
    navigation.navigate('MealDetails', { mealType, date: selectedDate });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}  // Added scrollView style
      >
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
            <TouchableOpacity
              onPress={() => navigation.navigate('FoodDiary')}
              style={styles.dateContainer}
            >
              <Text style={styles.dateText}>
                {format(selectedDate, 'EEEE, MMM d')}
                {format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                  <Text style={{ color: COLORS.orange }}> (Today)</Text>
                )}
              </Text>
            </TouchableOpacity>
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
            {Object.entries(macros).map(([macro, data]) => (
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

        {/* Streak Section */}
        <View style={styles.streakCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.streakHeader}>
              <Animated.View style={[styles.flameContainer, { transform: [{ scale: flameScale }] }]}>
                <Icon name="fire" size={36} color="#FFF4E4" style={styles.flameIcon} />
                {streak > 3 && (
                  <View style={styles.flameSparkles}>
                    <Icon name="sparkles" size={16} color="#FFD700" style={styles.sparkle1} />
                    <Icon name="sparkles" size={20} color="#FFD700" style={styles.sparkle2} />
                  </View>
                )}
              </Animated.View>
              <View>
                <Text style={styles.streakTitle}>{streak}</Text>
                <Text style={styles.streakSubtitle}>DAY STREAK</Text>
              </View>
            </View>
            {streak > 0 ? (
              <View style={styles.streakProgress}>
                <View style={[styles.progressBar, { width: `${Math.min(streak * 10, 100)}%` }]} />
                <Text style={styles.streakPhrase}>
                  {streak >= 7 ? '🔥 Unstoppable! ' :
                    streak >= 3 ? '🚀 Amazing! ' :
                      '💪 Great start! '}
                  Keep the fire burning!
                </Text>
              </View>
            ) : (
              <Text style={styles.noStreakText}>
                Start your streak today! 🔥
              </Text>
            )}
          </LinearGradient>
        </View>
      </ScrollView >
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  safeArea: {  // New style
    flex: 1,
    backgroundColor: COLORS.vert, // #105F3B
  },
  scrollView: {  // New style
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  // Keep all other styles the same
  container: {  // Remove this if you're not using it elsewhere
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
  streakCard: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 35,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 20,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  flameContainer: {
    position: 'relative',
    marginRight: 15,
  },
  flameIcon: {
    textShadowColor: 'rgba(255,107,107,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  flameSparkles: {
    position: 'absolute',
    top: -10,
    left: -5,
  },
  sparkle1: {
    position: 'absolute',
    top: 5,
    left: 25,
    transform: [{ rotate: '-20deg' }],
  },
  sparkle2: {
    position: 'absolute',
    top: -5,
    left: 10,
    transform: [{ rotate: '15deg' }],
  },
  streakTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFF4E4',
    letterSpacing: -1,
  },
  streakSubtitle: {
    fontSize: 16,
    color: 'rgba(255,244,228,0.9)',
    letterSpacing: 1,
    marginTop: -5,
  },
  streakProgress: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#FFF4E4',
    borderRadius: 3,
    marginBottom: 10,
  },
  streakPhrase: {
    color: '#FFF4E4',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  noStreakText: {
    color: '#FFF4E4',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
