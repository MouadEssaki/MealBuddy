import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Input } from '@ui-kitten/components';
import { ApplicationProvider, Layout, Text, Card } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './customTheme';
import { Button, Icon } from '@ui-kitten/components';

export default function FoodJournal() {
    const [activeTab, setActiveTab] = useState('calendar');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [foodSearch, setFoodSearch] = useState('');
    const [recipeSearch, setRecipeSearch] = useState('');

    // Données temporaires
    const meals = [
        { id: 1, date: '2023-10-01', time: 'Petit-déjeuner', items: ['Omelette', 'Pain complet'] },
        { id: 2, date: '2023-10-01', time: 'Déjeuner', items: ['Poulet grillé', 'Riz brun'] },
    ];

    const foodItems = [
        { id: 1, name: "Pomme", calories: 95 },
        { id: 2, name: "Poulet (100g)", calories: 165 },
        { id: 3, name: "Riz brun (100g)", calories: 111 },
    ];

    const recipeItems = [
        { id: 1, name: "Salade César", calories: 350 },
        { id: 2, name: "Smoothie protéiné", calories: 250 },
    ];

    const SearchIcon = (props) => <Icon name='search' {...props} />;
    const AddButton = (props) => <Icon name='plus' {...props} fill={customTheme.orange} />;

    //TODO À REVOIR SI CRÉATION ET UTILISATION COMPOSANT RECHERCHE OU NON
    return (
        <ApplicationProvider {...eva} theme={customTheme}>
            <Layout style={{ flex: 1, backgroundColor: customTheme.fond }}>
                <View style={{ flex: 1, marginTop: 20 }}>
                    {/* Navigation par onglets */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                        <Button 
                            appearance={activeTab === 'calendar' ? 'filled' : 'outline'}
                            onPress={() => setActiveTab('calendar')}
                            style={{ backgroundColor: activeTab === 'calendar' ? customTheme.vert : 'transparent' }}
                        >
                            Calendrier
                        </Button>
                        <Button 
                            appearance={activeTab === 'food' ? 'filled' : 'outline'}
                            onPress={() => setActiveTab('food')}
                            style={{ backgroundColor: activeTab === 'food' ? customTheme.vert : 'transparent' }}
                        >
                            Ajouter Aliment
                        </Button>
                        <Button 
                            appearance={activeTab === 'recipe' ? 'filled' : 'outline'}
                            onPress={() => setActiveTab('recipe')}
                            style={{ backgroundColor: activeTab === 'recipe' ? customTheme.vert : 'transparent' }}
                        >
                            Ajouter Recette
                        </Button>
                    </View>

                    {activeTab === 'calendar' && (
                        <ScrollView style={{ padding: 10 }}>
                            {/* Vue Calendrier simplifiée */}
                            <Text category='h5' style={{ marginBottom: 10 }}>Octobre 2023</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {[...Array(7)].map((_, i) => (
                                    <TouchableOpacity 
                                        key={i}
                                        style={{
                                            padding: 15,
                                            margin: 5,
                                            borderRadius: 10,
                                            backgroundColor: customTheme.beige
                                        }}
                                    >
                                        <Text>Jour {i + 1}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Liste des repas */}
                            {meals.map(meal => (
                                <Card key={meal.id} style={{ margin: 5, backgroundColor: customTheme.beige }}>
                                    <Text category='s1' style={{ color: customTheme.vert }}>{meal.time}</Text>
                                    {meal.items.map((item, index) => (
                                        <Text key={index}>• {item}</Text>
                                    ))}
                                </Card>
                            ))}
                        </ScrollView>
                    )}

                    {activeTab === 'food' && (
                        <View style={{ padding: 10 }}>
                            <Input
                                accessoryLeft={SearchIcon}
                                placeholder="Rechercher un aliment..."
                                style={{
                                    backgroundColor: customTheme.beige,
                                    marginBottom: 15,
                                    borderRadius: 10
                                }}
                                value={foodSearch}
                                onChangeText={setFoodSearch}
                            />

                            {foodItems.map(food => (
                                <Card key={food.id} style={{ margin: 5, backgroundColor: 'white' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text category='s1'>{food.name}</Text>
                                            <Text appearance='hint'>{food.calories} kcal</Text>
                                        </View>
                                        <Button accessoryLeft={AddButton} appearance='ghost'/>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}

                    {activeTab === 'recipe' && (
                        <View style={{ padding: 10 }}>
                            <Input
                                accessoryLeft={SearchIcon}
                                placeholder="Rechercher une recette..."
                                style={{
                                    backgroundColor: customTheme.beige,
                                    marginBottom: 15,
                                    borderRadius: 10
                                }}
                                value={recipeSearch}
                                onChangeText={setRecipeSearch}
                            />

                            {recipeItems.map(recipe => (
                                <Card key={recipe.id} style={{ margin: 5, backgroundColor: 'white' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text category='s1'>{recipe.name}</Text>
                                            <Text appearance='hint'>{recipe.calories} kcal</Text>
                                        </View>
                                        <Button accessoryLeft={AddButton} appearance='ghost'/>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}
                </View>
            </Layout>
        </ApplicationProvider>
    );
}