import { View, Text, Image, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";

const Component = () => {
  //constants
  const CARD_HEIGHT = 360;
  const CARD_WIDTH = 220;

  //shared Values for card
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  //shared Values for images
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => {
    const rX = `${rotateX.value}deg`;
    const rY = `${rotateY.value}deg`;

    return {
      transform: [
        {
          perspective: 400,
        },
        { rotateY: rY },
        { rotateX: rX },
      ],
    };
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      marginBottom: -10,
      zIndex: 300,
      transform: [
        { perspective: 800 },
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  }, []);

  const handleGesture =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: (event) => {
        scale.value = withTiming(1.05);
        rotateX.value = withTiming(
          interpolate(event.y, [0, CARD_HEIGHT], [20, -20], Extrapolate.CLAMP)
        );
        rotateY.value = withTiming(
          interpolate(event.x, [0, CARD_WIDTH], [-20, 20], Extrapolate.CLAMP)
        );
        translateX.value = withTiming(
          interpolate(
            event.x,
            [0, CARD_WIDTH / 2, CARD_WIDTH],
            [-40, 0, 40],
            Extrapolate.CLAMP
          )
        );
        translateY.value = withTiming(
          interpolate(
            event.y,
            [0, CARD_HEIGHT / 2, CARD_HEIGHT],
            [-40, 0, 40],
            Extrapolate.CLAMP
          )
        );
      },
      onActive: (event) => {
        rotateX.value = interpolate(
          event.y,
          [0, CARD_HEIGHT],
          [20, -20],
          Extrapolate.CLAMP
        );
        rotateY.value = interpolate(
          event.x,
          [0, CARD_WIDTH],
          [-20, 20],
          Extrapolate.CLAMP
        );
        translateX.value = interpolate(
          event.x,
          [0, CARD_WIDTH / 2, CARD_WIDTH],
          [-40, 0, 40],
          Extrapolate.CLAMP
        );

        translateY.value = interpolate(
          event.y,
          [0, CARD_HEIGHT / 2, CARD_HEIGHT],
          [-40, 0, 40],
          Extrapolate.CLAMP
        );
      },
      onFinish: () => {
        scale.value = withTiming(1);
        rotateX.value = withSpring(0);
        rotateY.value = withSpring(0);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      },
    });

  return (
    <View>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View
          style={[
            styles.card,
            animatedCardStyle,
            { height: CARD_HEIGHT, width: CARD_WIDTH },
          ]}
        >
          <Animated.View style={animatedImageStyle}>
            <Image
              source={require("../../assets/images/pav-bhaji.png")}
              style={styles.image}
            />
          </Animated.View>
          <View>
            <Text style={styles.heading}>Pav bhaji</Text>
            <Text style={styles.desc}>
              Pav bhaji (Marathi : पाव भाजी) is a fast food dish from India
              consisting of a thick vegetable curry (bhaji) served with a soft
              bread roll (pav). Its origins are in the state of Maharashtra.
            </Text>
          </View>
          <View style={styles.ctaContainer}>
            <View style={styles.addCta}>
              <Text style={{ fontSize: 12, color: "white" }}>Add To Cart</Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Component;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#F5EBE0",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    elevation: 4,
    zIndex: 400,
    shadowRadius: 7,
    shadowOffset: { height: -4, width: 0 },
  },
  image: {
    height: 180,
    width: 190,
    aspectRatio: 1,
    resizeMode: "contain",
    zIndex: 450,
  },
  desc: {
    fontSize: 12,
  },
  heading: {
    fontSize: 16,
    textTransform: "uppercase",
    textAlign: "center",
  },
  ctaContainer: {
    flexDirection: "row",
    marginTop: 10,
  },

  addCta: {
    backgroundColor: "black",
    borderRadius: 8,
    width: "80%",
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
