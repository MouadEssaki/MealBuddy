import React, { useState } from 'react';
import { IconRegistry, ApplicationProvider, Layout, Text, Button, Icon } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { customTheme } from './customTheme';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { format, addDays, subDays } from 'date-fns';

export default function App() {
  const StarIcon = (props) => <Icon name='star' {...props} />;
  const ClockIcon = (props) => <Icon name='clock-outline' {...props} fill="#555" />;
  const PersonIcon = (props) => <Icon name='person-outline' {...props} fill="#555" />;
  const [user, setUser] = useState("mahmoud");
  const [totalCalories, setTotalCalories] = useState(2500); // Total calorie budget
  const [consumedCalories, setConsumedCalories] = useState({
    breakfast: 1000,
    lunch: 0,
    dinner: 0,
  });
  // Macronutrient data (carbs, protein, fat)
  const [macros, setMacros] = useState({
    carbs: { consumed: 100, goal: 300 }, // in grams
    protein: { consumed: 50, goal: 150 }, // in grams
    fat: { consumed: 30, goal: 80 }, // in grams
  });
  // Date state
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate total consumed calories
  const totalConsumed = Object.values(consumedCalories).reduce((sum, value) => sum + value, 0);
  // Calculate fill percentage for the progress bar
  const fillPercentage = (totalConsumed / totalCalories) * 100;

  // Function to navigate to the previous day
  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  // Function to navigate to the next day
  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };


  const trendingRecipes = [
    {
      id: 2,
      name: "Classic Beef Cheeseburger",
      description: "Juicy beef patty with melted cheddar cheese.",
      image: "https://picsum.photos/601/400",
      servings: 2,
      time: "25 min",
      category: "Fast Food",
      rating: 5
    },
    {
      id: 4,
      name: "Spaghetti Bolognese",
      description: "Classic Italian pasta with rich meat sauce.",
      image: "https://picsum.photos/603/400",
      servings: 6,
      time: "45 min",
      category: "Italian",
      rating: 5
    },
    {
      id: 10,
      name: "Chicken Pad Thai",
      description: "Classic Thai stir-fried noodles with chicken.",
      image: "https://picsum.photos/609/400",
      servings: 4,
      time: "40 min",
      category: "Asian",
      rating: 5
    }
  ];


  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...customTheme }}>
        <Layout style={{ flex: 1, marginTop: 50, backgroundColor: customTheme.fond }}>
          <ScrollView contentContainerStyle={{ padding: 20, alignItems: "center" }} showsVerticalScrollIndicator={false}>
            {/* Welcome Message */}
            <View style={styles.headerContainer}>
              <Text category='h1' style={styles.welcomeText}>
                Dashboard
              </Text>
              <Text category='h5' style={styles.welcomeText}>
                Bonjour, {user} !
              </Text>
            </View>
            {/* Calorie Budget Card */}
            <View style={styles.cardContainer}>
              {/* Date Navigation */}
              <View style={styles.dateNavigation}>
                <TouchableOpacity onPress={goToPreviousDay}>
                  <Text style={styles.arrow}>{"<"}</Text>
                </TouchableOpacity>
                <Text style={styles.dateText}>{format(selectedDate, "dd MMMM yyyy")}</Text>
                <TouchableOpacity onPress={goToNextDay}>
                  <Text style={styles.arrow}>{">"}</Text>
                </TouchableOpacity>
              </View>
              <Text category='h6' style={styles.budgetLabel}>
                Calorie Budget
              </Text>
              <Text style={styles.budgetValue}>
                {totalCalories}
              </Text>
              {/* Circular Progress Bar */}
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
              {/* Meals Section */}
              <View style={styles.mealsContainer}>
                <View style={styles.mealColumn}>
                  <Text style={styles.mealTitle}>Breakfast</Text>
                  <Text style={styles.mealValue}>{consumedCalories.breakfast}</Text>
                </View>
                <View style={styles.mealColumn}>
                  <Text style={styles.mealTitle}>Lunch</Text>
                  <Text style={styles.mealValue}>{consumedCalories.lunch}</Text>
                </View>
                <View style={styles.mealColumn}>
                  <Text style={styles.mealTitle}>Dinner</Text>
                  <Text style={styles.mealValue}>{consumedCalories.dinner}</Text>
                </View>
              </View>
              {/* Macros Section */}
              <View style={styles.macrosContainer}>
                {/* Carbs */}
                <View style={styles.macroColumn}>
                  <Text style={styles.macroLabel}>Carbs</Text>
                  <Text style={styles.macroValue}>
                    {macros.carbs.consumed}g / {macros.carbs.goal}g
                  </Text>
                  <View style={styles.progressBar}>
                    <AnimatedCircularProgress
                      size={50}
                      width={5}
                      fill={(macros.carbs.consumed / macros.carbs.goal) * 100}
                      tintColor="#FFA726"
                      backgroundColor="#a9a9a940"
                    />
                  </View>
                </View>
                {/* Protein */}
                <View style={styles.macroColumn}>
                  <Text style={styles.macroLabel}>Protein</Text>
                  <Text style={styles.macroValue}>
                    {macros.protein.consumed}g / {macros.protein.goal}g
                  </Text>
                  <View style={styles.progressBar}>
                    <AnimatedCircularProgress
                      size={50}
                      width={5}
                      fill={(macros.protein.consumed / macros.protein.goal) * 100}
                      tintColor="#66BB6A"
                      backgroundColor="#a9a9a940"
                    />
                  </View>
                </View>
                {/* Fat */}
                <View style={styles.macroColumn}>
                  <Text style={styles.macroLabel}>Fat</Text>
                  <Text style={styles.macroValue}>
                    {macros.fat.consumed}g / {macros.fat.goal}g
                  </Text>
                  <View style={styles.progressBar}>
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
            </View>
            <View style={{ marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 10, width: "100%" }}>
              <Text>Your Streak!</Text>
            </View>
            <View style={{ marginTop: 20, backgroundColor: 'white', padding: 10, borderRadius: 10, width: "100%" }}>
              <Text category='h5' style={{marginBottom:20}}>Trending Recipes 📈</Text>
              {trendingRecipes.map((recipe) => (
                <View key={recipe.id} style={{
                  marginBottom: 30,
                  backgroundColor: 'transparent', // This is important
                }}>
                  <View style={{
                    backgroundColor: "#FFF4E4",
                    borderRadius: 10,
                    // iOS shadow properties
                    shadowColor: "#636363",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    // Android shadow property
                    elevation: 5,
                  }}>
                    <Image
                      source={{
                        uri: `https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.name)}`,
                      }}
                      style={{
                        width: '100%',
                        height: 200,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                      resizeMode="cover"
                    />
                    <View style={{ padding: 10 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                        <ClockIcon style={{ width: 16, height: 16 }} />
                        <Text style={{ marginLeft: 5, fontSize: 12 }}>{recipe.time}</Text>
                        <PersonIcon style={{ width: 16, height: 16, marginLeft: 10 }} />
                        <Text style={{ marginLeft: 5, fontSize: 12 }}>{recipe.servings} serve</Text>
                        <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              style={{
                                width: 16,
                                height: 16,
                                marginRight: 3,
                              }}
                              fill={i < recipe.rating ? "#FFD700" : "#E0E0E0"}
                            />
                          ))}


                        </View>
                      </View>

                      <Text category='h6' style={{ fontWeight: 'bold' }}>{recipe.name}</Text>
                      <Text appearance="hint">{recipe.description}</Text>
                      {/* Star Rating */}

                    </View>
                  </View>
                </View>
              ))}


            </View>
          </ScrollView>
        </Layout>
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: 'white', // Soft background color
    padding: 10,
    borderRadius: 10,
    width: "100%",
  },
  welcomeText: {
    fontWeight: 'bold',
    color: '#68AA64',
  },
  cardContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    backgroundColor: '#FFF4E4', // Soft background color
    padding: 20,
    borderRadius: 30,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  dateNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  arrow: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#68AA64",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
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
    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  mealColumn: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  mealTitle: {
    fontSize: 16,
    color: '#68AA64',
    marginBottom: 5,
  },
  mealValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  macrosContainer: {
    marginTop: 20,
    flexDirection: "row", // Display macros in a column
    gap: 15, // Add spacing between macro rows
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  macroColumn: {
    flexDirection: "column", // Align label, value, and progress bar horizontally
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    padding: 10,
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  macroValue: {
    fontSize: 14,
    color: "#68AA64",
  },
  progressBar: {
    marginLeft: 10,
  },
});