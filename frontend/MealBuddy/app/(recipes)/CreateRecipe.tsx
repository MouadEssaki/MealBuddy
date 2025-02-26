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
    FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalContext } from './GlobalState'; // Import the global context
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [isAiMode, setIsAiMode] = useState(false); // Toggle AI mode
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null); // Selected theme
    const navigation = useNavigation();

    // Access the global state for ingredients
    const { ingredients, setRecipeIngredients } = useContext(GlobalContext);

    // Themes for AI mode
    const themes = ['Italian', 'Mexican', 'Vegan', 'Low-Carb', 'Quick & Easy'];

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
            const ratio = grams / 100; 
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
        const userId = await AsyncStorage.getItem('currentUser');

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

    // Function to generate a recipe using AI
    const GenerateRecipe = async () => {
        const userId = await AsyncStorage.getItem('currentUser');
        const mandatoryIngredients = ingredients.map(ingredient => ingredient.name); // Extract ingredient names
        const theme = selectedTheme; // Use the selected theme

        if (!theme) {
            Alert.alert('Error', 'Please select a theme');
            return;
        }

        try {
            const response = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/generate_recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    mandatory_ingredients: mandatoryIngredients,
                    theme: theme,
                }),
            });

            // Log the raw response for debugging
            const rawResponse = await response.text();
            console.log('Raw Response:', rawResponse);

            // Check if the response is JSON
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the response as JSON
            const result = JSON.parse(rawResponse);

            Alert.alert('Success', 'Recipe generated successfully!');
            // Update the UI with the generated recipe details
            setTitle(result.recipe_title || 'Generated Recipe');
            setSteps(result.steps || []);
            setRecipeIngredients(result.ingredients || []);
        } catch (error) {
            console.error('Error generating recipe:', error);
            Alert.alert('Error', 'Failed to generate recipe. Please check the server and try again.');
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
                <LinearGradient
                    colors={[COLORS.vert, '#1a7a4e']}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Create Recipe</Text>
                </LinearGradient>

                {/* Use AI Button */}
                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={() => setIsAiMode(!isAiMode)} // Toggle AI mode
                >
                    <LinearGradient
                        colors={isAiMode ? [COLORS.vertClaire, COLORS.vert] : [COLORS.vert, COLORS.vertClaire]}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }} // Gradient starts from the top-left
                        end={{ x: 1, y: 1 }} // Gradient ends at the bottom-right
                    >
                        {/* Add an icon */}
                        <Icon
                            name={isAiMode ? 'robot-off' : 'robot'} // Use different icons for AI mode and normal mode
                            size={24} // Slightly larger icon
                            color={COLORS.white}
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}>{isAiMode ? 'Exit AI Mode' : 'Use AI'}</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Recipe Title Input */}
                {!isAiMode && (
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
                )}

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
                                    onPress={() => handleDelete(index)}
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

                {/* Theme Card (Visible only in AI mode) */}
                {isAiMode && (
                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Icon name="theme-light-dark" size={24} color={COLORS.vert} />
                            <Text style={styles.sectionTitle}>Choose a Theme</Text>
                        </View>
                        {themes.map((theme, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.themeButton,
                                    selectedTheme === theme && styles.selectedThemeButton,
                                ]}
                                onPress={() => setSelectedTheme(theme)}
                            >
                                <Text
                                    style={[
                                        styles.themeText,
                                        selectedTheme === theme && styles.selectedThemeText,
                                    ]}
                                >
                                    {theme}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Steps Card (Visible only in non-AI mode) */}
                {!isAiMode && (
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
                )}

                {/* Nutrition Card (Visible only in non-AI mode) */}
                {!isAiMode && (
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
                )}

                {/* Create Recipe / Generate Button */}
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={isAiMode ? GenerateRecipe : handleCreateRecipe}
                >
                    <Text style={styles.createButtonText}>
                        {isAiMode ? 'Generate' : 'Create Recipe'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles
const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 8,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    generateButton: {
        marginTop: 20,
        borderRadius: 25, // Rounded corners
        overflow: 'hidden', // Ensures the gradient doesn't overflow
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#000', // Shadow for depth
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5, // Adds shadow on Android
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15, // More padding for a larger button
        paddingHorizontal: 25, // More padding for a larger button
    },
    icon: {
        marginRight: 10, // Space between icon and text
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18, // Slightly larger text
        fontWeight: '700', // Bold text
        marginLeft: 10, // Space between icon and text
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
    themeButton: {
        backgroundColor: COLORS.beige,
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        alignItems: 'center',
    },
    selectedThemeButton: {
        backgroundColor: COLORS.orange,
    },
    themeText: {
        fontSize: 16,
        color: COLORS.vert,
    },
    selectedThemeText: {
        color: COLORS.white,
    },
});