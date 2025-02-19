// import React, { useState } from 'react';
// import { View, ScrollView } from 'react-native';
// import { ApplicationProvider, Layout, Text, Card, Button } from '@ui-kitten/components';
// import * as eva from '@eva-design/eva';
// import { customTheme } fro./customTheme.jseme';
// import mealPlan from '../assets/mealPlanTest.js';
// import { SafeAreaView } from 'react-native-safe-area-context';

// function MealCard({ mealName, mealData }) {
//     const [expanded, setExpanded] = useState(false);

//     return (
//         <Card style={styles.mealCard} onPress={() => setExpanded(!expanded)}>
//             <Text category='s1' style={styles.mealTitle}>{mealName}: {mealData.title}</Text>
//             {expanded && (
//                 <>
//                     <Text category='s2' style={styles.section}>Ingredients:</Text>
//                     {mealData.ingredients.map((item, index) => (
//                         <Text key={index} style={styles.text}>• {item.name} ({item.quantity})</Text>
//                     ))}

//                     <Text category='s2' style={styles.section}>Steps:</Text>
//                     {mealData.steps.map((step, index) => (
//                         <Text key={index} style={styles.text}>{index + 1}. {step}</Text>
//                     ))}

//                     <Text category='s2' style={styles.section}>Nutritional Info:</Text>
//                     <Text style={styles.text}>Calories: {mealData.nutritional_info.calories}</Text>
//                     <Text style={styles.text}>Protein: {mealData.nutritional_info.proteins}g</Text>
//                     <Text style={styles.text}>Carbs: {mealData.nutritional_info.carbs}g</Text>
//                     <Text style={styles.text}>Fats: {mealData.nutritional_info.fats}g</Text>

//                     <Button onPress={() => setExpanded(false)} style={styles.button}>Hide</Button>
//                 </>
//             )}
//             {!expanded && <Button onPress={() => setExpanded(true)} style={styles.button}>View</Button>}
//         </Card>
//     );
// }

// function DayCard({ day, meals }) {
//     const totalMacros = Object.values(meals).reduce((totals, meal) => {
//         totals.calories += meal.nutritional_info.calories;
//         totals.proteins += meal.nutritional_info.proteins;
//         totals.carbs += meal.nutritional_info.carbs;
//         totals.fats += meal.nutritional_info.fats;
//         return totals;
//     }, { calories: 0, proteins: 0, carbs: 0, fats: 0 });

//     return (
//         <Card style={styles.dayCard}>
//             <Text category='h6' style={styles.dayTitle}>{day}</Text>
//             {Object.entries(meals).map(([mealName, mealData]) => (
//                 <MealCard key={mealName} mealName={mealName} mealData={mealData} />
//             ))}
//             <Text category='s2' style={styles.section}>Total Macros:</Text>
//             <Text style={styles.text}>Calories: {totalMacros.calories}</Text>
//             <Text style={styles.text}>Protein: {totalMacros.proteins}g</Text>
//             <Text style={styles.text}>Carbs: {totalMacros.carbs}g</Text>
//             <Text style={styles.text}>Fats: {totalMacros.fats}g</Text>
//         </Card>
//     );
// }

// export default function MealPlanScreen() {
//     return (
//         <SafeAreaView style={{ flex: 1 }}>
//             <ApplicationProvider {...eva} theme={customTheme} >
//                 <Layout style={styles.container}>
//                     <ScrollView contentContainerStyle={{ alignItems: "center" }} showsVerticalScrollIndicator={false}>

//                         <View style={styles.header}>
//                             <Text category='h5' style={styles.headerTitle}>Your 7-Day Meal Plan</Text>
//                         </View>
//                         {Object.entries(mealPlan).map(([day, meals]) => (
//                             <DayCard key={day} day={day} meals={meals} />
//                         ))}
//                     </ScrollView>
//                 </Layout>
//             </ApplicationProvider>
//         </SafeAreaView>
//     );
// }

// const styles = {
//     container: { flex: 1, backgroundColor: customTheme.fond, padding: 15, marginTop: 50, paddingBottom: 0 },
//     header: { alignItems: 'center', marginBottom: 20 },
//     headerTitle: { color: customTheme.vertClaire, fontWeight: 'bold' },
//     dayCard: { marginBottom: 15, borderRadius: 10, backgroundColor: customTheme.beige, padding: 10 },
//     dayTitle: { color: customTheme.vert, fontWeight: 'bold', marginBottom: 10 },
//     mealCard: { marginVertical: 5, borderRadius: 10, backgroundColor: customTheme.fond },
//     mealTitle: { color: customTheme.vertClaire, fontWeight: 'bold' },
//     section: { color: customTheme.vert, fontWeight: 'bold', marginTop: 5 },
//     text: { marginLeft: 10, color: customTheme.vert },
//     button: { marginTop: 5 }
// };
