export function MIX(derivedCtor: K4Constructor, baseCtors: K4Constructor[]) {
	baseCtors.forEach(baseCtor => {
		Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
			const propDescriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
			if (propDescriptor) {
				Object.defineProperty(
					derivedCtor.prototype,
					name,
					propDescriptor
				);
			}
		});
	});
	return derivedCtor;
}

export const HandlebarHelpers = {
	test: function(param1: string, operator: string, param2: string) {
		switch (operator) {
			case "==": { return param1 == param2 } // eslint-disable-line eqeqeq
			case "===": { return param1 === param2 }
			default: { return false }
		}
	}
};