import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    Image
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
    white: '#FFFFFF',
    background: '#F9F9F9'
};


export default function AddMeal() {
    const [research, setResearch] = useState('');
    const [meal, setMeal] = useState([]);
    const [filteredMeal, setFilteredMeal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [advancedResearchLoading, setAdvancedResearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stillNotThere, setStillNotThere] = useState(false);
    const navigation = useNavigation();

    const apiPoint = "https://mealbuddy-smartgroup2025.azurewebsites.net/api/foods";
    const apiAdvancedResearch = "https://mealbuddy-smartgroup2025.azurewebsites.net/api/utils/search_food";

    const fetchCurrentMealInDb = async () => {
        try {
            const response = await fetch(apiPoint);
            const data = await response.json();
            // Assuming the API returns { results: "[...]" } or a direct array
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

            // Handle the results string
            let results = [];
            if (data.results) {
                // Replace single quotes with double quotes to fix invalid JSON
                const cleanedResults = data.results.replace(/'/g, '"');
                try {
                    results = JSON.parse(cleanedResults);
                    if (!Array.isArray(results)) {
                        // If parsed result isn’t an array, wrap it in an array
                        results = [results];
                    }
                } catch (parseError) {
                    console.error('Failed to parse results:', parseError);
                    results = []; // Fallback to empty array on parse failure
                }
            }

            setFilteredMeal(results);
            //add it to the meal array
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

    const handleMealDetails = (meal) => {
        navigation.navigate('SelectedMeal', { selectedMeal: JSON.stringify(meal) });
    };


    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.vert, '#1a7a4e']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Add New Meal</Text>
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
                                {/* <Image
                            source={require('../../assets/empty-search.png')}
                            style={styles.emptyImage}
                        /> */}
                                <Text style={styles.emptyTitle}>No Results Found</Text>
                                <Text style={styles.emptyText}>Try adjusting your search or use advanced search</Text>
                            </View>
                        ) : (
                            filteredMeal.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.mealCard}
                                    onPress={() => handleMealDetails(item)}
                                >
                                    <View style={styles.mealHeader}>
                                        <Icon name="restaurant" size={24} color={COLORS.vert} />
                                        <Text style={styles.mealName}>{item.name}</Text>
                                    </View>

                                    <View style={styles.nutritionInfo}>
                                        <View style={styles.nutritionItem}>
                                            <Icon name="local-fire-department" size={18} color={COLORS.orange} />
                                            <Text style={styles.nutritionText}>{item.nutritional_info.calories} cal</Text>
                                        </View>
                                        <View style={styles.nutritionItem}>
                                            <Icon name="scale" size={18} color={COLORS.vert} />
                                            <Text style={styles.nutritionText}>{item.quantity_measurement}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}

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
    nutritionInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nutritionItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nutritionText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
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
});