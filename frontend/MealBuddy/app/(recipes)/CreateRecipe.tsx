import React, { useState } from 'react';
import { ScrollView, SafeAreaView, StyleSheet, TextInput, Text, TouchableOpacity, Alert } from 'react-native';

export default function CreateRecipe() {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');

    const handleCreateRecipe = async () => {
        const userId = "67b9086fcf91584cc206f897"; // Replace with the actual user ID
        
        const mandatoryIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
        const recipeData = {
            title,
            ingredients: mandatoryIngredients,
            steps: steps.split(',').map(step => step.trim()),
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
                setIngredients('');
                setSteps('');
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
                <TextInput
                    style={styles.input}
                    placeholder='Ingredients (comma separated)'
                    value={ingredients}
                    onChangeText={setIngredients}
                />

                <Text>Steps</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Steps (comma separated)'
                    value={steps}
                    onChangeText={setSteps}
                />

                <TouchableOpacity 
                    onPress={handleCreateRecipe} 
                    style={styles.button}
                >
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
        marginBottom: 15,
    },
    button: {
        marginBottom: 10,
        borderColor: 'transparent',
        borderRadius: 20,
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
