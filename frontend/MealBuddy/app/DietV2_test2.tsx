// import React, { useState } from 'react';
// import { View, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
// import { ApplicationProvider, Layout, Text, Card } from '@ui-kitten/components';
// import * as eva from '@eva-design/eva';
// import { customTheme } from './customTheme';
// import mealPlan from '../assets/mealPlanTest.js';

// const { width } = Dimensions.get('window');

// // Calculate the longest day name width
// const days = Object.keys(mealPlan);
// const longestDay = days.reduce((a, b) => a.length > b.length ? a : b);
// const sidebarWidth = Math.max(100, longestDay.length * 10); // Adjust multiplier as needed

// export default function MealPlanScreen() {
//   const [selectedDay, setSelectedDay] = useState('Monday');
//   const [expandedMeals, setExpandedMeals] = useState([]);

//   const toggleMeal = (mealType) => {
//     setExpandedMeals(prev => 
//       prev.includes(mealType)
//         ? prev.filter(type => type !== mealType)
//         : [...prev, mealType]
//     );
//   };
//   //possiblement arondir, surement dans la db par contre
//   const totalMacros = Object.values(mealPlan[selectedDay]).reduce((totals, meal) => {
//     totals.calories += meal.nutritional_info.calories;
//     totals.proteins += meal.nutritional_info.proteins;
//     totals.carbs += meal.nutritional_info.carbs;
//     totals.fats += meal.nutritional_info.fats;
//     return totals;
//   }, { calories: 0, proteins: 0, carbs: 0, fats: 0 });

//   return (
//     <ApplicationProvider {...eva} theme={customTheme}>
//       <Layout style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text category='h5' style={styles.headerTitle}>Your 7-Day Meal Plan</Text>
//         </View>

//         {/* Main Content */}
//         <View style={styles.contentContainer}>
//           {/* Sidebar with Days */}
//           <View style={[styles.sidebar, { width: sidebarWidth }]}>
//             <ScrollView contentContainerStyle={styles.daysContainer}>
//               {days.map(day => (
//                 <TouchableOpacity
//                   key={day}
//                   style={[
//                     styles.dayItem,
//                     selectedDay === day && styles.activeDayItem
//                   ]}
//                   onPress={() => {
//                     setSelectedDay(day);
//                     setExpandedMeals([]);
//                   }}
//                 >
//                   <Text 
//                     style={styles.dayText}
//                     numberOfLines={1}
//                     ellipsizeMode="tail"
//                   >
//                     {day}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>

//           {/* Main Content Area */}
//           <View style={styles.mainContent}>
//             <ScrollView contentContainerStyle={styles.mealsContainer}>
//               {/* Total Macros */}
//               <Card style={styles.macrosCard}>
//                 <Text category='s2' style={styles.macrosTitle}>Total Macros for {selectedDay}:</Text>
//                 <View style={styles.macrosGrid}>
//                   <Text style={styles.macroText}>Calories: {totalMacros.calories}</Text>
//                   <Text style={styles.macroText}>Protein: {totalMacros.proteins}g</Text>
//                   <Text style={styles.macroText}>Carbs: {totalMacros.carbs}g</Text>
//                   <Text style={styles.macroText}>Fats: {totalMacros.fats}g</Text>
//                 </View>
//               </Card>

//               {/* Meal Cards */}
//               {Object.entries(mealPlan[selectedDay]).map(([mealType, meal]) => (
//                 <Card 
//                   key={mealType}
//                   style={styles.mealCard}
//                   onPress={() => toggleMeal(mealType)}
//                 >
//                   <View style={[
//                     styles.mealHeader,
//                     { borderLeftColor: getMealColor(mealType) }
//                   ]}>
//                     <Text category="s1">{mealType}</Text>
//                     <Text appearance="hint">{meal.title}</Text>
//                   </View>
                  
//                   {expandedMeals.includes(mealType) && (
//                     <MealDetails meal={meal} />
//                   )}
//                 </Card>
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//       </Layout>
//     </ApplicationProvider>
//   );
// }

// // Meal Details Component
// function MealDetails({ meal }) {
//   return (
//     <View style={styles.detailsContainer}>
//       <Text category="s2" style={styles.section}>Ingredients:</Text>
//       {meal.ingredients.map((item, i) => (
//         <Text key={i} style={styles.text}>• {item.name} ({item.quantity})</Text>
//       ))}

//       <Text category="s2" style={styles.section}>Steps:</Text>
//       {meal.steps.map((step, i) => (
//         <Text key={i} style={styles.text}>{i+1}. {step}</Text>
//       ))}

//       <Text category="s2" style={styles.section}>Nutrition:</Text>
//       <Text style={styles.text}>Calories: {meal.nutritional_info.calories}</Text>
//       <Text style={styles.text}>Protein: {meal.nutritional_info.proteins}g</Text>
//       <Text style={styles.text}>Carbs: {meal.nutritional_info.carbs}g</Text>
//       <Text style={styles.text}>Fats: {meal.nutritional_info.fats}g</Text>
//     </View>
//   );
// }

// // Helper Function for Meal Colors
// const getMealColor = (mealType) => {
//   switch(mealType.toLowerCase()) {
//     case 'breakfast': return customTheme.orange;
//     case 'lunch': return customTheme.vert;
//     case 'dinner': return customTheme.vertClaire;
//     default: return customTheme.vert;
//   }
// };

// // Styles
// const styles = StyleSheet.create({
//   container: { 
//     flex: 1,
//     backgroundColor: customTheme.fond
//   },
//   header: {
//     marginTop: 6,
//     alignItems: "center",
//     backgroundColor: 'white', // Soft background color
//     padding: 10,
//     borderRadius: 10,
//     width: "100%",
//   },
//   headerTitle: { color: customTheme.vertClaire, fontWeight: 'bold' },
//   contentContainer: {
//     flex: 1,
//     flexDirection: 'row'
//   },
//   sidebar: {
//     backgroundColor: customTheme.beige,
//     paddingTop: 16
//   },
//   daysContainer: {
//     paddingBottom: 20
//   },
//   dayItem: {
//     paddingVertical: 16,
//     paddingHorizontal: 8,
//     marginVertical: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: customTheme.fond,
//     borderRadius: 8,
//     marginHorizontal: 8
//   },
//   activeDayItem: {
//     backgroundColor: customTheme.vertClaire,
//   },
//   dayText: { 
//     color: customTheme.vert,
//     textAlign: 'center',
//     fontSize: 14,
//     width: '100%'
//   },
//   mainContent: {
//     flex: 1,
//     padding: 16
//   },
//   mealsContainer: {
//     paddingBottom: 20
//   },
//   macrosCard: {
//     marginBottom: 16,
//     backgroundColor: customTheme.beige
//   },
//   macrosTitle: {
//     color: customTheme.vert,
//     fontWeight: 'bold',
//     marginBottom: 8
//   },
//   macrosGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between'
//   },
//   macroText: {
//     width: '48%',
//     color: customTheme.vert,
//     marginBottom: 4
//   },
//   mealCard: { 
//     marginBottom: 16,
//     width: '100%'
//   },
//   mealHeader: {
//     borderLeftWidth: 4,
//     paddingLeft: 12,
//     marginBottom: 8
//   },
//   detailsContainer: {
//     marginTop: 8
//   },
//   section: { 
//     color: customTheme.vert, 
//     marginTop: 16 
//   },
//   text: { 
//     color: customTheme.vert, 
//     marginLeft: 8 
//   }
// });