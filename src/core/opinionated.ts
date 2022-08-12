/**
 * 護石の価値を個人的な意見を元に評価するためのモジュール
 *
 * FIXME: ほしいスキルは人それぞれで、大多数の人に納得感のない評価になってしまっているように
 *        感じた。まともにやるには複数のスキルセットをユーザーに入力させ、
 *        共通化のためにセットの継承や、スキルごとの評価値設定など複雑な機能が必要になるが、
 *        現状の実装ではそこまでやる必要がない。そのためこのモジュールは現状使用していない。
 */

import { skill1LevelData } from "./meding-pod-data/anima";
import { skillGradeData } from "./meding-pod-data/common";
import { Skill, Slot, Talisman } from "./mhr";

/** 全武器で有用なスキル */
const commonWorthSkills = [
  "攻撃",
  "見切り",
  "超会心",
  "弱点特効",
  "ひるみ軽減",
  "気絶耐性",
];
/** 各武器で有用なスキル */
const worthSkills: Record<string, string[]> = {
  // 大剣
  greatSword: ["集中", "抜刀術【技】", "抜刀術【力】", "納刀術"],
  // 太刀
  longSword: [
    "達人芸",
    "匠",
    "業物",
    "剛刃研磨",
    "砥石使用高速化",
    "納刀術",
    "渾身",
  ],
  // 片手剣
  swordShield: [
    "達人芸",
    "匠",
    "業物",
    "剛刃研磨",
    "砥石使用高速化",
    "満足感",
    "鈍器使い",
    "心眼",
    "ＫＯ術",
    "スタミナ奪取",
    "毒属性強化",
  ],
  // 双剣
  dualBlades: [
    "達人芸",
    "匠",
    "業物",
    "剛刃研磨",
    "砥石使用高速化",
    "ランナー",
    "火属性攻撃強化",
    "水属性攻撃強化",
    "雷属性攻撃強化",
    "氷属性攻撃強化",
    "龍属性攻撃強化",
  ],
  // ハンマー
  hammer: ["ＫＯ術", "スタミナ奪取", "翔蟲使い"],
  // 狩猟笛
  huntingHorn: [
    "達人芸",
    "匠",
    "業物",
    "剛刃研磨",
    "砥石使用高速化",
    "笛吹き名人",
    "翔蟲使い",
  ],
  // ランス
  lance: [
    "達人芸",
    "匠",
    "業物",
    "剛刃研磨",
    "砥石使用高速化",
    "攻めの守勢",
    "ガード強化",
    "ガード性能",
  ],
  // ガンランス
  gunlance: [
    "達人芸",
    "匠",
    "業物",
    "剛刃研磨",
    "砥石使用高速化",
    "攻めの守勢",
    "ガード強化",
    "ガード性能",
    "翔蟲使い",
    "砲術",
    "砲弾装填",
    "回避距離ＵＰ",
  ],
  // スラッシュアックス
  switchAxe: [
    "達人芸",
    "匠",
    "業物",
    "剛刃研磨",
    "砥石使用高速化",
    "回避距離ＵＰ",
    "回避性能",
    "高速変形",
    "強化持続",
  ],
  // チャージアックス
  chargeBlade: [
    "達人芸",
    "匠",
    "業物",
    "剛刃研磨",
    "砥石使用高速化",
    "回避距離ＵＰ",
    "回避性能",
    "攻めの守勢",
    "ガード強化",
    "ガード性能",
    "砲術",
    "高速変形",
    "鈍器使い",
  ],
  // 操虫棍
  insectGlaive: [
    "達人芸",
    "匠",
    "業物",
    "剛刃研磨",
    "砥石使用高速化",
    "強化持続",
  ],
  // ライトボウガン
  lightBowgun: [
    "通常弾・連射矢強化",
    "貫通弾・貫通矢強化",
    "散弾・拡散矢強化",
    "装填拡張",
    "装填速度",
    "反動軽減",
    "速射強化",
    "渾身",
  ],
  // ヘビィボウガン
  heavyBowgun: [
    "通常弾・連射矢強化",
    "貫通弾・貫通矢強化",
    "散弾・拡散矢強化",
    "装填拡張",
    "装填速度",
    "反動軽減",
    "渾身",
    "ガード強化",
    "ガード性能",
  ],
  // 弓
  bow: [
    "通常弾・連射矢強化",
    "貫通弾・貫通矢強化",
    "散弾・拡散矢強化",
    "装填速度",
    "スタミナ急速回復",
    "体術",
    "火属性攻撃強化",
    "水属性攻撃強化",
    "雷属性攻撃強化",
    "氷属性攻撃強化",
    "龍属性攻撃強化",
  ],
};

export function calculateOpinionatedValue(talisman: Talisman): number {
  const [skill1, skill2] = talisman.skills;

  let value = getSkillValue(skill1);

  SKILL2: if (skill2) {
    for (const weaponGroup of Object.values(worthSkills)) {
      const group = [...weaponGroup, ...commonWorthSkills];
      if (group.includes(skill1.name) && group.includes(skill2.name)) {
        value += getSkillValue(skill2);
        break SKILL2;
      }
    }
    value = Math.max(value, getSkillValue(skill2));
  }

  value += getSlotValue(talisman.slots);

  return value;
}

export function calculateValueRank(
  value: number
): "C" | "B" | "A" | "S" | "SS" {
  if (value < 90) return "C";
  if (value < 110) return "B";
  if (value < 130) return "A";
  if (value < 150) return "S";
  if (value >= 150) return "SS";
  throw new Error(`与えられた value が数値ではありません: ${value}`);
}

const valueByGrade = { S: 100, A: 90, B: 60, C: 30 };
function getSkillValue(skill: Skill): number {
  const { name, level } = skill;

  const grade = skillGradeData.get(name);
  if (!grade) throw new Error(`未知のスキルです: ${name}`);

  const levelData = skill1LevelData.get(name);
  if (!levelData) throw new Error(`未知のスキルです: ${name}`);

  return valueByGrade[grade] / 2 ** (levelData.length - level);
}

const valueBySlotLevel = { 4: 70, 3: 50, 2: 45, 1: 15, 0: 0 };
function getSlotValue(slots: Talisman["slots"]): number {
  return (slots as Slot[]).reduce(
    (accu, slot) => accu + valueBySlotLevel[slot.level ?? 0],
    0
  );
}
