import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "./screens/Main";
import { RootStackParamList } from "./types";
import SwipeScreen from "./screens/SwipeButton";
import ArcSliderScreen from "./screens/ArcSlider";
import CardFlipScreen from "./screens/CardFlip";
import PerspectiveCard from "./screens/PerspectiveCard";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          options={{ title: "Components List" }}
          name="Main"
          component={Main}
        />
        <Stack.Screen
          options={{ title: "Swipe Button", headerBackTitleVisible: false }}
          name="swipe-button"
          component={SwipeScreen}
        />
        <Stack.Screen
          options={{ title: "Arc Slider", headerBackTitleVisible: false }}
          name="arc-slider"
          component={ArcSliderScreen}
        />
        <Stack.Screen
          options={{ title: "Card Flip", headerBackTitleVisible: false }}
          name="card-flip"
          component={CardFlipScreen}
        />
        <Stack.Screen
          options={{ title: "Card Flip", headerBackTitleVisible: false }}
          name="perspective-card"
          component={PerspectiveCard}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
