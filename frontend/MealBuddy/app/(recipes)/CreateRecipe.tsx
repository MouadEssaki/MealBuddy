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
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalContext } from './GlobalState';
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
    const [isAiMode, setIsAiMode] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [customTheme, setCustomTheme] = useState('');
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const { ingredients, setRecipeIngredients } = useContext(GlobalContext);

    const themes = ['Italian', 'Mexican', 'Vegan', 'Low-Carb', 'Quick & Easy', 'Custom'];

    const calculateMacros = () => {
        const totals = {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            fiber: 0,
        };

        ingredients.forEach((ingredient) => {
            // Simply add the absolute nutritional values without scaling
            totals.calories += Number(ingredient.calories || 0);
            totals.proteins += Number(ingredient.proteins || 0);
            totals.carbs += Number(ingredient.carbs || 0);
            totals.fats += Number(ingredient.fats || 0);
            totals.fiber += Number(ingredient.fiber || 0);
        });

        // Round to 1 decimal place for consistency
        return {
            calories: Number(totals.calories.toFixed(1)),
            proteins: Number(totals.proteins.toFixed(1)),
            carbs: Number(totals.carbs.toFixed(1)),
            fats: Number(totals.fats.toFixed(1)),
            fiber: Number(totals.fiber.toFixed(1)),
        };
    };

    const macros = calculateMacros();

    const handleAddStep = () => {
        if (stepInput.trim()) {
            setSteps([...steps, stepInput.trim()]);
            setStepInput('');
        } else {
            Alert.alert('Error', 'Step cannot be empty');
        }
    };

    const handleCreateRecipe = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Recipe title cannot be empty');
            return;
        }
        if (ingredients.length === 0) {
            Alert.alert('Error', 'Please add at least one ingredient');
            return;
        }
        if (steps.length === 0) {
            Alert.alert('Error', 'Please add at least one step');
            return;
        }

        setLoading(true);
        const userId = await AsyncStorage.getItem('currentUser');

        const recipeData = {
            title,
            ingredients,
            steps,
            user_id: userId,
            nutritional_info: macros,
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
                console.log('Recipe created:', result);
                navigation.navigate('RecipesDetails', { recipe: result._id });
                setLoading(false);
                setTitle('');
                setSteps([]);
                setRecipeIngredients([]);
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Failed to create recipe');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error creating recipe:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    const GenerateRecipe = async () => {
        if (ingredients.length === 0) {
            Alert.alert('Error', 'Please add at least one ingredient to generate a recipe');
            return;
        }
        if (!selectedTheme) {
            Alert.alert('Error', 'Please select a theme');
            return;
        }
        if (selectedTheme === 'Custom' && !customTheme.trim()) {
            Alert.alert('Error', 'Please enter a custom theme');
            return;
        }

        setLoading(true);
        const userId = await AsyncStorage.getItem('currentUser');
        const mandatoryIngredients = ingredients.map(ingredient => ingredient.name);
        const themeToSend = selectedTheme === 'Custom' ? customTheme.trim() : selectedTheme;

        try {
            const response = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/utils/generate_recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    mandatory_ingredients: mandatoryIngredients,
                    theme: themeToSend,
                }),
            });

            const rawResponse = await response.text();
            console.log('Raw Response:', rawResponse);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = JSON.parse(rawResponse);
            navigation.navigate('RecipesDetails', { recipe: result.recipe_id });
            setLoading(false);
            setTitle(result.recipe_title || 'Generated Recipe');
            setSteps(result.steps || []);
            setRecipeIngredients(result.ingredients || []);
            if (selectedTheme === 'Custom') setCustomTheme('');
        } catch (error) {
            console.error('Error generating recipe:', error);
            Alert.alert('Error', 'Failed to generate recipe. Please check your connection and try again.');
            setLoading(false);
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
                <LinearGradient
                    colors={[COLORS.vert, '#1a7a4e']}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Create Recipe</Text>
                </LinearGradient>

                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={() => setIsAiMode(!isAiMode)}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={isAiMode ? [COLORS.vertClaire, COLORS.vert] : [COLORS.vert, COLORS.vertClaire]}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Icon
                            name={isAiMode ? 'robot-off' : 'robot'}
                            size={24}
                            color={COLORS.white}
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}>{isAiMode ? 'Exit AI Mode' : 'Use AI'}</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {!isAiMode && (
                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Icon name="format-title" size={24} color={COLORS.vert} />
                            <Text style={styles.sectionTitle}>Recipe Title</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter recipe title"
                            placeholderTextColor={COLORS.vert}
                            value={title}
                            onChangeText={setTitle}
                            editable={!loading}
                        />
                    </View>
                )}

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
                                    disabled={loading}
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
                        onPress={() => navigation.navigate('AddIngredient', { isAiMode })}
                        disabled={loading}
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
                                disabled={loading}
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
                        {selectedTheme === 'Custom' && (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your custom theme"
                                placeholderTextColor={COLORS.vert}
                                value={customTheme}
                                onChangeText={setCustomTheme}
                                editable={!loading}
                            />
                        )}
                    </View>
                )}

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
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newSteps = [...steps];
                                            newSteps.splice(index, 1);
                                            setSteps(newSteps);
                                        }}
                                        style={styles.deleteButton}
                                        disabled={loading}
                                    >
                                        <Icon name="trash-can-outline" size={20} color={COLORS.orange} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noData}>No steps added yet</Text>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Add a step"
                            placeholderTextColor={COLORS.vert}
                            value={stepInput}
                            onChangeText={setStepInput}
                            editable={!loading}
                        />
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddStep}
                            disabled={loading}
                        >
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

                {!isAiMode && (
                    <View style={[styles.card, { marginBottom: 30 }]}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name="nutrition" size={24} color={COLORS.vert} />
                            <Text style={styles.sectionTitle}>Estimated Macros</Text>

                        </View>
                        <View style={styles.metaItem}>
                                <MaterialCommunityIcons name="fire" size={20} color={COLORS.vert} />
                                <Text style={styles.metaText}>{macros.calories || '0'} kcal</Text>
                            </View>
                        <View style={styles.nutritionGrid}>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>
                                    {macros.proteins}
                                </Text>
                                <Text style={styles.nutritionLabel}>Protein (g)</Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>
                                    {macros.carbs}
                                </Text>
                                <Text style={styles.nutritionLabel}>Carbs (g)</Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>
                                    {macros.fats}
                                </Text>
                                <Text style={styles.nutritionLabel}>Fat (g)</Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>
                                    {macros.fiber}
                                </Text>
                                <Text style={styles.nutritionLabel}>Fiber (g)</Text>
                            </View>

                        </View>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={isAiMode ? GenerateRecipe : handleCreateRecipe}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.createButtonText}>
                            {isAiMode ? 'Generate' : 'Create Recipe'}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

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
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 16,
        color: COLORS.vert,
        fontWeight: '600',
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
        alignItems: 'center',
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
        borderRadius: 25,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 10,
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
    deleteButton: {
        padding: 5,
    },
});