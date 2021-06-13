import { calculateGenerationChance } from "./chance-calculator";
import { Talisman } from "./mhr";

describe("calculateGenerationChance", () => {
  const table: Array<[string, Talisman, number]> = [
    [
      "攻撃特化神護石",
      {
        name: "神嵐の護石",
        skills: [
          { name: "超会心", level: 2 },
          { name: "弱点特効", level: 2 },
        ],
        slots: [{ level: 3 }, { level: 1 }, { level: 1 }],
      },
      (((0.03 / 16) * 0.05 * 0.2 * 0.15) / 26) * 0.1 * 0.02 * 0.1 * 0.1,
    ],
    [
      "回避特化神護石",
      {
        name: "神嵐の護石",
        skills: [
          { name: "回避性能", level: 3 },
          { name: "回避距離ＵＰ", level: 2 },
        ],
        slots: [{ level: 3 }, { level: 2 }, { level: 1 }],
      },
      (((0.52 / 30) * 0.05 * 1 * 0.52) / (30 - 1)) * 0.25 * 0.1 * 0.1 * 0.1,
    ],
    [
      "レアゴミ護石代表",
      {
        name: "神嵐の護石",
        skills: [{ name: "ジャンプ鉄人", level: 1 }],
        slots: [],
      },
      // スキル1にジャンプ鉄人が付く確率
      (0.03 / 16) * 1 +
        // スキル2にジャンプ鉄人が付く確率
        /* スキル1: S */ (0.03 * 0.2 * 0.03) / (16 - 1) +
        /* スキル1: A */ (0.15 * 0.4 * 0.03) / 16 +
        /* スキル1: B */ (0.52 * 1 * 0.03) / 16 +
        /* スキル1: C */ (0.3 * 1 * 0.03) / 16,
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
      (((0.15 / 26) * 1 * 0.4 * 0.3) / 29) * 1 +
        // 逆順 (壁面移動、見切り)
        (((0.3 / 29) * 1 * 1 * 0.15) / 26) * 1,
    ],
  ];
  for (const [testName, talisman, expected] of table) {
    test(testName, () => {
      const actual = calculateGenerationChance(talisman);
      expect(Math.log10(actual)).toBeCloseTo(Math.log10(expected), 15);
    });
  }
});
