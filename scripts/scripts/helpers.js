export function MIX(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            const propDescriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            if (propDescriptor) {
                Object.defineProperty(derivedCtor.prototype, name, propDescriptor);
            }
        });
    });
    return derivedCtor;
}
export const HandlebarHelpers = {
    test: function (param1, operator, param2) {
        switch (operator) {
            case "==": {
                return param1 == param2;
            } // eslint-disable-line eqeqeq
            case "===": {
                return param1 === param2;
            }
            default: {
                return false;
            }
        }
    }
};
