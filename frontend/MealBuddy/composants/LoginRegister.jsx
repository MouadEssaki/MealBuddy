import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const LoginForm = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
                setMessage(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            console.log(error);
            setMessage('Une erreur est survenue.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Connexion</Text>
            <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Entrez votre email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    required
                />
                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Entrez votre mot de passe"
                    secureTextEntry
                    required
                />
                <Button title="Se connecter" onPress={handleLogin} />
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        </View>
    );
};

const RegisterForm = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [goal, setGoal] = useState('');
    const [preferences, setPreferences] = useState([]);
    const [message, setMessage] = useState('');

    const handleAvatarSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission denied to access gallery!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setAvatar(result.uri);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            const response = await fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password, goal, preferences, avatar }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.token) {
                    await AsyncStorage.setItem('authToken', data.token);
                    await AsyncStorage.setItem('currentUser', data.user._id);
                    onAuthSuccess(data.token); // Redirige après l'inscription
                }
            } else {
                setMessage(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            console.log(error);
            setMessage('Une erreur est survenue.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Inscription</Text>
            <View style={styles.form}>
                <Text style={styles.label}>Nom d'utilisateur</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Entrez votre nom d'utilisateur"
                    required
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Entrez votre email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    required
                />
                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Entrez votre mot de passe"
                    secureTextEntry
                    required
                />
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirmez votre mot de passe"
                    secureTextEntry
                    required
                />
                
                <Text style={styles.label}>Sélectionnez un avatar</Text>
                <Button title="Choisir un avatar" onPress={handleAvatarSelect} />
                {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
                
                <Text style={styles.label}>Quel est votre objectif ?</Text>
                <Button title="Perte de poids" onPress={() => setGoal('Perte de poids')} />
                <Button title="Prise de poids" onPress={() => setGoal('Prise de poids')} />
                <Button title="Maintien de poids" onPress={() => setGoal('Maintien de poids')} />
                
                <Text style={styles.label}>Sélectionnez vos préférences alimentaires</Text>
                <TouchableOpacity onPress={() => setPreferences(prev => prev.includes('Végétarien') ? prev.filter(item => item !== 'Végétarien') : [...prev, 'Végétarien'])}>
                    <Text style={styles.buttonText}>Végétarien</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPreferences(prev => prev.includes('Allergie aux arachides') ? prev.filter(item => item !== 'Allergie aux arachides') : [...prev, 'Allergie aux arachides'])}>
                    <Text style={styles.buttonText}>Allergie aux arachides</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPreferences(prev => prev.includes('Vegan') ? prev.filter(item => item !== 'Vegan') : [...prev, 'Vegan'])}>
                    <Text style={styles.buttonText}>Vegan</Text>
                </TouchableOpacity>

                <Button title="S'inscrire" onPress={handleRegister} />
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        </View>
    );
};

const LoginRegister = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <View style={styles.container}>
            {isLogin ? (
                <LoginForm onAuthSuccess={onAuthSuccess} />
            ) : (
                <RegisterForm onAuthSuccess={onAuthSuccess} />
            )}

            <Text style={styles.toggleText}>
                {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
                <Text
                    style={styles.toggleLink}
                    onPress={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "S'inscrire" : 'Se connecter'}
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    form: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: '#007bff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    toggleText: {
        textAlign: 'center',
        color: '#555',
    },
    toggleLink: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 10,
    },
    message: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default LoginRegister;
