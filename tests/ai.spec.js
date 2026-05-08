import { describe, it, expect } from "vitest";
import { chooseCpuPlays } from "../src/game/ai.js";
import { chooseCpuTurnPlays } from "../src/game/rules.js";

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

  it("prioritizes action cards over money cards", () => {
    const hand = [
      { type: "money", value: 4 },
      { type: "action", name: "Rent" },
    ];

    const picks = chooseCpuPlays({ hand, sets: {}, playsLeft: 1 });

    expect(picks[0].type).toBe("action");
  });

  it("returns up to playsLeft picks through chooseCpuTurnPlays", () => {
    const player = {
      hand: [
        { type: "money", value: 1 },
        { type: "action", name: "Debt Collector" },
        { type: "property", group: "Solar" },
      ],
      sets: { Solar: [{ type: "property", group: "Solar" }] },
    };

    const picks = chooseCpuTurnPlays(player, 2);

    expect(picks).toHaveLength(2);
    expect(picks[0].type).toBe("property");
    expect(picks[1].type).toBe("action");
  });
});
