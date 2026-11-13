export type Point = { x: number; y: number };

export type MapState = {
  center: Point;
  scale: number;
  isPinching: boolean;
};
