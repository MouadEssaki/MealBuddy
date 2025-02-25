import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  SafeAreaView, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import mealPlan from '../assets/mealPlanTest';

const { width } = Dimensions.get('window');
const COLORS = {
  vertClaire: '#68AA64',
  vert: '#105F3B',
  orange: '#E36820',
  beige: '#FFF4E4',
  white: '#FFFFFF',
  grey: '#F5F5F5'
};

const MealPlanScreen = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const days = Object.keys(mealPlan);

  const totalMacros = Object.values(mealPlan[selectedDay]).reduce((totals, meal) => {
    totals.calories += meal.nutritional_info.calories;
    totals.proteins += meal.nutritional_info.proteins;
    totals.carbs += meal.nutritional_info.carbs;
    totals.fats += meal.nutritional_info.fats;
    return totals;
  }, { calories: 0, proteins: 0, carbs: 0, fats: 0 });

  const getMealColor = (mealName) => {
    switch (mealName.toLowerCase()) {
      case 'breakfast': return COLORS.orange;
      case 'lunch': return COLORS.vert;
      case 'dinner': return COLORS.vertClaire;
      default: return COLORS.vert;
    }
  };

  const MealDetails = ({ mealData, onClose }) => (
    <View style={styles.detailsContainer}>
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {mealData.ingredients.map((item, index) => (
          <Text key={index} style={styles.detailText}>
            • {item.name} ({item.quantity})
          </Text>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Steps</Text>
        {mealData.steps.map((step, index) => (
          <Text key={index} style={styles.detailText}>
            {index + 1}. {step}
          </Text>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Nutritional Info</Text>
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{mealData.nutritional_info.calories}</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{mealData.nutritional_info.proteins}g</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{mealData.nutritional_info.carbs}g</Text>
            <Text style={styles.nutritionLabel}>Carbs</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{mealData.nutritional_info.fats}g</Text>
            <Text style={styles.nutritionLabel}>Fats</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={onClose} 
          style={styles.closeButton}
        >
          <Icon name="close" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
            onPress={() => {
              setSelectedDay(day);
              setSelectedMeal(null);
            }}
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
        {Object.entries(mealPlan[selectedDay]).map(([mealName, mealData]) => (
          <TouchableOpacity
            key={mealName}
            style={[
              styles.mealCard,
              { backgroundColor: getMealColor(mealName) },
              selectedMeal?.title === mealData.title && styles.activeMealCard
            ]}
            onPress={() => setSelectedMeal(prev => 
              prev?.title === mealData.title ? null : mealData
            )}
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
        ))}

        {/* Macros Card */}
        <View style={styles.macrosCard}>
          <Text style={styles.macrosTitle}>Daily Nutrition Summary</Text>
          <View style={styles.macrosGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totalMacros.calories}</Text>
              <Text style={styles.macroLabel}>Calories</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totalMacros.proteins}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totalMacros.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totalMacros.fats}g</Text>
              <Text style={styles.macroLabel}>Fats</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Meal Details Overlay */}
      {selectedMeal && (
        <MealDetails mealData={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.beige,
  },
  header: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 26,
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
    padding: 20,
    paddingBottom: 100,
  },
  mealCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  activeMealCard: {
    borderWidth: 2,
    borderColor: COLORS.beige,
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
  macrosCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.vert,
    marginBottom: 16,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 12,
    color: COLORS.vert,
    opacity: 0.8,
    marginTop: 4,
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  detailsCard: {
    maxHeight: width * 0.8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.vert,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.vert,
    lineHeight: 22,
    marginBottom: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.orange,
  },
  nutritionLabel: {
    fontSize: 12,
    color: COLORS.vert,
    opacity: 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: COLORS.orange,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default MealPlanScreen;