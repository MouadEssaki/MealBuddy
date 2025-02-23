import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ApplicationProvider, Layout, Text, Card, Button, Icon } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { BarChart } from 'react-native-chart-kit';
import { customTheme } from './customTheme'


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

// Icons
const CalendarIcon = (props) => <Icon {...props} name='calendar' />;
const StatsIcon = (props) => <Icon {...props} name='activity' />;
const ChevronLeft = (props) => <Icon {...props} name='arrow-ios-back' />;
const ChevronRight = (props) => <Icon {...props} name='arrow-ios-forward' />;

// Helper Components
const NutritionPill = ({ label, value }) => (
    <View style={styles.nutritionPill}>
        <Text category='c2' appearance='hint'>{label}</Text>
        <Text category='s2' style={styles.nutritionValue}>{value}</Text>
    </View>
);

const StatPill = ({ label, value, unit }) => (
    <Card style={styles.statPill}>
        <Text category='c2' appearance='hint'>{label}</Text>
        <Text category='h5' style={styles.statValue}>
            {value}<Text category='c1' appearance='hint'> {unit}</Text>
        </Text>
    </Card>
);

export default function FoodDiary() {
    const [activeTab, setActiveTab] = useState('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [expandedMeals, setExpandedMeals] = useState([]);

    // Sample data
    const meals = [
        {
            id: 1, date: '2025-02-20', time: 'Breakfast',
            items: ['Omelette', 'Whole wheat bread'], calories: 300,
            nutrients: { protein: 20, carbs: 25, fats: 10 }
        },
        {
            id: 2, date: '2025-02-20', time: 'Lunch',
            items: ['Grilled chicken', 'Brown rice'], calories: 450,
            nutrients: { protein: 35, carbs: 40, fats: 15 }
        },
    ];

    const chartData = {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        datasets: [{
            data: [meals[0].calories, meals[1].calories]  //donc possiblement itérer
        }]
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

    const renderMealCard = (meal) => (

        <Card
            key={meal.id}
            style={[styles.mealCard, expandedMeals.includes(meal.id) && styles.expandedMealCard]}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleMealDetails(meal.id)}
            >
                <View style={styles.mealHeader}>
                    <View style={[styles.mealTypeIndicator,
                    { backgroundColor: getMealColor(meal.time) }]}
                    />
                    <Text category='s2' style={styles.mealTime}>{meal.time}</Text>
                    <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
                </View>

                {expandedMeals.includes(meal.id) && (
                    <View style={styles.mealDetails}>
                        <Text category='s2' style={styles.detailTitle}>Ingredients:</Text>
                        {meal.items.map((item, index) => (
                            <Text key={index} style={styles.detailItem}>• {item}</Text>
                        ))}

                        <View style={styles.nutritionGrid}>
                            <NutritionPill label="Protein" value={`${meal.nutrients.protein}g`} />
                            <NutritionPill label="Carbs" value={`${meal.nutrients.carbs}g`} />
                            <NutritionPill label="Fats" value={`${meal.nutrients.fats}g`} />
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        </Card>

    );

    return (
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...customTheme }}>
            <Layout style={styles.container}>
                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'calendar' && styles.activeTabButton
                        ]}
                        onPress={() => setActiveTab('calendar')}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === 'calendar' && styles.activeTabText
                        ]}>
                            Calendrier
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === 'stats' && styles.activeTabButton
                        ]}
                        onPress={() => setActiveTab('stats')}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === 'stats' && styles.activeTabText
                        ]}>
                            Statistiques
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'calendar' ? (
                    <ScrollView contentContainerStyle={styles.calendarContainer}>
                        {/* Calendar Header */}
                        <View style={styles.calendarHeader}>
                            <Button
                                appearance='ghost'
                                accessoryLeft={ChevronLeft}
                                onPress={() => handleMonthChange(-1)}
                                style={styles.navButton}
                            />
                            <Text category='h6' style={styles.monthHeader}>
                                {getMonthName(currentDate)} {currentDate.getFullYear()}
                            </Text>
                            <Button
                                appearance='ghost'
                                accessoryLeft={ChevronRight}
                                onPress={() => handleMonthChange(1)}
                                style={styles.navButton}
                            />
                        </View>

                        {/* Calendar Grid */}
                        <View style={styles.calendarGrid}>
                            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
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
                        <Text category='h6' style={styles.sectionHeader}>
                            Repas du {formatDate(selectedDate)}
                        </Text>
                        {meals.filter(meal => meal.date === formatDate(selectedDate)).map(renderMealCard)}
                    </ScrollView>
                ) : (
                    <ScrollView contentContainerStyle={styles.statsContainer}>
                        <Card style={styles.chartCard}>
                            <Text category='h6' style={styles.chartTitle}>Calories Hebdomadaires</Text>
                            <BarChart
                                data={chartData}
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
                        </Card>

                        <View style={styles.statsGrid}>
                            <StatPill label="Moy. Journalière" value="1980" unit="kcal" />
                            <StatPill label="Eau consommée" value="1.8" unit="L" />
                            <StatPill label="Protéines" value="82" unit="g" />
                            <StatPill label="Activité" value="45" unit="min" />
                        </View>
                    </ScrollView>
                )}
            </Layout>
        </ApplicationProvider>
    );
}

// Styles
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