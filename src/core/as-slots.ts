/**
 * 護石をスロット数換算で評価するためモジュール
 */

import { decorationData } from "./decoration-data";
import { Skill, Slot, Talisman } from "./mhr";

export interface AsSlots {
  lv3: number;
  lv2: number;
  lv1: number;
  /** 装飾品では再現できないスキルを持つかどうか */
  alpha: boolean;
}

/** 与えられた護石のスキルと装飾品スロットを装飾品スロット数換算で評価する */
export function calculateAsSlots(talisman: Talisman): AsSlots {
  return sum(
    getSkillAsSlots(talisman.skills[0]),
    getSkillAsSlots(talisman.skills[1]),
    getSlotAsSlots(talisman.slots[0]),
    getSlotAsSlots(talisman.slots[1]),
    getSlotAsSlots(talisman.slots[2])
  );
}

function zero(): AsSlots {
  return { lv3: 0, lv2: 0, lv1: 0, alpha: false };
}

function sum(...slots: AsSlots[]): AsSlots {
  return slots.reduce((s, x) => ({
    lv3: s.lv3 + x.lv3,
    lv2: s.lv2 + x.lv2,
    lv1: s.lv1 + x.lv1,
    alpha: s.alpha || x.alpha,
  }));
}

function getSkillAsSlots(skill: Skill | undefined): AsSlots {
  if (!skill) return zero();
  const row = decorationData.find(([, skillName]) => skillName === skill.name);
  if (row) {
    const deco = row[0];
    if (deco.includes("【３】")) {
      return { lv3: skill.level, lv2: 0, lv1: 0, alpha: false };
    } else if (deco.includes("【２】")) {
      return { lv3: 0, lv2: skill.level, lv1: 0, alpha: false };
    } else if (deco.includes("【１】")) {
      return { lv3: 0, lv2: 0, lv1: skill.level, alpha: false };
    } else {
      throw new Error(`装飾品名にスロットレベルが含まれていません: ${deco}`);
    }
  } else {
    return { lv3: 0, lv2: 0, lv1: 0, alpha: true };
  }
}

function getSlotAsSlots(slot: Slot | undefined): AsSlots {
  if (!slot) return zero();
  return {
    lv3: slot.level === 3 ? 1 : 0,
    lv2: slot.level === 2 ? 1 : 0,
    lv1: slot.level === 1 ? 1 : 0,
    alpha: false,
  };
}
