import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Input, Button, Icon, Text, Card } from '@ui-kitten/components';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './customTheme';
import { TextInput } from 'react-native-gesture-handler';


export default function Recipes() {
    const SearchIcon = (props) => <Icon name='search-outline' {...props} />;
    const StarIcon = (props) => <Icon name='star' {...props} />;
    const ClockIcon = (props) => <Icon name='clock-outline' {...props} fill="#555" />;
    const PersonIcon = (props) => <Icon name='person-outline' {...props} fill="#555" />;

    const recipes = [
        // Burgers and Fast Food
        {
            id: 1,
            name: "Chicken Burger with Nuggets",
            description: "Mouth-watering burger with crispy chicken nuggets.",
            image: "https://picsum.photos/600/400",
            servings: 4,
            time: "30 min",
            category: "Fast Food",
            rating: 4
        },
        {
            id: 2,
            name: "Classic Beef Cheeseburger",
            description: "Juicy beef patty with melted cheddar cheese.",
            image: "https://picsum.photos/601/400",
            servings: 2,
            time: "25 min",
            category: "Fast Food",
            rating: 5
        },
        {
            id: 3,
            name: "Vegetarian Black Bean Burger",
            description: "Healthy plant-based burger with fresh vegetables.",
            image: "https://picsum.photos/602/400",
            servings: 3,
            time: "40 min",
            category: "Vegetarian",
            rating: 4
        },

        // Pasta Dishes
        {
            id: 4,
            name: "Spaghetti Bolognese",
            description: "Classic Italian pasta with rich meat sauce.",
            image: "https://picsum.photos/603/400",
            servings: 6,
            time: "45 min",
            category: "Italian",
            rating: 5
        },
        {
            id: 5,
            name: "Creamy Fettuccine Alfredo",
            description: "Luxurious pasta with parmesan cream sauce.",
            image: "https://picsum.photos/604/400",
            servings: 4,
            time: "35 min",
            category: "Italian",
            rating: 4
        },
        {
            id: 6,
            name: "Vegetarian Pesto Pasta",
            description: "Fresh basil pesto with cherry tomatoes.",
            image: "https://picsum.photos/605/400",
            servings: 3,
            time: "25 min",
            category: "Vegetarian",
            rating: 3
        },

        // Seafood
        {
            id: 7,
            name: "Grilled Salmon",
            description: "Delicious grilled salmon with lemon butter sauce.",
            image: "https://picsum.photos/606/400",
            servings: 2,
            time: "25 min",
            category: "Seafood",
            rating: 5
        },
        {
            id: 8,
            name: "Shrimp Scampi",
            description: "Garlic butter shrimp served over linguine.",
            image: "https://picsum.photos/607/400",
            servings: 3,
            time: "30 min",
            category: "Seafood",
            rating: 4
        },
        {
            id: 9,
            name: "Tuna Poke Bowl",
            description: "Hawaiian-style raw tuna with rice and vegetables.",
            image: "https://picsum.photos/608/400",
            servings: 2,
            time: "20 min",
            category: "Seafood",
            rating: 3
        },

        // Asian Cuisine
        {
            id: 10,
            name: "Chicken Pad Thai",
            description: "Classic Thai stir-fried noodles with chicken.",
            image: "https://picsum.photos/609/400",
            servings: 4,
            time: "40 min",
            category: "Asian",
            rating: 5
        },
        {
            id: 11,
            name: "Vegetable Sushi Rolls",
            description: "Fresh vegetable sushi with avocado and cucumber.",
            image: "https://picsum.photos/610/400",
            servings: 3,
            time: "50 min",
            category: "Asian",
            rating: 4
        },
        {
            id: 12,
            name: "Beef Teriyaki",
            description: "Tender beef in sweet teriyaki glaze.",
            image: "https://picsum.photos/611/400",
            servings: 4,
            time: "35 min",
            category: "Asian",
            rating: 3
        },

        // Salads and Healthy Options
        {
            id: 13,
            name: "Greek Salad",
            description: "Fresh Mediterranean salad with feta cheese.",
            image: "https://picsum.photos/612/400",
            servings: 3,
            time: "15 min",
            category: "Salad",
            rating: 4
        },
        {
            id: 14,
            name: "Quinoa Power Bowl",
            description: "Nutritious bowl with quinoa, roasted vegetables.",
            image: "https://picsum.photos/613/400",
            servings: 2,
            time: "35 min",
            category: "Healthy",
            rating: 5
        },
        {
            id: 15,
            name: "Caesar Chicken Salad",
            description: "Classic Caesar with grilled chicken breast.",
            image: "https://picsum.photos/614/400",
            servings: 4,
            time: "25 min",
            category: "Salad",
            rating: 3
        }
    ];



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
                                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                                            <ClockIcon style={{ width: 16, height: 16 }} />
                                            <Text style={{ marginLeft: 5, fontSize: 12 }}>{recipe.time}</Text>
                                            <PersonIcon style={{ width: 16, height: 16, marginLeft: 10 }} />
                                            <Text style={{ marginLeft: 5, fontSize: 12 }}>{recipe.servings} serve</Text>
                                            <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                            marginRight: 3,
                                                        }}
                                                        fill={i < recipe.rating ? "#FFD700" : "#E0E0E0"}
                                                    />
                                                ))}


                                            </View>
                                        </View>

                                        <Text category='h6' style={{ fontWeight: 'bold' }}>{recipe.name}</Text>
                                        <Text appearance="hint">{recipe.description}</Text>
                                        {/* Star Rating */}

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
