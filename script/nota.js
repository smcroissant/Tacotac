const { notarize } = require("@electron/notarize");
const { build } = require("../package.json");

exports.default = async function notarizing(context) {
	const { electronPlatformName, appOutDir } = context;

	if (electronPlatformName !== "darwin") {
		console.log("Skipping notarization (not macOS)");
		return;
	}

	if (process.env.CI !== "true") {
		console.warn("Skipping notarization (not in CI)");
		return;
	}

	const appName = context.packager.appInfo.productFilename;
	const appPath = `${appOutDir}/${appName}.app`;

	console.log(`Starting notarization for ${appPath}`);

	try {
		await notarize({
			tool: "notarytool",
			appBundleId: build.appId,
			appPath: appPath,
			teamId: process.env.APPLE_TEAM_ID,
			appleId: process.env.APPLE_ID,
			appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
		});
		console.log("✅ Notarization completed successfully");
	} catch (error) {
		console.error("❌ Notarization failed:", error);
		throw error;
	}
};
