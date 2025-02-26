import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
// Corrigez l'import de FontAwesome5 pour qu'il utilise l'export par défaut
import Icon from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditGoal() {
    const [goal, setGoal] = useState(""); // État pour l'objectif
    const [loading, setLoading] = useState(true); // Chargement de l'objectif
    const [error, setError] = useState(null); // Gestion des erreurs
    const navigation = useNavigation();

    useEffect(() => {
        loadUserGoal();
    }, []);

    const loadUserGoal = async () => {
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
                setGoal(data.goal || "No current goal set");
            } else {
                throw new Error("Failed to fetch user data");
            }
        } catch (err) {
            setError(err.message || "An error occurred while loading user data");
        } finally {
            setLoading(false);
        }
    };

    const handleGoalChange = async (newGoal) => {
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
                    body: JSON.stringify({ goal: newGoal }),
                }
            );

            if (response.ok) {
                setGoal(newGoal); // Mettre à jour l'objectif affiché
                navigation.goBack();
            } else {
                throw new Error("Failed to update goal");
            }
        } catch (err) {
            setError(err.message || "An error occurred while updating goal");
        } finally {
            setLoading(false);
        }
    };

    // Chargement en attente
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E36820" />
            </View>
        );
    }

    // Gestion des erreurs
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={loadUserGoal} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Affichage principal
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="bullseye" size={30} color="#E36820" />
                <Text style={styles.title}>Current Goal</Text>
            </View>
            <Text style={styles.goalText}>{goal}</Text>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleGoalChange("Weight Loss")}
                >
                    <Text style={styles.buttonText}>Loss of Weight</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleGoalChange("Maintain Weight")}
                >
                    <Text style={styles.buttonText}>Maintain Weight</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleGoalChange("Weight Gain")}
                >
                    <Text style={styles.buttonText}>Gain Weight</Text>
                </TouchableOpacity>
            </View>
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
    goalText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#105F3B",
        textAlign: "center",
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#68AA64",
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginBottom: 15,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
