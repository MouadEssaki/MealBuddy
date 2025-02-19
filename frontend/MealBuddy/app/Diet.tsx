import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';
import { ApplicationProvider, Layout, Text, Card, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './customTheme.js';
import mealPlan from '../assets/mealPlanTest.js';

function DietV2_test1({ mealData, onClose }) {
  return (
    <Card style={styles.detailsCard}>
      <Text category='s2' style={styles.section}>Ingredients:</Text>
      {mealData.ingredients.map((item, index) => (
        <Text key={index} style={styles.text}>• {item.name} ({item.quantity})</Text>
      ))}

      <Text category='s2' style={styles.section}>Steps:</Text>
      {mealData.steps.map((step, index) => (
        <Text key={index} style={styles.text}>{index + 1}. {step}</Text>
      ))}

      <Text category='s2' style={styles.section}>Nutritional Info:</Text>
      <Text style={styles.text}>Calories: {mealData.nutritional_info.calories}</Text>
      <Text style={styles.text}>Protein: {mealData.nutritional_info.proteins}g</Text>
      <Text style={styles.text}>Carbs: {mealData.nutritional_info.carbs}g</Text>
      <Text style={styles.text}>Fats: {mealData.nutritional_info.fats}g</Text>

      <Button onPress={onClose} style={styles.button}>Close</Button>
    </Card>
  );
}

function MealCard({ mealName, mealData, onPress, isActive }) {
  const getMealColor = () => {
    switch (mealName.toLowerCase()) {
      case 'breakfast': return customTheme.orange;
      case 'lunch': return customTheme.vert;
      case 'dinner': return customTheme.vertClaire;
      default: return customTheme.vert;
    }
  };

  return (
    <TouchableOpacity //todo, check si ya autre chose pcq bof le dimming, highglights marche pas pcq react component can only have 1 child (???)
      onPress={onPress}
      style={[
        styles.mealCard,
        { backgroundColor: getMealColor(), borderColor: isActive ? customTheme.vertClaire : 'transparent' }
      ]}
    >
      <Text category='s1' style={styles.mealTitle}>{mealName}</Text>
      <Text category='label' style={styles.mealSubtitle}>{mealData.title}</Text>
    </TouchableOpacity>
  ); //pas giga nice la taille mais c ok
}

export default function MealPlanScreen() {
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

  return (
    <ApplicationProvider {...eva} theme={customTheme}>
      <Layout style={styles.container}>
        <View style={styles.header}>
          <Text category='h5' style={styles.headerTitle}>Your 7-Day Meal Plan</Text>
        </View>

        {/* Day Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysContainer}
        >
          {days.map(day => (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
              onPress={() => {
                setSelectedDay(day);
                setSelectedMeal(null);
              }}
            >
              <Text style={selectedDay === day ? styles.selectedDayText : styles.dayText}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Meal Cards */}
        <ScrollView contentContainerStyle={styles.mealsContainer}>
          {Object.entries(mealPlan[selectedDay]).map(([mealName, mealData]) => (
            <MealCard
              key={mealName}
              mealName={mealName}
              mealData={mealData}
              isActive={selectedMeal?.title === mealData.title}
              onPress={() => setSelectedMeal(selectedMeal?.title === mealData.title ? null : mealData)}
            />
          ))}

          <Card style={styles.macrosCard}>
            <Text category='s2' style={styles.macrosTitle}>Total Macros for {selectedDay}:</Text>
            <View style={styles.macrosGrid}>
              <Text style={styles.macroText}>Calories: {totalMacros.calories}</Text>
              <Text style={styles.macroText}>Protein: {totalMacros.proteins}g</Text>
              <Text style={styles.macroText}>Carbs: {totalMacros.carbs}g</Text>
              <Text style={styles.macroText}>Fats: {totalMacros.fats}g</Text>
            </View>
          </Card>
        </ScrollView>
          {/* possible aussi de bouger macros ici, j'aimer pas le fait que le plus pouvait être au dessus tho*/}


        {/* Meal Details */}
        {selectedMeal && (
          <View style={styles.detailsContainer}>
            <DietV2_test1 mealData={selectedMeal} onClose={() => setSelectedMeal(null)} />
          </View>
        )}
      </Layout>
    </ApplicationProvider>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: customTheme.fond },
  header: { padding: 16, alignItems: 'center' }, //ou comme dans test2 / diet (l'og)
  headerTitle: { color: customTheme.vertClaire, fontWeight: 'bold' },
  daysContainer: { paddingHorizontal: 8, paddingBottom: 12 },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: customTheme.beige,
  },
  selectedDayButton: {
    backgroundColor: customTheme.vertClaire,
  },
  dayText: { color: customTheme.vert },
  selectedDayText: { color: 'white', fontWeight: 'bold' },
  mealsContainer: { padding: 16, paddingBottom: 100 },
  mealCard: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  mealTitle: { color: 'white', fontWeight: 'bold' },
  mealSubtitle: { color: 'white', opacity: 0.8 },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  detailsCard: { borderRadius: 15 },
  section: { color: customTheme.vert, marginTop: 8 },
  text: { color: customTheme.vert, marginLeft: 8 },
  button: { marginTop: 12 },
  macrosTitle: {
    color: customTheme.vert,
    fontWeight: 'bold',
    marginBottom: 8
  },
  macrosCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: customTheme.beige
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  macroText: {
    width: '48%',
    color: customTheme.vert,
    marginBottom: 4
  },
};