/**
 * このモジュールはマカ錬金のゲーム内データを管理する
 *
 * データの参照元
 * @see https://www.reddit.com/r/MonsterHunterMeta/comments/mn1gmo/talisman_melding_probabilities_and_system_guide/
 * @see https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQbGSXThYV1IwAp1nffNmnvRZi_GiZwtwUq4lsGfzH04NLmVhmbViEpvSWstl05qXt3DqnXeBiDLC3C/pubhtml#
 */

import { SkillGrade } from "../mhr";

// データは [hyperWiki](https://hyperwiki.jp/mhr/alchemy/) より
// $ curl -s https://hyperwiki.jp/mhr/alchemy/ | pup ':parent-of(:parent-of(#t4)) + * > table tr th, :parent-of(:parent-of(#t4)) + * > table tr td:nth-child(2) text{}'
export const skillGradeData = new Map<string, SkillGrade>([
  ["攻撃", "A"],
  ["挑戦者", "A"],
  ["フルチャージ", "A"],
  ["逆恨み", "A"],
  ["死中に活", "A"],
  ["見切り", "A"],
  ["超会心", "S"],
  ["弱点特効", "A"],
  ["力の解放", "A"],
  ["渾身", "A"],
  ["会心撃【属性】", "A"],
  ["達人芸", "S"],
  ["火属性攻撃強化", "B"],
  ["水属性攻撃強化", "B"],
  ["氷属性攻撃強化", "B"],
  ["雷属性攻撃強化", "B"],
  ["龍属性攻撃強化", "B"],
  ["毒属性強化", "B"],
  ["麻痺属性強化", "A"],
  ["睡眠属性強化", "A"],
  ["爆破属性強化", "A"],
  ["匠", "S"],
  ["業物", "A"],
  ["弾丸節約", "A"],
  ["剛刃研磨", "A"],
  ["心眼", "S"],
  ["弾導強化", "A"],
  ["鈍器使い", "B"],
  ["集中", "S"],
  ["強化持続", "A"],
  ["ランナー", "S"],
  ["体術", "C"],
  ["スタミナ急速回復", "A"],
  ["ガード性能", "A"],
  ["ガード強化", "A"],
  ["攻めの守勢", "S"],
  ["抜刀術【技】", "S"],
  ["抜刀術【力】", "B"],
  ["納刀術", "B"],
  ["ＫＯ術", "B"],
  ["スタミナ奪取", "C"],
  ["滑走強化", "C"],
  ["笛吹き名人", "C"],
  ["砲術", "S"],
  ["砲弾装填", "A"],
  ["特殊射撃強化", "A"],
  ["通常弾・連射矢強化", "A"],
  ["貫通弾・貫通矢強化", "S"],
  ["散弾・拡散矢強化", "S"],
  ["装填拡張", "S"],
  ["装填速度", "B"],
  ["反動軽減", "B"],
  ["ブレ抑制", "B"],
  ["速射強化", "S"],
  ["防御", "B"],
  ["精霊の加護", "B"],
  ["体力回復量ＵＰ", "C"],
  ["回復速度", "C"],
  ["早食い", "B"],
  ["耳栓", "B"],
  ["風圧耐性", "B"],
  ["耐震", "B"],
  ["泡沫の舞", "B"],
  ["回避性能", "B"],
  ["回避距離ＵＰ", "B"],
  ["火耐性", "C"],
  ["水耐性", "C"],
  ["氷耐性", "C"],
  ["雷耐性", "C"],
  ["龍耐性", "C"],
  ["属性やられ耐性", "B"],
  ["毒耐性", "C"],
  ["麻痺耐性", "C"],
  ["睡眠耐性", "C"],
  ["気絶耐性", "B"],
  ["泥雪耐性", "C"],
  ["爆破やられ耐性", "C"],
  ["植生学", "C"],
  ["地質学", "C"],
  ["破壊王", "B"],
  ["幸運", "S"],
  ["砥石使用高速化", "B"],
  ["ボマー", "C"],
  ["キノコ大好き", "S"],
  ["アイテム使用強化", "C"],
  ["広域化", "B"],
  ["満足感", "C"],
  ["火事場力", "A"],
  ["不屈", "C"],
  ["ひるみ軽減", "B"],
  ["ジャンプ鉄人", "S"],
  ["剥ぎ取り鉄人", "C"],
  ["腹減り耐性", "C"],
  ["飛び込み", "C"],
  ["陽動", "C"],
  ["乗り名人", "C"],
  ["翔蟲使い", "C"],
  ["壁面移動", "C"],
  ["逆襲", "B"],
  ["高速変形", "B"],
  ["鬼火纏", "A"],
]);
