import React, { useState, useEffect } from "react";
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Animated,
    ScrollView,
    StyleSheet,
    Text
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
    white: '#FFFFFF',
    background: '#F9F9F9'
};

const STATS = [
    { icon: 'fire', label: 'Active Days', value: '18' },
    { icon: 'apple', label: 'Meals Logged', value: '247' },
    { icon: 'tint', label: 'Water Tracked', value: '58L' },
    { icon: 'leaf', label: 'Veggie Meals', value: '89' },
];

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const fadeAnim = useState(new Animated.Value(0))[0];


    useEffect(() => {
        fetchUserInfo();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.vert} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <LinearGradient
                    colors={[COLORS.vert, '#1a7a4e']}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.profileHeader}>
                            <Image
                                source={{ uri: user.avatar }}
                                style={styles.avatar}
                            />
                            <View style={styles.profileInfo}>
                                <Text style={styles.username}>{user.username}</Text>
                                <Text style={styles.email}>{user.email}</Text>
                            </View>
                            <TouchableOpacity onPress={deconnexion}>
                                <Icon name="sign-out" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Bio Card */}
                    <View style={styles.bioCard}>
                        <View style={styles.bioHeader}>
                            <Text style={styles.bioTitle}>About Me</Text>
                            <TouchableOpacity>
                                <Icon name="edit" size={18} color={COLORS.vert} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.bioText}>
                            {user.bio || "No bio added yet"}
                        </Text>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        {STATS.map((stat, index) => (
                            <View key={index} style={styles.statCard}>
                                <IconFA5
                                    name={stat.icon}
                                    size={24}
                                    color={COLORS.orange}
                                    style={styles.statIcon}
                                />
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Goals Card */}
                    <View style={styles.goalsCard}>
                        <View style={styles.goalsHeader}>
                            <IconFA5 name="bullseye" size={20} color={COLORS.orange} />
                            <Text style={styles.goalsTitle}>Current Goal</Text>
                        </View>
                        <Text style={styles.goalText}>
                            {user.goal || "No current goal set"}
                        </Text>
                        <View style={styles.achievementsRow}>
                            <View style={styles.achievementItem}>
                                <IconFA5 name="medal" size={20} color={COLORS.vert} />
                                <Text style={styles.achievementText}>7 Day Streak</Text>
                            </View>
                            <View style={styles.achievementItem}>
                                <IconFA5 name="trophy" size={20} color={COLORS.vert} />
                                <Text style={styles.achievementText}>12 Achievements</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.vert,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.beige,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: COLORS.beige
    },
    profileInfo: {
        flex: 1,
        marginLeft: 15,
    },
    username: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '700',
    },
    email: {
        color: COLORS.white,
        opacity: 0.8,
        fontSize: 14,
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
    },
    bioCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    bioHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    bioTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.vert,
    },
    bioText: {
        fontSize: 14,
        color: COLORS.vert,
        lineHeight: 22,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    statCard: {
        width: '48%',
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    statIcon: {
        marginBottom: 10
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.vert,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.vert,
        opacity: 0.8,
    },
    goalsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 55,
    },
    goalsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    goalsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.vert,
        marginLeft: 10,
    },
    goalText: {
        fontSize: 14,
        color: COLORS.vert,
    },
    achievementsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    achievementItem: {
        alignItems: 'center',
    },
    achievementText: {
        fontSize: 12,
        color: COLORS.vert,
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
});
