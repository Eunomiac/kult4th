import U from "../../scripts/utilities";

describe("clampNum", () => {
  it("clamps numbers within range", () => {
    expect(U.clampNum(5, [0, 10])).toBe(5);
    expect(U.clampNum(-5, [0, 10])).toBe(0);
    expect(U.clampNum(15, [0, 10])).toBe(10);
  });
});