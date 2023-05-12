import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Component from "./Component";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Index = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Component />
      </View>
    </GestureHandlerRootView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
});
