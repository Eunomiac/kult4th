import "./utilities.d.ts";

declare global {
	type int = number;
	type float = number;
	type posInt = number;
	type posFloat = number;
	type SmallInt = -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

	type HTMLCode = string;
	type HEXColor = string;
	type RGBColor = string;
	type jQueryTextTerm = string | number | boolean | ((this: Element, index: number, text: string) => string | number | boolean);

	type keyFunc = (key: number | string, val?: unknown) => unknown;
	type valFunc = (val: unknown, key?: number | string) => unknown;
	type testFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => boolean;
	type mapFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => unknown;
	type checkTest = ((...args: any[]) => any) | testFunc<keyFunc> | testFunc<valFunc> | RegExp | number | string;

	export type List<Type> = Record<number | string | symbol, Type>
	type Index<Type> = List<Type> | Type[];

	type ConstructorOf<X> = new (...args: any[]) => X;

	type FreezeProps<T> = {
		[Prop in keyof T as string extends Prop ? never : number extends Prop ? never : Prop]: T[Prop]
	};
	type KnownKeys<T> = keyof FreezeProps<T>;
}