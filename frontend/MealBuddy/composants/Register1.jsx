import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const Register1 = ({ onNext, formData, setFormData }) => {
    const [username, setUsername] = useState(formData.username || '');
    const [email, setEmail] = useState(formData.email || '');
    const [password, setPassword] = useState(formData.password || '');
    const [confirmPassword, setConfirmPassword] = useState(formData.confirmPassword || '');

    const handleNext = () => {
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }
        setFormData({ ...formData, username, email, password });
        onNext({ username, email, password });
    };

    return (
        <View style={styles.container}>
            <Text>Inscription - Étape 1</Text>
            <TextInput 
                placeholder="Nom d'utilisateur" 
                value={username} 
                onChangeText={setUsername} 
                style={styles.input} 
            />
            <TextInput 
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail} 
                style={styles.input} 
            />
            <TextInput 
                placeholder="Mot de passe" 
                secureTextEntry 
                value={password} 
                onChangeText={setPassword} 
                style={styles.input} 
            />
            <TextInput 
                placeholder="Confirmer le mot de passe" 
                secureTextEntry 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                style={styles.input} 
            />
            <Button title="Suivant" onPress={handleNext} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 }
});

export default Register1;
