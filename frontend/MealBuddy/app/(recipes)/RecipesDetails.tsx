import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
    white: '#FFFFFF',
};

export default function RecipesDetails() {
    const { recipe } = useLocalSearchParams() as { recipe: string };
    const [recipeData, setRecipeData] = useState({});

    useEffect(() => {
        fetch(`https://mealbuddy-smartgroup2025.azurewebsites.net/api/recipes/${recipe}`)
            .then(response => response.json())
            .then(data => setRecipeData(data));
    }, [recipe]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Recipe Image */}
                {recipeData.title && (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: `https://image.pollinations.ai/prompt/${encodeURIComponent(recipeData.title)}` }}
                            style={styles.recipeImage}
                            resizeMode="cover"
                        />
                        <View style={styles.imageOverlay} />
                    </View>
                )}

                {/* Title Card */}
                <View style={styles.titleCard}>
                    <Text style={styles.title}>{recipeData.title || 'Recipe Title'}</Text>
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.vert} />
                            <Text style={styles.metaText}>30 mins</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <MaterialCommunityIcons name="fire" size={20} color={COLORS.vert} />
                            <Text style={styles.metaText}>{recipeData.nutritional_info?.calories || '0'} kcal</Text>
                        </View>
                    </View>
                </View>

                {/* Ingredients Card */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="format-list-checks" size={24} color={COLORS.vert} />
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                    </View>
                    {recipeData.ingredients?.length > 0 ? (
                        recipeData.ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientItem}>
                                <View style={styles.bulletPoint} />
                                <Text style={styles.ingredientText}>
                                    {`${ingredient.quantity || ''} ${ingredient.quantity_description || ''} ${ingredient.name || ''}`}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noData}>No ingredients available</Text>
                    )}
                </View>

                {/* Instructions Card */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="chef-hat" size={24} color={COLORS.vert} />
                        <Text style={styles.sectionTitle}>Instructions</Text>
                    </View>
                    {recipeData.steps?.length > 0 ? (
                        recipeData.steps.map((step, index) => (
                            <View key={index} style={styles.stepContainer}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.instructionText}>{step}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noData}>No instructions available</Text>
                    )}
                </View>

                {/* Nutrition Card */}
                <View style={[styles.card, { marginBottom: 30 }]}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="nutrition" size={24} color={COLORS.vert} />
                        <Text style={styles.sectionTitle}>Nutrition Facts</Text>
                    </View>
                    <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {parseFloat(recipeData.nutritional_info?.proteins?.toFixed(1)) || '0'}
                            </Text>
                            <Text style={styles.nutritionLabel}>Protein (g)</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {parseFloat(recipeData.nutritional_info?.carbs?.toFixed(1)) || '0'}
                            </Text>
                            <Text style={styles.nutritionLabel}>Carbs (g)</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {parseFloat(recipeData.nutritional_info?.fats?.toFixed(1)) || '0'}
                            </Text>
                            <Text style={styles.nutritionLabel}>Fat (g)</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionValue}>
                                {parseFloat(recipeData.nutritional_info?.fiber?.toFixed(1)) || '0'}
                            </Text>
                            <Text style={styles.nutritionLabel}>Fiber (g)</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.beige,
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    imageContainer: {
        height: 280,
        borderRadius: 20,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    recipeImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    titleCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 16,
        marginTop: -60,
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
        marginBottom: 12,
        textAlign: 'center',
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
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
    noData: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginVertical: 12,
    },
});