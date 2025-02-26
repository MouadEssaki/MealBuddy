import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FOOD_COLORS = {
    primary: "#105F3B",
    secondary: "#E36820",
    background: "#FFF4E4",
    surface: "#FFFFFF",
    accent: "#68AA64",
};

const Login = ({ onAuthSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (autoEmail = null, autoPassword = null) => {
        console.log("Login button clicked");

        const loginEmail = autoEmail || email;
        const loginPassword = autoPassword || password;

        console.log("Email:", loginEmail);
        console.log("Password:", loginPassword);

        if (!loginEmail || !loginPassword) {
            setMessage("Email and password cannot be blank.");
            return;
        }

        setLoading(true);

        try {
            const requestBody = JSON.stringify({
                email: loginEmail,
                password: loginPassword,
            });

            console.log("Request body:", requestBody);

            const response = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
            });

            const data = await response.json();
            console.log("Server response:", data);

            if (response.ok) {
                if (data.token && data.user) {
                    try {
                        await AsyncStorage.setItem('rememberedEmail', loginEmail);
                        await AsyncStorage.setItem('rememberedPassword', loginPassword);
                        console.log("Credentials saved to AsyncStorage");
                    } catch (error) {
                        console.error("AsyncStorage save error:", error);
                        setMessage("Failed to save credentials.");
                    }
                    console.log("Login successful:", data);
                    handleAuthSuccess(data.token, data.user._id); // Call the updated function here
                } else {
                    setMessage('Invalid token or user data received.');
                }
            } else {
                setMessage(`Login failed : ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // Updated handleAuthSuccess function to store the token
    const handleAuthSuccess = async (token, id) => {
        try {
            await AsyncStorage.setItem('authToken', token); // Store the token
            console.log(id)
            await AsyncStorage.setItem('currentUser', id);
            console.log('Authentication successful: Token stored in AsyncStorage');
            onAuthSuccess(token); // Proceed with the original callback
        } catch (error) {
            console.error('Error storing token in AsyncStorage:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons name="food-apple" size={48} color={FOOD_COLORS.primary} style={styles.logo} />
                <Text style={styles.greeting}>Welcome Back Foodie!</Text>
                <Text style={styles.subtitle}>Track your nutrition journey</Text>

                <View style={styles.card}>
                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="leaf" size={20} color={FOOD_COLORS.accent} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={FOOD_COLORS.accent}
                            value={email}
                            onChangeText={text => setEmail(text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="lock" size={20} color={FOOD_COLORS.accent} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={FOOD_COLORS.accent}
                            value={password}
                            onChangeText={text => setPassword(text)}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => handleLogin()}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={FOOD_COLORS.surface} />
                        ) : (
                            <Text style={styles.buttonText}>Nourish My Journey</Text>
                        )}
                    </TouchableOpacity>

                    {message ? <Text style={styles.error}>{message}</Text> : null}
                </View>

                <TouchableOpacity style={styles.switchContainer} onPress={onSwitchToRegister}>
                    <Text style={styles.switchText}>
                        New to MealBuddy? <Text style={styles.switchHighlight}>Start Your Nutrition Diary</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: FOOD_COLORS.background },
    content: { flex: 1, justifyContent: 'center', padding: 24 },
    logo: { alignSelf: 'center', marginBottom: 16 },
    greeting: { fontSize: 26, fontWeight: '700', color: FOOD_COLORS.primary, textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: FOOD_COLORS.accent, textAlign: 'center', marginBottom: 32 },
    card: { backgroundColor: FOOD_COLORS.surface, borderRadius: 20, padding: 24, shadowColor: FOOD_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: FOOD_COLORS.accent, marginBottom: 24, paddingBottom: 8 },
    input: { flex: 1, marginLeft: 12, fontSize: 16, color: FOOD_COLORS.primary, includeFontPadding: false },
    loginButton: { backgroundColor: FOOD_COLORS.secondary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24, shadowColor: FOOD_COLORS.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    buttonText: { color: FOOD_COLORS.surface, fontSize: 16, fontWeight: '600', letterSpacing: 0.5 },
    error: { color: FOOD_COLORS.secondary, textAlign: 'center', marginTop: 16, fontWeight: '500' },
    switchContainer: { marginTop: 24 },
    switchText: { textAlign: 'center', color: FOOD_COLORS.primary, fontSize: 14 },
    switchHighlight: { color: FOOD_COLORS.secondary, fontWeight: '600', textDecorationLine: 'underline' },
});

export default Login;