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

  // Sample meal data - replace with your actual data
  const mealPlan = {
    Monday: {
      Breakfast: {
        title: 'Sample Breakfast',
        ingredients: [],
        steps: [],
        nutritional_info: { calories: 300, proteins: 20, carbs: 30, fats: 10 }
      },
      Lunch: {
        title: 'Sample Lunch',
        ingredients: [],
        steps: [],
        nutritional_info: { calories: 500, proteins: 30, carbs: 40, fats: 20 }
      },
      Dinner: {
        title: 'Sample Dinner',
        ingredients: [],
        steps: [],
        nutritional_info: { calories: 400, proteins: 25, carbs: 35, fats: 15 }
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
          {Object.entries(mealPlan[selectedDay]).map(([mealName, mealData]) => (
            <TouchableOpacity
              key={mealName}
              style={[
                styles.mealCard,
                { backgroundColor: getMealColor(mealName) }
              ]}
              onPress={() => { }}
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

          {/* Nutrition Summary Card */}
          <View style={styles.nutritionCard}>
            <Text style={styles.nutritionTitle}>Daily Summary</Text>
            <View style={styles.nutritionRow}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>1200</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>75g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>105g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>45g</Text>
                <Text style={styles.nutritionLabel}>Fats</Text>
              </View>
            </View>
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
});