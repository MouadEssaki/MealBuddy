import React, { useState } from 'react';
import { ScrollView, SafeAreaView, StyleSheet, TextInput, Text, TouchableOpacity, Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';

export default function CreateRecipe() {
    const [title, setTitle] = useState('');
    const { recipeIngredients: rawRecipeIngredients } = useLocalSearchParams() as { recipeIngredients?: string[] };
    const [steps, setSteps] = useState<string[]>([]);
    const [stepInput, setStepInput] = useState('');
    const navigation = useNavigation();

    // Ensure recipeIngredients is always an array
    const recipeIngredients = Array.isArray(rawRecipeIngredients) ? rawRecipeIngredients : [];

    const handleAddStep = () => {
        if (stepInput.trim()) {
            setSteps([...steps, stepInput.trim()]);
            setStepInput('');
        }
    };

    const COLORS = {
        vertClaire: '#68AA64',
        vert: '#105F3B',
        orange: '#E36820',
        beige: '#FFF4E4',
        white: '#FFFFFF',
        background: '#F9F9F9'
    };

    const handleCreateRecipe = async () => {
        const userId = "67b9086fcf91584cc206f897"; // Replace with the actual user ID

        const recipeData = {
            title,
            recipeIngredients,
            steps,
            user_id: userId,
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.header}>Create Recipe</Text>

                <Text>Recipe Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Recipe Title'
                    value={title}
                    onChangeText={setTitle}
                />

                <Text>Ingredients</Text>
                {recipeIngredients.map((ingredient, index) => (
                    <Text key={index} style={styles.listItem}>{ingredient}</Text>
                ))}
                <TouchableOpacity
                    style={styles.AddButton}
                    onPress={() => navigation.navigate('AddIngredient')}
                >
                    <LinearGradient
                        colors={[COLORS.orange, '#f05a1a']}
                        style={styles.gradientButton}
                    >
                        <Icon name="plus" size={24} color={COLORS.white} />
                        <Text style={styles.buttonText}>Add Ingredient</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Text>Steps</Text>
                {steps.map((step, index) => (
                    <Text key={index} style={styles.listItem}>{step}</Text>
                ))}
                <TextInput
                    style={styles.input}
                    placeholder='Add a step'
                    value={stepInput}
                    onChangeText={setStepInput}
                />

                <TouchableOpacity
                    style={styles.AddButton}
                    onPress={handleAddStep} 
                >
                    <LinearGradient
                        colors={[COLORS.orange, '#f05a1a']}
                        style={styles.gradientButton}
                    >
                        <Icon name="plus" size={24} color={COLORS.white} />
                        <Text style={styles.buttonText}>Add Step</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCreateRecipe} style={styles.button}>
                    <Text style={styles.buttonText}>Create Recipe</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 20,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    listItem: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        marginTop: 15,
        borderRadius: 20,
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        elevation: 4,
    },
    AddButton: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
        shadowColor: '#E36820',
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
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});