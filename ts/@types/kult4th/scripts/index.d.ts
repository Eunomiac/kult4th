import gsap from "gsap/all";

declare global {
	type int = number;
	type float = number;
	type posInt = number;
	type posFloat = number;
	type key = string | number | symbol;
	type SmallInt = -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

	type HTMLCode = string;
	type HEXColor = string;
	type RGBColor = string;
	type K4Color = ValueOf<typeof C.Colors>;
	type jQueryTextTerm = string | number | boolean | ((this: Element, index: number, text: string) => string | number | boolean);

	type keyFunc = (key: number | string, val?: any) => unknown;
	type valFunc = (val: any, key?: number | string) => any;
	type testFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => boolean;
	type mapFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => unknown;
	type checkTest = ((...args: any[]) => any) | testFunc<keyFunc> | testFunc<valFunc> | RegExp | number | string;

	type List<Type = any> = Record<number | string | symbol, Type>
	type Index<Type = any> = List<Type> | Type[];

	type ConstructorOf<X> = new (...args: any[]) => X;
	type FreezeProps<T> = {
		[Prop in keyof T as string extends Prop ? never : number extends Prop ? never : Prop]: T[Prop]
	};
	type KeyOf<T> = keyof T;

	type gsapAnim = gsap.core.Tween | gsap.core.Timeline;

	declare function $clamp(element: HTMLElement, options: Record<string,any>): {
		original: string,
		clamped: string
	}
}