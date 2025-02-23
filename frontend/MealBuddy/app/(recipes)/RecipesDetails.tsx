import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import styles from "./Style"; // Adjust the path if needed

export default function RecipesDetails() {
    const { recipe } = useLocalSearchParams() as { recipe: string };
    const [recipeData, setRecipeData] = useState({}); // Initialize as an empty object

    useEffect(() => {
        fetch(`https://mealbuddy-smartgroup2025.azurewebsites.net/api/recipes/${recipe}`)
            .then(response => response.json())
            .then(data => {
                setRecipeData(data);
            });
    }, [recipe]); // Add recipe as a dependency

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {recipeData.title && (
                    <Image
                        source={{
                            uri: `https://image.pollinations.ai/prompt/${encodeURIComponent(recipeData.title)}`,
                        }}
                        style={{
                            width: '100%',
                            height: 200,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.card}>
                    <Text style={styles.title}>{recipeData.title || 'Recipe Title'}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Ingredients:</Text>
                    {recipeData.ingredients?.length > 0 ? (
                        recipeData.ingredients.map((ingredient, index) => (
                            <Text key={index} style={styles.ingredient}>
                                {`${ingredient.quantity || ''} ${ingredient.quantity_description || ''} of ${ingredient.name || ''}`}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.noData}>No ingredients available.</Text>
                    )}
                </View>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Instructions:</Text>
                    {recipeData.steps?.length > 0 ? (
                        recipeData.steps.map((step, index) => (
                            <Text key={index} style={styles.instruction}>
                                 {step}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.noData}>No instructions available.</Text>
                    )}
                </View>
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Nutritional Information:</Text>
                    <Text style={styles.nutritionalInfo}>{`Calories: ${recipeData.nutritional_info?.calories || 'N/A'}`}</Text>
                    <Text style={styles.nutritionalInfo}>{`Carbs: ${recipeData.nutritional_info?.carbs || 'N/A'}g`}</Text>
                    <Text style={styles.nutritionalInfo}>{`Fats: ${recipeData.nutritional_info?.fats || 'N/A'}g`}</Text>
                    <Text style={styles.nutritionalInfo}>{`Protein: ${recipeData.nutritional_info?.proteins || 'N/A'}g`}</Text>
                    <Text style={styles.nutritionalInfo}>{`Fiber: ${recipeData.nutritional_info?.fiber || 'N/A'}g`}</Text>
                    <Text style={styles.nutritionalInfo}>{`Sugars: ${recipeData.nutritional_info?.sugars || 'N/A'}g`}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
