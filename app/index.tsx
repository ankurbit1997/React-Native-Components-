import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";

interface componentListType {
  name: string;
  path: string;
}

const componentList: componentListType[] = [
  {
    name: "Swipe Button",
    path: "SwipeButton",
  },
  {
    name: "Arc Slider",
    path: "ArcSlider",
  },
  {
    name: "Card Flip",
    path: "CardFlip",
  },
  {
    name: "Perspective Card",
    path: "PerspectiveCard",
  },
  {
    name: "Balance Slider",
    path: "BalanceSlider",
  },
];

export default function Page() {
  return (
    <View style={styles.container}>
      <StatusBar />
      <FlatList
        data={componentList}
        renderItem={({ item, index }) => (
          <Link href={item?.path} asChild>
            <Pressable>
              <View
                style={[
                  styles.card,
                  { backgroundColor: index % 2 !== 0 ? "#1B2430" : "#D6D5A8" },
                ]}
              >
                <Text
                  style={{ color: index % 2 === 0 ? "#1B2430" : "#D6D5A8" }}
                >
                  {item.name}
                </Text>
                <AntDesign
                  name="arrowright"
                  size={24}
                  color={index % 2 === 0 ? "#1B2430" : "#D6D5A8"}
                />
              </View>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

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
