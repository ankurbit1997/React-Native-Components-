import { StyleSheet, Text, Vibration, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Component from "./Component";

const Index = () => {
  const [progress, setProgress] = useState(0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>{progress}</Text>
        <Component
          // daysSlid={12}
          progress={progress}
          // limit={20}
          // currentMonth={"JUN"}
          onChange={setProgress}
          // notAvailToday={true}
        />
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
