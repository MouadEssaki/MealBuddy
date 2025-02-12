import React, { useState } from "react";
import { View, Image } from "react-native";
import { ApplicationProvider, Layout, Text, Button, Card } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { customTheme } from "./customTheme"; // Assurez-vous que le thème est bien importé
import Icon from "react-native-vector-icons/FontAwesome";  // Importation de FontAwesome pour l'icône de la cible
import IconFA5 from "react-native-vector-icons/FontAwesome5";  // Importation de FontAwesome pour l'icône de la cible
import { SafeAreaView } from "react-native-safe-area-context";


export default function Profile() {
    // Simulation des données utilisateur
    const mockUserData = {
        name: "John Doe",
        email: "johndoe@example.com",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        bio: "Développeur passionné par le React Native et l'intelligence artificielle. Toujours en quête de nouvelles technologies !",
        goal: "Perte de poids",
    };

    // État pour stocker les données utilisateur
    const [user, setUser] = useState(mockUserData);

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
                            accessoryLeft={() => <Icon name="sign-out" size={20} color="white" />} // Use function to return the Icon component properly
                            size="small"
                            style={{ borderRadius: 30 }}
                            onPress={() => console.log("Déconnexion")}
                        />
                    </View>

                    {/* Infos utilisateur */}
                    <Card disabled={true} style={{ borderRadius: 10, padding: 15, backgroundColor: "#FFF4E4" }}>
                        {/* Icône de crayon en haut à droite */}
                        <View style={{ position: "absolute", top: 20, right: 20 }}>
                            <Icon name="edit" size={30} color={customTheme.vert} />
                        </View>
                        <Text category="h4">{user.name}</Text>
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
