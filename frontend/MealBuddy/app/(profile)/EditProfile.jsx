import React, { useState, useEffect } from "react";
import {
    View,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Text,
    ActivityIndicator,
    Alert,
    ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

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
                <TouchableOpacity onPress={loadUserData} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Main render
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            {/* Avatar Section */}
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

            {/* Input Fields */}
            <TextInput
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                accessible={true}
                accessibilityLabel="Full name input"
            />
            <TextInput
                placeholder="Email Address"
                placeholderTextColor="#999"
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
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                accessible={true}
                accessibilityLabel="Password input"
            />
            <TextInput
                placeholder="Bio"
                placeholderTextColor="#999"
                value={bio}
                onChangeText={setBio}
                style={[styles.input, styles.bioInput]}
                multiline
                numberOfLines={4}
                accessible={true}
                accessibilityLabel="Bio input"
            />

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        fontSize: 16,
    },
    retryButton: {
        backgroundColor: "#E36820",
        padding: 10,
        borderRadius: 10,
    },
    retryButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "500",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#333",
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: "#E36820",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
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
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
        fontSize: 16,
        color: "#333",
    },
    bioInput: {
        height: 120,
        textAlignVertical: "top",
    },
    saveButton: {
        backgroundColor: "#E36820",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    saveButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "600",
    },
});