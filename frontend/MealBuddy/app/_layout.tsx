import { Tabs } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';

// Example animated icon for other tabs.
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
  const [overlayVisible, setOverlayVisible] = useState(false);
  const slideAnimation = useRef(new Animated.Value(300)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

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
      })
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

  return (
    <>
      <Tabs screenOptions={{ tabBarShowLabel: false }}>
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
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

        {/* Dummy Plus Screen using an image */}
        <Tabs.Screen
          name="Plus" // Dummy route; you should have a dummy file for it.
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
              // Prevent navigation; we only want the overlay.
              e.preventDefault();
              openOverlay();
            },
          }}
        />

        {/* Recipes Tab */}
        <Tabs.Screen
          name="Recipes"
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

        {/* Food Diary Tab */}
        <Tabs.Screen
          name="FoodDiary"
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
      </Tabs>

      {/* Modal Overlay */}
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
            <Text style={{ fontSize: 35, fontWeight: "bold", color:"#b85317" }}>Add a meal:</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                console.log('Matin pressed');
                closeOverlay();
              }}
            >
              <Text style={styles.buttonText}>Breakfast</Text>
              <Image source={require('../assets/bottomBar/Light/sunrise.png')} style={{ width: 35, height: 35 }} />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  console.log('Midi pressed');
                  closeOverlay();
                }}
              >
                <Text style={styles.buttonText}>Lunch</Text>
                <Image source={require('../assets/bottomBar/Light/sun.png')} style={{ width: 35, height: 35 }} />
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  console.log('Soir pressed');
                  closeOverlay();
                }}
              >
                <Text style={styles.buttonText}>Dinner</Text>
                <Image source={require('../assets/bottomBar/Light/sunset.png')} style={{ width: 35, height: 35 }} />
              </Pressable>
            </View>
            <Pressable style={styles.closeButton} onPress={closeOverlay}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  plusImage: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //box shadow
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 15,
    shadowOpacity: 0.35,
    elevation: 5, // For Android
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
    height: 8 
  },
  shadowRadius: 24,
  shadowOpacity: 1, // We set this to 1 because the opacity is already in the shadowColor
  elevation: 8, // For Android, adjust this value as needed
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
  },
  closeText: {
    color: '#b85317',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
