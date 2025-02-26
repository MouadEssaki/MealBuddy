import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const FOOD_COLORS = {
    vertClaire: "#68AA64",
    vert: "#105F3B",
    orange: "#E36820",
    beige: "#FFF4E4",
};

const Register2 = ({ onNext, formData, setFormData, onBack }) => {
    const handleAvatarSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('We need gallery access to personalize your food journey!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFormData({ ...formData, avatar: result.assets[0].uri });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons
                    name="chef-hat"
                    size={48}
                    color={FOOD_COLORS.vert}
                    style={styles.logo}
                />

                <Text style={styles.title}>Personalize Your Profile</Text>
                <Text style={styles.subtitle}>Add a photo to track your nutrition journey</Text>

                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={handleAvatarSelect}
                    >
                        {formData.avatar ? (
                            <Image
                                source={{ uri: formData.avatar }}
                                style={styles.avatarImage}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="camera-plus"
                                size={40}
                                color={FOOD_COLORS.vertClaire}
                            />
                        )}
                    </TouchableOpacity>

                    <Text style={styles.avatarLabel}>
                        {formData.avatar ? 'Tap to change photo' : 'Tap to add photo'}
                    </Text>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[styles.button, styles.backButton]}
                            onPress={onBack}
                        >
                            <Text style={styles.backButtonText}>← Previous</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.nextButton]}
                            onPress={onNext}
                        >
                            <Text style={styles.buttonText}>Next Step →</Text>
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
        alignItems: 'center',
    },
    avatarContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: FOOD_COLORS.beige,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: FOOD_COLORS.vertClaire,
        marginBottom: 16,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
    },
    avatarLabel: {
        color: FOOD_COLORS.vertClaire,
        fontSize: 14,
        marginBottom: 24,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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

export default Register2;
