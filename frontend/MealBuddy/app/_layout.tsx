import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Modal, View, Text, Pressable, Image, StyleSheet } from 'react-native';
import LoginRegister from '../composants/LoginRegister';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import AddMealOverlay from './Plus';

const AnimatedTabIcon = ({
  focused,
  activeSource,
  inactiveSource,
  activeScale = 1.2,
  inactiveScale = 1,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? activeScale : inactiveScale,
      useNativeDriver: true,
      speed: 20,
    }).start();
  }, [focused]);

  return (
    <Animated.Image
      source={focused ? activeSource : inactiveSource}
      style={{
        width: 33,
        height: 33,
        marginBottom: -20,
        transform: [{ scale: scaleAnim }],
      }}
      resizeMode="contain"
    />
  );
};

export default function Layout() {
  const [authToken, setAuthToken] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const slideAnimation = useRef(new Animated.Value(300)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const [selectedMealType, setSelectedMealType] = useState(null);




  useEffect(() => {
    const getAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
      }
    };
    getAuthToken();
  }, []);

  const slideIn = () => {
    Animated.parallel([
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const slideOut = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setOverlayVisible(false);
      slideAnimation.setValue(300);
    });
  };



  const openOverlay = () => {
    setOverlayVisible(true);
    slideIn();
  };

  const closeOverlay = () => {
    slideOut();
    setSelectedMealType(null);
  };

  const handleAuthSuccess = async (token) => {
    setAuthToken(token);
    await AsyncStorage.setItem('authToken', token); // Use AsyncStorage
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken'); // Use AsyncStorage
    setAuthToken(null);
  };

  return (
    <>
      <View style={{ minHeight: '100%', backgroundColor: '#F0F0F0' }}>
        {!authToken ? (
          <LoginRegister onAuthSuccess={handleAuthSuccess} />
        ) : (
          <Tabs screenOptions={{ tabBarShowLabel: false, headerShown: false }}>
            <Tabs.Screen
              name="(home)"
              options={{
                tabBarIcon: ({ focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    activeSource={require('../assets/bottomBar/Bold/Home.png')}
                    inactiveSource={require('../assets/bottomBar/Light/Home.png')}
                    activeScale={1.15}
                  />
                ),
              }}
            />

            {/* Recipes Tab */}
            <Tabs.Screen
              name="(recipes)"
              options={{
                tabBarIcon: ({ focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    activeSource={require('../assets/bottomBar/Bold/Recipes.png')}
                    inactiveSource={require('../assets/bottomBar/Light/Recipes.png')}
                    activeScale={1.15}
                  />
                ),
              }}
            />

            <Tabs.Screen
              name="Plus"
              options={{
                tabBarIcon: ({ focused }) => (
                  <Pressable onPress={openOverlay}>
                    <Image
                      source={require('../assets/bottomBar/Add.png')}
                      style={styles.plusImage}
                      resizeMode="contain"
                    />
                  </Pressable>
                ),
              }}
              listeners={{
                tabPress: (e) => {
                  e.preventDefault();
                  openOverlay();
                },
              }}
            />


            <Tabs.Screen
              name="Diet"
              options={{
                tabBarIcon: ({ focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    activeSource={require('../assets/bottomBar/Bold/Diary.png')}
                    inactiveSource={require('../assets/bottomBar/Light/Diary.png')}
                    activeScale={1.15}
                  />
                ),
              }}
            />


            <Tabs.Screen
              name="Profile"
              options={{
                tabBarIcon: ({ focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    activeSource={require('../assets/bottomBar/Bold/User.png')}
                    inactiveSource={require('../assets/bottomBar/Light/User.png')}
                    activeScale={1.15}
                  />
                ),
              }}
            />
          </Tabs>
        )}
      </View>

      <Modal
        visible={overlayVisible}
        transparent
        animationType="none"
        onRequestClose={closeOverlay}
      >
        <Animated.View style={[styles.modalBackground, { opacity: fadeAnimation }]}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: slideAnimation }],
              },
            ]}
          >
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#68AA64' }}>Add a meal:</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setSelectedMealType('Breakfast');
                openOverlay();
              }}
            >
              <Text style={styles.buttonText}>Breakfast</Text>
              <Image source={require('../assets/bottomBar/Light/sunrise.png')} style={{ width: 30, height: 30 }} />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setSelectedMealType('Lunch');
                  openOverlay();
                }}
              >
                <Text style={styles.buttonText}>Lunch</Text>
                <Image source={require('../assets/bottomBar/Light/sun.png')} style={{ width: 30, height: 30 }} />
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  setSelectedMealType('Dinner');
                  openOverlay();
                }}
              >
                <Text style={styles.buttonText}>Dinner</Text>
                <Image source={require('../assets/bottomBar/Light/sunset.png')} style={{ width: 30, height: 30 }} />
              </Pressable>
            </View>
            <Pressable style={styles.closeButton} onPress={closeOverlay}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>

      <AddMealOverlay
        visible={selectedMealType !== null}
        onClose={(success) => {
          setSelectedMealType(null);
          //if (success) {
          //
          //}
        }}
        selectedMealType={selectedMealType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  plusImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 15,
    shadowOpacity: 0.35,
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 35,
    padding: 20,
    alignItems: 'center',
    marginBottom: 120,
  },
  modalButton: {
    width: 140,
    height: 80,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#E36820',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    marginTop: 10,
    shadowColor: 'rgba(149, 157, 165, 0.2)',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 24,
    shadowOpacity: 1,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {},
  closeText: {
    color: '#68AA64',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
