import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import {
  Animated,
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import LoginRegister from '../composants/LoginRegister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 70;

const AnimatedTabIcon = ({ focused, iconName, label }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
        speed: 20,
      }),
      Animated.timing(colorAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start();
  }, [focused]);

  const iconColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#999', '#105F3B']
  });

  return (
    <View style={styles.tabItem}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Icon
          name={iconName}
          size={28}
          color={focused ? '#105F3B' : '#999'}
        />
      </Animated.View>
      <Text style={[styles.tabLabel, { color: focused ? '#105F3B' : '#999' }]}>
        {label}
      </Text>
    </View>
  );
};

export default function Layout() {
  const [authToken, setAuthToken] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Nouvel état pour le chargement
  const slideAnimation = useRef(new Animated.Value(300)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        // Attendre minimum 3 secondes pour l'animation
        setTimeout(() => {
          setAuthToken(token);
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error checking auth token:', error);
        setTimeout(() => {
          setAuthToken(null);
          setIsLoading(false);
        }, 2000);
      }
    };
    checkAuthToken();
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
  };

  const handleAuthSuccess = async (token) => {
    setAuthToken(token);
    await AsyncStorage.setItem('authToken', token);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setAuthToken(null);
  };

  // Si en chargement, montrer l'animation
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0' }}>
        <LottieView
          source={require('../assets/foodAnim.json')}
          autoPlay
          loop
          style={{
            width: 200,
            height: 200,
          }}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {!authToken ? (
          <LoginRegister onAuthSuccess={handleAuthSuccess} />
        ) : (
          <Tabs
            screenOptions={{
              tabBarShowLabel: false,
              headerShown: false,
              tabBarStyle: styles.tabBar,
            }}
          >
            <Tabs.Screen
              name="(home)"
              options={{
                tabBarIcon: ({ focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    iconName="home-outline"
                    label="Home"
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="(recipes)"
              options={{
                tabBarIcon: ({ focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    iconName="book-outline"
                    label="Recipes"
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="Plus"
              options={{
                tabBarIcon: () => (
                  <View style={styles.fabContainer}>
                    <TouchableOpacity
                      style={styles.fabButton}
                      onPress={openOverlay}
                    >
                      <LinearGradient
                        colors={['#E36820', '#FF8C42']}
                        style={styles.gradient}
                      >
                        <Icon name="plus" size={28} color="white" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                ),
              }}
              listeners={{ tabPress: e => e.preventDefault() }}
            />
            <Tabs.Screen
              name="Diet"
              options={{
                tabBarIcon: ({ focused }) => (
                  <AnimatedTabIcon
                    focused={focused}
                    iconName="notebook-outline"
                    label="Diary"
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
                    iconName="account-outline"
                    label="Profile"
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
        <Animated.View style={[styles.modalBackdrop, { opacity: fadeAnimation }]}>
          <Pressable style={styles.backdropPress} onPress={closeOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnimation }] }
              ]}
            >
              <Text style={styles.modalTitle}>Add Meal</Text>
              <View style={styles.mealButtonsContainer}>
                {[
                  { label: 'Breakfast', icon: 'weather-sunny' },
                  { label: 'Lunch', icon: 'white-balance-sunny' },
                  { label: 'Dinner', icon: 'weather-night' }
                ].map((meal, index) => (
                  <TouchableOpacity
                    key={meal.label}
                    style={styles.mealButton}
                    onPress={closeOverlay}
                  >
                    <LinearGradient
                      colors={['#FFF4E4', '#F5E6D3']}
                      style={styles.mealGradient}
                    >
                      <Icon
                        name={meal.icon}
                        size={32}
                        color="#E36820"
                        style={styles.mealIcon}
                      />
                      <Text style={styles.mealLabel}>{meal.label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeOverlay}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9'
  },
  tabBar: {
    position: 'absolute',
    height: TAB_BAR_HEIGHT,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    top: Platform.OS === 'ios' ? 8 : 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  fabContainer: {
    top: -5,
    shadowColor: '#E36820',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  backdropPress: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
    marginHorizontal: 10,
    marginBottom: Platform.OS === 'ios' ? 30 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#105F3B',
    marginBottom: 25,
    textAlign: 'center',
  },
  mealButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  mealButton: {
    width: width / 3.5,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
  },
  mealGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  mealIcon: {
    marginBottom: 10,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E36820',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  closeText: {
    color: '#68AA64',
    fontSize: 16,
    fontWeight: '600',
  },
});