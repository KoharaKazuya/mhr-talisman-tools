/** スキル */
export interface Skill {
  /** スキル名 (日本語名, ID として使う) */
  name: string;
  /** スキルレベル */
  level: number;
}

/** スキルグレード (マカ錬金における内部的に設定されたスキルのレア度) */
export type SkillGrade = typeof skillGrades[number];
export const skillGrades = ["C", "B", "A", "S"] as const;

/** 護石名 */
export const talismanNames = [
  "凪の護石",
  "風立の護石",
  "烈風の護石",
  "鬼雨の護石",
  "初心の護石",
  "山嵐の護石",
  "天雷の護石",
  "神嵐の護石",
];

/** 護石 */
export interface Talisman {
  name: string;
  skills: [Skill] | [Skill, Skill];
  slots: [] | [Slot] | [Slot, Slot] | [Slot, Slot, Slot];
}

/** 装飾品スロット */
export interface Slot {
  level: 1 | 2 | 3;
}

export function createTalisman({
  name,
  skill1,
  skill2,
  level1,
  level2,
  slot1,
  slot2,
  slot3,
}: Partial<{
  name: string;
  skill1: string;
  skill2: string;
  level1: number;
  level2: number;
  slot1: number;
  slot2: number;
  slot3: number;
}>): Talisman {
  if (
    !name ||
    !skill1 ||
    !level1 ||
    (skill2 && !level2) ||
    (!skill2 && level2) ||
    (slot3 && (!slot2 || !slot1)) ||
    (slot2 && !slot1)
  )
    throw new Error("Invalid talisman: 護石に必要なデータが与えられていません");
  if (
    ![1, 2, 3, 4].includes(level1) ||
    (level2 && ![1, 2, 3, 4].includes(level2)) ||
    (slot1 && ![1, 2, 3].includes(slot1)) ||
    (slot2 && ![1, 2, 3].includes(slot2)) ||
    (slot3 && ![1, 2, 3].includes(slot3))
  )
    throw new Error("Invalid talisman: 護石のパラメーターが不正です");

  return {
    name,
    skills: !skill2
      ? [{ name: skill1, level: level1 }]
      : [
          { name: skill1, level: level1 },
          { name: skill2, level: level2 },
        ],
    slots: slot3
      ? [{ level: slot1 }, { level: slot2 }, { level: slot3 }]
      : slot2
      ? [{ level: slot1 }, { level: slot2 }]
      : slot1
      ? [{ level: slot1 }]
      : [],
  } as any;
}
