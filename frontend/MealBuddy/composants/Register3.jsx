import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Register3 = ({ onNext, formData, setFormData }) => {
    const [goal, setGoal] = useState(formData.goal || '');

    const handleSelectGoal = (selectedGoal) => {
        setGoal(selectedGoal);
        setFormData({ ...formData, goal: selectedGoal });
    };

    return (
        <View style={styles.container}>
            <Text>Inscription - Étape 3 : Choisir votre objectif</Text>
            <Button title="Perte de poids" onPress={() => handleSelectGoal('Perte de poids')} />
            <Button title="Maintien de poids" onPress={() => handleSelectGoal('Maintien de poids')} />
            <Button title="Gain de poids" onPress={() => handleSelectGoal('Gain de poids')} />
            <Button title="Suivant" onPress={onNext} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 }
});

export default Register3;