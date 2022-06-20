import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  CENTER,
  normalize,
  R,
  SIZE,
  STROKE,
  getPosFromProgess,
  THUMB_SIZE,
} from "./Constants";
import { canvas2Polar, polar2Canvas } from "react-native-redash";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type ContextType = {
  theta: number;
  translateX: number;
  translateY: number;
};

type SliderProps = {
  progress: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  daysSlid: number;
  currentMonth: string;
  notAvailToday: boolean;
};

const Component = ({
  progress,
  onChange,
  limit,
  daysSlid,
  currentMonth,
  notAvailToday,
}: SliderProps) => {
  //arc start and end value
  const start = useSharedValue(1.25 * Math.PI);
  const end = useSharedValue(1.75 * Math.PI);

  //arc start and end pos
  const startPos = useDerivedValue(() =>
    polar2Canvas({ theta: start.value, radius: R }, CENTER)
  );
  const endPos = useDerivedValue(() =>
    polar2Canvas({ theta: end.value, radius: R }, CENTER)
  );

  //slider thumb inital value
  const startThumb = useSharedValue(getPosFromProgess(progress));
  //slider thumb inital pos
  const thumbPos = useDerivedValue(() =>
    polar2Canvas({ theta: startThumb.value, radius: R }, CENTER)
  );

  //thumb initial start value
  const disabledStart = useSharedValue<number>(getPosFromProgess(limit));
  //thumb initial start pos
  const disabledStartPos = useDerivedValue(() =>
    polar2Canvas({ theta: disabledStart.value, radius: R }, CENTER)
  );

  // const animatedThumb = useSharedValue(getPosFromProgess(progress));
  // const animatedthumbPos = useDerivedValue(() =>
  //   polar2Canvas({ theta: animatedThumb.value, radius: R }, CENTER)
  // );

  // const animatedThumbI = useSharedValue(getPosFromProgess(progress / 2));
  // const animatedthumbPosI = useDerivedValue(() =>
  //   polar2Canvas({ theta: animatedThumbI.value, radius: R }, CENTER)
  // );

  // useEffect(() => {
  //   translateX.value = withDelay(
  //     300,
  //     withSequence(
  //       withTiming(animatedthumbPosI.value.x, { duration: 300 }),
  //       withTiming(animatedthumbPos.value.x, { duration: 300 })
  //     )
  //   );
  //   translateY.value = withDelay(
  //     300,
  //     withSequence(
  //       withTiming(animatedthumbPosI.value.y, { duration: 300 }),
  //       withTiming(animatedthumbPos.value.y, { duration: 300 })
  //     )
  //   );
  // }, []);

  //translation values
  const translateX = useSharedValue(thumbPos.value.x);
  const translateY = useSharedValue(thumbPos.value.y);
  const arcTheta = useSharedValue<number>(0);

  const handleCursorDrag = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (e, context) => {
      const x = e.translationX + context.translateX;
      const y = e.translationY + context.translateY;
      const { theta } = canvas2Polar({ x, y }, CENTER);
      if (
        theta < -0.75 * Math.PI ||
        (theta < Math.PI && theta > -0.25 * Math.PI)
      ) {
        arcTheta.value = theta;
        const { x: tx, y: ty } = polar2Canvas({ theta, radius: R }, CENTER);
        translateX.value = tx;
        translateY.value = ty;
      }
    },
    onEnd: () => {},
  });

  //utiliy to calculate % from normalised arctheta value
  const getValue = useCallback((result: number) => {
    const temp = result + 0.78;
    const range = 4.7;
    const percentage = Math.round(100 - (temp * 100) / range);
    onChange(percentage);
  }, []);

  // normalize theta value for calculating %

  useDerivedValue(() => {
    if (
      arcTheta.value !== 0 &&
      normalize(arcTheta.value) > 0 &&
      normalize(arcTheta.value) <= 1.25 * Math.PI
    ) {
      runOnJS(getValue)(normalize(arcTheta.value));
    } else if (arcTheta.value !== 0) {
      runOnJS(getValue)(arcTheta.value);
    }
  });

  // animated props for active part
  const animatedProps = useAnimatedProps(() => {
    // calculation to let arc take the longest path always
    const isSweep =
      normalize(arcTheta.value) < 0.78 ||
      (progress > 60 ? normalize(arcTheta.value) > 6 : false) ||
      (arcTheta.value! < 0 && arcTheta.value! > -1);

    return {
      d: `M ${startPos.value.x} ${startPos.value.y} A ${R} ${R} 1 ${
        isSweep ? 1 : 0
      } 1 ${translateX.value} ${translateY.value} `,
    };
  });

  // animated props for disabled part
  const animatedPropsDisabled = useAnimatedProps(() => {
    return {
      d: `M ${disabledStartPos.value.x} ${disabledStartPos.value.y} A ${R} ${R} 0 0 1 ${translateX.value} ${translateY.value} `,
      strokeWidth: notAvailToday ? STROKE : 0,
    };
  });

  // partition start value
  const partitionStart = useSharedValue<number>(
    getPosFromProgess(limit - 0.27)
  );
  const partitionEnd = useSharedValue<number>(getPosFromProgess(limit + 0.27));
  // partition startpos pos
  const partitionStartPos = useDerivedValue(() =>
    polar2Canvas({ theta: partitionStart.value, radius: R }, CENTER)
  );
  const partitionEndPos = useDerivedValue(() =>
    polar2Canvas({ theta: partitionEnd.value, radius: R }, CENTER)
  );

  const cursorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value - THUMB_SIZE / 2 },
        { translateY: translateY.value - THUMB_SIZE / 2 },
      ],
      position: "absolute",
    };
  });

  return (
    <View>
      <Svg height={SIZE * 1.05} width={SIZE}>
        <G transform={"translate(0 10)"}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="1" stopColor={"#27ABA7"} stopOpacity="1" />
              <Stop offset="0" stopColor={"#A3E3E3"} stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <AnimatedPath
            stroke={"#ccc"}
            d={`M ${startPos.value.x} ${startPos.value.y} A ${R} ${R} 1 1 1 ${endPos.value.x} ${endPos.value.y} `}
            strokeLinecap={"round"}
            strokeWidth={STROKE}
          />
          <AnimatedPath
            animatedProps={animatedProps}
            stroke={"url(#grad)"}
            strokeWidth={STROKE}
            strokeLinecap={"round"}
          />
          <AnimatedPath
            animatedProps={animatedPropsDisabled}
            stroke={"#9E9E9E"}
            strokeLinecap={"butt"}
          />
          <AnimatedPath
            stroke={progress > limit ? "#27ABA7" : "#ccc"}
            strokeLinecap={"butt"}
            strokeWidth={STROKE * 1.3}
            d={`M ${partitionStartPos.value.x} ${partitionStartPos.value.y} A ${R} ${R} 1 0 1 ${partitionEndPos.value.x} ${partitionEndPos.value.y}`}
          />
        </G>
      </Svg>
      <PanGestureHandler onGestureEvent={handleCursorDrag}>
        <Animated.View style={[thumbStyle.view, cursorStyle]}>
          <Text style={thumbStyle.subText}>{currentMonth}</Text>
          <Text style={thumbStyle.text}>{daysSlid}</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Component;

const thumbStyle = StyleSheet.create({
  view: {
    height: THUMB_SIZE,
    width: THUMB_SIZE,
    backgroundColor: "white",
    borderRadius: THUMB_SIZE,
    borderWidth: 2.5,
    borderColor: "#27ABA7",
    top: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9E9E9E",
  },
  subText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9E9E9E",
  },
});
