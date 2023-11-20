import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AntDesign } from "@expo/vector-icons";

interface componentListType {
  name: string;
  path: keyof RootStackParamList;
}

const componentList: componentListType[] = [
  {
    name: "Swipe Button",
    path: "swipe-button",
  },
  {
    name: "Arc Slider",
    path: "arc-slider",
  },
  {
    name: "Card Flip",
    path: "card-flip",
  },
  {
    name: "Perspective Card",
    path: "perspective-card",
  },
  {
    name: "Carousel",
    path: "card-carousel",
  },
];

type MainScreenProps = NativeStackScreenProps<RootStackParamList, "Main">;

const Main = ({ navigation }: MainScreenProps) => {
  return (
    <View style={styles.container}>
      <StatusBar />
      <FlatList
        data={componentList}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => navigation.navigate(item.path)}>
            <View
              style={[
                styles.card,
                { backgroundColor: index % 2 !== 0 ? "#1B2430" : "#D6D5A8" },
              ]}
            >
              <Text style={{ color: index % 2 === 0 ? "#1B2430" : "#D6D5A8" }}>
                {item.name}
              </Text>
              <AntDesign
                name="arrowright"
                size={24}
                color={index % 2 === 0 ? "#1B2430" : "#D6D5A8"}
              />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  card: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: "#D6D5A8",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
