// noinspection NonAsciiCharacters

const mapOf = <V>(record: Record<string, V>): ReadonlyMap<string, V> =>
  Object.freeze(new Map(Object.entries(record)));

const SINGLE_CHAR_MAP = mapOf({
  g: "ɡ",
  j: "ʑ",
  q: "ʔ",
  r: "ɾ",
  ụ: "ɨ",
  ụ́: "ɨ́",
  ụ̀: "ɨ̀",
  x: "ɕ",
  y: "j",
});

const CLUSTER_MAP = mapOf({
  ch: "t͡ɕ",
  hs: "ç",
  ts: "t͡s",
  ụụ: "yː",
  ụ̀ụ̀: "ỳː",
  ụ́ụ́: "ýː",
});

export function pronounce(word: string): string {
  let ipa = "";

  let segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  let chars = [...segmenter.segment(word)].map((it) => it.segment);
  for (let i = 0; i < chars.length; ++i) {
    let cluster = chars.slice(i, i + 2).join("");
    let clusterPhoneme = CLUSTER_MAP.get(cluster);
    if (clusterPhoneme) {
      ipa += clusterPhoneme;
      ++i;
      continue;
    }

    let char = chars[i];
    let phoneme = SINGLE_CHAR_MAP.get(char) ?? char;

    ipa += phoneme;

    if (chars[i + 1] === char) {
      ipa += `ː`;
      ++i;
    }
  }

  return ipa;
}
