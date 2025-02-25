import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SelectedMeal = () => {
    const { selectedMeal } = useLocalSearchParams();
    const mealObj = JSON.parse(selectedMeal);
    const [selectedServing, setSelectedServing] = useState<'default' | 'custom'>('default');
    const [customAmount, setCustomAmount] = useState('');
    const [calculatedNutrition, setCalculatedNutrition] = useState(mealObj.nutritional_info);
    const [servingMultiplier, setServingMultiplier] = useState(1);

    // Extract default amount and unit from quantity_measurement (e.g., "100g" or "250ml")
    const defaultAmount = parseFloat(mealObj.quantity_measurement.match(/\d+/)[0]);
    const defaultUnit = mealObj.quantity_measurement.match(/[a-zA-Z]+/)[0]; // Extracts "g", "ml", etc.

    useEffect(() => {
        if (selectedServing === 'custom' && customAmount) {
            const multiplier = parseFloat(customAmount) / defaultAmount;
            const newNutrition = Object.fromEntries(
                Object.entries(mealObj.nutritional_info).map(([key, value]) => [
                    key,
                    Number((Number(value) * multiplier).toFixed(1))
                ])
            );
            setCalculatedNutrition(newNutrition);
        } else if (selectedServing === 'default') {
            const newNutrition = Object.fromEntries(
                Object.entries(mealObj.nutritional_info).map(([key, value]) => [
                    key,
                    Number((Number(value) * servingMultiplier).toFixed(1))
                ])
            );
            setCalculatedNutrition(newNutrition);
        }
    }, [customAmount, selectedServing, servingMultiplier]);


    const handleAddToDay = () => {
        console.log('Adding to day:', {
            ...mealObj,
            nutritional_info: calculatedNutrition,
            actual_amount: selectedServing === 'custom' ? customAmount : defaultAmount,
            unit: defaultUnit
        });
    };

    // Group nutrients for better visual hierarchy
    const primaryNutrients = ['proteins', 'carbs', 'fats'];
    const secondaryNutrients = Object.keys(calculatedNutrition)
        .filter(key => !['calories', ...primaryNutrients].includes(key));

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>{mealObj.name}</Text>
                <Text style={styles.category}>
                    <MaterialCommunityIcons name="fruit-cherries" size={16} color="#FFF4E4" />
                    {mealObj.category}
                </Text>
            </View>

            {/* Serving Size Selector */}
            <View style={styles.servingSelector}>
                <TouchableOpacity
                    style={[styles.servingButton, selectedServing === 'default' && styles.activeServing]}
                    onPress={() => setSelectedServing('default')}
                >
                    <Text style={styles.servingButtonText}>Default Serving</Text>
                    <Text style={styles.servingDetails}>{mealObj.quantity_description}</Text>
                    <Text style={styles.servingDetails}>{defaultAmount * servingMultiplier}{defaultUnit}</Text>

                    {/* Serving Stepper */}
                    <View style={styles.stepperContainer}>
                        <TouchableOpacity onPress={() => setServingMultiplier(prev => Math.max(1, prev - 1))}>
                            <MaterialCommunityIcons name="minus-circle" size={24} color="#E36820" />
                        </TouchableOpacity>

                        <Text style={styles.stepperValue}>{servingMultiplier}x</Text>

                        <TouchableOpacity onPress={() => setServingMultiplier(prev => prev + 1)}>
                            <MaterialCommunityIcons name="plus-circle" size={24} color="#E36820" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.servingButton, selectedServing === 'custom' && styles.activeServing]}
                    onPress={() => setSelectedServing('custom')}
                >
                    <Text style={styles.servingButtonText}>Custom Serving</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder={`Enter ${defaultUnit} (default ${defaultAmount}${defaultUnit})`}
                            value={customAmount}
                            onChangeText={setCustomAmount}
                            placeholderTextColor="#999"
                        />
                        <Text style={styles.unitLabel}>{defaultUnit}</Text>
                    </View>
                </TouchableOpacity>
            </View>


            {/* Calorie Highlight */}
            <View style={styles.calorieCard}>
                <Text style={styles.calorieValue}>{calculatedNutrition.calories}</Text>
                <Text style={styles.calorieLabel}>CALORIES</Text>
                <MaterialCommunityIcons
                    name="fire"
                    size={32}
                    color="#FFF4E4"
                    style={styles.calorieIcon}
                />
            </View>

            {/* Primary Macronutrients */}
            <View style={styles.macroContainer}>
                {primaryNutrients.map((nutrient) => (
                    <View key={nutrient} style={styles.macroCard}>
                        <Text style={styles.macroValue}>
                            {calculatedNutrition[nutrient]}
                            <Text style={styles.macroUnit}>g</Text>
                        </Text>
                        <Text style={styles.macroLabel}>
                            {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Other Nutrients */}
            <View style={styles.nutritionSection}>
                <Text style={styles.sectionTitle}>Other Nutrients</Text>
                <View style={styles.nutritionGrid}>
                    {secondaryNutrients.map((key) => (
                        <View key={key} style={styles.nutrientCard}>
                            <Text style={styles.nutrientValue}>
                                {calculatedNutrition[key]}
                                <Text style={styles.nutrientUnit}>
                                    {['sodium', 'cholesterol'].includes(key) ? 'mg' : 'g'}
                                </Text>
                            </Text>
                            <Text style={styles.nutrientLabel}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Add to Day Button */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddToDay}>
                <Text style={styles.addButtonText}>Add to Day</Text>
                <MaterialCommunityIcons name="plus-circle" size={24} color="#FFF4E4" />
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF4E4',
    },
    header: {
        backgroundColor: '#105F3B',
        padding: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF4E4',
        marginBottom: 8,
        textAlign: 'center',
    },
    category: {
        fontSize: 18,
        color: '#FFF4E4',
        textAlign: 'center',
        opacity: 0.9,
    },
    servingSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        gap: 15,
        marginBottom: 10,
    },
    servingButton: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#FFE5C2',
    },
    activeServing: {
        borderColor: '#FF8C00',
        backgroundColor: '#FFFFFF',
    },
    servingButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#105F3B',
        marginBottom: 8,
    },
    servingDetails: {
        fontSize: 14,
        color: '#68AA64',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#E36820',
        paddingVertical: 8,
        marginRight: 8,
        color: '#105F3B',
    },
    unitLabel: {
        color: '#68AA64',
        fontWeight: '600',
    },
    calorieCard: {
        backgroundColor: '#E36820',
        borderRadius: 100,
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,


    },
    calorieValue: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFF4E4',
        color: '#FFF4E4',
    },
    calorieLabel: {
        fontSize: 16,
        color: '#FFF4E4',
        letterSpacing: 1,
        marginTop: 4,

    },
    calorieIcon: {
        position: 'absolute',
        bottom: -20,
        backgroundColor: '#105F3B',
        borderRadius: 20,
        padding: 8,

    },
    macroContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 24,
        marginTop: 22,
    },
    macroCard: {
        backgroundColor: '#105F3B',
        borderRadius: 16,
        padding: 16,
        width: '30%',
        alignItems: 'center',
    },
    macroValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFF4E4',
        marginBottom: 4,
    },
    macroUnit: {
        fontSize: 12,
        fontWeight: '400',
    },
    macroLabel: {
        fontSize: 14,
        color: '#68AA64',
        textAlign: 'center',
    },
    nutritionSection: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 22,
        color: '#105F3B',
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    nutritionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    nutrientCard: {
        backgroundColor: '#68AA64',
        borderRadius: 16,
        padding: 16,
        width: '45%',
        margin: 8,
        aspectRatio: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nutrientValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF4E4',
        marginBottom: 4,
    },
    nutrientUnit: {
        fontSize: 12,
        fontWeight: '400',
        color: 'rgba(255, 244, 228, 0.8)',
    },
    nutrientLabel: {
        fontSize: 14,
        color: '#FFF4E4',
        textAlign: 'center',
        opacity: 0.9,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#E36820',
        borderRadius: 25,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        margin: 20,
        marginTop: 0,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    addButtonText: {
        color: '#FFF4E4',
        fontSize: 18,
        fontWeight: '700',
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 10,
    },
    stepperValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#105F3B',
    },

});

export default SelectedMeal;