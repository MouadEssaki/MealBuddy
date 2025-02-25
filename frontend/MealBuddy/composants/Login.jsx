// Login.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ onAuthSuccess, toggleToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.token) {
                    await AsyncStorage.setItem('authToken', data.token);
                    await AsyncStorage.setItem('currentUser', data.user._id);
                    onAuthSuccess(data.token);
                }
            } else {
                setMessage(data.error || 'An error occurred.');
            }
        } catch (error) {
            console.log(error);
            setMessage('An error occurred.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.heading}>Login</Text>
                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry
                    />
                    <Button title="Login" onPress={handleLogin} />
                    {message && <Text style={styles.message}>{message}</Text>}
                </View>
                <Text style={styles.toggleText}>
                    Don't have an account?{' '}
                    <Text style={styles.toggleLink} onPress={toggleToRegister}>
                        Sign up
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f5f5f5' },
    heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    form: { marginBottom: 16 },
    label: { fontSize: 16, marginBottom: 8 },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    message: { color: 'red', textAlign: 'center', marginTop: 10 },
    toggleText: { textAlign: 'center', color: '#555' },
    toggleLink: { color: '#007bff', fontWeight: 'bold' },
});

export default Login;
