/**
 * このモジュールは護石の確率を計算するために以下などを参考に実装
 * @see https://www.reddit.com/r/MonsterHunterMeta/comments/mn1gmo/talisman_melding_probabilities_and_system_guide/
 * @see https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQbGSXThYV1IwAp1nffNmnvRZi_GiZwtwUq4lsGfzH04NLmVhmbViEpvSWstl05qXt3DqnXeBiDLC3C/pubhtml#
 */

import {
  deco1SlotWeightedTable,
  deco2SlotWeightedTable,
  deco3SlotWeightedTable,
  secondSkillProbability,
  skill1LevelData,
  skill2LevelData,
  skillGradeProbabilities,
} from "./meding-pod-data/anima";
import { skillGradeData } from "./meding-pod-data/common";
import { Skill, SkillGrade, skillGrades, Slot, Talisman } from "./mhr";

/**
 * 与えられた護石と同等またはそれ以上 (= 上位互換のスキルおよびスロットを持つもの)
 * の護石がマカ錬金 (神気) で生成される確率を計算する
 */
export function calculateGenerationChance(talisman: Talisman): number {
  const { skills, slots } = talisman;
  const [skill1, skill2] = skills;

  // 基本式:
  // = (スキルグレード決定時、あるグレード G1 が選択される確率)
  // / (グレード G1 に属するスキルの数)
  // * (スキル1のスキルレベル決定時、あるスキルレベル以上のスキルレベルになる確率)
  // * (スキル2が付く確率)
  // * (スキルグレード決定時、あるグレード G2 が選択される確率)
  // / (グレード G2 に属するスキルの数 (G1 = G2 の場合 -1))
  // * (スキル2のスキルレベル決定時、あるスキルレベル以上のスキルレベルになる確率)
  // * (スロットの決定時、あるスロット数以上のスロット数になる確率)

  if (skill2) {
    // スキル2がある場合、skill1・skill2 が同じ順でまたは逆順で選択される確率を計算する

    const skill1Grade = getSkillGrade(skill1);
    const skill2Grade = getSkillGrade(skill2);
    const sameGrade = skill1Grade === skill2Grade;
    const skillGradeChance1 = getSkillGradeChance(skill1Grade);
    const skillGradeChance2 = getSkillGradeChance(skill2Grade);
    const size1 = getNumOfSkillsInGrade(skill1Grade);
    const size2 = getNumOfSkillsInGrade(skill2Grade);
    const slotChance = getBetterSlotChance(slots, skill1Grade, skill2Grade);

    // 同じ順
    const levelChance1 = getBetterSkillLevelChance(1, skill1);
    const levelChance2 = getBetterSkillLevelChance(2, skill2);
    const place2Chance = getSkill2Chance(skill1Grade);
    const sameOrderChance =
      (((skillGradeChance1 / size1) *
        levelChance1 *
        place2Chance *
        skillGradeChance2) /
        (sameGrade ? size2 - 1 : size2)) *
      levelChance2 *
      slotChance;

    // 逆順
    const levelChance1Rev = getBetterSkillLevelChance(1, skill2);
    const levelChance2Rev = getBetterSkillLevelChance(2, skill1);
    const place2ChanceRev = getSkill2Chance(skill2Grade);
    const reverseChance =
      (((skillGradeChance2 / size2) *
        levelChance1Rev *
        place2ChanceRev *
        skillGradeChance1) /
        (sameGrade ? size1 - 1 : size1)) *
      levelChance2Rev *
      slotChance;

    return sameOrderChance + reverseChance;
  } else {
    // スキル2がない場合、skill1 がスキル1またはスキル2として選択される確率を計算する

    const skillGrade = getSkillGrade(skill1);
    const skillGradeChance = getSkillGradeChance(skillGrade);
    const size = getNumOfSkillsInGrade(skillGrade);

    // スキル1として選択される確率
    const levelChance1 = getBetterSkillLevelChance(1, skill1);
    const place2Chance = getSkill2Chance(skillGrade);
    let slotChance1 = getBetterSlotChance(slots, skillGrade);
    let chance1 =
      (skillGradeChance / size) *
      levelChance1 *
      (1 - place2Chance) *
      slotChance1;
    for (const skillGrade2 of skillGrades) {
      const skillGradeChance2 = getSkillGradeChance(skillGrade2);
      const slotChance2 = getBetterSlotChance(slots, skillGrade, skillGrade2);
      chance1 +=
        (skillGradeChance / size) *
        levelChance1 *
        place2Chance *
        skillGradeChance2 *
        slotChance2;
    }

    // スキル2として選択される確率
    let chance2 = 0;
    for (const skillGrade1 of skillGrades) {
      const sameGrade = skillGrade1 === skillGrade;
      const skillGradeChance1 = getSkillGradeChance(skillGrade1);
      const place2Chance = getSkill2Chance(skillGrade1);
      const slotChance2 = getBetterSlotChance(slots, skillGrade, skillGrade1);
      chance2 +=
        ((skillGradeChance1 * place2Chance * skillGradeChance) /
          (sameGrade ? size - 1 : size)) *
        slotChance2;
    }
    const levelChance2 = getBetterSkillLevelChance(2, skill1);
    chance2 *= levelChance2;

    return chance1 + chance2;
  }
}

