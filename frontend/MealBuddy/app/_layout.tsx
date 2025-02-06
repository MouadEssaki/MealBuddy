import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#105F3B",
          tabBarInactiveTintColor: "#9E9E9E",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            switch (route.name) {
              case "FoodDiary":
                iconName = "book-outline";
                break;
              case "Recipes":
                iconName = "restaurant-outline";
                break;
              case "index":
                iconName = "home-outline";
                break;
              case "Notifications":
                iconName = "notifications-outline";
                break;
              case "Profile":
                iconName = "person-outline";
                break;
            }

            const iconSize = focused ? 33 : 30;

            return (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                <Ionicons name={iconName} size={iconSize} color={focused ? "#fff" : color} />
              </View>
            );
          },
        })}
      >
        <Tabs.Screen name="FoodDiary" options={{ title: "" }} />
        <Tabs.Screen name="Recipes" options={{ title: "" }} />
        <Tabs.Screen name="index" options={{ title: "" }} />
        <Tabs.Screen name="Notifications" options={{ title: "" }} />
        <Tabs.Screen name="Profile" options={{ title: "" }} />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  activeTab: {
    backgroundColor: "#68AA64",
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveTab: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});
