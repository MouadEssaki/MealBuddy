import React, { useState, useEffect, useCallback } from "react";
import { View, Image, ActivityIndicator, TouchableOpacity, Animated, StyleSheet, ScrollView } from "react-native";
import { ApplicationProvider, Layout, Text, Button } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { customTheme } from "../customTheme";
import Icon from "react-native-vector-icons/FontAwesome";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from "expo-updates";
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { checkStreak } from '@/composants/checkStreak';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from 'expo-router';


const defaultStats = [
    { icon: 'user-clock', label: 'Age', value: null },
    { icon: 'ruler', label: 'height', value: null },
    { icon: 'weight', label: 'Weight', value: null },
    { icon: 'transgender', label: 'Gender', value: null },
];



export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const [streak, setStreak] = useState(0);
    const [totalCalories, setTotalCalories] = useState(2500);
    const [stats, setstats] = useState(defaultStats)


    const navigation = useNavigation();

    useEffect(() => {
        fetchUserInfo();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                console.log('Refreshing data...');
                await fetchUserInfo();
            };
            fetchData();
        }, []) // Add dependency here
    );



    const fetchUserInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            console.log("heret the token", token);
            const userId = await AsyncStorage.getItem('currentUser');
            console.log("here the user", userId);

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
            console.log("Données utilisateur récupérées");
            setLoading(false); // Arrêter le chargement en cas d'erreur

            // Mise à jour du state user avec les données spécifiques
            setUser({
                _id: data._id || '', // Include _id if needed
                username: data.username || '',
                email: data.email || '',
                avatar: data.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
                bio: data.bio || '',
                goal: data.goal || '',
                preferences: data.preferences || [],
                age: data.age || '',
                height: data.height || '',
                weight: data.weight || '',
                gender: data.gender || '',
                activityLevel: data.activityLevel || '',
                nutritionalGoals: {
                    calories: data.nutritionalGoals?.calories || '',
                    protein: data.nutritionalGoals?.protein || '',
                    carbs: data.nutritionalGoals?.carbs || '',
                    fats: data.nutritionalGoals?.fats || ''
                }
            });

            setstats([
                { icon: 'user-clock', label: 'Age', value: data.age },
                { icon: 'ruler', label: 'height', value: data.height + " cm" },
                { icon: 'balance-scale', label: 'Weight', value: data.weight + " kg" },
                { icon: 'transgender', label: 'Gender', value: data.gender },
            ])

        } catch (error) {
            console.log("Erreur lors de la récupération des informations utilisateur :", error);
            setLoading(false); // Arrêter le chargement en cas d'erreur
        }
    };

    useEffect(() => {
        if (user && user.nutritionalGoals) {
            const totalCalories = user.nutritionalGoals.calories;
            if (totalCalories) {
                checkStreak({ totalCalories, setStreak });
            }
        }
    }, [user]);
    
    const deconnexion = async () => {
        //console.log(await AsyncStorage.getItem('authToken'));
        //console.log(await AsyncStorage.getItem('currentUser'));
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

    const flameAnimation = new Animated.Value(0);

    const flameScale = flameAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
    });


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <ApplicationProvider {...eva} theme={customTheme}>
                    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                        <LinearGradient
                            colors={[customTheme.vert, '#1a7a4e']}
                            style={{ padding: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
                        >
                            {/* Header Section */}
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Image
                                        source={{ uri: user.avatar }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                            borderWidth: 3,
                                            borderColor: '#FFF4E4'
                                        }}
                                    />
                                    <View style={{ marginLeft: 15 }}>
                                        <Text category='h5' style={{ color: '#FFF4E4', fontWeight: '700' }}>
                                            {user.username}
                                        </Text>
                                        <Text category='label' style={{ color: '#FFF4E4', opacity: 0.8 }}>
                                            {user.email}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={deconnexion}>
                                    <Icon name="sign-out" size={24} color="#FFF4E4" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>

                        {/* Main Content */}

                        <Layout style={{
                            flex: 1,
                            backgroundColor: customTheme.fond,
                            marginTop: -20,
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            padding: 25
                        }}>
                            {/* Bio Section */}
                            <View style={{
                                backgroundColor: '#FFF4E4',
                                borderRadius: 20,
                                padding: 20,
                                marginBottom: 25,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 10,
                                marginTop: 25
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text category='h6' style={{ color: customTheme.vert, fontWeight: '700', marginBottom: 10 }}>
                                        About Me
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                                        <Icon name="edit" size={18} color={customTheme.vert} />
                                    </TouchableOpacity>
                                </View>
                                <Text category='s1' style={{ color: customTheme.vert, lineHeight: 22 }}>
                                    {user.bio || "No bio added yet"}
                                </Text>
                            </View>

                            {/* Stats Grid */}
                            <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                            }}>
                                {stats.map((stat, index) => (
                                    <View key={index} style={{
                                        width: '48%',
                                        backgroundColor: '#FFF4E4',
                                        borderRadius: 15,
                                        padding: 15,
                                        marginBottom: 15
                                    }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('EditMoreInfo')}>
                                            <IconFA5
                                                name={stat.icon}
                                                size={24}
                                                color={customTheme.orange}
                                                style={{ marginBottom: 10 }}
                                            />
                                            <Text category='h5' style={{ color: customTheme.vert, fontWeight: '700' }}>
                                                {stat.value}
                                            </Text>
                                            <Text category='label' style={{ color: customTheme.vert, opacity: 0.7 }}>
                                                {stat.label}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>




                            {/* Goals Section */}
                            <View style={{
                                backgroundColor: '#FFF4E4',
                                borderRadius: 20,
                                padding: 20,
                            }}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('EditGoal')}
                                    style={{ marginBottom: 15 }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <IconFA5
                                            name="bullseye"
                                            size={20}
                                            color={customTheme.orange}
                                            style={{ marginRight: 10 }}
                                        />
                                        <Text category='h6' style={{ color: customTheme.vert, fontWeight: '700' }}>
                                            Current Goal
                                        </Text>
                                    </View>
                                    <Text category='s1' style={{ color: customTheme.vert, marginTop: 5 }}>
                                        {user.goal || "No current goal set"}
                                    </Text>
                                </TouchableOpacity>


                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 20,
                                    paddingTop: 15,
                                    borderTopWidth: 1,
                                    borderTopColor: '#EEE'
                                }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <IconFA5 name="medal" size={20} color={customTheme.vert} />
                                        <Text category='s2' style={{ color: customTheme.vert, marginTop: 5 }}>
                                            7 Day Streak
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <IconFA5 name="trophy" size={20} color={customTheme.vert} />
                                        <Text category='s2' style={{ color: customTheme.vert, marginTop: 5 }}>
                                            12 Achievements
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            {/* Streak Section */}
                            <View style={styles.streakCard}>
                                <LinearGradient
                                    colors={['#FF6B6B', '#FF8E53']}
                                    style={styles.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <View style={styles.streakHeader}>
                                        <Animated.View style={[styles.flameContainer, { transform: [{ scale: flameScale }] }]}>
                                            <Icon2 name="fire" size={36} color="#FFF4E4" style={styles.flameIcon} />
                                            {streak > 3 && (
                                                <View style={styles.flameSparkles}>
                                                    <Icon2 name="sparkles" size={16} color="#FFD700" style={styles.sparkle1} />
                                                    <Icon2 name="sparkles" size={20} color="#FFD700" style={styles.sparkle2} />
                                                </View>
                                            )}
                                        </Animated.View>
                                        <View>
                                            <Text style={styles.streakTitle}>{streak}</Text>
                                            <Text style={styles.streakSubtitle}>DAY STREAK</Text>
                                        </View>
                                    </View>
                                    {streak > 0 ? (
                                        <View style={styles.streakProgress}>
                                            <View style={[styles.progressBar, { width: `${Math.min(streak * 10, 100)}%` }]} />
                                            <Text style={styles.streakPhrase}>
                                                {streak >= 7 ? '🔥 Unstoppable! ' :
                                                    streak >= 3 ? '🚀 Amazing! ' :
                                                        '💪 Great start! '}
                                                Keep the fire burning!
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.noStreakText}>
                                            Start your streak today! 🔥
                                        </Text>
                                    )}
                                </LinearGradient>
                            </View>

                        </Layout>
                    </Animated.View>
                </ApplicationProvider>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    streakCard: {
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 35,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginTop: 25,

    },
    gradient: {
        padding: 20,
    },
    streakHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    flameContainer: {
        position: 'relative',
        marginRight: 15,
    },
    flameIcon: {
        textShadowColor: 'rgba(255,107,107,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    flameSparkles: {
        position: 'absolute',
        top: -10,
        left: -5,
    },
    sparkle1: {
        position: 'absolute',
        top: 5,
        left: 25,
        transform: [{ rotate: '-20deg' }],
    },
    sparkle2: {
        position: 'absolute',
        top: -5,
        left: 10,
        transform: [{ rotate: '15deg' }],
    },
    streakTitle: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFF4E4',
        letterSpacing: -1,
    },
    streakSubtitle: {
        fontSize: 16,
        color: 'rgba(255,244,228,0.9)',
        letterSpacing: 1,
        marginTop: -5,
    },
    streakProgress: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        padding: 12,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#FFF4E4',
        borderRadius: 3,
        marginBottom: 10,
    },
    streakPhrase: {
        color: '#FFF4E4',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    noStreakText: {
        color: '#FFF4E4',
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 8,
    },
});