export type Size = {
  width: number;
  height: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Offset = {
  x: number;
  y: number;
};

export function add(rect: Rect, offset: Offset): Rect {
  return { ...rect, x: rect.x + offset.x, y: rect.y + offset.y };
}
