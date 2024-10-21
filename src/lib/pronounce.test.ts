import { pronounce, syllabify, toIpa } from "./pronounce";
import { describe, test, expect } from "vitest";

const putAcute = (x: string) => x + "\u{0301}";
const putBreve = (x: string) => x + "\u{0300}";
const putLength = (x: string) => x + "ː";

describe("vowels", () => {
  const genVowelCases = (
    vowel: string,
    ipa: string,
    ipaLong: string = ipa,
  ): Array<[string, string, string]> => {
    let acuteVowel = putAcute(vowel);
    let breveVowel = putBreve(vowel);
    let longVowel = vowel + vowel;
    let longAcuteVowel = acuteVowel + acuteVowel;
    let longBreveVowel = breveVowel + breveVowel;

    let acuteIpa = putAcute(ipa);
    let breveIpa = putBreve(ipa);
    let longIpa = putLength(ipaLong);
    let longAcuteIpa = putLength(putAcute(ipaLong));
    let longBreveIpa = putLength(putBreve(ipaLong));

    return [
      [vowel, ipa, ""],
      [acuteVowel.normalize("NFKC"), acuteIpa, ""],
      [breveVowel.normalize("NFKC"), breveIpa, ""],
      [acuteVowel, acuteIpa, " (combining)"],
      [breveVowel, breveIpa, " (combining)"],

      [longVowel, longIpa, ""],
      [longAcuteVowel.normalize("NFKC"), longAcuteIpa, ""],
      [longBreveVowel.normalize("NFKC"), longBreveIpa, ""],
      [longAcuteVowel, longAcuteIpa, " (combining)"],
      [longBreveVowel, longBreveIpa, " (combining)"],
    ].map(([v, i, t]) => [v, i.normalize("NFKC"), t]);
  };

  test.each([
    //             vowel, ipa, ipa for long vowel if necessary
    ...genVowelCases("a", "a"),
    ...genVowelCases("e", "e"),
    ...genVowelCases("i", "i"),
    ...genVowelCases("o", "o"),
    ...genVowelCases("u", "u"),
    ...genVowelCases("ụ", "ɨ", "y"),
  ])("%j → %j%s", (input, ipa) => {
    expect(pronounce(input)).toEqual(ipa);
  });
});

describe("consonants", () => {
  const genConsonantCases = (
    cons: string,
    ipa: string,
    geminates: boolean = false,
  ): Array<[string, string]> =>
    geminates
      ? [
          [cons, ipa],
          [cons + cons, putLength(ipa)],
        ]
      : [[cons, ipa]];

  test.each([
    //             consonant, ipa, geminates?
    ...genConsonantCases("b", "b", true),
    ...genConsonantCases("d", "d", true),
    ...genConsonantCases("g", "ɡ", true),
    ...genConsonantCases("h", "h"),
    ...genConsonantCases("j", "ʑ"),
    ...genConsonantCases("k", "k", true),
    ...genConsonantCases("m", "m", true),
    ...genConsonantCases("n", "n", true),
    ...genConsonantCases("p", "p", true),
    ...genConsonantCases("q", "ʔ"),
    ...genConsonantCases("r", "ɾ"),
    ...genConsonantCases("s", "s"),
    ...genConsonantCases("t", "t", true),
    ...genConsonantCases("w", "w"),
    ...genConsonantCases("x", "ɕ"),
    ...genConsonantCases("y", "j"),
    ...genConsonantCases("z", "z"),
  ])("%j → %j", (input, ipa) => {
    expect(pronounce(input)).toEqual(ipa);
  });
});

describe("clusters", () => {
  test.each([
    ["hs", "ç"],
    ["ts", "t͡s"],
    ["ch", "t͡ɕ"],
  ])("%j → %j", (input, ipa) => {
    expect(pronounce(input)).toEqual(ipa);
  });
});

describe("syllabify", () => {
  test.each([
    ["e", "e"],
    ["yːn", "yːn"],
    ["kasa", "ka.sa"],
    ["asa", "a.sa"],
    ["asta", "as.ta"],
    ["astaɾ", "as.taɾ"],
    ["kɾe", "kɾe"],
    ["kɾen", "kɾen"],
    ["kɾensa", "kɾen.sa"],
    ["ajóːta", "a.jóː.ta"],
    ["xɨ́ːɾka", "xɨ́ːɾ.ka"],
    ["awja", "aw.ja"],
    ["kaenu", "ka.e.nu"],
    ["iotːa", "i.o.tːa"],
    ["báʔmù", "báʔ.mù"],
    ["ɕɨ̀na", "ɕɨ̀.na"],
  ])("%j → %j", (input, ipa) => {
    expect(syllabify(input)).toEqual(ipa.split("."));
  });
});

describe("toIpa", () => {
  test.each([
    ["a", "a"],
    ["kasa", "ˈka.sa"],
    ["etton", "ˈe.tːon"],
  ])("%j → /%s/", (input, ipa) => {
    expect(toIpa(input)).toEqual(ipa);
  });
});
