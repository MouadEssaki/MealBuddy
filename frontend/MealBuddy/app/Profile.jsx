import React, { useState, useEffect } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { ApplicationProvider, Layout, Text, Button, Card } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { customTheme } from "./customTheme"; 
import Icon from "react-native-vector-icons/FontAwesome";
import IconFA5 from "react-native-vector-icons/FontAwesome5";  
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from "expo-updates";

export default function Profile() {
    const [user, setUser] = useState(null); // Initialisé à null pour gérer le cas avant le chargement
    const [loading, setLoading] = useState(true); // État de chargement

    useEffect(() => {
        fetchUserInfo(); // Appel de la fonction lors du chargement du composant
    }, []);

    const fetchUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const userId = await AsyncStorage.getItem('currentUser');

            if (!token || !userId) {
                console.log("Token ou ID utilisateur manquant");
                setLoading(false); // Arrêter le chargement si les données manquent
                return;
            }

            const response = await fetch(`https://mealbuddy-smartgroup2025.azurewebsites.net/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.log("Erreur lors de la récupération des données utilisateur :", response.status);
                setLoading(false); // Arrêter le chargement en cas d'erreur
                return;
            }

            const data = await response.json();
            console.log("Données utilisateur récupérées :", data);
            setLoading(false); // Arrêter le chargement en cas d'erreur

            // Mise à jour du state user avec les données spécifiques
            setUser({
                username: data.name,
                email: data.email,
                avatar: data.avatar || "https://randomuser.me/api/portraits/men/1.jpg", 
                bio: data.bio,
                goal: data.goal,
                preferences: data.preferences
            });
        } catch (error) {
            console.log("Erreur lors de la récupération des informations utilisateur :", error);
            setLoading(false); // Arrêter le chargement en cas d'erreur
        }
    };

    const deconnexion = async () => {
        console.log(await AsyncStorage.getItem('authToken'));
        console.log(await AsyncStorage.getItem('currentUser'));
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('currentUser');
        await Updates.reloadAsync(); // Recharge toute l'application
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={customTheme.vert} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ApplicationProvider {...eva} theme={customTheme}>
                <Layout style={{ flex: 1, backgroundColor: customTheme.fond, padding: 20 }}>
                    {/* Header avec l'avatar et le bouton de déconnexion */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <Image source={{ uri: user.avatar }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                        <Button
                            appearance="filled"
                            status="danger"
                            accessoryLeft={() => <Icon name="sign-out" size={20} color="white" />}
                            size="small"
                            style={{ borderRadius: 30 }}
                            onPress={() => deconnexion()}
                        />
                    </View>

                    {/* Infos utilisateur */}
                    <Card disabled={true} style={{ borderRadius: 10, padding: 15, backgroundColor: "#FFF4E4" }}>
                        <View style={{ position: "absolute", top: 20, right: 20 }}>
                            <Icon name="edit" size={30} color={customTheme.vert} />
                        </View>
                        <Text category="h4">{user.username}</Text>
                        <Text category="h6" appearance="hint" style={{ marginBottom: 10 }}>
                            {user.email}
                        </Text>
                        <Text category="p1" appearance="hint">
                            {user.bio}
                        </Text>
                    </Card>

                    {/* Icone de l'objectif et affichage */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                        <Icon name="bullseye" size={32} color={customTheme.vert} style={{ marginRight: 10 }} />
                        <Text category="h6" appearance="hint">{user.goal || "Aucun objectif défini"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                        <IconFA5 name="award" size={32} color={customTheme.vert} style={{ marginRight: 10 }} />
                        <Text category="h6" appearance="hint">Streaks</Text>
                    </View>
                </Layout>
            </ApplicationProvider>
        </SafeAreaView>
    );
}
