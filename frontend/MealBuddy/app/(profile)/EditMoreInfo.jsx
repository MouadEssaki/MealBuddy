import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditMoreInfo() {
    const [userInfo, setUserInfo] = useState({
        age: "",
        height: "",
        weight: "",
        gender: "Male",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
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
                setUserInfo({
                    age: data.age || "",
                    height: data.height || "",
                    weight: data.weight || "",
                    gender: data.gender || "Male",
                });
            } else {
                throw new Error("Failed to fetch user data");
            }
        } catch (err) {
            setError(err.message || "An error occurred while loading user data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserInfo = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("authToken");
            const userId = await AsyncStorage.getItem("currentUser");

            if (!token || !userId) {
                throw new Error("Authentication data missing");
            }

            const response = await fetch(
                `https://mealbuddy-smartgroup2025.azurewebsites.net/api/users/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userInfo),
                }
            );

            if (response.ok) {
                navigation.goBack();
            } else {
                throw new Error("Failed to update user data");
            }
        } catch (err) {
            setError(err.message || "An error occurred while updating user data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E36820" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={loadUserInfo} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="user-edit" size={30} color="#E36820" />
                <Text style={styles.title}>Edit Your Information</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                    style={styles.input}
                    value={userInfo.age}
                    onChangeText={(text) => setUserInfo({ ...userInfo, age: text })}
                    placeholder="Enter your age"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Height (cm)</Text>
                <TextInput
                    style={styles.input}
                    value={userInfo.height}
                    onChangeText={(text) => setUserInfo({ ...userInfo, height: text })}
                    placeholder="Enter your height"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                    style={styles.input}
                    value={userInfo.weight}
                    onChangeText={(text) => setUserInfo({ ...userInfo, weight: text })}
                    placeholder="Enter your weight"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.genderContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <TouchableOpacity
                    style={[
                        styles.genderButton,
                        userInfo.gender === "Male" && styles.selectedGender,
                    ]}
                    onPress={() => setUserInfo({ ...userInfo, gender: "Male" })}
                >
                    <Text style={styles.buttonText}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.genderButton,
                        userInfo.gender === "Female" && styles.selectedGender,
                    ]}
                    onPress={() => setUserInfo({ ...userInfo, gender: "Female" })}
                >
                    <Text style={styles.buttonText}>Female</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateUserInfo}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
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
    },
    errorText: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
    },
    retryButton: {
        padding: 10,
        backgroundColor: "#E36820",
        borderRadius: 5,
    },
    retryText: {
        color: "#FFF",
        fontWeight: "bold",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginLeft: 10,
        color: "#105F3B",
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#105F3B",
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderColor: "#E36820",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#105F3B",
    },
    genderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    genderButton: {
        backgroundColor: "#68AA64",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 15,
    },
    selectedGender: {
        backgroundColor: "#E36820",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
    saveButton: {
        backgroundColor: "#E36820",
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "600",
    },
});
