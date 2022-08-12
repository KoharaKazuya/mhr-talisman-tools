/**
 * このモジュールはマカ錬金のゲーム内データを管理する
 * Anima = 神気
 *
 * データの参照元
 * @see https://docs.google.com/spreadsheets/d/1XzmYu4TorITdiTXISp-te5Ee_E4HieCOCjVk-x-VLXg/edit#gid=1691180449
 */

// スキルグレード決定時のグレードごとの確率
export const skillGradeProbabilities = { C: 20, B: 49, A: 23, S: 8 };

// スキル2の有無決定時のスキル1グレードごとのスキル2出現確率
export const secondSkillProbability = { C: 100, B: 100, A: 30, S: 20 };

export const skill1LevelData = new Map<string, number[]>([
  ["攻撃", [50, 35, 15]],
  ["挑戦者", [50, 35, 15]],
  ["フルチャージ", [50, 50]],
  ["逆恨み", [50, 35, 15]],
  ["死中に活", [50, 50]],
  ["見切り", [50, 35, 15]],
  ["超会心", [90, 10]],
  ["弱点特効", [50, 50]],
  ["力の解放", [50, 35, 15]],
  ["渾身", [50, 50]],
  ["会心撃【属性】", [50, 50]],
  ["達人芸", [90, 10]],
  ["麻痺属性強化", [50, 50]],
  ["睡眠属性強化", [50, 50]],
  ["爆破属性強化", [50, 50]],
  ["匠", [90, 10]],
  ["業物", [50, 50]],
  ["弾丸節約", [50, 50]],
  ["剛刃研磨", [50, 50]],
  ["心眼", [90, 10]],
  ["弾導強化", [50, 50]],
  ["集中", [90, 10]],
  ["強化持続", [50, 50]],
  ["ランナー", [90, 10]],
  ["体術", [40, 45, 15]],
  ["スタミナ急速回復", [50, 50]],
  ["ガード性能", [50, 35, 15]],
  ["ガード強化", [50, 50]],
  ["攻めの守勢", [90, 10]],
  ["抜刀術【技】", [90, 10]],
  ["抜刀術【力】", [40, 45, 15]],
  ["納刀術", [45, 45, 10]],
  ["ＫＯ術", [40, 45, 15]],
  ["スタミナ奪取", [50, 45, 5]],
  ["滑走強化", [100]],
  ["笛吹き名人", [100]],
  ["砲術", [90, 10]],
  ["砲弾装填", [80, 20]],
  ["特殊射撃強化", [50, 50]],
  ["通常弾・連射矢強化", [50, 50]],
  ["貫通弾・貫通矢強化", [90, 10]],
  ["散弾・拡散矢強化", [90, 10]],
  ["装填拡張", [90, 10]],
  ["装填速度", [45, 45, 10]],
  ["反動軽減", [45, 45, 10]],
  ["ブレ抑制", [45, 45, 15]],
  ["速射強化", [90, 10]],
  ["防御", [50, 35, 15]],
  ["精霊の加護", [60, 25, 15]],
  ["体力回復量ＵＰ", [40, 45, 15]],
  ["回復速度", [40, 45, 15]],
  ["早食い", [40, 45, 15]],
  ["耳栓", [60, 30, 10]],
  ["風圧耐性", [40, 45, 15]],
  ["耐震", [40, 45, 15]],
  ["泡沫の舞", [40, 45, 15]],
  ["回避性能", [40, 45, 15]],
  ["回避距離ＵＰ", [40, 45, 15]],
  ["気絶耐性", [40, 45, 15]],
  ["破壊王", [40, 45, 15]],
  ["幸運", [90, 10]],
  ["砥石使用高速化", [40, 45, 15]],
  ["キノコ大好き", [90, 10]],
  ["アイテム使用強化", [40, 45, 15]],
  ["広域化", [40, 45, 15]],
  ["満足感", [40, 45, 15]],
  ["火事場力", [50, 35, 15]],
  ["不屈", [100]],
  ["ひるみ軽減", [40, 45, 15]],
  ["剥ぎ取り鉄人", [100]],
  ["腹減り耐性", [40, 45, 15]],
  ["乗り名人", [100]],
  ["翔蟲使い", [40, 50, 10]],
  ["壁面移動", [40, 45, 15]],
  ["逆襲", [40, 45, 15]],
  ["高速変形", [45, 45, 10]],
  ["鬼火纏", [50, 50]],
  ["災禍転福", [60, 40]],
  ["合気", [70, 30]],
  ["供応", [100]],
  ["チャージマスター", [60, 40]],
  ["攻勢", [60, 40]],
  ["チューンアップ", [70, 30]],
  ["研磨術【鋭】", [60, 40]],
  ["刃鱗磨き", [60, 40]],
  ["壁面移動【翔】", [100]],
  ["連撃", [60, 40]],
]);

