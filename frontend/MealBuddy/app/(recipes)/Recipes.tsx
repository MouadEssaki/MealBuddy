import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    Image,
    Pressable,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
    white: '#FFFFFF',
    background: '#F9F9F9',
};

export default function RecipesScreen() {
    const [recipesData, setRecipesData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const navigation = useNavigation();

    // Fetch current user ID from AsyncStorage
    useEffect(() => {
        const getUserId = async () => {
            const userId = await AsyncStorage.getItem('currentUser');
            setCurrentUserId(userId);
        };
        getUserId();
    }, []);

    // Fetch recipes initially
    useEffect(() => {
        fetchRecipes();
    }, []);

    // Filter recipes based on search query
    useEffect(() => {
        setFilteredRecipes(
            recipesData.filter(recipe =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, recipesData]);

    const handleRecipePress = (recipeId: string) => {
        navigation.navigate('RecipesDetails', { recipe: recipeId });
    };

    const fetchRecipes = () => {
        fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/recipes')
            .then(response => response.json())
            .then(data => setRecipesData(data))
            .catch(error => console.error('Error fetching recipes:', error));
    };

    useFocusEffect(useCallback(() => { fetchRecipes(); }, []));

    const handleDeleteRecipe = async (recipeId: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this recipe?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(
                                `https://mealbuddy-smartgroup2025.azurewebsites.net/api/recipes/${recipeId}`,
                                {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );

                            if (response.ok) {
                                // Remove the deleted recipe from the state
                                setRecipesData(recipesData.filter(recipe => recipe._id !== recipeId));
                                Alert.alert('Success', 'Recipe deleted successfully');
                            } else {
                                const errorData = await response.json();
                                Alert.alert('Error', errorData.error || 'Failed to delete recipe');
                            }
                        } catch (error) {
                            console.error('Error deleting recipe:', error);
                            Alert.alert('Error', 'An unexpected error occurred');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <LinearGradient
                    colors={[COLORS.vert, '#1a7a4e']}
                    style={styles.header}
                >
                    <Text style={styles.headerTitle}>Discover Recipes</Text>

                    <View style={styles.searchContainer}>
                        <Icon name="magnify" size={24} color="#999" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search recipes..."
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </LinearGradient>

                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Create Recipe Button */}
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => navigation.navigate('CreateRecipe')}
                    >
                        <LinearGradient
                            colors={[COLORS.orange, '#f05a1a']}
                            style={styles.gradientButton}
                        >
                            <Icon name="plus" size={24} color={COLORS.white} />
                            <Text style={styles.buttonText}>Create Recipe</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Recipes Grid */}
                    <View style={styles.recipesGrid}>
                        {(searchQuery.length === 0 ? recipesData : filteredRecipes).map(recipe => (
                            <Pressable
                                key={recipe._id}
                                style={styles.recipeCard}
                                onPress={() => handleRecipePress(recipe._id)}
                            >
                                <Image
                                    source={{ uri: `https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.title)}` }}
                                    style={styles.recipeImage}
                                />

                                <View style={styles.recipeContent}>
                                    <Text style={styles.recipeTitle}>{recipe.title}</Text>

                                    <View style={styles.metaContainer}>
                                        <View style={styles.metaItem}>
                                            <Icon name="clock-outline" size={14} color={COLORS.vert} />
                                            <Text style={styles.metaText}>{recipe.steps?.length || 0} steps</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Icon name="food-apple" size={14} color={COLORS.vert} />
                                            <Text style={styles.metaText}>{recipe.ingredients.length} ingredients</Text>
                                        </View>
                                    </View>

                                    <View style={styles.ratingContainer}>
                                        {[...Array(5)].map((_, i) => (
                                            <Icon
                                                key={i}
                                                name="star"
                                                size={16}
                                                color={i < 3 ? COLORS.orange : '#ddd'}
                                            />
                                        ))}
                                    </View>

                                    <View style={styles.buttonContainer}>
                                        <View style={styles.viewButton}>
                                            <Text style={styles.viewButtonText}>View Recipe</Text>
                                            <Icon name="arrow-right" size={16} color={COLORS.white} />
                                        </View>
                                        {/* Delete Button for User's Recipes */}
                                        {recipe.user_id === currentUserId && (
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => handleDeleteRecipe(recipe._id)}
                                            >
                                                <Icon name="trash-can-outline" size={20} color={COLORS.orange} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.vert,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 23,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 25,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 30,
        paddingHorizontal: 20,
        height: 56,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.vert,
        height: '100%',
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
    },
    createButton: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
        shadowColor: COLORS.orange,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 30,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 12,
    },
    recipesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    recipeCard: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    recipeImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    recipeContent: {
        padding: 20,
    },
    recipeTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.vert,
        marginBottom: 15,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 14,
        color: COLORS.vert,
        marginLeft: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.vert,
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    viewButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    deleteButton: {
        padding: 10,
    },
});