export default {
	preset: "ts-jest/presets/default-esm",

	testEnvironment: "jest-environment-jsdom",
	extensionsToTreatAsEsm: [".ts", ".tsx"],

	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.test.json",
				useESM: true,
			},
		],
	},

	setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

	collectCoverage: true,
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}", // tots els fitxers del codi
		"!src/**/*.test.{ts,tsx}", // exclou els tests
		"!src/**/__tests__/**", // i carpetes de tests
		"!src/**/__mocks__/**", // i mocks
		"!src/**/*.d.ts", // definicions TS
		"!src/setupTests.ts", // fitxer de setup
		"!src/**/index.{ts,tsx}", // opcional: barrels
	],
	coverageDirectory: "<rootDir>/coverage",
	coverageReporters: ["text", "lcov", "html"],

	coveragePathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"],
};
