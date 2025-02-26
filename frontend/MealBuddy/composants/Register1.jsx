import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FOOD_COLORS = {
    vertClaire: "#68AA64",
    vert: "#105F3B",
    orange: "#E36820",
    beige: "#FFF4E4",
};

const Register1 = ({ onNext, formData, setFormData, onBackToLogin }) => {
    const [username, setUsername] = useState(formData.username || '');
    const [email, setEmail] = useState(formData.email || '');
    const [password, setPassword] = useState(formData.password || '');
    const [confirmPassword, setConfirmPassword] = useState(formData.confirmPassword || '');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        // At least 8 characters
        return password.length >= 8;
    };

    const handleNext = () => {
        // Reset error
        setError('');

        // Check if all fields are filled
        if (!username || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Validate password strength
        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // If all validations pass, proceed to next step
        setFormData({ ...formData, username, email, password });
        onNext({ username, email, password });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons
                    name="chef-hat"
                    size={48}
                    color={FOOD_COLORS.vert}
                    style={styles.logo}
                />

                <Text style={styles.title}>Start Your Nutrition Journey</Text>

                <View style={styles.card}>
                    {/* Username Input */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="account"
                            size={20}
                            color={FOOD_COLORS.vertClaire}
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor={FOOD_COLORS.vertClaire}
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="email"
                            size={20}
                            color={FOOD_COLORS.vertClaire}
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={FOOD_COLORS.vertClaire}
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="lock"
                            size={20}
                            color={FOOD_COLORS.vertClaire}
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={FOOD_COLORS.vertClaire}
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            secureTextEntry
                        />
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons
                            name="lock-reset"
                            size={20}
                            color={FOOD_COLORS.vertClaire}
                            style={styles.icon}
                        />
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor={FOOD_COLORS.vertClaire}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.input}
                            secureTextEntry
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                    >
                        <Text style={styles.buttonText}>Next Step →</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBackToLogin}
                    >
                        <Text style={styles.backButtonText}>← Back to Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: FOOD_COLORS.beige,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: FOOD_COLORS.vertClaire,
        marginBottom: 24,
        paddingBottom: 8,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: FOOD_COLORS.vert,
        includeFontPadding: false,
    },
    nextButton: {
        backgroundColor: FOOD_COLORS.orange,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: FOOD_COLORS.orange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    errorText: {
        color: FOOD_COLORS.orange,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '500',
    },
    backButton: {
        marginTop: 16,
        paddingVertical: 12,
        alignItems: 'center',
    },
    backButtonText: {
        color: FOOD_COLORS.vert,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Register1;
