import React, { useState, useEffect } from 'react';
import {customTheme} from '../customTheme'
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Text,Button
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
    white: '#FFFFFF',
    grey: '#F5F5F5'
};

const formatDate = (date) => date.toISOString().split('T')[0];
const getMonthName = (date) => date.toLocaleString('default', { month: 'long' });
const generateMonthDays = (date) => {
    const days = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevMonthDays = firstDay.getDay();
    const nextMonthDays = 6 - lastDay.getDay();
    const totalDays = prevMonthDays + lastDay.getDate() + nextMonthDays;

    for (let i = 1 - prevMonthDays; i <= totalDays - prevMonthDays; i++) {
        days.push(new Date(year, month, i));
    }
    return days;
};

export default function FoodDiary ({ navigation }) {
    const [activeTab, setActiveTab] = useState('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [expandedMeals, setExpandedMeals] = useState([]);
    const [mealLogs, setMealLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchMealLogs = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const response = await fetch(
                    'https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs/current',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch meal logs');

                const data = await response.json();
                setMealLogs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMealLogs();
    }, []);

    const fetchMealLogs = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(
                'https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs/current',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) throw new Error('Failed to fetch meal logs');

            const data = await response.json();
            setMealLogs(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (months) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + months);
        setCurrentDate(newDate);
    };

    const toggleMealDetails = (mealId) => {
        setExpandedMeals(prev =>
            prev.includes(mealId) ? prev.filter(id => id !== mealId) : [...prev, mealId]
        );
    };

    const processMeals = () => {
        return mealLogs
            .filter(log => log.date === formatDate(selectedDate))
            .flatMap(log =>
                log.meals.map((meal, index) => ({
                    id: `${log._id}-${index}`,
                    date: log.date,
                    time: meal.time,
                    items: meal.items,
                    calories: meal.calories,
                    nutrients: typeof meal.nutrients === 'string'
                        ? JSON.parse(meal.nutrients)
                        : meal.nutrients,
                    isRecipe: !!meal.recipe_id
                }))
            );
    };

    const renderMealCard = (meal) => (
        <TouchableOpacity
            key={meal.id}
            style={[styles.mealCard, expandedMeals.includes(meal.id) && styles.expandedMealCard]}
            onPress={() => toggleMealDetails(meal.id)}
        >
            <View style={styles.mealHeader}>
                <View style={[styles.mealTypeIndicator,
                { backgroundColor: getMealColor(meal.time) }]}
                />
                <Text style={styles.mealTime}>{meal.time}</Text>
                <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </View>

            {expandedMeals.includes(meal.id) && (
                <View style={styles.mealDetails}>
                    <Text style={styles.detailTitle}>Ingredients:</Text>
                    {meal.items.map((item, index) => (
                        <Text key={index} style={styles.detailItem}>• {item.name} ({item.quantity}g)</Text>
                    ))}

                    <View style={styles.nutritionGrid}>
                        <NutritionPill label="Protein" value={`${meal.nutrients.protein}g`} />
                        <NutritionPill label="Carbs" value={`${meal.nutrients.carbs}g`} />
                        <NutritionPill label="Fats" value={`${meal.nutrients.fats}g`} />
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
    const generateChartData = () => {
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        const weekDays = Array(7).fill(0).map((_, i) => {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            return date;
        });

        const dailyCalories = weekDays.map(date => {
            const logs = mealLogs.filter(log => log.date === formatDate(date));
            return logs.reduce((sum, log) => sum + log.meals.reduce(
                (mealSum, meal) => mealSum + meal.calories, 0
            ), 0);
        });

        return {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ data: dailyCalories }]
        };
    };
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={customTheme.vert} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <Button onPress={() => fetchMealLogs()} title='Retry'>Retry</Button>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Tab Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'calendar' && styles.activeTabButton]}
                    onPress={() => setActiveTab('calendar')}
                >
                    <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
                        Calendar
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'stats' && styles.activeTabButton]}
                    onPress={() => setActiveTab('stats')}
                >
                    <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
                        Statistics
                    </Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'calendar' ? (
                <ScrollView contentContainerStyle={styles.calendarContainer}>
                    {/* Calendar Header */}
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={() => handleMonthChange(-1)}>
                            <Icon name="chevron-left" size={28} color={COLORS.vert} />
                        </TouchableOpacity>
                        <Text style={styles.monthHeader}>
                            {getMonthName(currentDate)} {currentDate.getFullYear()}
                        </Text>
                        <TouchableOpacity onPress={() => handleMonthChange(1)}>
                            <Icon name="chevron-right" size={28} color={COLORS.vert} />
                        </TouchableOpacity>
                    </View>

                    {/* Calendar Grid */}
                    <View style={styles.calendarGrid}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <Text key={day} style={styles.weekDayHeader}>{day}</Text>
                        ))}
                        {generateMonthDays(currentDate).map((date, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayCell,
                                    date.getMonth() !== currentDate.getMonth() && styles.adjacentMonthDay,
                                    formatDate(date) === formatDate(selectedDate) && styles.selectedDay
                                ]}
                                onPress={() => setSelectedDate(date)}
                            >
                                <Text style={[
                                    styles.dayText,
                                    date.getMonth() !== currentDate.getMonth() && styles.adjacentMonthText,
                                    formatDate(date) === formatDate(selectedDate) && styles.selectedDayText
                                ]}>
                                    {date.getDate()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Daily Meals */}
                    <Text style={styles.sectionHeader}>Meals for {formatDate(selectedDate)}</Text>
                    {processMeals().map(renderMealCard)}
                </ScrollView>
            ) : (
                <ScrollView contentContainerStyle={styles.statsContainer}>
                    <View style={styles.chartCard}>
                        <Text category='h6' style={styles.chartTitle}>Calories Hebdomadaires</Text>
                        <BarChart
                            data={generateChartData()}
                            width={Dimensions.get('window').width - 32}
                            height={220}
                            yAxisSuffix="kcal"
                            chartConfig={{
                                backgroundColor: customTheme.beige,
                                backgroundGradientFrom: customTheme.beige,
                                backgroundGradientTo: customTheme.beige,
                                decimalPlaces: 0,
                                color: (opacity = 1) => customTheme.vert,
                                labelColor: (opacity = 1) => customTheme.vert,
                                style: { borderRadius: 16 },
                                propsForLabels: {
                                    fontSize: 12,
                                    fontFamily: 'System'
                                }
                            }}
                            style={styles.chart}
                        />
                    </View>

                    <View style={styles.statsGrid}>
                        <StatPill label="Moy. Journalière" value="1980" unit="kcal" />
                        <StatPill label="Eau consommée" value="1.8" unit="L" />
                        <StatPill label="Protéines" value="82" unit="g" />
                        <StatPill label="Activité" value="45" unit="min" />
                    </View>
                </ScrollView>
            )}
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: customTheme.fond
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: customTheme.beige,
        marginHorizontal: 16,
        marginTop: 8
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent'
    },
    activeTabButton: {
        borderBottomColor: customTheme.vert
    },
    tabText: {
        textAlign: 'center',
        color: customTheme.vertClaire,
        fontSize: 16
    },
    activeTabText: {
        color: customTheme.vert,
        fontWeight: 'bold'
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginVertical: 16
    },
    monthHeader: {
        color: customTheme.vert,
        fontWeight: 'bold',
        fontSize: 18
    },
    navButton: {
        width: 40,
        height: 40
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 8
    },
    weekDayHeader: {
        width: '14.28%',
        textAlign: 'center',
        color: customTheme.vert,
        paddingVertical: 8,
        fontSize: 12
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: customTheme.beige,
        margin: 1
    },
    selectedDay: {
        backgroundColor: customTheme.vertClaire
    },
    dayText: {
        fontSize: 14
    },
    selectedDayText: {
        color: 'white',
        fontWeight: 'bold'
    },
    adjacentMonthDay: {
        backgroundColor: '#f8f8f8'
    },
    adjacentMonthText: {
        color: '#aaa'
    },
    sectionHeader: {
        color: customTheme.vert,
        fontWeight: 'bold',
        fontSize: 18,
        margin: 16
    },
    mealCard: {
        margin: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: customTheme.beige
    },
    expandedMealCard: {
        borderColor: customTheme.vertClaire
    },
    mealHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12
    },
    mealTypeIndicator: {
        width: 6,
        height: 24,
        borderRadius: 3,
        marginRight: 12
    },
    mealTime: {
        flex: 1,
        color: customTheme.vert,
        fontWeight: 'bold',
        fontSize: 16
    },
    mealCalories: {
        color: customTheme.vertClaire,
        fontSize: 14
    },
    mealDetails: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: customTheme.beige
    },
    detailTitle: {
        color: customTheme.vert,
        marginBottom: 8,
        fontSize: 14
    },
    detailItem: {
        color: customTheme.vert,
        marginLeft: 8,
        marginBottom: 4,
        fontSize: 14
    },
    nutritionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12
    },
    nutritionPill: {
        backgroundColor: customTheme.beige,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4
    },
    nutritionValue: {
        color: customTheme.vert,
        fontWeight: 'bold'
    },
    chartCard: {
        margin: 16,
        borderRadius: 12
    },
    chartTitle: {
        color: customTheme.vert,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
        fontSize: 16
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16
    },
    statsContainer: {
        flexGrow: 1,
        paddingBottom: 20
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    statPill: {
        width: '45%',
        margin: 8,
        borderRadius: 12,
        backgroundColor: customTheme.beige,
        alignItems: 'center'
    },
    statValue: {
        color: customTheme.vert,
        marginTop: 4,
        fontWeight: 'bold'
    },
     loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    errorText: {
        color: 'red',
        marginBottom: 20
    }
});

// Color mapping function
const getMealColor = (mealType) => {
    switch (mealType.toLowerCase()) {
        case 'breakfast': return customTheme.orange;
        case 'lunch': return customTheme.vert;
        case 'dinner': return customTheme.vertClaire;
        default: return customTheme.vert;
    }
};
