import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Component from "./Component";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Index = () => {
  const [swiped, setSwiped] = useState(false);

  const handleComplete = (isToggled: boolean) => {
    setSwiped(isToggled);
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ marginBottom: 15, fontSize: 16 }}>
          {swiped ? "Button Swiped" : "Button Not Swiped"}
        </Text>
        <Component onComplete={handleComplete} />
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
