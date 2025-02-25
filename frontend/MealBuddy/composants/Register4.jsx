import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Register4 = ({ onAuthSuccess, formData, setStep }) => {
    const [preferences, setPreferences] = useState([]);

    const handlePreferenceToggle = (preference) => {
        setPreferences((prev) =>
            prev.includes(preference)
                ? prev.filter((p) => p !== preference)
                : [...prev, preference]
        );
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, preferences }),
            });
            const data = await response.json();
            if (response.ok) {
                onAuthSuccess(data.token); // Pass the token to onAuthSuccess
                setStep('login'); // Change the step to login
            } else {
                alert(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Inscription - Étape 4 : Choisir vos préférences</Text>
            <Button title="Allergie aux noix" onPress={() => handlePreferenceToggle('Allergie aux noix')} />
            <Button title="Végétarien" onPress={() => handlePreferenceToggle('Végétarien')} />
            <Button title="Sans gluten" onPress={() => handlePreferenceToggle('Sans gluten')} />
            <Button title="Envoyer" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 }
});

export default Register4;
