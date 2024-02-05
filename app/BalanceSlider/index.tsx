import { View, StyleSheet, Text } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { ReText } from "react-native-redash";

//constants
const SLIDER_WIDTH = 300;
const SLIDER_HEIGHT = 20;
const SWIPE_RANGE = SLIDER_WIDTH / 2 - 4 / 2;
const LEFT_TRIGGER_WIDTH = 86;
const RIGHT_TRIGGER_WIDTH = 226;

//constants

const Component = () => {
  const translationX = useSharedValue(0);
  const context = useSharedValue(0);

  const animatedThumbStyle = useAnimatedStyle(() => {
    const draggedVal = translationX.value + SWIPE_RANGE;
    const cond =
      (draggedVal >= 0 && draggedVal < LEFT_TRIGGER_WIDTH) ||
      (draggedVal > RIGHT_TRIGGER_WIDTH && draggedVal <= SWIPE_RANGE * 2);
    return {
      transform: [{ translateX: translationX.value }],
      height: !cond
        ? withTiming((SLIDER_HEIGHT - 5) * 2)
        : withTiming(SLIDER_HEIGHT - 5),
    };
  });

  const dynamicHeight = useAnimatedStyle(() => {
    const draggedVal = translationX.value + SWIPE_RANGE;
    const cond =
      (draggedVal >= 0 && draggedVal < LEFT_TRIGGER_WIDTH) ||
      (draggedVal > RIGHT_TRIGGER_WIDTH && draggedVal <= SWIPE_RANGE * 2);

    return {
      height: !cond ? withTiming(SLIDER_HEIGHT * 2) : withTiming(SLIDER_HEIGHT),
    };
  });

  const pan = Gesture.Pan()
    .onStart((e) => {
      context.value = translationX.value;
    })
    .onUpdate((e) => {
      if (context.value + e.translationX < -SWIPE_RANGE) {
        translationX.value = -SWIPE_RANGE;
      } else if (context.value + e.translationX > SWIPE_RANGE) {
        translationX.value = SWIPE_RANGE;
      } else {
        translationX.value = e?.translationX + context.value;
      }
    })
    .hitSlop({ left: 10, right: 10 });

  const rightPos = useDerivedValue(() => {
    return -translationX.value + SWIPE_RANGE + 10;
  });

  const leftPos = useDerivedValue(() => {
    const temp =
      translationX.value + SWIPE_RANGE + 10 > SWIPE_RANGE * 2
        ? translationX.value + SWIPE_RANGE
        : translationX.value + SWIPE_RANGE + 10;
    return temp;
  });

  const coffeePercentage = useDerivedValue(() => {
    const percentage =
      ((translationX.value + SWIPE_RANGE) / (SWIPE_RANGE * 2)) * 100;
    return ` ${percentage.toFixed(0)}%`;
  });

  const milkPercentage = useDerivedValue(() => {
    const percentage =
      ((translationX.value + SWIPE_RANGE) / (SWIPE_RANGE * 2)) * 100;
    return `${(100 - percentage).toFixed(0)}% `;
  });

  const labelTranslateStyle = useAnimatedStyle(() => {
    const draggedVal = translationX.value + SWIPE_RANGE;
    const cond =
      (draggedVal >= 0 && draggedVal < LEFT_TRIGGER_WIDTH) ||
      (draggedVal > RIGHT_TRIGGER_WIDTH && draggedVal <= SWIPE_RANGE * 2);
    return {
      transform: [
        {
          translateY: !cond ? withTiming(12) : withTiming(-24),
        },
      ],
    };
  });

  const coffeeOpacity = useAnimatedStyle(() => {
    const purePercentage =
      ((translationX.value + SWIPE_RANGE) / (SWIPE_RANGE * 2)) * 100;
    return {
      opacity: interpolate(purePercentage, [0, 50, 100], [0.6, 0.6, 1]),
    };
  });

  const milkOpacity = useAnimatedStyle(() => {
    const purePercentage =
      ((translationX.value + SWIPE_RANGE) / (SWIPE_RANGE * 2)) * 100;
    return {
      opacity: interpolate(purePercentage, [0, 50, 100], [1, 0.6, 0.6]),
    };
  });

  return (
    <View>
      <Animated.View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            position: "absolute",
            width: SLIDER_WIDTH,
            paddingHorizontal: 5,
          },
          labelTranslateStyle,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#637A9F", fontSize: 12, fontWeight: "400" }}>
            COFFEE
          </Text>
          <ReText
            text={coffeePercentage}
            style={{ color: "white", fontSize: 12, fontWeight: "500" }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ReText
            text={milkPercentage}
            style={{ color: "white", fontSize: 12, fontWeight: "500" }}
          />
          <Text style={{ color: "#9F6348", fontSize: 12, fontWeight: "400" }}>
            MILK
          </Text>
        </View>
      </Animated.View>
      <Animated.View
        style={[{ width: SLIDER_WIDTH }, styles.sliderContainer, dynamicHeight]}
      >
        <Animated.View
          style={[
            { left: 0, right: rightPos, paddingLeft: 5 },
            styles.fillLeft,
            dynamicHeight,
            coffeeOpacity,
          ]}
        />
        <Animated.View
          style={[
            {
              left: leftPos,
              right: 0,
              alignItems: "flex-end",
              paddingRight: 5,
            },
            styles.fillRight,
            dynamicHeight,
            milkOpacity,
          ]}
        />
        <GestureDetector gesture={pan}>
          <Animated.View style={[animatedThumbStyle, styles.sliderThumb]} />
        </GestureDetector>
      </Animated.View>
    </View>
  );
};

const BalanceSlider = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Component />
      </View>
    </GestureHandlerRootView>
  );
};

export default BalanceSlider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  leftLabel: {
    color: "#3498db",
  },
  rightLabel: {
    color: "#2ecc71",
  },
  sliderContainer: {
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "white",
  },
  fillLeft: {
    backgroundColor: "#637A9F80",
    position: "absolute",
    borderRadius: 4,
  },
  fillRight: {
    backgroundColor: "#9F634880",
    position: "absolute",
    borderRadius: 4,
  },
  sliderThumb: {
    width: 4,
    borderRadius: 2,
    backgroundColor: "white",
    position: "absolute",
  },
});
