import { skillGradeData } from "../core/meding-pod-data/common";
import type { Skill, Slot } from "../core/mhr";
import { talismanNames } from "../core/mhr";
import { skillLevelSize, skillNameSize } from "./config";
import { loadOpenCV } from "./opencv-loader";

export async function matchAnchor(imageData: ImageData): Promise<boolean> {
  return Boolean(await match(imageData, anchorTemplates, 20));
}

export async function matchType(imageData: ImageData): Promise<string | null> {
  return await match(imageData, typeTemplates, 100);
}

export async function matchSkillName(
  imageData: ImageData
): Promise<Skill["name"] | "" | null> {
  return await match(imageData, skillTemplates, 50);
}

export async function matchSkillLevel(
  imageData: ImageData
): Promise<Skill["level"] | null> {
  return await match(imageData, numberTemplates, 50);
}

export async function matchSlotLevel(
  imageData: ImageData
): Promise<Slot["level"] | 0 | null> {
  return await match(imageData, slotTemplates, 50);
}

async function match<T>(
  imageData: ImageData,
  templates: Map<T, any>,
  threshold: number
): Promise<T | null> {
  await loadOpenCV();
  await loadSkillTemplates();

  const mat = cv.matFromImageData(imageData);
  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);

  // 上限付きで最も差分が小さいテンプレートを検索する
  let min = { mean: threshold, target: null as T | null };
  for (const [key, template] of Array.from(templates.entries())) {
    // テンプレートマッチングで最もテンプレートが当てはまる位置を探す
    const dst = new cv.Mat();
    cv.matchTemplate(mat, template, dst, cv.TM_SQDIFF);
    // 大きく位置がずれることは想定していないので 16x16 の範囲内から探す
    const dstRoi = dst.roi(
      new cv.Rect(0, 0, Math.min(dst.cols, 16), Math.min(dst.rows, 16))
    );
    const { minLoc } = cv.minMaxLoc(dstRoi);

    // 差分を計算する
    const t = new cv.Mat();
    cv.copyMakeBorder(
      template,
      t,
      minLoc.y,
      mat.rows - template.rows - minLoc.y,
      minLoc.x,
      mat.cols - template.cols - minLoc.x,
      cv.BORDER_CONSTANT,
      new cv.Scalar(0, 0, 0, 255)
    );
    const diff = new cv.Mat();
    cv.absdiff(mat, t, diff);

    // 以前よりも差分の平均値が小さい場合は最終結果となるテンプレートを更新する
    const mean = cv.mean(diff)[0]; // grayscale なので 0 チャンネルのみ
    if (mean < min.mean) min = { mean, target: key };

    dst.delete();
    t.delete();
    diff.delete();
  }

  mat.delete();

  return min.target;
}

const anchorTemplates = new Map<"anchor", any>();
const typeTemplates = new Map<string, any>();
const skillTemplates = new Map<string, any>();
const numberTemplates = new Map<0 | 1 | 2 | 3 | 4, any>();
const slotTemplates = new Map<0 | 1 | 2 | 3, any>();
let loading: Promise<void> | undefined;
function loadSkillTemplates(): Promise<void> {
  if (!loading) loading = loadAllTemplates();
  return loading;
}

async function loadAllTemplates() {
  await Promise.all([
    // アンカー (=「装備スキル」という文字) のテンプレートを読み込む
    loadTemplate("/anchor.png").then((mat) => {
      anchorTemplates.set("anchor", mat);
    }),
    // 護石の種類 (=「初心の護石」など) を読み込む
    ...talismanNames.map((type) =>
      loadTemplate(`/type/${type}.png`).then((mat) => {
        typeTemplates.set(type, mat);
      })
    ),
    // スキルのテンプレートを読み込む
    ...Array.from(skillGradeData.keys()).map((name) =>
      loadTemplate(`/skill/${name}.png`).then((mat) => {
        skillTemplates.set(name, mat);
      })
    ),
    // レベルの数値のテンプレートを読み込む
    ...Array.from({ length: 4 }, (_, i) =>
      loadTemplate(`/number/${i + 1}.png`).then((mat) => {
        numberTemplates.set((i + 1) as any, mat);
      })
    ),
    // スロットのテンプレートを読み込む
    ...Array.from({ length: 5 }, (_, i) =>
      loadTemplate(`/slot/${i}.png`).then((mat) => {
        slotTemplates.set(i as any, mat);
      })
    ),
  ]);

  // スキルなし (= 空文字列) のテンプレートを生成する
  // 比較時に文字が書かれていない部分とマッチしてしまわないようにフルサイズで生成する
  skillTemplates.set(
    "",
    cv.Mat.zeros(skillNameSize.height, skillNameSize.width, 0)
  );
  numberTemplates.set(
    0,
    cv.Mat.zeros(skillLevelSize.height, skillLevelSize.width, 0)
  );
}

async function loadTemplate(url: string) {
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const mat = cv.matFromImageData(imageData);
  cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);

  return mat;
}
