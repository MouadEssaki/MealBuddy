import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AddMeal() {
    const { mealType, date } = useLocalSearchParams();
    const [research, setResearch] = useState('');
    const [meal, setMeal] = useState([]);
    const [filteredMeal, setFilteredMeal] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiPoint = "https://mealbuddy-smartgroup2025.azurewebsites.net/api/foods";

    const fetchCurrentMealInDb = async () => {
        try {
            const response = await fetch(apiPoint);
            const data = await response.json();
            setMeal(data);
            setFilteredMeal(data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentMealInDb();
    }, []);

    useEffect(() => {
        if (research === '') {
            setFilteredMeal(meal);
        } else {
            setFilteredMeal(meal.filter((item) => item.name.toLowerCase().startsWith(research.toLowerCase())));
        }
    }, [research]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search a meal:</Text>
            <View style={styles.form}>
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#A9A9A9" style={styles.searchIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Type to do a basic Research..."
                        value={research}
                        onChangeText={setResearch}
                        placeholderTextColor={'#A9A9A9'}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => console.log('Advanced Research pressed')}>
                    <Icon name="tune" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Advanced Research</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.outputDataView}>
                {loading ? (
                    <ActivityIndicator size="large" color="#68AA64" />
                ) : filteredMeal.length === 0 ? (
                    <Text style={styles.noResultsText}>
                        Oops! It looks like we don’t have it in our database. Try Advanced Research.
                    </Text>
                ) : (
                    filteredMeal.map((item, index) => (
                        <View key={index} style={styles.outputData}>
                            <Icon name="restaurant" size={24} color="#68AA64" style={styles.mealIcon} />
                            <View style={styles.textContainer}>
                                <Text style={styles.foodNameText}>{item.name}</Text>
                                <View style={styles.nutritionalInfo}>
                                    <Icon name="local-fire-department" size={20} color="#FF5733" />
                                    <Text>{item.nutritional_info.calories} cal</Text>
                                    <Icon name="scale" size={20} color="#3498db" />
                                    <Text>{item.quantity_measurement}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 25,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#68AA64',
        fontWeight: '600',
    },
    form: {
        width: '80%',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'white',
        paddingLeft: 10,
    },
    searchIcon: {
        marginRight: 5,
    },
    input: {
        flex: 1,
        padding: 10,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#68AA64',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
    },
    outputDataView: {
        width: '90%',
        marginTop: 20,
    },
    outputData: {
        marginBottom: 10,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'flex-start', // Aligns items to the top
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1.00,
        elevation: 1,
    },
    textContainer: {
        flex: 1, // Allows text container to take available space
        flexDirection: 'column', // Stacks food name and nutritional info
    },
    foodNameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#105F3B',
        flexWrap: 'wrap', // Allows text to wrap to new line
    },
    nutritionalInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 5, // Adds spacing between food name and nutritional info
    },
    mealIcon: {
        marginRight: 10,
    },
    noResultsText: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    
});
