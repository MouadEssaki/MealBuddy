import React, { useMemo } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Color constants
const FOOD_COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
};

// Goal options
const GOAL_OPTIONS = [
    { id: 'loss', title: 'Perte de poids', icon: 'fire', description: 'Développez des habitudes saines et durables' },
    { id: 'maintain', title: 'Maintien de poids', icon: 'scale-balance', description: 'Conservez votre équilibre nutritionnel actuel' },
    { id: 'gain', title: 'Gain de poids', icon: 'trending-up', description: 'Augmentez votre apport calorique de manière saine' },
];

// Gender options
const GENDER_OPTIONS = [
    { id: 'male', title: 'Homme' },
    { id: 'female', title: 'Femme' },
];

// Activity options
const ACTIVITY_OPTIONS = [
    { id: 'sedentary', title: 'Sédentaire' },
    { id: 'light', title: 'Léger' },
    { id: 'moderate', title: 'Modéré' },
    { id: 'active', title: 'Actif' },
    { id: 'veryActive', title: 'Très actif' },
];

// Activity icons mapping
const ACTIVITY_ICONS = {
    sedentary: 'seat',
    light: 'walk',
    moderate: 'run',
    active: 'bike',
    veryActive: 'weight-lifter',
};

// Calculate nutritional goals based on user input
const calculateNutritionalGoals = ({ weight, height, age, gender, activityLevel, goal }) => {
    const parsedWeight = parseFloat(weight);
    const parsedHeight = parseFloat(height);
    const parsedAge = parseFloat(age);

    if (isNaN(parsedWeight) || isNaN(parsedHeight) || isNaN(parsedAge) || !gender || !activityLevel || !goal) {
        throw new Error('Invalid input data');
    }

    // Step 1: Calculate BMR (Harris-Benedict formula)
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * parsedWeight) + (4.799 * parsedHeight) - (5.677 * parsedAge);
    } else if (gender === 'female') {
        bmr = 447.593 + (9.247 * parsedWeight) + (3.098 * parsedHeight) - (4.330 * parsedAge);
    }

    // Step 2: Calculate TDEE using activity factor
    const activityFactors = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9,
    };
    const tdee = bmr * activityFactors[activityLevel];

    // Step 3: Adjust calorie goal based on fitness goal
    const goalAdjustments = { loss: -500, maintain: 0, gain: 500 };
    const calorieGoal = tdee + goalAdjustments[goal];

    // Step 4: Calculate macronutrient goals
    const proteinPerKg = { loss: 2.0, maintain: 1.8, gain: 2.2 };
    const proteinGoal = proteinPerKg[goal] * parsedWeight;
    const proteinCalories = proteinGoal * 4;

    const fatCalories = 0.3 * calorieGoal;
    const fatGoal = fatCalories / 9;

    const carbCalories = calorieGoal - proteinCalories - fatCalories;
    const carbGoal = carbCalories / 4;

    return {
        calories: Math.round(calorieGoal),
        protein: Math.round(proteinGoal),
        carbs: Math.round(carbGoal),
        fats: Math.round(fatGoal),
    };
};

// Sub-component: Goal Selection
const GoalSelection = ({ value, onChange }) => (
    <View>
        {GOAL_OPTIONS.map((goal) => (
            <TouchableOpacity
                key={goal.id}
                style={[styles.optionCard, value === goal.id && styles.selectedOptionCard]}
                onPress={() => onChange(goal.id)}
            >
                <MaterialCommunityIcons
                    name={goal.icon}
                    size={28}
                    color={value === goal.id ? FOOD_COLORS.orange : FOOD_COLORS.vert}
                />
                <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{goal.title}</Text>
                    <Text style={styles.optionDescription}>{goal.description}</Text>
                </View>
            </TouchableOpacity>
        ))}
    </View>
);

// Sub-component: Personal Info Inputs
const PersonalInfoInputs = ({ formData, setFormData }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.sectionTitle}>Informations personnelles</Text>
        <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="calendar" size={20} color={FOOD_COLORS.vert} />
                <Text style={[styles.label, { marginLeft: 8 }]}>Âge (années)</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Ex: 25"
                keyboardType="numeric"
                value={formData.age || ''}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
            />
        </View>
        <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="human-male-height" size={20} color={FOOD_COLORS.vert} />
                <Text style={[styles.label, { marginLeft: 8 }]}>Taille (cm)</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Ex: 170"
                keyboardType="numeric"
                value={formData.height || ''}
                onChangeText={(text) => setFormData({ ...formData, height: text })}
            />
        </View>
        <View style={styles.inputContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="weight-kilogram" size={20} color={FOOD_COLORS.vert} />
                <Text style={[styles.label, { marginLeft: 8 }]}>Poids (kg)</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Ex: 70"
                keyboardType="numeric"
                value={formData.weight || ''}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
            />
        </View>
    </View>
);

