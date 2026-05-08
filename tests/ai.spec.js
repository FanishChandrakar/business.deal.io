import { describe, it, expect } from "vitest";
import { chooseCpuPlays } from "../src/game/ai.js";

describe("cpu policy", () => {
  it("prioritizes property completion over money banking", () => {
    const hand = [
      { type: "money", value: 3 },
      { type: "property", group: "Solar" },
    ];
    const sets = { Solar: [{ type: "property", group: "Solar" }] };

    const picks = chooseCpuPlays({ hand, sets, playsLeft: 1 });

    expect(picks[0].type).toBe("property");
  });
});
