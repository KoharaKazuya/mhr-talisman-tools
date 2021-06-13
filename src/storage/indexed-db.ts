import { DBSchema, openDB } from "idb";
import { Talisman } from "../core/mhr";
import { serialize } from "../core/serializer";

/**
 * ユーザーが所有すると記録されているすべての護石を返す
 */
export async function getAllUserTalismans(): Promise<Talisman[]> {
  const db = await open();
  const talismans = await db.getAll("talismans");
  return talismans;
}

/**
 * 指定した護石をユーザーが所有していると記録する
 */
export async function setUserTalismans(talismans: Talisman[]): Promise<void> {
  const db = await open();
  const tx = db.transaction("talismans", "readwrite");
  const store = tx.objectStore("talismans");
  await store.clear();
  await Promise.all(
    talismans.map((talisman) => store.put(talisman, serialize(talisman)))
  );
  await tx.done;
}

/**
 * 指定した護石をユーザーが所有していると記録する
 */
export async function addUserTalismans(talismans: Talisman[]): Promise<void> {
  const db = await open();
  const tx = db.transaction("talismans", "readwrite");
  const store = tx.objectStore("talismans");
  await Promise.all(
    talismans.map((talisman) => store.put(talisman, serialize(talisman)))
  );
  await tx.done;
}

/**
 * 指定した護石をユーザーが所有しなくなったと記録する
 */
export async function removeUserTalismans(
  talismans: Talisman[]
): Promise<void> {
  const db = await open();
  const tx = db.transaction("talismans", "readwrite");
  await Promise.all<unknown>([
    ...talismans.map((talisman) => db.delete("talismans", serialize(talisman))),
    tx.done,
  ]);
}

interface MHRTalismanToolsDBSchema extends DBSchema {
  talismans: {
    value: Talisman;
    key: string;
  };
}

async function open() {
  return await openDB<MHRTalismanToolsDBSchema>("mhr-talisman-tools", 1, {
    upgrade(db) {
      db.createObjectStore("talismans");
    },
  });
}
