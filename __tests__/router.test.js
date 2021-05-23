/**
 * @jest-environment jsdom
 */

import { pushToHistory } from "../scripts/router";

let hist = pushToHistory("settings", 0);
pushToHistory("", 0);
pushToHistory("entry", 2);

describe("Test pushing settings, entry2 and home pages to history", () => {
  test("has length-4 state", () => {
    expect(hist.length).toBe(4);
  })

  test("has page property", () => {
    expect(hist.state).toStrictEqual({page: "entry2"});
  })
});

