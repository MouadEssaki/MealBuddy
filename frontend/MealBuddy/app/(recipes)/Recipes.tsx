import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { Input, Button, Icon, Text, Card } from '@ui-kitten/components';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from '../customTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from 'expo-router';


export default function App() {
    const SearchIcon = (props) => <Icon name='search-outline' {...props} />;
    const StarIcon = (props) => <Icon name='star' {...props} />;
    const ClockIcon = (props) => <Icon name='clock-outline' {...props} fill="#555" />;
    const PersonIcon = (props) => <Icon name='person-outline' {...props} fill="#555" />;
    const CreateIcon = (props) => <Icon name='plus-outline' {...props} fill="#FFFFFF" />;

    const [recipesData, setrecipesData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const navigation = useNavigation();

    // Fetch data from API
    useEffect(() => {
        fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/recipes')
            .then(response => response.json())
            .then(data => {
                setrecipesData(data);
            });
    }, []);


    useEffect(() => {
        setFilteredRecipes(
            recipesData.filter((recipe) =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery]);

    const handleRecipePress = (recipe: string) => {
        navigation.navigate('RecipesDetails', { recipe });
    };

   const fetchRecipes = () => {
        fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/recipes')
            .then(response => response.json())
            .then(data => {
                setrecipesData(data);
            });
    };

    useFocusEffect(
        useCallback(() => {
            fetchRecipes();
        }
            , [searchQuery])
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ApplicationProvider {...eva} theme={{ ...eva.light, ...customTheme }}>
                <Layout style={{ flex: 1, backgroundColor: customTheme.fond }}>
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                        <Text category='h5' style={{ color: customTheme.vertClaire, fontWeight: 'bold' }}  >Recipes</Text>


                        {/* Search Input */}
                        <Input
                            accessoryLeft={SearchIcon}
                            style={{
                                marginTop: 20,
                                height: 60,
                                width: '90%',
                                borderRadius: 30,
                                paddingLeft: 20,
                                backgroundColor: "#FFFFFF",
                                borderColor: 'transparent',
                                fontSize: 16,

                            }}
                            textStyle={{
                                color: '#333333',
                            }}
                            placeholder="Search for a recipe"
                            placeholderTextColor="#999999"
                            value={searchQuery}
                            onChangeText={nextValue => setSearchQuery(nextValue)}
                        />

                        <Button
                            accessoryLeft={CreateIcon}
                            onPress={() => navigation.navigate('CreateRecipe')}
                            style={{
                                marginBottom: 10,
                                borderColor: 'transparent',
                                borderRadius: 20,
                                backgroundColor: "#4CAF50",
                                paddingVertical: 15,
                                paddingHorizontal: 20,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,
                                elevation: 4,
                            }}
                            textStyle={{
                                color: '#FFFFFF',
                                fontSize: 18,
                                fontWeight: 'bold',
                            }}
                        >
                            <Text>Create a recipe</Text>
                        </Button>



                        {/* ScrollView for displaying the recipes */}
                        <ScrollView style={{ width: '100%' }}>
                            {(searchQuery.length == 0 ? recipesData : filteredRecipes).map((recipe) => (
                                <View key={recipe._id} style={{
                                    marginRight: 20,
                                    marginLeft: 20,
                                    marginBottom: 30,
                                    backgroundColor: 'transparent', // This is important
                                }}>
                                    <View style={{
                                        backgroundColor: "#FFF4E4",
                                        borderRadius: 10,
                                        shadowColor: "#636363",
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 2,
                                        elevation: 3,
                                    }}>
                                        <Image
                                            source={{
                                                uri: `https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.title)}`,
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
                                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                                                <ClockIcon style={{ width: 16, height: 16 }} />
                                                <Text style={{ marginLeft: 5, fontSize: 12 }}>{recipe.steps ? recipe.steps.length : 0} steps</Text>
                                                <PersonIcon style={{ width: 16, height: 16, marginLeft: 10 }} />
                                                <Text style={{ marginLeft: 5, fontSize: 12 }}>{recipe.ingredients.length} ingredients</Text>
                                                <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            style={{
                                                                width: 16,
                                                                height: 16,
                                                                marginRight: 3,
                                                            }}
                                                            fill={i < 3 ? "#FFD700" : "#E0E0E0"} // Example: 3 stars for this recipe
                                                        />
                                                    ))}
                                                </View>
                                            </View>

                                            <Text category='h6' style={{ fontWeight: 'bold' }}>{recipe.title}</Text>

                                            <Button
                                                onPress={() => handleRecipePress(recipe._id)}
                                                style={{
                                                    marginTop: 10,
                                                    borderColor: 'transparent',
                                                    borderRadius: 20,
                                                    backgroundColor: "#E36820"
                                                }}
                                                textStyle={{
                                                    color: '#FFFFFF',
                                                    fontSize: 16,
                                                }}
                                            >
                                                <Text>View Recipe</Text>
                                            </Button>

                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </Layout>
            </ApplicationProvider>
        </SafeAreaView>
    );
}