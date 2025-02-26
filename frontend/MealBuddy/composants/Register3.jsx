import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const FOOD_COLORS = {
    vertClaire: "#68AA64",
    vert: "#105F3B",
    orange: "#E36820",
    beige: "#FFF4E4",
};

const GOAL_OPTIONS = [
    {
        id: 'loss',
        title: "Perte de poids",
        icon: "fire",
        description: "Développez des habitudes saines et durables"
    },
    {
        id: 'maintain',
        title: "Maintien de poids",
        icon: "scale-balance",
        description: "Conservez votre équilibre nutritionnel actuel"
    },
    {
        id: 'gain',
        title: "Gain de poids",
        icon: "trending-up",
        description: "Augmentez votre apport calorique de manière saine"
    }
];

const Register3 = ({ onNext, onBack, formData, setFormData }) => {
    const [selectedGoal, setSelectedGoal] = useState(formData.goal || '');

    const isNextDisabled = useMemo(() => !selectedGoal, [selectedGoal]);

    const handleSelectGoal = (goal) => {
        setSelectedGoal(goal);
        setFormData({ ...formData, goal });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons
                    name="target"
                    size={48}
                    color={FOOD_COLORS.vert}
                    style={styles.logo}
                />

                <Text style={styles.title}>Définissez votre objectif</Text>
                <Text style={styles.subtitle}>Choisissez la direction de votre voyage nutritionnel</Text>

                <View style={styles.card}>
                    {GOAL_OPTIONS.map((goal) => (
                        <TouchableOpacity
                            key={goal.id}
                            style={[
                                styles.goalCard,
                                selectedGoal === goal.id && styles.selectedGoalCard
                            ]}
                            onPress={() => handleSelectGoal(goal.id)}
                        >
                            <MaterialCommunityIcons
                                name={goal.icon}
                                size={28}
                                color={selectedGoal === goal.id ? FOOD_COLORS.orange : FOOD_COLORS.vert}
                            />
                            <View style={styles.goalTextContainer}>
                                <Text style={styles.goalTitle}>{goal.title}</Text>
                                <Text style={styles.goalDescription}>{goal.description}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.backButton]}
                            onPress={onBack}
                        >
                            <Text style={styles.backButtonText}>← Retour</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.nextButton,
                                isNextDisabled && styles.disabledButton
                            ]}
                            onPress={onNext}
                            disabled={isNextDisabled}
                        >
                            <Text style={[
                                styles.buttonText,
                                isNextDisabled && styles.disabledButtonText
                            ]}>Continuer →</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: FOOD_COLORS.beige,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logo: {
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: FOOD_COLORS.vert,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: FOOD_COLORS.vertClaire,
        textAlign: 'center',
        marginBottom: 32,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        shadowColor: FOOD_COLORS.vert,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: FOOD_COLORS.beige,
        marginBottom: 16,
        backgroundColor: FOOD_COLORS.beige,
    },
    selectedGoalCard: {
        borderColor: FOOD_COLORS.orange,
        backgroundColor: '#FFF8F2',
    },
    goalTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    goalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: FOOD_COLORS.vert,
        marginBottom: 4,
    },
    goalDescription: {
        fontSize: 14,
        color: FOOD_COLORS.vertClaire,
        lineHeight: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    button: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        minWidth: 120,
        alignItems: 'center',
    },
    nextButton: {
        backgroundColor: FOOD_COLORS.orange,
        shadowColor: FOOD_COLORS.orange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    disabledButton: {
        backgroundColor: FOOD_COLORS.vertClaire,
        opacity: 0.5,
        shadowOpacity: 0,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    disabledButtonText: {
        color: FOOD_COLORS.beige,
    },
    backButton: {
        borderWidth: 1,
        borderColor: FOOD_COLORS.vert,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    backButtonText: {
        color: FOOD_COLORS.vert,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Register3;
