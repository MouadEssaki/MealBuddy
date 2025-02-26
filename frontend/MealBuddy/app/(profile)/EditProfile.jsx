import React, { useState, useEffect } from "react";
import { View, Image, TextInput, TouchableOpacity, StyleSheet, Text, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

export default function EditProfile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [bio, setBio] = useState("");  // Nouvel état pour la bio

    const navigation = useNavigation();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const userId = await AsyncStorage.getItem('currentUser');

            const response = await fetch(`https://mealbuddy-smartgroup2025.azurewebsites.net/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setEmail(data.email);
                setAvatar(data.avatar || null);
                setBio(data.bio || "");  // Charger la bio existante
            }
        } catch (error) {
            console.error("Failed to load user data", error);
        }
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const userId = await AsyncStorage.getItem('currentUser');

            // Créer un objet avec les données à mettre à jour
            const updatedUserData = { username, email, avatar, bio };

            // Si un mot de passe a été saisi, l'ajouter à l'objet
            if (password) {
                updatedUserData.password = password;
            }

            const response = await fetch(`https://mealbuddy-smartgroup2025.azurewebsites.net/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserData)
            });

            if (response.ok) {
                console.log("Profile updated successfully");
                navigation.goBack();
            } else {
                console.error("Failed to update profile", response.status);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleImagePick}>
                <Image
                    source={{ uri: avatar || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        marginBottom: 20,
                    }}
                />
            </TouchableOpacity>

            <TextInput
                placeholder="Full Name"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />

            {/* Nouveau champ pour la bio */}
            <TextInput
                placeholder="Bio"
                value={bio}
                onChangeText={setBio}
                style={[styles.input, styles.bioInput]}  // Appliquer un style spécifique pour la bio
                multiline
                numberOfLines={4}  // Affiche plusieurs lignes pour la bio
            />

            <Button onPress={handleSave} title="Save" color="#E36820" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFF',
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#68AA64',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    bioInput: {
        height: 100,  // Hauteur plus grande pour la bio
        textAlignVertical: 'top',  // Texte aligné en haut
    }
});
