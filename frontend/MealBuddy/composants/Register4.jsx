import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FOOD_COLORS = {
    vertClaire: "#68AA64",
    vert: "#105F3B",
    orange: "#E36820",
    beige: "#FFF4E4",
};

const PREFERENCE_OPTIONS = [
    { id: 'noix', title: "Allergie aux noix", icon: "peanut-off" },
    { id: 'vegetarien', title: "Végétarien", icon: "leaf" },
    { id: 'sansGluten', title: "Sans gluten", icon: "barley-off" },
    { id: 'rien', title: "Aucune préférence particulière", icon: "check-circle" },
];

const Register4 = ({ onAuthSuccess, formData, setStep, onBack, onBackToLogin }) => {
    const [preferences, setPreferences] = useState([]);
    const [customPreference, setCustomPreference] = useState('');
    const [addedCustomPreferences, setAddedCustomPreferences] = useState([]);

    const isSubmitDisabled = useMemo(() => preferences.length === 0, [preferences]);

    const handlePreferenceToggle = (preference) => {
        if (preference === 'rien') {
            setPreferences(['rien']);
            setAddedCustomPreferences([]);
        } else {
            setPreferences((prev) => {
                if (prev.includes('rien')) {
                    return [preference];
                }
                return prev.includes(preference)
                    ? prev.filter((p) => p !== preference)
                    : [...prev.filter(p => p !== 'rien'), preference];
            });
        }
    };

    const handleAddCustomPreference = () => {
        if (customPreference && !preferences.includes(customPreference) && !addedCustomPreferences.includes(customPreference)) {
            setPreferences(prev => [...prev.filter(p => p !== 'rien'), customPreference]);
            setAddedCustomPreferences(prev => [...prev, customPreference]);
            setCustomPreference('');
        }
    };

    const handleRemoveCustomPreference = (prefToRemove) => {
        setPreferences(prev => prev.filter(p => p !== prefToRemove));
        setAddedCustomPreferences(prev => prev.filter(p => p !== prefToRemove));
    };

    const [isLoading, setIsLoading] = useState(false);


    const handleAuthSuccess = async (token, id) => {
        try {
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('currentUser', id.toString()); // Ensure id is a string
            console.log('Authentication successful: Token stored in AsyncStorage');
            onAuthSuccess(token);
        } catch (error) {
            console.error('Error storing token in AsyncStorage:', error);
        }
    };


    const handleSubmit = async () => {
        if (isLoading) return; // Prevent multiple clicks
        setIsLoading(true);

        try {
            // Register the user
            const registerResponse = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, preferences }),
            });
            const registerData = await registerResponse.json();
            console.log('Registration response:', registerData);

            if (registerResponse.ok) {
                // Auto-login after registration
                const loginBody = JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                });
                console.log('Login request body:', loginBody);

                const loginResponse = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: loginBody,
                });
                const loginData = await loginResponse.json();
                console.log('Login response:', loginData);

                if (loginResponse.ok) {
                    if (loginData.token && loginData.user) {
                        try {
                            await AsyncStorage.setItem('rememberedEmail', formData.email);
                            await AsyncStorage.setItem('rememberedPassword', formData.password);
                            console.log('Credentials saved to AsyncStorage');
                        } catch (error) {
                            console.error('AsyncStorage save error:', error);
                            alert('Failed to save credentials.');
                        }
                        console.log('Login successful:', loginData);
                        await handleAuthSuccess(loginData.token, loginData.user._id); // Changed from .id to ._id
                    } else {
                        console.error('No token or user in login response');
                        alert('Registration succeeded, but login failed: No token or user data received.');
                    }
                } else {
                    console.error('Login failed:', loginData.error);
                    alert(`Login failed: ${loginData.error || 'Unknown error'}`);
                }
            } else {
                console.error('Registration failed:', registerData.error);
                alert(`Registration failed: ${registerData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('A connection error occurred. Please check your network.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <MaterialCommunityIcons
                    name="food-apple"
                    size={48}
                    color={FOOD_COLORS.vert}
                    style={styles.logo}
                />
                <Text style={styles.title}>Vos préférences alimentaires</Text>
                <Text style={styles.subtitle}>Personnalisez votre expérience culinaire</Text>
                <View style={styles.card}>
                    {PREFERENCE_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.preferenceButton,
                                preferences.includes(option.id) && styles.selectedPreference
                            ]}
                            onPress={() => handlePreferenceToggle(option.id)}
                        >
                            <MaterialCommunityIcons
                                name={option.icon}
                                size={24}
                                color={preferences.includes(option.id) ? FOOD_COLORS.orange : FOOD_COLORS.vert}
                            />
                            <Text style={[
                                styles.preferenceText,
                                preferences.includes(option.id) && styles.selectedPreferenceText
                            ]}>{option.title}</Text>
                        </TouchableOpacity>
                    ))}
                    {addedCustomPreferences.map((pref, index) => (
                        <View key={`custom-${index}`} style={styles.customPreferenceDisplay}>
                            <Text style={styles.customPreferenceText}>{pref}</Text>
                            <TouchableOpacity
                                onPress={() => handleRemoveCustomPreference(pref)}
                                style={styles.removeCustomButton}
                            >
                                <MaterialCommunityIcons
                                    name="close"
                                    size={16}
                                    color={FOOD_COLORS.orange}
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={styles.customPreferenceContainer}>
                        <TextInput
                            style={styles.customPreferenceInput}
                            value={customPreference}
                            onChangeText={setCustomPreference}
                            placeholder="Ajouter une préférence personnalisée"
                            placeholderTextColor={FOOD_COLORS.vertClaire}
                        />
                        <TouchableOpacity
                            style={styles.addCustomButton}
                            onPress={handleAddCustomPreference}
                        >
                            <MaterialCommunityIcons name="plus" size={24} color={FOOD_COLORS.vert} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={isLoading}
                        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    >
                        <Text style={styles.submitButtonText}>
                            {isLoading ? 'Chargement...' : 'Terminer l\'inscription'}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity style={styles.backButton} onPress={onBack}>
                            <Text style={styles.backButtonText}>← Retour</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginButton} onPress={onBackToLogin}>
                            <Text style={styles.loginButtonText}>Retour à la connexion</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: FOOD_COLORS.beige,
    },
    content: {
        padding: 24,
    },
    logo: {
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: FOOD_COLORS.vert,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: FOOD_COLORS.vertClaire,
        textAlign: 'center',
        marginBottom: 32,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        shadowColor: FOOD_COLORS.vert,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    preferenceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: FOOD_COLORS.beige,
    },
    selectedPreference: {
        backgroundColor: '#FFF8F2',
        borderColor: FOOD_COLORS.orange,
        borderWidth: 1,
    },
    preferenceText: {
        marginLeft: 12,
        fontSize: 16,
        color: FOOD_COLORS.vert,
    },
    selectedPreferenceText: {
        color: FOOD_COLORS.orange,
        fontWeight: '600',
    },
    customPreferenceContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    customPreferenceInput: {
        flex: 1,
        height: 48,
        borderWidth: 1,
        borderColor: FOOD_COLORS.vertClaire,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: FOOD_COLORS.vert,
    },
    addCustomButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: FOOD_COLORS.beige,
        borderRadius: 8,
        marginLeft: 8,
    },
    submitButton: {
        backgroundColor: FOOD_COLORS.orange,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    submitButtonDisabled: {
        backgroundColor: FOOD_COLORS.vertClaire,
        opacity: 0.5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButtonTextDisabled: {
        color: FOOD_COLORS.beige,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: FOOD_COLORS.vert,
        fontSize: 14,
    },
    loginButton: {
        padding: 8,
    },
    loginButtonText: {
        color: FOOD_COLORS.orange,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    customPreferenceDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E2F0CB', // Light green background
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    customPreferenceText: {
        color: FOOD_COLORS.vert,
        fontSize: 16,
    },
    removeCustomButton: {
        padding: 4,
    },
});

export default Register4;
