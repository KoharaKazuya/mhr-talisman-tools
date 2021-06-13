import { Skill, Slot } from "../core/mhr";
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
  return await match(imageData, skillTemplates, 100);
}

export async function matchSkillLevel(
  imageData: ImageData
): Promise<Skill["level"] | null> {
  return await match(imageData, numberTemplates, 100);
}

export async function matchSlotLevel(
  imageData: ImageData
): Promise<Slot["level"] | 0 | null> {
  return await match(imageData, slotTemplates, 100);
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
  cv.threshold(mat, mat, 0, 255, cv.THRESH_OTSU);

  // 上限付きで最も差分が小さいテンプレートを検索する
  let min = { mean: threshold, target: null as T | null };
  for (const [key, template] of Array.from(templates.entries())) {
    const roi = mat.roi(new cv.Rect(0, 0, template.cols, template.rows));
    const diff = new cv.Mat();
    cv.absdiff(roi, template, diff);
    const mean = cv.mean(diff)[0]; // grayscale なので 0 チャンネルのみ
    if (mean < min.mean) min = { mean, target: key };
  }

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
  const types: string[] = await (await fetch("/type/list.json")).json();
  const skillNames: string[] = await (await fetch("/skill/list.json")).json();

  await Promise.all([
    // アンカー (=「装備スキル」という文字) のテンプレートを読み込む
    loadTemplate("/anchor.png").then((mat) => {
      anchorTemplates.set("anchor", mat);
    }),
    // 護石の種類 (=「初心の護石」など) を読み込む
    ...types.map((type) =>
      loadTemplate(`/type/${type}.png`).then((mat) => {
        typeTemplates.set(type, mat);
      })
    ),
    // スキルのテンプレートを読み込む
    ...skillNames.map((name, i) =>
      loadTemplate(`/skill/${i}.png`, true).then((mat) => {
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
    ...Array.from({ length: 4 }, (_, i) =>
      loadTemplate(`/slot/${i}.png`, true).then((mat) => {
        slotTemplates.set(i as any, mat);
      })
    ),
  ]);

  // スキルなし (= 空文字列) のテンプレートを生成する
  // 比較時に差分ピクセルの平均値を下げないように 1 文字目のみ比較するため、正方形の形状にする
  skillTemplates.set(
    "",
    cv.Mat.zeros(skillNameSize.height, skillNameSize.height, 0)
  );
  numberTemplates.set(
    0,
    cv.Mat.zeros(skillLevelSize.height, skillLevelSize.height, 0)
  );
}

async function loadTemplate(url: string, resize = false) {
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
  cv.threshold(mat, mat, 0, 255, cv.THRESH_OTSU);
  // テンプレートデータは 1920 (1280 の x1.5) 想定で作られているので、リサイズする
  if (resize) {
    const size = new cv.Size(
      Math.round(mat.cols / 1.5),
      Math.round(mat.rows / 1.5)
    );
    cv.resize(mat, mat, size);
  }
  return mat;
}