// Sub-component: Gender Selection
const GenderSelection = ({ value, onChange }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.sectionTitle}>Genre</Text>
        {GENDER_OPTIONS.map((gender) => (
            <TouchableOpacity
                key={gender.id}
                style={[styles.optionCard, value === gender.id && styles.selectedOptionCard]}
                onPress={() => onChange(gender.id)}
            >
                <MaterialCommunityIcons
                    name={gender.id === 'male' ? 'gender-male' : 'gender-female'}
                    size={24}
                    color={value === gender.id ? FOOD_COLORS.orange : FOOD_COLORS.vert}
                />
                <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{gender.title}</Text>
                </View>
            </TouchableOpacity>
        ))}
    </View>
);

// Sub-component: Activity Selection
const ActivitySelection = ({ value, onChange }) => (
    <View style={styles.inputGroup}>
        <Text style={styles.sectionTitle}>Niveau d'activité</Text>
        {ACTIVITY_OPTIONS.map((activity) => (
            <TouchableOpacity
                key={activity.id}
                style={[styles.optionCard, value === activity.id && styles.selectedOptionCard]}
                onPress={() => onChange(activity.id)}
            >
                <MaterialCommunityIcons
                    name={ACTIVITY_ICONS[activity.id]}
                    size={24}
                    color={value === activity.id ? FOOD_COLORS.orange : FOOD_COLORS.vert}
                />
                <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>{activity.title}</Text>
                </View>
            </TouchableOpacity>
        ))}
    </View>
);

// Main Register3 Component
const Register3 = ({ onNext, onBack, formData, setFormData }) => {
    const isNextDisabled = useMemo(() => {
        return (
            !formData.goal ||
            !formData.gender ||
            !formData.activityLevel ||
            !formData.age ||
            !formData.height ||
            !formData.weight
        );
    }, [formData]);

    const handleNext = () => {
        try {
            const nutritionalGoals = calculateNutritionalGoals({
                weight: formData.weight,
                height: formData.height,
                age: formData.age,
                gender: formData.gender,
                activityLevel: formData.activityLevel,
                goal: formData.goal,
            });
            onNext({ ...formData, nutritionalGoals });
        } catch (error) {
            Alert.alert('Erreur', 'Veuillez vérifier vos informations.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                            <GoalSelection
                                value={formData.goal}
                                onChange={(newGoal) => setFormData({ ...formData, goal: newGoal })}
                            />
                            {formData.goal && (
                                <>
                                    <PersonalInfoInputs formData={formData} setFormData={setFormData} />
                                    <GenderSelection
                                        value={formData.gender}
                                        onChange={(newGender) => setFormData({ ...formData, gender: newGender })}
                                    />
                                    <ActivitySelection
                                        value={formData.activityLevel}
                                        onChange={(newActivity) => setFormData({ ...formData, activityLevel: newActivity })}
                                    />
                                </>
                            )}
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity style={[styles.button, styles.backButton]} onPress={onBack}>
                                    <Text style={styles.backButtonText}>← Retour</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.nextButton, isNextDisabled && styles.disabledButton]}
                                    onPress={handleNext}
                                    disabled={isNextDisabled}
                                >
                                    <Text style={[styles.buttonText, isNextDisabled && styles.disabledButtonText]}>
                                        Continuer →
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: FOOD_COLORS.beige,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
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
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: FOOD_COLORS.beige,
        marginBottom: 16,
        backgroundColor: FOOD_COLORS.beige,
    },
    selectedOptionCard: {
        borderColor: FOOD_COLORS.orange,
        backgroundColor: '#FFF8F2',
    },
    optionTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: FOOD_COLORS.vert,
    },
    optionDescription: {
        fontSize: 14,
        color: FOOD_COLORS.vertClaire,
        lineHeight: 20,
    },
    inputGroup: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: FOOD_COLORS.vert,
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: FOOD_COLORS.vert,
        marginBottom: 8,
    },
    input: {
        backgroundColor: FOOD_COLORS.beige,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: FOOD_COLORS.vert,
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
    backButtonText: {
        color: FOOD_COLORS.vert,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Register3;