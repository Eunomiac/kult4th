function isUndefined(ref: unknown): ref is undefined {
  return ref === undefined;
}

function pFloat(ref: unknown, sigDigits?: number, isStrict = false): Float {
  let num: number;

  if (typeof ref === "string") {
    num = parseFloat(ref);
  } else if (typeof ref === "number") {
    num = ref;
  } else {
    return (isStrict ? NaN : 0) as Float;
  }

  if (isNaN(num)) {
    return (isStrict ? NaN : 0) as Float;
  }

  if (isUndefined(sigDigits)) {
    return num as Float;
  }

  const factor = Math.pow(10, sigDigits);
  const rounded = Math.round(num * factor) / factor;

  return rounded as Float;
}

function pInt(ref: unknown, isStrict?: boolean): number;
function pInt(ref: unknown, index: number, array: unknown[]): number;
function pInt(ref: unknown, isStrictOrIndex?: boolean | number, _arr?: unknown[]): number {
  let isStrict = false;
  if (typeof isStrictOrIndex === "boolean") {
    isStrict = isStrictOrIndex;
  }
  return isNaN(U.pFloat(ref, 0, isStrict))
    ? NaN
    : Math.round(U.pFloat(ref, 0, isStrict));
}

const U = {
  isUndefined,
  pFloat,
  pInt,
  roundNum: (num: number, sigDigits = 0) => (sigDigits === 0 ? U.pInt(num) : U.pFloat(num, sigDigits))
};

describe("pInt", () => {
  it("casts and rounds to the nearest integer the input, returning 0 if it cannot parse", () => {
    expect(U.pInt(5.123456789)).toBe(5);
    expect(U.pInt(-5.123456789)).toBe(-5);
    expect(U.pInt("5.6")).toBe(6);
    expect(U.pInt("carkey")).toBe(0);
    expect(U.pInt(true)).toBe(0);
    expect(U.pInt(false)).toBe(0);
    expect(U.pInt(null)).toBe(0);
    expect(U.pInt(undefined)).toBe(0);
    expect(U.pInt({})).toBe(0);
    expect(U.pInt([])).toBe(0);
    expect(U.pInt(() => {})).toBe(0);
  });
});


describe("roundNum", () => {
  it("rounds a number to an integer, or to a specified number of significant digits", () => {
    expect(U.roundNum(5.123456789, 0)).toBe(5);
    expect(U.roundNum(5.123456789, 1)).toBe(5.1);
    expect(U.roundNum(5.123456789, 2)).toBe(5.12);
    expect(U.roundNum(5.123456789, 3)).toBe(5.123);
    expect(U.roundNum(5.123456789, 4)).toBe(5.1235);
    expect(U.roundNum(5.123456789, 5)).toBe(5.12346);
    expect(U.roundNum(5.123456789, 6)).toBe(5.123457);
    expect(U.roundNum(5.123456789, 7)).toBe(5.1234568);
    expect(U.roundNum(5.123456789, 8)).toBe(5.12345679);
    expect(U.roundNum(5.123456789, 9)).toBe(5.123456789);
  });
});