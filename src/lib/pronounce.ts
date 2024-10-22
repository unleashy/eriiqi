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

  word = word.replaceAll("-", "");

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

  return ipa.normalize("NFKC");
}

const VOWELS = /(?:[aáàeéèiíìoóòuúùyýỳ]|ɨ[\u{0300}\u{0301}]?)ː?/gv;
const CODAS = /^[mnʔsɾjw](?:[^aáàeéèiíìoóòuúùɨyýỳ]|$)/v;

export function syllabify(ipa: string): string[] {
  let result: string[] = [];

  let lastSplit = 0;
  for (let m of ipa.matchAll(VOWELS)) {
    let endIndex = m.index + m[0].length;
    if (CODAS.test(ipa.slice(endIndex, endIndex + 2))) {
      result.push(ipa.slice(lastSplit, endIndex + 1));
      lastSplit = endIndex + 1;
    } else {
      result.push(ipa.slice(lastSplit, endIndex));
      lastSplit = endIndex;
    }
  }

  if (lastSplit < ipa.length) {
    result.push(ipa.slice(lastSplit));
  }

  return result.map((it) => it.normalize("NFKC"));
}

export function toIpa(word: string): string {
  let syllables = syllabify(pronounce(word));
  if (syllables.length > 1) {
    syllables[0] = `ˈ${syllables[0]}`;
  }

  return syllables.join(".");
}