/** 指定したスキルのグレードを返す */
function getSkillGrade(skill: Skill): SkillGrade {
  const { name } = skill;
  const grade = skillGradeData.get(name);
  if (!grade) throw new Error(`未知のスキルです: ${name}`);
  return grade;
}

/** グレードを選択するとき、指定したグレードが選ばれる確率を返す */
function getSkillGradeChance(grade: SkillGrade): number {
  return skillGradeProbabilities[grade] / 100;
}

/** 指定したグレードのスキルがいくつあるか返す */
function getNumOfSkillsInGrade(grade: SkillGrade): number {
  let count = 0;
  for (const [, g] of Array.from(skillGradeData.entries()))
    if (g === grade) count += 1;
  return count;
}

/** スキルのレベルを選択するとき、指定したスキル以上 (同じ種類で同じかより大きいレベル) のスキルが選ばれる確率を返す */
function getBetterSkillLevelChance(place: 1 | 2, skill: Skill): number {
  const { name, level } = skill;
  const weights =
    (place === 1 ? skill1LevelData : skill2LevelData).get(name) ?? [];
  const sum = weights.slice(level - 1).reduce((accu, x) => accu + x, 0);
  return sum / 100;
}

/** スキル2を付けるかどうか選択するとき、付けることが選ばれる確率を返す */
function getSkill2Chance(skill1Grade: SkillGrade): number {
  return secondSkillProbability[skill1Grade] / 100;
}

/** 指定されたスキルを持つ護石のスロットを選択するとき、指定されたスロット以上のスロットが付く確率を返す */
function getBetterSlotChance(
  slots: Talisman["slots"],
  skillGrade1: SkillGrade,
  skillGrade2?: SkillGrade
): number {
  const slot1 = slots[0]?.level ?? 0;
  const slot2 = slots[1]?.level ?? 0;
  const slot3 = slots[2]?.level ?? 0;
  const demand = [slot1, slot2, slot3].sort().reverse();

  let chance = 0;
  for (let s1 = 0 as 0 | 1 | 2 | 3 | 4; s1 <= 4; s1 += 1)
    for (let s2 = 0 as 0 | 1 | 2 | 3 | 4; s2 <= 4; s2 += 1)
      for (let s3 = 0 as 0 | 1 | 2 | 3 | 4; s3 <= 4; s3 += 1) {
        const supply = [s1, s2, s3].sort().reverse();
        if (
          supply[0] < demand[0] ||
          supply[1] < demand[1] ||
          supply[2] < demand[2]
        )
          continue;
        chance +=
          getSlotLevelChance(1, s1, skillGrade1, skillGrade2) *
          getSlotLevelChance(2, s2, skillGrade1, skillGrade2) *
          getSlotLevelChance(3, s3, skillGrade1, skillGrade2);
      }

  return chance;
}

/** 指定されたスキルグレードを持つ護石の装飾品スロットを選択するとき、指定した装飾品スロット位置に指定したスロットレベルのスロットが付く確率を返す */
function getSlotLevelChance(
  place: 1 | 2 | 3,
  slotLevel: Slot["level"] | 0,
  skillGrade1: SkillGrade,
  skillGrade2?: SkillGrade
): number {
  const table =
    place === 1
      ? deco1SlotWeightedTable
      : place === 2
      ? deco2SlotWeightedTable
      : deco3SlotWeightedTable;
  const key = `${skillGrade1}-${skillGrade2 ?? "N"}`;
  const weights = table.get(key);
  if (!weights) throw new Error(`unknown key: ${key}`);
  return (weights[slotLevel] ?? 0) / 100;
}

/**
 * 与えられた確率がマカ錬金 (神気) で生成される確率においてどの程度のレアさか直感的にわかるようにランク付けする
 */
export function calculateChanceRank(
  chance: number
): "Z" | "C" | "B" | "A" | "S" | "SS" {
  if (chance === 0) return "Z";
  const log = -Math.log10(chance);
  if (log < 4) return "C";
  if (log < 6) return "B";
  if (log < 8) return "A";
  if (log < 10) return "S";
  if (log >= 10) return "SS";
  throw new Error(`与えられた確率が数値ではありません: ${chance}`);
}
