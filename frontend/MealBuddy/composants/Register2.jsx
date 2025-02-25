import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Register2 = ({ onNext, formData, setFormData }) => {
    const handleAvatarSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission refusée pour accéder à la galerie !');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setFormData({ ...formData, avatar: result.assets[0].uri });
        }
    };

    return (
        <View style={styles.container}>
            <Text>Inscription - Étape 2 : Choisir un avatar</Text>
            <Button title="Sélectionner un avatar" onPress={handleAvatarSelect} />
            {formData.avatar && <Image source={{ uri: formData.avatar }} style={styles.avatar} />}
            <Button title="Suivant" onPress={onNext} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginVertical: 10 }
});

export default Register2;