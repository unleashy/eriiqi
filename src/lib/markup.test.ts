import { renderMarkup } from "./markup.ts";
import { test, expect } from "vitest";

test("no markup", () => {
  expect(renderMarkup("foobar")).toEqual("foobar");
  expect(renderMarkup("a ◇ bc")).toEqual("a ◇ bc");
});

test("lozenge without tag creates word link", () => {
  expect(renderMarkup("foo ◇{bar}")).toEqual(`foo <a href="/w/bar">bar</a>`);
});

test("unclosed lozenge", () => {
  expect(renderMarkup("◇foo{bar")).toEqual(`<foo>bar</foo>`);
});

test("arbitrary tags", () => {
  expect(renderMarkup("◇b{hello} this ◇i{world}")).toEqual(
    `<b>hello</b> this <i>world</i>`,
  );
});

test("nested tags", () => {
  expect(renderMarkup("◇b{foo ◇i{bar} bux}")).toEqual(
    `<b>foo <i>bar</i> bux</b>`,
  );
});

test("hs tag", () => {
  expect(renderMarkup("◇hs{abcd}")).toEqual(`<i lang="x-hs">abcd</i>`);
});
