import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import React from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const Component = () => {
  const spin = useSharedValue<number>(0);

  const rStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [0, 180]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    };
  }, []);

  const bStyle = useAnimatedStyle(() => {
    const spinVal = interpolate(spin.value, [0, 1], [180, 360]);
    return {
      transform: [
        {
          rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
        },
      ],
    };
  }, []);

  return (
    <View>
      <View>
        <Animated.View style={[Styles.front, rStyle]}>
          <Text>Front View</Text>
        </Animated.View>
        <Animated.View style={[Styles.back, bStyle]}>
          <Text>Back</Text>
        </Animated.View>
      </View>
      <Pressable
        onPress={() => (spin.value = spin.value ? 0 : 1)}
        style={{ marginTop: 30, alignItems: "center" }}
      >
        <Text style={{ fontSize: 16 }}>Flip</Text>
      </Pressable>
    </View>
  );
};

export default Component;

const Styles = StyleSheet.create({
  front: {
    height: 400,
    width: 250,
    backgroundColor: "#D8D9CF",
    borderRadius: 16,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    height: 400,
    width: 250,
    backgroundColor: "#FF8787",
    borderRadius: 16,
    backfaceVisibility: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
