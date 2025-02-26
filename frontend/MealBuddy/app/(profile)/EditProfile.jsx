import React, { useState, useEffect } from "react";
import {
    View,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    Button,
    ActivityIndicator,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function EditProfile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigation = useNavigation();

    // Load user data on component mount
    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem("authToken");
            const userId = await AsyncStorage.getItem("currentUser");

            if (!token || !userId) {
                throw new Error("Authentication data missing");
            }

            const response = await fetch(
                `https://mealbuddy-smartgroup2025.azurewebsites.net/api/users/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username || "");
                setEmail(data.email || "");
                setAvatar(data.avatar || null);
                setBio(data.bio || "");
            } else {
                throw new Error("Failed to fetch user data");
            }
        } catch (err) {
            setError(err.message || "An error occurred while loading user data");
        } finally {
            setLoading(false);
        }
    };

    const handleImagePick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission Denied", "Permission to access camera roll is required!");
            return;
        }

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

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSave = async () => {
        if (!validateEmail(email)) {
            Alert.alert("Validation Error", "Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem("authToken");
            const userId = await AsyncStorage.getItem("currentUser");

            if (!token || !userId) {
                throw new Error("Authentication data missing");
            }

            const updatedUserData = { username, email, avatar, bio };
            if (password) {
                updatedUserData.password = password;
            }

            const response = await fetch(
                `https://mealbuddy-smartgroup2025.azurewebsites.net/api/users/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedUserData),
                }
            );

            if (response.ok) {
                Alert.alert("Success", "Profile updated successfully");
                navigation.goBack();
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (err) {
            setError(err.message || "An error occurred while updating profile");
        } finally {
            setLoading(false);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E36820" />
            </View>
        );
    }

    // Render error state
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="Retry" onPress={loadUserData} color="#E36820" />
            </View>
        );
    }

    // Main render
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
                <Image
                    source={{
                        uri: avatar || "https://randomuser.me/api/portraits/men/1.jpg",
                    }}
                    style={styles.avatar}
                    accessible={true}
                    accessibilityLabel="User avatar"
                />
                <Text style={styles.changeAvatarText}>Change Avatar</Text>
            </TouchableOpacity>

            <TextInput
                placeholder="Full Name"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                accessible={true}
                accessibilityLabel="Full name input"
            />
            <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                accessible={true}
                accessibilityLabel="Email address input"
            />
            <TextInput
                placeholder="Password (leave blank to keep current)"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                accessible={true}
                accessibilityLabel="Password input"
            />
            <TextInput
                placeholder="Bio"
                value={bio}
                onChangeText={setBio}
                style={[styles.input, styles.bioInput]}
                multiline
                numberOfLines={4}
                accessible={true}
                accessibilityLabel="Bio input"
            />
            <Button
                onPress={handleSave}
                title="Save"
                color="#E36820"
                accessible={true}
                accessibilityLabel="Save profile changes"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFF",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#68AA64",
    },
    changeAvatarText: {
        marginTop: 10,
        color: "#E36820",
        fontSize: 16,
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
        fontSize: 16,
    },
    bioInput: {
        height: 100,
        textAlignVertical: "top",
    },
});