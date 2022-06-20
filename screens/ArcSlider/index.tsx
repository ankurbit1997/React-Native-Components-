import { StyleSheet, Text, Vibration, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Component from "./Component";

const Index = () => {
  const didMountRef = useRef(false);
  const [progress, setProgress] = useState(40);

  const limit = 40;

  const isAmountNotAllowed = progress > limit;

  useEffect(() => {
    //dont vibrate on first mount
    if (didMountRef.current) {
      Vibration.vibrate([0, 20]);
    } else {
      didMountRef.current = true;
    }
  }, [isAmountNotAllowed]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ marginBottom: 30 }}>{progress}%</Text>
        <Component progress={progress} limit={limit} onChange={setProgress} />
      </View>
    </GestureHandlerRootView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
