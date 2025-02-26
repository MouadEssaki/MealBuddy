import React, { useState, useContext } from 'react';
import {
    ScrollView,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    Alert,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalContext } from './GlobalState'; // Import the global context
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
    white: '#FFFFFF',
    background: '#F9F9F9',
};

export default function CreateRecipe() {
    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState<string[]>([]);
    const [stepInput, setStepInput] = useState('');
    const navigation = useNavigation();

    // Access the global state for ingredients
    const { ingredients, setRecipeIngredients } = useContext(GlobalContext);

    // Calculate total macros based on ingredients
    const calculateMacros = () => {
        const totals = {
            proteins: 0,
            carbs: 0,
            fats: 0,
            fiber: 0,
        };

        ingredients.forEach((ingredient) => {
            const grams = ingredient.grams || 0;
            const ratio = grams / 100; // Convert to per 100g basis
            totals.proteins += (ingredient.proteins || 0) * ratio;
            totals.carbs += (ingredient.carbs || 0) * ratio;
            totals.fats += (ingredient.fats || 0) * ratio;
            totals.fiber += (ingredient.fiber || 0) * ratio;
        });

        return totals;
    };

    const macros = calculateMacros();

    const handleAddStep = () => {
        if (stepInput.trim()) {
            setSteps([...steps, stepInput.trim()]);
            setStepInput('');
        }
    };

    const handleCreateRecipe = async () => {
        const userId = '67b9086fcf91584cc206f897'; // Replace with actual user ID

        const recipeData = {
            title,
            ingredients,
            steps,
            user_id: userId,
            nutritional_info: macros, // Include calculated macros in the recipe data
        };

        try {
            const response = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeData),
            });

            if (response.ok) {
                const result = await response.json();
                Alert.alert('Success', `Recipe created with ID: ${result._id}`);
                setTitle('');
                setSteps([]);
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Failed to create recipe');
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    };

    const handleDelete = (index: number) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setRecipeIngredients(newIngredients);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Title Card */}
                <View style={styles.titleCard}>
                    <Text style={styles.title}>Create Recipe</Text>
                </View>

                {/* Recipe Title Input */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Icon name="format-title" size={24} color={COLORS.vert} />
                        <Text style={styles.sectionTitle}>Recipe Title</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter recipe title"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Ingredients Card */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Icon name="format-list-checks" size={24} color={COLORS.vert} />
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                    </View>
                    {ingredients.length > 0 ? (
                        ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientItem}>
                                <View style={styles.bulletPoint} />
                                <Text style={styles.ingredientText}>
                                    {ingredient.name} - {ingredient.grams}g
                                </Text>
                                <TouchableOpacity
                                    onPress={() => handleDelete(index)} // Changed to index-based deletion
                                    style={styles.deleteButton}
                                >
                                    <Icon name="trash-can-outline" size={20} color={COLORS.orange} />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noData}>No ingredients added yet</Text>
                    )}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddIngredient')}
                    >
                        <LinearGradient
                            colors={[COLORS.orange, '#f05a1a']}
                            style={styles.gradientButton}
                        >
                            <Icon name="plus" size={20} color={COLORS.white} />
                            <Text style={styles.buttonText}>Add Ingredient</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Steps Card */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Icon name="chef-hat" size={24} color={COLORS.vert} />
                        <Text style={styles.sectionTitle}>Steps</Text>
                    </View>
                    {steps.length > 0 ? (
                        steps.map((step, index) => (
                            <View key={index} style={styles.stepContainer}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.instructionText}>{step}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noData}>No steps added yet</Text>
                    )}
                    <TextInput
                        style={styles.input}
                        placeholder="Add a step"
                        value={stepInput}
                        onChangeText={setStepInput}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddStep}>
                        <LinearGradient
                            colors={[COLORS.orange, '#f05a1a']}
                            style={styles.gradientButton}
                        >
                            <Icon name="plus" size={20} color={COLORS.white} />
                            <Text style={styles.buttonText}>Add Step</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Nutrition Card */}
                <View style={[styles.card, { marginBottom: 30 }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="nutrition" size={24} color={COLORS.vert} />
                        <Text style={styles.sectionTitle}>Estimated Macros</Text>
                    </View>
                    <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {macros.proteins.toFixed(1)}
                            </Text>
                            <Text style={styles.nutritionLabel}>Protein (g)</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {macros.carbs.toFixed(1)}
                            </Text>
                            <Text style={styles.nutritionLabel}>Carbs (g)</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {macros.fats.toFixed(1)}
                            </Text>
                            <Text style={styles.nutritionLabel}>Fat (g)</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {macros.fiber.toFixed(1)}
                            </Text>
                            <Text style={styles.nutritionLabel}>Fiber (g)</Text>
                        </View>
                    </View>
                </View>

                {/* Create Recipe Button */}
                <TouchableOpacity style={styles.createButton} onPress={handleCreateRecipe}>
                    <Text style={styles.createButtonText}>Create Recipe</Text>
                </TouchableOpacity>


            </ScrollView>
        </SafeAreaView>
    );
}

// Styles remain the same
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.beige,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    titleCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.vert,
        textAlign: 'center',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.vert,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
        color: COLORS.vert,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.orange,
        marginTop: 8,
    },
    ingredientText: {
        fontSize: 16,
        color: COLORS.vert,
        flex: 1,
        lineHeight: 24,
    },
    stepContainer: {
        flexDirection: 'row',
        gap: 16,
        paddingVertical: 12,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.orange,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        color: COLORS.white,
        fontWeight: '700',
    },
    instructionText: {
        fontSize: 16,
        color: COLORS.vert,
        flex: 1,
        lineHeight: 24,
    },
    noData: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginVertical: 12,
    },
    addButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    createButton: {
        backgroundColor: COLORS.vert,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 20,
    },
    createButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
    },
    nutritionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 12,
    },
    nutritionItem: {
        width: '48%',
        backgroundColor: COLORS.vertClaire,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    nutritionValue: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 4,
    },
    nutritionLabel: {
        fontSize: 14,
        color: COLORS.white,
        textAlign: 'center',
    },
});