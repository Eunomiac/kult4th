type ComputeRange<
    N extends number,
    Result extends unknown[] = [],
    > =
    (Result["length"] extends N
        ? Result[number]
        : ComputeRange<N, [...Result, Result["length"]]>
    )

type HexNumber = `${ComputeRange<10>}`
type HexString = "A" | "B" | "C" | "D" | "E" | "F" | "a" | "b" | "c" | "d" | "e" | "f"

type Hex = `${HexNumber}` | HexString;

type StringLength<
    Str extends string,
    Acc extends string[] = []
    > =
    (Str extends `${infer S}${infer Rest}`
        ? StringLength<Rest, [...Acc, S]>
        : Acc["length"])

type ValidateLength<
    Str extends string,
    Length extends number
    > =
    (StringLength<Str> extends Length
        ? Str
        : never)

type ValidateHex<
    Color extends string,
    Cache extends string = "",
    > =
    Color extends `${infer A}${infer Rest}`
    ? (A extends ""
        ? Cache
        : (A extends Hex
            ? ValidateHex<Rest, `${Cache}${A}`>
            : never)
    ) : Cache

// Usage
type HexColor = ValidateHex<string>;
type InvalidHexColor = ValidateHex<"ZZZZZZ">; // never


const hex1: HexColor = "abcdef";
const hex2: HexColor = "zzzz";
// declare global {

//   // First of all, let's define our constraints.
//   type HexNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
//   type HexString = "A" | "B" | "C" | "D" | "E" | "F" | "a" | "b" | "c" | "d" | "e" | "f"
//   type StringNumber<T extends number> = `${T}`;
//   type HEX = HexNumber | StringNumber<HexNumber> | HexString;

//   // To be able to do some transformations over the string, we should convert it to tuple.
//   type ToArray<T extends string, Cache extends readonly string[] = []> =
//     T extends `${infer A}${infer Rest}`
//     ? A extends HEX
//     ? ToArray<Rest, [...Cache, A]> : A extends ""
//     ? 1 : 2 : T extends "" ? Cache extends { length: 6 }
//     ? Cache : "String should have 6 chars. No more, no less" : never;

//   // Now, when we know that our string is exactly 6 chars length and contains only allowed symbols, we can join it back to string.
//   type Elem = string;

//   type ReduceToString<
//       Arr extends readonly Elem[],
//       Result extends string = ""
//       > = Arr extends []
//       ? Result
//       : Arr extends [infer H]
//       ? H extends Elem
//       ? `${Result}${H}`
//       : never
//       : Arr extends readonly [infer H, ...infer Tail]
//       ? Tail extends readonly Elem[]
//       ? H extends Elem
//       ? ReduceToString<Tail, `${Result}${H}`>
//       : never
//       : never
//       : never;

//   // Let's test it.
//   type Result = ReduceToString<ToArray<"abcdef">>  // "abcdef"
//   type Result2 = ReduceToString<ToArray<"00cdef">> // "00cdef"
//   type Result3 = ReduceToString<ToArray<"z0cdef">> // never
//   type Result4 = ReduceToString<ToArray<"00cdem">> // never
//   type Result5 = ReduceToString<ToArray<"aaaaa">>  // never


//   // Looks great, but how we can use it in practice?
//   const hex = <
//     T extends string,
//     U extends {
//       "valid": "valid",
//       "invalid": "invalid",
//     }[
//       Check<T> extends string[]
//         ? Mapper<Check<T>> extends T
//           ? "valid"
//           : never
//         : "invalid"
//     ]
//   >
//     (value: T, ...rest: U extends "valid" ? [] : [never]) => value;

//   const result = hex("aaaaaf");  // ok
//   const result2 = hex("aaaaaZ"); // error
// }