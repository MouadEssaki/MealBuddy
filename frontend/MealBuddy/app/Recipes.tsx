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
            <Layout style={{ flex: 1, backgroundColor: customTheme.fond, marginTop: 50 }}>
                <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                    {/* TextInput pour la recherche */}
                    <Input
                        accessoryLeft={SearchIcon}
                        style={{
                            height: 60,
                            width: '90%',
                            borderRadius: 30,
                            paddingLeft: 20,
                            marginBottom: 20,
                            backgroundColor: "#FFFFFF",
                            borderColor: 'transparent',
                            fontSize: 16,
                            // Shadow properties
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3, // for Android
                        }}
                        textStyle={{
                            color: '#333333',
                        }}
                        placeholder="Search for a recipe"
                        placeholderTextColor="#999999"
                    />


                    {/* ScrollView pour afficher la liste des recettes */}
                    <ScrollView style={{ width: '100%' }}>
                        {recipes.map((recipe) => (
                            <View key={recipe.id} style={{
                                marginRight: 20,
                                marginLeft: 20,
                                marginBottom: 30,
                                backgroundColor: 'transparent', // This is important
                            }}>
                                <View style={{
                                    backgroundColor: "#FFF4E4",
                                    borderRadius: 10,
                                    // iOS shadow properties
                                    shadowColor: "#636363",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 8,
                                    // Android shadow property
                                    elevation: 5,
                                }}>
                                    <Image
                                        source={{
                                            uri: `https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.name)}`,
                                        }}
                                        style={{
                                            width: '100%',
                                            height: 200,
                                            borderTopLeftRadius: 10,
                                            borderTopRightRadius: 10,
                                        }}
                                        resizeMode="cover"
                                    />
                                    <View style={{ padding: 10 }}>
                                        <Text category="h5" style={{ color: customTheme.orange }}>{recipe.name}</Text>
                                        <Text>{recipe.description}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </Layout>
        </ApplicationProvider>
    );
}
