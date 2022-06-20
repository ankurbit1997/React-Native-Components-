import { StyleSheet, Text, Vibration, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Component from "./Component";

const getThumbDate = (progress: number) => {
  // calculating date by slider position
  const normalizedPrecentage = progress === 0 ? 1 : progress;
  const tempDragged = Math.ceil(normalizedPrecentage / (100 / 28));
  const draggedDays = tempDragged === 0 ? tempDragged : tempDragged;
  const currentMonth = "JUN";
  return { draggedDays, currentMonth };
};

const Index = () => {
  const didMountRef = useRef(false);
  const [progress, setProgress] = useState(40);

  const limit = 40;

  const isAmountNotAllowed = progress > limit;

  const { draggedDays } = getThumbDate(progress);

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
        <Component
          daysSlid={draggedDays}
          progress={progress}
          limit={limit}
          onChange={setProgress}
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
