// app/(tabs)/Plus.js
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, TextInput, FlatList, TouchableOpacity, Text, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddMealOverlay = ({ visible, onClose, selectedMealType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      
      // Fetch foods and recipes in parallel
      const [foodsResponse, recipesResponse] = await Promise.all([
        fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/foods', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('https://mealbuddy-smartgroup2025.azurewebsites.net/api/recipes', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!foodsResponse.ok || !recipesResponse.ok) throw new Error('Fetch failed');

      const foods = await foodsResponse.json();
      const recipes = await recipesResponse.json();

      setItems([
        ...foods.map(f => ({ ...f, type: 'food' })),
        ...recipes.map(r => ({ ...r, type: 'recipe' }))
      ]);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      if (visible) {
        fetchItems();
      }
    }, [visible])
  );

  const handleAddMeal = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('currentUser');
      const today = new Date().toISOString().split('T')[0];

      // Check if meal log exists for today
      const existingLogResponse = await fetch(
        `https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs?date=${today}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let mealLogId;
      if (existingLogResponse.ok) {
        const existingLogs = await existingLogResponse.json();
        mealLogId = existingLogs.length > 0 ? existingLogs[0]._id : null;
      }

      const mealData = {
        date: today,
        time: selectedMealType,
        meals: [{
          type: selectedItem.type,
          [selectedItem.type === 'food' ? 'food_id' : 'recipe_id']: selectedItem._id,
          quantity: parseInt(quantity),
          name: selectedItem.nom || selectedItem.title,
          calories: Math.round((selectedItem.calories * quantity) / (selectedItem.type === 'food' ? 100 : 1)),
          nutrients: {
            protein: Math.round((selectedItem.protein * quantity) / (selectedItem.type === 'food' ? 100 : 1)),
            carbs: Math.round((selectedItem.carbs * quantity) / (selectedItem.type === 'food' ? 100 : 1)),
            fats: Math.round((selectedItem.fats * quantity) / (selectedItem.type === 'food' ? 100 : 1))
          }
        }]
      };

      // Update or create meal log
      const url = mealLogId 
        ? `https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs/${mealLogId}`
        : 'https://mealbuddy-smartgroup2025.azurewebsites.net/api/MealLogs';

      const method = mealLogId ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(mealData)
      });

      if (!response.ok) throw new Error('Failed to save meal');

      onClose(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredItems = items.filter(item =>
    (item.name ||item.nom || item.title).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlayContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.header}>
            Add to {selectedMealType}
          </Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search foods or recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#68AA64" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemCard}
                  onPress={() => setSelectedItem(item)}
                >
                  <Text style={styles.itemName}>
                    {item.name ||item.nom || item.title}
                  </Text>
                  <Text style={styles.itemType}>
                    {item.type === 'food' ? '🍎 Food' : '📝 Recipe'}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}

          <Modal visible={!!selectedItem} transparent animationType="fade">
            <View style={styles.quantityModal}>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityTitle}>
                  Add {selectedItem?.nom || selectedItem?.title}
                </Text>
                
                <TextInput
                  style={styles.quantityInput}
                  placeholder="Quantity (grams)"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setSelectedItem(null)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddMeal}
                    disabled={!quantity}
                  >
                    <Text style={styles.buttonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={styles.closeButton} onPress={() => onClose(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    height: '80%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#68AA64',
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemType: {
    color: '#666',
    fontSize: 14,
  },
  quantityModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  quantityContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '80%',
  },
  quantityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#68AA64',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#E36820',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#68AA64',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#68AA64',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AddMealOverlay;