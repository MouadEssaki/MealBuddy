// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
//     ActivityIndicator,
//     Text,
//     SafeAreaView
// } from 'react-native';
// import { BarChart } from 'react-native-chart-kit';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LinearGradient } from 'expo-linear-gradient';




// const COLORS = {
//     vertClaire: '#68AA64',
//     vert: '#105F3B',
//     orange: '#E36820',
//     beige: '#FFF4E4',
//     white: '#FFFFFF',
//     background: '#F9F9F9'
// };

// const { width } = Dimensions.get('window');

// const NutritionPill = ({ label, value }) => (
//     <View style={styles.nutritionPill}>
//         <Text style={styles.nutritionLabel}>{label}</Text>
//         <Text style={styles.nutritionValue}>{value}</Text>
//     </View>
// );

// const StatPill = ({ label, value, unit }) => (
//     <View style={styles.statPill}>
//         <Text style={styles.statLabel}>{label}</Text>
//         <Text style={styles.statValue}>
//             {value}<Text style={styles.statUnit}> {unit}</Text>
//         </Text>
//     </View>
// );


// export default function FoodDiary() {
//     const [activeTab, setActiveTab] = useState('calendar');
//     const [currentDate, setCurrentDate] = useState(new Date());
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [expandedMeals, setExpandedMeals] = useState([]);
//     const [mealLogs, setMealLogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);


//     useEffect(() => {
//         const fetchMealLogs = async () => {
//             try {
//                 const token = await AsyncStorage.getItem('authToken');
//                 const response = await fetch(
//                     'https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs/current',
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     }
//                 );
//                 console.log(response);
//                 if (!response.ok) throw new Error('Failed to fetch meal logs');

//                 const data = await response.json();
//                 setMealLogs(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMealLogs();
//     }, []);
//     /*
//     // Sample data
//     const meals = [
//         {
//             id: 1, date: '2025-02-20', time: 'Breakfast',
//             items: ['Omelette', 'Whole wheat bread'], calories: 300,
//             nutrients: { protein: 20, carbs: 25, fats: 10 }
//         },
//         {
//             id: 2, date: '2025-02-20', time: 'Lunch',
//             items: ['Grilled chicken', 'Brown rice'], calories: 450,
//             nutrients: { protein: 35, carbs: 40, fats: 15 }
//         },
//     ];

//     const chartData = {
//         labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
//         datasets: [{
//             data: [meals[0].calories, meals[1].calories]  //donc possiblement itérer
//         }]
//     };*/

//     const handleMonthChange = (months) => {
//         const newDate = new Date(currentDate);
//         newDate.setMonth(newDate.getMonth() + months);
//         setCurrentDate(newDate);
//     };

//     const toggleMealDetails = (mealId) => {
//         setExpandedMeals(prev =>
//             prev.includes(mealId) ? prev.filter(id => id !== mealId) : [...prev, mealId]
//         );
//     };

//     const processMeals = () => {
//         return mealLogs
//             .filter(log => log.date === formatDate(selectedDate))
//             .flatMap(log =>
//                 log.meals.map((meal, index) => ({
//                     id: `${log._id}-${index}`,
//                     date: log.date,
//                     time: meal.time,
//                     items: meal.items,
//                     calories: meal.calories,
//                     nutrients: typeof meal.nutrients === 'string'
//                         ? JSON.parse(meal.nutrients)
//                         : meal.nutrients,
//                     isRecipe: !!meal.recipe_id
//                 }))
//             );
//     };

//     const renderMealCard = (meal) => (
//         <TouchableOpacity
//             key={meal.id}
//             style={[styles.mealCard, expandedMeals.includes(meal.id) && styles.expandedMealCard]}
//             onPress={() => toggleMealDetails(meal.id)}
//             activeOpacity={0.9}
//         >
//             <View style={styles.mealHeader}>
//                 <LinearGradient
//                     colors={[getMealColor(meal.time), '#8BC34A']}
//                     style={styles.mealTypeIndicator}
//                 />
//                 <Text style={styles.mealTime}>{meal.time}</Text>
//                 <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
//             </View>

//             {expandedMeals.includes(meal.id) && (
//                 <View style={styles.mealDetails}>
//                     <Text style={styles.detailTitle}>Ingredients:</Text>
//                     {meal.items.map((item, index) => (
//                         <Text key={index} style={styles.detailItem}>• {item.name} ({item.quantity}g)</Text>
//                     ))}

//                     <View style={styles.nutritionGrid}>
//                         <NutritionPill label="Protein" value={`${meal.nutrients.protein}g`} />
//                         <NutritionPill label="Carbs" value={`${meal.nutrients.carbs}g`} />
//                         <NutritionPill label="Fats" value={`${meal.nutrients.fats}g`} />
//                     </View>
//                 </View>
//             )}
//         </TouchableOpacity>
//     );

//     const generateChartData = () => {
//         const weekStart = new Date(currentDate);
//         weekStart.setDate(weekStart.getDate() - weekStart.getDay());

