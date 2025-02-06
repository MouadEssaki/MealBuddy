import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { Input, Button, Icon, Text, Card } from '@ui-kitten/components';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './customTheme';
import { TextInput } from 'react-native-gesture-handler';


export default function Recipes() {
    const SearchIcon = (props) => <Icon name='search-outline' {...props} />;
    const StarIcon = (props) => <Icon name='star' fill='#FFD700' {...props} />;
    const ClockIcon = (props) => <Icon name='clock-outline' {...props} fill="#555" />;
    const PersonIcon = (props) => <Icon name='person-outline' {...props} fill="#555" />;

    const recipes = [
        { id: 1, name: "Chicken Burger with Nuggets", description: "Mouth-watering burger with French side toppings.", image: "https://picsum.photos/600/400" },
        { id: 2, name: "Spaghetti Bolognese", description: "Classic Italian pasta with meat sauce.", image: "https://picsum.photos/601/400" },
        { id: 3, name: "Grilled Salmon", description: "Delicious grilled salmon with lemon butter sauce.", image: "https://picsum.photos/602/400" },
    ];

    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <Layout style={{ flex: 1, backgroundColor: "white", padding: 20 }}>


                {/* Search Bar Agrandie */}
                <Input
                    placeholder="Party Food"
                    accessoryLeft={SearchIcon}
                    size='large'

                    style={{
                        fontSize: 18,
                        borderRadius: 30,
                        backgroundColor: "#F2F2F2",
                        borderWidth: 0,
                        paddingLeft: 15,
                        marginBottom: 25,
                    }}
                />

                {/* Recipes Section Header */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <Text category="h5" style={{ fontWeight: 'bold' }}>Recipes</Text>
                    <Button appearance="ghost" size="tiny">View All</Button>
                </View>

                {/* Recipes List */}
                <ScrollView>
                    {recipes.map((recipe) => (
                        <View key={recipe.id} style={{ borderRadius: 20, padding: 0, overflow: 'hidden', marginBottom: 20, backgroundColor: customTheme["beige"] }}>
                            {/* Full-width Image */}
                            <Image source={{ uri: recipe.image }} style={{ width: "100%", height: 180, borderTopLeftRadius: 20 }} />

                            {/* Recipe Details */}
                            <View style={{ padding: 15 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                                    <ClockIcon style={{ width: 16, height: 16 }} />
                                    <Text style={{ marginLeft: 5, fontSize: 12 }}>15 min</Text>
                                    <PersonIcon style={{ width: 16, height: 16, marginLeft: 10 }} />
                                    <Text style={{ marginLeft: 5, fontSize: 12 }}>1 serve</Text>
                                </View>

                                <Text category='h6' style={{ fontWeight: 'bold' }}>{recipe.name}</Text>
                                <Text appearance="hint">{recipe.description}</Text>

                                {/* Star Rating */}
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} style={{ width: 16, height: 16, marginRight: 3 }} />
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>

            </Layout>
        </ApplicationProvider>
    );
}
