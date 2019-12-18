
let config = module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "arrowFunctions": true,
            "classes": true,
            "impliedStrict": true,
            "jsx": true,
            "modules": true,
        },
    },
    "plugins": [],
    "extends": [
        "airbnb-base",
        "eslint:recommended"
    ],
    "globals": {
        "$": true,
        "Color": true,
        "Dropzone": true,
        "Popper": true,
        "bootstrap": true,
        "document": true,
        "fetch": true,
        "google": true,
        "toastr": true,
        "window": true,
        "isNaN": true,
    },
    "settings": {},
    "rules": {
        // Basic
        "camelcase": "off",
        "comma-spacing": "off",
        "comma-dangle": "off",
        "consistent-return": "off",
        "default-case": "off",
        "global-require": "off",
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "object-curly-newline": "off",
        "no-console": "off",
        "no-continue": "off",
        "no-plusplus": "off",
        "no-bitwise": "off",
        "no-param-reassign": "off",
        "no-restricted-syntax": "off",
        "no-return-assign": "off",
        "no-script-url": "off",
        "no-shadow": "off",
        "no-unused-vars": "warn",
        "strict": ["error", "global"],
        "function-paren-newline": "off",
        "semi-style": "off",
        "quotes": "off",
        "max-len": "off",
        "newline-per-chained-call": "off",

        // Temporary fix
        "arrow-body-style": "off",
        "lines-between-class-members": "off",
        "eqeqeq": "off",
        "no-underscore-dangle": "off",
        "prefer-promise-reject-errors": "off",
        "no-use-before-define": "off",
        "guard-for-in": "off",
        "no-nested-ternary": "off",
        "class-methods-use-this": "off",
        "no-useless-constructor": "off",
        "no-multi-assign": "off",
        "one-var": "off",
        "one-var-per-line": "off",
        "one-var-declaration-per-line": "off",
        "object-property-newline": "off",
        "prefer-destructuring": "off",
        "no-multi-spaces": "off",
        "no-extra-boolean-cast": "off",
        "no-new": "off",
        "no-undef": "warn",
        "no-empty": "warn",
        "no-unused-expressions": "warn",
        "no-restricted-globals": "warn",
        "no-mixed-operators": "off",
        "new-cap": "off",

        // Import
        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",
        "import/extensions": "off",
    },
};

try {
    require("react");
    config.plugins.push("react");
    config.extends.push("plugin:react/recommended")
    Object.assign(config.settings, {
        "react": {
            "pragma": "React",
            version: "detect",
            flowVersion: "0.53",
        }
    });
    Object.assign(config.rules, {
        // React
        "react/button-has-type": "error",
        "react/default-props-match-prop-types": "error",
        "react/display-name": "off",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/no-unescaped-entities": ["off"],
        "react/prop-types": ["off"],
    });
} catch (e) {}
