import { calculateGenerationChance } from "./chance-calculator";
import { Talisman } from "./mhr";

describe("calculateGenerationChance", () => {
  const table: Array<[string, Talisman, number]> = [
    [
      "攻撃特化神護石",
      {
        name: "天上の護石",
        skills: [
          { name: "超会心", level: 2 },
          { name: "弱点特効", level: 2 },
        ],
        slots: [{ level: 4 }, { level: 1 }, { level: 1 }],
      },
      (((0.08 / 16) * 0.1 * 0.2 * 0.23) / 33) * 0.15 * 0.02 * 0.2 * 0.2,
    ],
    [
      "回避特化神護石",
      {
        name: "天上の護石",
        skills: [
          { name: "回避性能", level: 3 },
          { name: "回避距離ＵＰ", level: 2 },
        ],
        slots: [{ level: 4 }, { level: 2 }, { level: 1 }],
      },
      (((0.49 / 31) * 0.15 * 1 * 0.49) / (31 - 1)) * 0.3 * 0.06 * 0.2 * 0.2,
    ],
    [
      "レアゴミ護石代表",
      {
        name: "天上の護石",
        skills: [{ name: "ジャンプ鉄人", level: 1 }],
        slots: [],
      },
      0,
    ],
    [
      "初心の護石",
      {
        name: "初心の護石",
        skills: [
          { name: "見切り", level: 1 },
          { name: "壁面移動", level: 1 },
        ],
        slots: [],
      },
      // 同順 (見切り、壁面移動)
      (((0.23 / 33) * 1 * 0.3 * 0.2) / 31) * 1 +
        // 逆順 (壁面移動、見切り)
        (((0.2 / 31) * 1 * 1 * 0.23) / 33) * 1,
    ],
  ];
  for (const [testName, talisman, expected] of table) {
    test(testName, () => {
      const actual = calculateGenerationChance(talisman);
      expect(Math.log10(actual)).toBeCloseTo(Math.log10(expected), 15);
    });
  }
});
