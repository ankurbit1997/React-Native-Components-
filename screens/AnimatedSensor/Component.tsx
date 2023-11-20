import React, { useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const data = [
  {
    name: "Pizza",
    id: 1,
    image: require("../../assets/images/egg.jpg"),
  },
  {
    name: "Burger",
    id: 2,
    image: require("../../assets/images/bread.jpg"),
  },
  {
    name: "Sushi",
    id: 3,
    image: require("../../assets/images/pancake.jpg"),
  },
];

type cardDataType = {
  name: string;
  id: number;
  image: any;
};

const Component = () => {
  const x = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      x.value = e.contentOffset.x;
    },
  });

  const [active, setActive] = useState(0);
  return (
    <View style={styles.container}>
      <Animated.FlatList
        onScroll={scrollHandler}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(item) => <Card cardData={item} />}
        horizontal
        pagingEnabled
        style={{
          flexGrow: 0,
        }}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(
            Math.floor(event.nativeEvent.contentOffset.x) /
              Math.floor(event.nativeEvent.layoutMeasurement.width)
          );

          setActive(index);
          // work with: index
        }}
      />
      <Pagination x={x} active={active} data={data} />
    </View>
  );
};

export default Component;

const Card = ({ cardData }: { cardData: ListRenderItemInfo<cardDataType> }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  return (
    <Image
      source={cardData?.item?.image}
      style={[styles.image, { width: SCREEN_WIDTH - 20, height: 220 }]}
      resizeMode="cover"
    />
  );
};
const Pagination = ({
  data,
  x,
  active,
}: {
  data: cardDataType[];
  x: SharedValue<number>;
  active: number;
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  return (
    <View style={styles.dotContainer}>
      {data.map((_, i) => {
        const dotAnimatedStyle = useAnimatedStyle(() => {
          return {
            backgroundColor: "#000",
            opacity: interpolate(
              x.value,
              [
                SCREEN_WIDTH * (i - 1),
                SCREEN_WIDTH * i,
                SCREEN_WIDTH * (i + 1),
              ],
              [0.2, 1, 0.2],
              Extrapolate.CLAMP
            ),
            width: interpolate(
              x.value,
              [
                SCREEN_WIDTH * (i - 1),
                SCREEN_WIDTH * i,
                SCREEN_WIDTH * (i + 1),
              ],
              [12, 24, 12],
              Extrapolate.CLAMP
            ),
            height: interpolate(
              x.value,
              [
                SCREEN_WIDTH * (i - 1),
                SCREEN_WIDTH * i,
                SCREEN_WIDTH * (i + 1),
              ],
              [10, 16, 10],
              Extrapolate.CLAMP
            ),
          };
        });
        return (
          <Animated.View
            key={i.toString()}
            style={[styles.dot, dotAnimatedStyle]}
          >
            <Animated.Text style={styles.dotText}>
              {active + 1}/{data?.length}
            </Animated.Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    borderRadius: 16,
    marginTop: 40,
    marginHorizontal: 10,
  },
  dot: {
    marginTop: 10,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  dotContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dotText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
});