//         const weekDays = Array(7).fill(0).map((_, i) => {
//             const date = new Date(weekStart);
//             date.setDate(date.getDate() + i);
//             return date;
//         });

//         const dailyCalories = weekDays.map(date => {
//             const logs = mealLogs.filter(log => log.date === formatDate(date));
//             return logs.reduce((sum, log) => sum + log.meals.reduce(
//                 (mealSum, meal) => mealSum + meal.calories, 0
//             ), 0);
//         });

//         return {
//             labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//             datasets: [{ data: dailyCalories }]
//         };
//     };


//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={COLORS.vert} />
//             </View>
//         );
//     }


//     if (error) {
//         const fetchMealLogs = async () => {
//             try {
//                 const token = await AsyncStorage.getItem('authToken');
//                 console.log(token);
//                 const response = await fetch(
//                     'https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs/current',
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     }
//                 );
//                 console.log(response);
//                 if (!response.ok) throw new Error('Failed to fetch meal logs');

//                 const data = await response.json();
//                 setMealLogs(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         return (
//             <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>Error: {error}</Text>
//                 <TouchableOpacity
//                     style={styles.retryButton}
//                     onPress={() => fetchMealLogs()}
//                 >
//                     <Text style={styles.retryText}>Retry</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Tab Selector */}
//             <View style={styles.tabContainer}>
//                 <TouchableOpacity
//                     style={[styles.tabButton, activeTab === 'calendar' && styles.activeTab]}
//                     onPress={() => setActiveTab('calendar')}
//                 >
//                     <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
//                         Calendar
//                     </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={[styles.tabButton, activeTab === 'stats' && styles.activeTab]}
//                     onPress={() => setActiveTab('stats')}
//                 >
//                     <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
//                         Statistics
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             {activeTab === 'calendar' ? (
//                 <ScrollView contentContainerStyle={styles.contentContainer}>
//                     {/* Calendar Header */}
//                     <View style={styles.calendarHeader}>
//                         <TouchableOpacity onPress={() => handleMonthChange(-1)}>
//                             <Icon name="chevron-left" size={28} color={COLORS.vert} />
//                         </TouchableOpacity>
//                         <Text style={styles.monthHeader}>
//                             {getMonthName(currentDate)} {currentDate.getFullYear()}
//                         </Text>
//                         <TouchableOpacity onPress={() => handleMonthChange(1)}>
//                             <Icon name="chevron-right" size={28} color={COLORS.vert} />
//                         </TouchableOpacity>
//                     </View>

//                     {/* Calendar Grid */}
//                     <View style={styles.calendarGrid}>
//                         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                             <Text key={day} style={styles.weekDayHeader}>{day}</Text>
//                         ))}
//                         {generateMonthDays(currentDate).map((date, index) => (
//                             <TouchableOpacity
//                                 key={index}
//                                 style={[
//                                     styles.dayCell,
//                                     date.getMonth() !== currentDate.getMonth() && styles.adjacentMonthDay,
//                                     formatDate(date) === formatDate(selectedDate) && styles.selectedDay
//                                 ]}
//                                 onPress={() => setSelectedDate(date)}
//                             >
//                                 <Text style={[
//                                     styles.dayText,
//                                     date.getMonth() !== currentDate.getMonth() && styles.adjacentMonthText,
//                                     formatDate(date) === formatDate(selectedDate) && styles.selectedDayText
//                                 ]}>
//                                     {date.getDate()}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>

//                     {/* Daily Meals */}
//                     <Text style={styles.sectionHeader}>Meals for {formatDate(selectedDate)}</Text>
//                     {processMeals().map(renderMealCard)}
//                 </ScrollView>
//             ) : (
//                 <ScrollView contentContainerStyle={styles.statsContainer}>
//                     <View style={styles.chartCard}>
//                         <Text style={styles.chartTitle}>Weekly Calories</Text>
//                         <BarChart
//                             data={generateChartData()}
//                             width={width - 40}
//                             height={220}
//                             yAxisSuffix="kcal"
//                             chartConfig={{
//                                 backgroundColor: COLORS.beige,
//                                 backgroundGradientFrom: COLORS.beige,
//                                 backgroundGradientTo: COLORS.beige,
//                                 decimalPlaces: 0,
//                                 color: () => COLORS.vert,
//                                 labelColor: () => COLORS.vert,
//                                 style: { borderRadius: 16 },
//                                 propsForLabels: { fontSize: 12 }
//                             }}
//                             style={styles.chart}
//                         />
//                     </View>

//                     <View style={styles.statsGrid}>
//                         <StatPill label="Daily Average" value="1980" unit="kcal" />
//                         <StatPill label="Water" value="1.8" unit="L" />
//                         <StatPill label="Protein" value="82" unit="g" />
//                         <StatPill label="Activity" value="45" unit="min" />
//                     </View>
//                 </ScrollView>
//             )}
//         </SafeAreaView>
//     );
// }


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.background
//     },
//     tabContainer: {
//         flexDirection: 'row',
//         marginHorizontal: 20,
//         marginTop: 15,
//         borderRadius: 15,
//         backgroundColor: COLORS.beige,
//         overflow: 'hidden'
//     },
//     tabButton: {
//         flex: 1,
//         paddingVertical: 14,
//         alignItems: 'center'
//     },
//     activeTab: {
//         backgroundColor: COLORS.vert
//     },
//     tabText: {
//         fontSize: 16,
//         color: COLORS.vert,
//         fontWeight: '500'
//     },
//     activeTabText: {
//         color: COLORS.white,
//         fontWeight: '600'
//     },
//     calendarHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         marginVertical: 20
//     },
//     monthHeader: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: COLORS.vert
//     },
//     calendarGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginHorizontal: 10,
//         backgroundColor: COLORS.white,
//         borderRadius: 15,
//         padding: 5
//     },
//     weekDayHeader: {
//         width: '14.28%',
//         textAlign: 'center',
//         color: COLORS.vert,
//         paddingVertical: 12,
//         fontSize: 12,
//         fontWeight: '500'
//     },
//     dayCell: {
//         width: '14.28%',
//         aspectRatio: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: COLORS.beige,
//         borderRadius: 8,
//         margin: 2
//     },
//     selectedDay: {
//         backgroundColor: COLORS.vert
//     },
//     dayText: {
//         fontSize: 16,
//         color: COLORS.vert
//     },
//     selectedDayText: {
//         color: COLORS.white,
//         fontWeight: '600'
//     },
//     adjacentMonthDay: {
//         backgroundColor: '#F8F8F8'
//     },
//     adjacentMonthText: {
//         color: '#AAA'
//     },
//     sectionHeader: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: COLORS.vert,
//         margin: 20
//     },
//     mealCard: {
//         backgroundColor: COLORS.white,
//         borderRadius: 15,
//         marginHorizontal: 20,
//         marginVertical: 8,
//         padding: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 3
//     },
//     expandedMealCard: {
//         borderWidth: 2,
//         borderColor: COLORS.vertClaire
//     },
//     mealHeader: {
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     mealTypeIndicator: {
//         width: 6,
//         height: 24,
//         borderRadius: 3,
//         marginRight: 12
//     },
//     mealTime: {
//         flex: 1,
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.vert
//     },
//     mealCalories: {
//         fontSize: 14,
//         color: COLORS.orange,
//         fontWeight: '500'
//     },
//     mealDetails: {
//         paddingTop: 16,
//         marginTop: 12,
//         borderTopWidth: 1,
//         borderTopColor: COLORS.beige
//     },
//     detailTitle: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: COLORS.vert,
//         marginBottom: 8
//     },
//     detailItem: {
//         fontSize: 14,
//         color: COLORS.vert,
//         marginLeft: 8,
//         marginBottom: 4
//     },
//     nutritionGrid: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 12
//     },
//     nutritionPill: {
//         backgroundColor: COLORS.beige,
//         borderRadius: 20,
//         paddingVertical: 8,
//         paddingHorizontal: 16,
//         margin: 4
//     },
//     nutritionLabel: {
//         fontSize: 12,
//         color: COLORS.vert,
//         opacity: 0.8
//     },
//     nutritionValue: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: COLORS.vert,
//         marginTop: 4
//     },
//     chartCard: {
//         backgroundColor: COLORS.white,
//         borderRadius: 15,
//         padding: 16,
//         margin: 20
//     },
//     chartTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: COLORS.vert,
//         textAlign: 'center',
//         marginBottom: 16
//     },
//     statsGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'center',
//         paddingHorizontal: 20
//     },
//     statPill: {
//         width: '45%',
//         backgroundColor: COLORS.white,
//         borderRadius: 15,
//         padding: 16,
//         margin: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 3
//     },
//     statLabel: {
//         fontSize: 12,
//         color: COLORS.vert,
//         opacity: 0.8
//     },
//     statValue: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: COLORS.vert,
//         marginTop: 8
//     },
//     statUnit: {
//         fontSize: 14,
//         fontWeight: '500'
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: COLORS.background
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         backgroundColor: COLORS.background
//     },
//     errorText: {
//         color: COLORS.orange,
//         fontSize: 16,
//         marginBottom: 20
//     },
//     retryButton: {
//         backgroundColor: COLORS.vert,
//         paddingVertical: 12,
//         paddingHorizontal: 30,
//         borderRadius: 25
//     },
//     retryText: {
//         color: COLORS.white,
//         fontSize: 16,
//         fontWeight: '600'
//     },
// });

// const getMealColor = (mealType) => {
//     switch (mealType.toLowerCase()) {
//         case 'breakfast': return COLORS.orange;
//         case 'lunch': return COLORS.vert;
//         case 'dinner': return COLORS.vertClaire;
//         default: return COLORS.vert;
//     }
// };
