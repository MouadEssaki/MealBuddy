import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RadioButton, Checkbox } from 'react-native-paper';


//TODO traduire en anglais mdr
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
        <SafeAreaView style={styles.container}>
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
        </SafeAreaView>
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
    const [otherPreference, setOtherPreference] = useState('');

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
    
     const handlePreferenceChange = (preference) => {
        setPreferences(prev => 
            prev.includes(preference) 
            ? prev.filter(item => item !== preference) 
            : [...prev, preference]
        );
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.heading}>Inscription</Text>
                <View style={styles.form}>
                    <Text style={styles.label}>Nom d'utilisateur</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Entrez votre nom d'utilisateur"
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Entrez votre email"
                        keyboardType="email-address"
                    />
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Entrez votre mot de passe"
                        secureTextEntry
                    />
                    <Text style={styles.label}>Confirmer le mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirmez votre mot de passe"
                        secureTextEntry
                    />
                    <Text style={styles.label}>Sélectionnez un avatar</Text>
                    <Button title="Choisir un avatar" onPress={handleAvatarSelect} />
                    {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
                    <Text style={styles.label}>Quel est votre objectif ?</Text>
                    <RadioButton.Group
                        onValueChange={value => setGoal(value)}
                        value={goal}
                    >
                        <RadioButton.Item label="Perte de poids" value="Perte de poids" />
                        <RadioButton.Item label="Prise de poids" value="Prise de poids" />
                        <RadioButton.Item label="Maintien de poids" value="Maintien de poids" />
                    </RadioButton.Group>
                    <Text style={styles.label}>Sélectionnez vos préférences alimentaires</Text>
                    <View style={styles.checkboxContainer}>
                        <Checkbox.Item
                            label="Végétarien"
                            status={preferences.includes('Végétarien') ? 'checked' : 'unchecked'}
                            onPress={() => handlePreferenceChange('Végétarien')}
                        />
                        <Checkbox.Item
                            label="Allergie aux arachides"
                            status={preferences.includes('Allergie aux arachides') ? 'checked' : 'unchecked'}
                            onPress={() => handlePreferenceChange('Allergie aux arachides')}
                        />
                        <Checkbox.Item
                            label="Vegan"
                            status={preferences.includes('Vegan') ? 'checked' : 'unchecked'}
                            onPress={() => handlePreferenceChange('Vegan')}
                        />
                        <Checkbox.Item
                            label="Autres"
                            status={preferences.includes('Autres') ? 'checked' : 'unchecked'}
                            onPress={() => handlePreferenceChange('Autres')}
                        />
                        {preferences.includes('Autres') && (
                            <TextInput
                                style={styles.input}
                                value={otherPreference}
                                onChangeText={setOtherPreference}
                                placeholder="Précisez votre préférence"
                            />
                        )}
                    </View>
                    <Button title="S'inscrire" onPress={handleRegister} />
                    {message && <Text style={styles.message}>{message}</Text>}
                </View>
            </View>
        </ScrollView>
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