export const skill2LevelData = new Map<string, number[]>([
  ["攻撃", [85, 15]],
  ["挑戦者", [85, 15]],
  ["フルチャージ", [85, 15]],
  ["逆恨み", [85, 15]],
  ["死中に活", [85, 15]],
  ["見切り", [85, 15]],
  ["超会心", [100]],
  ["弱点特効", [85, 15]],
  ["力の解放", [85, 15]],
  ["渾身", [85, 15]],
  ["会心撃【属性】", [85, 15]],
  ["達人芸", [100]],
  ["火属性攻撃強化", [60, 40]],
  ["水属性攻撃強化", [60, 40]],
  ["氷属性攻撃強化", [60, 40]],
  ["雷属性攻撃強化", [60, 40]],
  ["龍属性攻撃強化", [60, 40]],
  ["毒属性強化", [60, 40]],
  ["麻痺属性強化", [85, 15]],
  ["睡眠属性強化", [85, 15]],
  ["爆破属性強化", [85, 15]],
  ["匠", [100]],
  ["業物", [85, 15]],
  ["弾丸節約", [85, 15]],
  ["剛刃研磨", [85, 15]],
  ["心眼", [100]],
  ["弾導強化", [85, 15]],
  ["集中", [100]],
  ["強化持続", [85, 15]],
  ["ランナー", [100]],
  ["体術", [40, 50, 10]],
  ["スタミナ急速回復", [85, 15]],
  ["ガード性能", [85, 15]],
  ["ガード強化", [100]],
  ["攻めの守勢", [100]],
  ["抜刀術【技】", [100]],
  ["抜刀術【力】", [70, 30]],
  ["納刀術", [70, 30]],
  ["ＫＯ術", [70, 30]],
  ["スタミナ奪取", [40, 50, 10]],
  ["滑走強化", [100]],
  ["笛吹き名人", [100]],
  ["砲術", [100]],
  ["砲弾装填", [100]],
  ["特殊射撃強化", [100]],
  ["通常弾・連射矢強化", [85, 15]],
  ["貫通弾・貫通矢強化", [100]],
  ["散弾・拡散矢強化", [100]],
  ["装填拡張", [100]],
  ["装填速度", [70, 30]],
  ["反動軽減", [70, 30]],
  ["ブレ抑制", [70, 30]],
  ["速射強化", [100]],
  ["防御", [70, 20, 10]],
  ["精霊の加護", [70, 30]],
  ["体力回復量ＵＰ", [40, 50, 10]],
  ["回復速度", [40, 50, 10]],
  ["早食い", [70, 30]],
  ["耳栓", [70, 30]],
  ["風圧耐性", [70, 30]],
  ["耐震", [70, 30]],
  ["泡沫の舞", [70, 30]],
  ["回避性能", [70, 30]],
  ["回避距離ＵＰ", [70, 30]],
  ["属性やられ耐性", [70, 30]],
  ["気絶耐性", [70, 30]],
  ["破壊王", [70, 30]],
  ["幸運", [100]],
  ["砥石使用高速化", [70, 30]],
  ["キノコ大好き", [100]],
  ["アイテム使用強化", [40, 50, 10]],
  ["広域化", [70, 30]],
  ["満足感", [40, 50, 10]],
  ["火事場力", [85, 15]],
  ["不屈", [100]],
  ["ひるみ軽減", [70, 30]],
  ["剥ぎ取り鉄人", [100]],
  ["腹減り耐性", [40, 50, 10]],
  ["乗り名人", [100]],
  ["翔蟲使い", [40, 50, 10]],
  ["壁面移動", [40, 50, 10]],
  ["逆襲", [70, 30]],
  ["高速変形", [70, 30]],
  ["鬼火纏", [85, 15]],
  ["災禍転福", [90, 10]],
  ["合気", [100]],
  ["供応", [100]],
  ["チャージマスター", [90, 10]],
  ["攻勢", [90, 10]],
  ["チューンアップ", [100]],
  ["研磨術【鋭】", [90, 10]],
  ["刃鱗磨き", [90, 10]],
  ["壁面移動【翔】", [100]],
  ["連撃", [90, 10]],
]);

