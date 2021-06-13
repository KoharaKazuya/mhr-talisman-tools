import { Offset, Rect, Size } from "../core/coordinate";

export const videoSize: Size = {
  width: 1280,
  height: 720,
};
export const anchorSize: Size = {
  width: 81,
  height: 17,
};
export const typeSize: Size = {
  width: 81,
  height: 18,
};
export const skillNameSize: Size = {
  width: 150,
  height: 16,
};
export const skillLevelSize: Size = {
  width: 16,
  height: 16,
};
export const slotSize: Size = {
  width: 24,
  height: 19,
};

export const videoRect: Rect = {
  x: 0,
  y: 0,
  ...videoSize,
};

export const anchorRect: Rect = {
  x: 1095,
  y: 242,
  ...anchorSize,
};

export const typeRect: Rect = {
  x: 1056,
  y: 153,
  ...typeSize,
};

export const skillName1Rect: Rect = {
  x: 1037,
  y: 268,
  ...skillNameSize,
};
export const skillName2Rect: Rect = {
  x: 1037,
  y: 319,
  ...skillNameSize,
};

export const skillLevel1Rect: Rect = {
  x: 1237,
  y: 293,
  ...skillLevelSize,
};
export const skillLevel2Rect: Rect = {
  x: 1237,
  y: 344,
  ...skillLevelSize,
};

export const slot1Rect: Rect = {
  x: 1168,
  y: 203,
  ...slotSize,
};
export const slot2Rect: Rect = {
  x: 1196,
  y: 203,
  ...slotSize,
};
export const slot3Rect: Rect = {
  x: 1224,
  y: 203,
  ...slotSize,
};

/** 装備 BOX での UI を記述としたときの錬金結果の UI の座標位置 */
export const meldingResult: Offset = {
  x: -263,
  y: 12,
};
