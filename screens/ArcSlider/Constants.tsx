import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
export const PADDING = 56;
export const SIZE = width - PADDING * 2;
export const STROKE = 25;
export const R = (SIZE - STROKE) / 2;
export const { PI } = Math;
export const TAU = 2 * PI;
export const CENTER = { x: SIZE / 2, y: SIZE / 2 };
export const THUMB_SIZE = 48;

export const normalize = (value: number) => {
  "worklet";
  const rest = value % TAU;
  return rest > 0 ? rest : TAU + rest;
};

export const radToMinutes = (rad: number) => {
  "worklet";
  return (24 * 60 * rad) / TAU;
};

export const getPosFromProgess = (p: number) => {
  const range = 4.7;
  const temp = ((100 - p) * range) / 100;
  return temp - 0.78;
};
