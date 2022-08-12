import { useMemo } from "react";
import { Row, useSortBy, useTable } from "react-table";
import ReactTooltip from "react-tooltip";
import { AsSlots, calculateAsSlots } from "../../core/as-slots";
import {
  calculateChanceRank,
  calculateGenerationChance,
} from "../../core/chance-calculator";
import { Talisman } from "../../core/mhr";
import DeleteButton from "./delete-button";
import TweetButton from "./tweet-button";

type Props = {
  talismans: Talisman[];
};

const columns = [
  {
    Header: "名前",
    accessor: "name" as const,
  },
  {
    Header: "スキル1",
    accessor: "skill1" as const,
  },
  {
    Header: "スキル2",
    accessor: "skill2" as const,
  },
  {
    Header: "スロット",
    accessor: "slots" as const,
  },
  {
    Header: (
      <>
        出現確率{" "}
        <span
          data-tip="フォーマット: {レア度} ({出現確率})<br>レア度: 出現確率を独自基準でランク分けしたもの<br>出現確率: 同じ性能のスキル・スロット、もしくは (装飾品なしで) 同等以上の性能の護石がマカ錬金・神気で出現する確率"
          data-html
        >
          [?]
        </span>
      </>
    ),
    accessor: "chance" as const,
    sortType: (rowA: Row, rowB: Row, columnId: string, desc: boolean) => {
      const chanceA = rowA.values.chance;
      const chanceB = rowB.values.chance;

      const rankA = chanceA.replace(/ .*$/, "");
      const rankB = chanceB.replace(/ .*$/, "");
      if (rankA === "Z" && rankB !== "Z") return 1;
      if (rankA !== "Z" && rankB === "Z") return -1;

      const numA = Number(chanceA.replace(/^.*\((.+)%\).*$/, "$1"));
      const numB = Number(chanceB.replace(/^.*\((.+)%\).*$/, "$1"));
      if (numA > numB) return 1;
      if (numA < numB) return -1;
    },
  },
  {
    Header: (
      <>
        装飾品スロット換算{" "}
        <span
          data-tip="フォーマット: {Lv4の個数},{Lv3の個数},{Lv2の個数},{Lv1の個数}<br>装飾品スロット換算: スキル1およびスキル2を装飾品で再現する場合の必要スロット数を護石のスロット数に加え、レベル別に数えたもの"
          data-html
        >
          [?]
        </span>
      </>
    ),
    accessor: "asSlots" as const,
  },
  {
    Cell: TweetButton,
    accessor: "tweet" as const,
  },
  {
    Cell: DeleteButton,
    accessor: "delete" as const,
  },
];

export default function TalismansTable({ talismans }: Props) {
  const data = useMemo(
    () =>
      talismans.map((talisman) => ({
        name: talisman.name,
        skill1: `${talisman.skills[0].name} Lv${talisman.skills[0].level}`,
        skill2: talisman.skills[1]
          ? `${talisman.skills[1].name} Lv${talisman.skills[1].level}`
          : "-",
        slots: [0, 1, 2].map((i) => talisman.slots[i]?.level ?? 0).join("-"),
        chance: chanceString(calculateGenerationChance(talisman)),
        asSlots: asSlotsString(calculateAsSlots(talisman)),
        tweet: tweetString(talisman),
        delete: talisman,
      })),
    [talismans]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key -- React Table が key を管理している
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key -- React Table が key を管理している
                <th
                  {...column.getHeaderProps(
                    (column as any).getSortByToggleProps()
                  )}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key -- React Table が key を管理している
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  // eslint-disable-next-line react/jsx-key -- React Table が key を管理している
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <ReactTooltip />
    </>
  );
}

function chanceString(chance: number): string {
  const rank = calculateChanceRank(chance);
  return `${rank} (${(chance * 100).toFixed(10)}%)`;
}

function asSlotsString({ lv4, lv3, lv2, lv1, alpha }: AsSlots): string {
  let output = alpha ? "+α " : "";
  output += `${lv4},${lv3},${lv2},${lv1}`;
  return output;
}

function tweetString(talisman: Talisman): string {
  const { skills, slots } = talisman;
  const spec = [
    `${skills[0].name} Lv${skills[0].level}`,
    ...(skills[1] ? [`${skills[1].name} Lv${skills[1].level}`] : []),
    `スロット ${slots[0]?.level ?? 0}-${slots[1]?.level ?? 0}-${
      slots[2]?.level ?? 0
    }`,
  ].join(", ");
  const chance = calculateGenerationChance(talisman);
  const rank = calculateChanceRank(chance);
  const text = encodeURIComponent(
    "モンハンライズでこの護石を入手しました！\n" +
      `${spec}\n` +
      `レア度は ${rank} (${(chance * 100).toFixed(10)}%) です！\n`
  );

  const url = encodeURIComponent(
    "https://mhr-talisman-tools.koharakazuya.net/"
  );

  const hashtags = encodeURIComponent("護石ツールズ,モンハンライズ");

  return `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
}
