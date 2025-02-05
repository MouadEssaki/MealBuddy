import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Input } from '@ui-kitten/components';
import { ApplicationProvider, Layout, Text, Card } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './customTheme';  // Assurez-vous que le thème est bien importé
import { Button, Icon } from '@ui-kitten/components';

export default function Recipes() {
    const recipes = [
        { id: 1, name: "Spaghetti Bolognese", description: "A classic Italian dish." },
        { id: 2, name: "Chicken Curry", description: "A flavorful and spicy curry." },
        { id: 3, name: "Vegetable Stir Fry", description: "A healthy and quick stir fry." },
        { id: 4, name: "Beef Stew", description: "A hearty and filling stew." },
        { id: 5, name: "Fish Tacos", description: "Fresh and light tacos with fish." },
    ];

    const SearchIcon = (props) => (
        <Icon name='search' {...props} />
    );

    return (
        <ApplicationProvider {...eva} theme={customTheme}>
            <Layout style={{ flex: 1, backgroundColor: customTheme.fond }}>
                <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                    {/* TextInput pour la recherche */}
                    <Input
                        accessoryLeft={SearchIcon}
                        style={{
                            height: 60,
                            borderColor: "#f9f2e8",
                            borderWidth: 1,
                            width: '80%',
                            borderRadius: 20,
                            paddingLeft: 10,
                            marginBottom: 20,
                            backgroundColor: "#f9f2e8"
                        }}
                        placeholder="Search for a recipe"
                    />

                    {/* ScrollView pour afficher la liste des recettes */}
                    <ScrollView style={{ width: '100%' }}>
                        {recipes.map((recipe) => (
                            <Card key={recipe.id} style={{ margin: 5, borderRadius: 20, backgroundColor: "#FFF4E4" }}>
                                <Image source={{ uri: 'https://picsum.photos/200/300' }} style={{ width: "100%", height: 150, borderRadius: 10 }} />
                                <Text category='h5' >
                                    {recipe.name}
                                </Text>
                                <Text >
                                    {recipe.description}
                                </Text>
                            </Card>
                        ))}
                    </ScrollView>
                </View>
            </Layout>
        </ApplicationProvider>
    );
}
