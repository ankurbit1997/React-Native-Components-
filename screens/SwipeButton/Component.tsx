import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

const SWIPER_HEIGHT = 60;
const SWIPER_PADDDING = 5;
const PADDING = 30;
const CONTAINER_WIDTH = Dimensions.get("screen").width - PADDING * 2;

const SWIPEABLE_DIMENSIONS =
  SWIPER_HEIGHT - SWIPER_PADDDING * 2 - 2 * SWIPER_PADDDING;

const H_SWIPE_RANGE =
  CONTAINER_WIDTH - 2 * SWIPER_PADDDING - SWIPEABLE_DIMENSIONS - 10;

interface ComponentProps {
  onComplete: (isToggled: boolean) => void;
}

const Component = ({ onComplete }: ComponentProps) => {
  const [toggled, setToggled] = useState(false);

  const translationX = useSharedValue(0);

  type ContextType = {
    translateX: number;
    completed: boolean;
  };

  const handleComplete = (isToggled: boolean) => {
    if (isToggled !== toggled) {
      setToggled(isToggled);
      onComplete(isToggled);
    }
  };

  const handleGesture = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.translateX = translationX.value;
      context.completed = toggled;
    },
    onActive: (event, context) => {
      let newValue;
      if (context.completed) {
        newValue = H_SWIPE_RANGE + event.translationX;
      } else {
        newValue = event.translationX;
      }

      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        translationX.value = newValue;
      }
    },

    onFinish: () => {
      if (translationX.value < CONTAINER_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        translationX.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        translationX.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const rThumbStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translationX.value,
      [0, H_SWIPE_RANGE],
      [0, 180],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translationX.value },
        { rotateZ: `${rotate.toString()}deg` },
      ],
    };
  });

  return (
    <View style={styles.swipeContainer}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View style={[rThumbStyle, styles.swipeThumb]}>
          <AntDesign name="arrowright" size={22} color="#354259" />
        </Animated.View>
      </PanGestureHandler>
      <Text style={styles.swipeText}>{"Swipe To Complete"}</Text>
    </View>
  );
};

export default Component;

const styles = StyleSheet.create({
  swipeContainer: {
    height: SWIPER_HEIGHT,
    backgroundColor: "#354259",
    borderRadius: SWIPER_HEIGHT,
    width: CONTAINER_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeThumb: {
    backgroundColor: "#C2DED1",
    height: SWIPER_HEIGHT - SWIPER_PADDDING * 2,
    width: SWIPER_HEIGHT - SWIPER_PADDDING * 2,
    borderRadius: SWIPER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: SWIPER_PADDDING,
    top: SWIPER_PADDDING,
    zIndex: 5,
  },
  swipeText: {
    fontSize: 16,
    color: "#C2DED1",
    fontWeight: "600",
  },
});
