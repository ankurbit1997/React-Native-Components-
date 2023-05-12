import React from "react";
import { Text, TextInput, View } from "react-native";
import Animated, {
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { CsmButton } from "@rrn-ui/react-native-ui";

const Component = () => {
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 10,
  }); // <- initialization

  const animatedSensor2 = useAnimatedSensor(SensorType.GRAVITY, {
    interval: 10,
  }); // <- initialization

  const style = useAnimatedStyle(() => {
    const yaw = Math.abs(animatedSensor.sensor.value.yaw);
    const pitch = Math.abs(animatedSensor.sensor.value.pitch);

    return {
      height: withTiming(yaw * 200 + 20, { duration: 100 }), // <- usage
      width: withTiming(pitch * 200 + 20, { duration: 100 }), // <- usage
    };
  });

  return (
    <View>
      <Text> sensor</Text>
      {/* <Animated.View style={[{ backgroundColor: "black" }, style]} /> */}
    </View>
  );
};

export default Component;
