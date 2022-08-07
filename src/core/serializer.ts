import {
  array,
  assert,
  Describe,
  empty,
  enums,
  number,
  object,
  string,
  tuple,
  union,
} from "superstruct";
import { Skill, Slot, Talisman } from "./mhr";

export function serialize(talisman: Talisman): string {
  const { name, skills, slots } = talisman;
  const [skill1, skill2] = skills;
  const [slot1, slot2, slot3] = slots;
  return [
    name,
    skill1.name,
    skill1.level,
    skill2?.name ?? "-",
    skill2?.level ?? "-",
    slot1?.level ?? "-",
    slot2?.level ?? "-",
    slot3?.level ?? "-",
  ].join("\t");
}

type Backup = {
  talismans: Talisman[];
};
const SkillSchema: Describe<Skill> = object({
  name: string(),
  level: number(),
});
const SlotSchema: Describe<Slot> = object({
  level: enums([1, 2, 3, 4]),
});
const BackupSchema: Describe<Backup> = object({
  talismans: array(
    object({
      name: string(),
      skills: union([tuple([SkillSchema]), tuple([SkillSchema, SkillSchema])]),
      slots: union([
        empty<[], null>(array() as any),
        tuple([SlotSchema]),
        tuple([SlotSchema, SlotSchema]),
        tuple([SlotSchema, SlotSchema, SlotSchema]),
      ]),
    })
  ),
});

export function toJSON(backup: Backup): string {
  return JSON.stringify(backup);
}

export function fromJSON(json: string): Backup {
  const data = JSON.parse(json);
  assert(data, BackupSchema);
  return data;
}

export function toSkillSimulatorText(talismans: Talisman[]): string {
  return talismans
    .map(({ skills, slots }) =>
      [
        skills[0].name,
        skills[0].level,
        skills[1]?.name ?? "",
        skills[1]?.level ?? 0,
        slots[0]?.level ?? 0,
        slots[1]?.level ?? 0,
        slots[2]?.level ?? 0,
      ].join(",")
    )
    .join("\n");
}
