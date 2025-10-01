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
};
