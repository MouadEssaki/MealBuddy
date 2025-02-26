// AddIngredient.js
import React, { useEffect, useState, useContext } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    Modal,
} from 'react-native';
import { useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalContext } from './GlobalState'; // Import the global context
import { useLocalSearchParams } from 'expo-router';

const COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
    white: '#FFFFFF',
    background: '#F9F9F9'
};

export default function AddIngredient() {
    const { isAiMode } = useLocalSearchParams() as { isAiMode: boolean };
    const [research, setResearch] = useState('');
    const [meal, setMeal] = useState([]);
    const [filteredMeal, setFilteredMeal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [advancedResearchLoading, setAdvancedResearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stillNotThere, setStillNotThere] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null); // Track selected ingredient
    const [grams, setGrams] = useState(''); // Track grams input

    const navigation = useNavigation();
    const { ingredients, setRecipeIngredients } = useContext(GlobalContext); // Access global state

    const apiPoint = "https://mealbuddy-smartgroup2025.azurewebsites.net/api/foods";
    const apiAdvancedResearch = "https://mealbuddy-smartgroup2025.azurewebsites.net/api/utils/search_food";

    const fetchCurrentMealInDb = async () => {
        try {
            const response = await fetch(apiPoint);
            const data = await response.json();
            const mealData = Array.isArray(data) ? data : JSON.parse(data.results || '[]');
            setMeal(mealData);
            setFilteredMeal(mealData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to load meals');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdvancedResearch = async () => {
        try {
            setAdvancedResearchLoading(true);
            const settings = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ search_term: research }),
            };
            const response = await fetch(apiAdvancedResearch, settings);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log('Advanced Research Response:', data);

            let results = [];
            if (data.results) {
                const cleanedResults = data.results.replace(/'/g, '"');
                try {
                    results = JSON.parse(cleanedResults);
                    if (!Array.isArray(results)) {
                        results = [results];
                    }
                } catch (parseError) {
                    console.error('Failed to parse results:', parseError);
                    results = [];
                }
            }

            setFilteredMeal(results);
            setMeal([...meal, ...results]);
            setStillNotThere(true);
            if (results.length === 0) {
                setError('No results found');
            } else {
                setError(null);
            }
        } catch (error) {
            console.error('Failed to fetch advanced data:', error);
            setError('Failed to fetch data');
        } finally {
            setAdvancedResearchLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentMealInDb();
    }, []);

    useEffect(() => {
        setStillNotThere(false);
        if (research === '') {
            setFilteredMeal(meal);
        } else {
            const filtered = meal.filter((item) =>
                item.name.toLowerCase().includes(research.toLowerCase())
            );
            setFilteredMeal(filtered);
        }
    }, [research]);

    // Function to handle selecting an ingredient and opening the grams input modal
    const handleSelectIngredient = (ingredient) => {

        setSelectedIngredient(ingredient);
        setResearch(''); // Reset search input
        setGrams(''); // Reset grams input

    };


    // Function to confirm the ingredient with the specified grams
    const handleConfirmIngredient = () => {
        if (!selectedIngredient || !grams) return;

        const gramsValue = parseFloat(grams);
        if (isNaN(gramsValue) || gramsValue <= 0) return; // Ensure valid input

        const { nutritional_info, quantity_measurement } = selectedIngredient;
        const defaultGrams = parseFloat(quantity_measurement); // Extract the default grams

        if (isNaN(defaultGrams) || defaultGrams <= 0) return; // Ensure valid default grams

        // Calculate macros based on custom grams input
        const scaleFactor = gramsValue / defaultGrams;

        const ingredientWithGrams = {
            name: selectedIngredient.name,
            grams: gramsValue, // Custom grams input
            calories: (nutritional_info.calories * scaleFactor).toFixed(2),
            proteins: (nutritional_info.proteins * scaleFactor).toFixed(2),
            carbs: (nutritional_info.carbs * scaleFactor).toFixed(2),
            fats: (nutritional_info.fats * scaleFactor).toFixed(2),
            fiber: (nutritional_info.fiber * scaleFactor).toFixed(2),
            sugars: (nutritional_info.sugars * scaleFactor).toFixed(2),
            sodium: (nutritional_info.sodium * scaleFactor).toFixed(2),
            cholesterol: (nutritional_info.cholesterol * scaleFactor).toFixed(2),
        };

        setRecipeIngredients([...ingredients, ingredientWithGrams]); // Update global state
        setSelectedIngredient(null); // Close the modal
        setGrams(''); // Reset grams input
    };


    // Function to handle going back
    const handleGoBack = () => {
        navigation.goBack(); // Navigate back to the previous screen
    };

    const handleDelete = (index: number) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(index, 1);
        setRecipeIngredients(newIngredients);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.vert, '#1a7a4e']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Add ingredient to your recipe</Text>
                <Text style={styles.headerSubtitle}>Search our database or add custom items</Text>
            </LinearGradient>

            <View style={styles.searchContainer}>
                <Icon name="search" size={24} color={COLORS.vert} style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search for meals..."
                    placeholderTextColor="#999"
                    value={research}
                    onChangeText={setResearch}
                    editable={!advancedResearchLoading}
                />
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <LottieView
                            source={require('../../assets/searchAnim.json')}
                            autoPlay
                            loop
                            style={styles.loadingAnimation}
                        />
                        <Text style={styles.loadingText}>Searching our database...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Icon name="error-outline" size={40} color={COLORS.orange} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) :
                    research === '' ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>Start Searching</Text>
                            <Text style={styles.emptyText}>Type the name of the meal you want to add</Text>
                            <LottieView
                                source={require('../../assets/searchAnim.json')}
                                autoPlay
                                loop
                                style={styles.loadingAnimation}
                            />
                        </View>
                    ) :

                        filteredMeal.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyTitle}>No Results Found</Text>
                                <Text style={styles.emptyText}>Try adjusting your search or use advanced search</Text>
                            </View>
                        ) : (
                            filteredMeal.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.mealCard}
                                    onPress={() => handleSelectIngredient(item)}
                                >
                                    <View style={styles.mealHeader}>
                                        <Icon name="restaurant" size={24} color={COLORS.vert} />
                                        <Text style={styles.mealName}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}

                {/* Modal for selecting grams */}
                <Modal
                    visible={!!selectedIngredient}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Enter Quantity (in grams)</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="e.g., 100"
                                keyboardType="numeric"
                                placeholderTextColor={COLORS.vert}
                                value={grams}
                                onChangeText={setGrams}
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setSelectedIngredient(null)}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonConfirm]}
                                    onPress={handleConfirmIngredient}
                                >
                                    <Text style={styles.modalButtonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {(filteredMeal.length === 0 && !loading) && (
                    <TouchableOpacity
                        style={styles.advancedButton}
                        onPress={fetchAdvancedResearch}
                        disabled={advancedResearchLoading}
                    >
                        <LinearGradient
                            colors={[COLORS.orange, '#f05a1a']}
                            style={styles.gradientButton}
                        >
                            {advancedResearchLoading ? (
                                <ActivityIndicator size="small" color={COLORS.white} />
                            ) : (
                                <>
                                    <Icon name="tune" size={20} color={COLORS.white} />
                                    <Text style={styles.buttonText}>Advanced Search</Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {stillNotThere && (
                    <View style={styles.retryContainer}>
                        <Text style={styles.retryText}>Still not finding what you need?</Text>
                        <TouchableOpacity
                            style={styles.advancedButton}
                            onPress={fetchAdvancedResearch}
                            disabled={advancedResearchLoading}
                        >
                            <LinearGradient
                                colors={[COLORS.vert, '#1a7a4e']}
                                style={styles.gradientButton}
                            >
                                {advancedResearchLoading ? (
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                ) : (
                                    <>
                                        <Icon name="refresh" size={20} color={COLORS.white} />
                                        <Text style={styles.buttonText}>Search Again</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}

                {ingredients.length > 0 && (
                    <View style={styles.recipeContainer}>
                        <Text style={styles.recipeTitle}>Current Recipe Ingredients:</Text>
                        {ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientItem}>
                                <View style={styles.ingredientTextContainer}>
                                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                                    <Text style={styles.ingredientDetails}>
                                        {ingredient.grams}g
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => handleDelete(index)}
                                    style={styles.deleteButton}
                                    disabled={loading} // Disable delete button while loading
                                >
                                    <MaterialCommunityIcons name="trash-can-outline" size={20} color={COLORS.orange} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Add a "Done" button to go back */}
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={handleGoBack}
                >
                    <LinearGradient
                        colors={[COLORS.vert, '#1a7a4e']}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Done</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingVertical: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: COLORS.beige,
        opacity: 0.9,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 15,
        marginHorizontal: 24,
        marginTop: -20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.vert,
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingAnimation: {
        width: 200,
        height: 200,
    },
    loadingText: {
        fontSize: 16,
        color: COLORS.vert,
        marginTop: 20,
    },
    errorContainer: {
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.orange,
        marginTop: 20,
        textAlign: 'center',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: COLORS.vert,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    mealCard: {
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    mealHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    mealName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.vert,
        marginLeft: 12,
        flex: 1,
    },
    advancedButton: {
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 30,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 30,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
    retryContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    retryText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    recipeContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    recipeTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.vert,
        marginBottom: 15,
    },
    ingredientItem: {
        flexDirection: 'row',           // Arrange children in a row
        alignItems: 'center',           // Center items vertically
        paddingVertical: 8,             // Add some vertical padding
        borderBottomWidth: 1,           // Optional: separator line
        borderBottomColor: '#eee',      // Optional: light separator
    },
    ingredientTextContainer: {
        flex: 1,                        // Take up remaining space
        flexDirection: 'column',        // Stack name and details vertically
    },
    deleteButton: {
        marginLeft: 'auto',             // Push button to the right
        padding: 5,                     // Add touchable area
    },
    ingredientName: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.vert,
    },
    ingredientDetails: {
        fontSize: 14,
        color: '#666',
    },
    doneButton: {
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 30,
        marginBottom: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.vert,
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: COLORS.orange,
    },
    modalButtonConfirm: {
        backgroundColor: COLORS.vert,
    },
    modalButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});