export const deco1SlotWeightedTable = new Map<string, number[]>([
  ["S-S", [75, 15, 5, 3, 2]],
  ["S-A", [75, 15, 5, 3, 2]],
  ["S-B", [65, 23, 7, 3, 2]],
  ["S-C", [65, 23, 7, 3, 2]],
  ["S-N", [43, 40, 7, 7, 3]],
  ["A-S", [76, 15, 4, 3, 2]],
  ["A-A", [53, 30, 7, 7, 3]],
  ["A-B", [43, 40, 7, 7, 3]],
  ["A-C", [43, 40, 7, 7, 3]],
  ["A-N", [32, 50, 7, 7, 4]],
  ["B-S", [65, 23, 7, 3, 2]],
  ["B-A", [45, 37, 7, 7, 4]],
  ["B-B", [20, 44, 20, 10, 6]],
  ["B-C", [20, 43, 20, 10, 7]],
  ["B-N", [10, 40, 25, 15, 10]],
  ["C-S", [64, 25, 6, 3, 2]],
  ["C-A", [40, 40, 8, 7, 5]],
  ["C-B", [8, 45, 25, 15, 7]],
  ["C-C", [0, 25, 30, 30, 15]],
  ["C-N", [0, 20, 30, 30, 20]],
]);
export const deco2SlotWeightedTable = new Map<string, number[]>([
  ["S-S", [80, 20, 0, 0, 0]],
  ["S-A", [80, 20, 0, 0, 0]],
  ["S-B", [80, 20, 0, 0, 0]],
  ["S-C", [80, 20, 0, 0, 0]],
  ["S-N", [70, 30, 0, 0, 0]],
  ["A-S", [80, 20, 0, 0, 0]],
  ["A-A", [70, 30, 0, 0, 0]],
  ["A-B", [60, 40, 0, 0, 0]],
  ["A-C", [60, 40, 0, 0, 0]],
  ["A-N", [50, 50, 0, 0, 0]],
  ["B-S", [80, 20, 0, 0, 0]],
  ["B-A", [60, 40, 0, 0, 0]],
  ["B-B", [40, 40, 20, 0, 0]],
  ["B-C", [40, 40, 20, 0, 0]],
  ["B-N", [40, 30, 30, 0, 0]],
  ["C-S", [80, 20, 0, 0, 0]],
  ["C-A", [60, 40, 0, 0, 0]],
  ["C-B", [40, 40, 20, 0, 0]],
  ["C-C", [40, 40, 20, 0, 0]],
  ["C-N", [40, 30, 30, 0, 0]],
]);
export const deco3SlotWeightedTable = new Map<string, number[]>([
  ["S-S", [80, 20, 0, 0, 0]],
  ["S-A", [80, 20, 0, 0, 0]],
  ["S-B", [80, 20, 0, 0, 0]],
  ["S-C", [80, 20, 0, 0, 0]],
  ["S-N", [70, 30, 0, 0, 0]],
  ["A-S", [80, 20, 0, 0, 0]],
  ["A-A", [80, 20, 0, 0, 0]],
  ["A-B", [80, 20, 0, 0, 0]],
  ["A-C", [80, 20, 0, 0, 0]],
  ["A-N", [70, 30, 0, 0, 0]],
  ["B-S", [80, 20, 0, 0, 0]],
  ["B-A", [80, 20, 0, 0, 0]],
  ["B-B", [80, 20, 0, 0, 0]],
  ["B-C", [80, 20, 0, 0, 0]],
  ["B-N", [70, 30, 0, 0, 0]],
  ["C-S", [80, 20, 0, 0, 0]],
  ["C-A", [80, 20, 0, 0, 0]],
  ["C-B", [80, 20, 0, 0, 0]],
  ["C-C", [80, 20, 0, 0, 0]],
  ["C-N", [70, 30, 0, 0, 0]],
]);