import { Dimensions } from 'react-native';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export function scaleWidth(size: number): number {
  return (WINDOW_WIDTH / BASE_WIDTH) * size;
}

export function scaleHeight(size: number): number {
  return (WINDOW_HEIGHT / BASE_HEIGHT) * size;
}

export function moderateScale(size: number, factor = 0.5): number {
  return size + (scaleWidth(size) - size) * factor;
}
