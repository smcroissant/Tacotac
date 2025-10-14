const { notarize } = require("@electron/notarize");

exports.default = async function notarizing(context) {
	const appName = context.packager.appInfo.productFilename;
	const { electronPlatformName, appOutDir } = context;

	if (electronPlatformName !== "darwin") {
		console.log("• Skipping notarization (not macOS)");
		return;
	}

	const appId = "com.croissantlabs.tacotac"; // Must match appId in config
	const appPath = `${appOutDir}/${appName}.app`;
	const { APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID } = process.env;

	console.log(`• Notarizing ${appPath}`);

	return await notarize({
		tool: "notarytool",
		appBundleId: appId,
		appPath,
		appleId: APPLE_ID,
		appleIdPassword: APPLE_APP_SPECIFIC_PASSWORD,
		teamId: APPLE_TEAM_ID,
	});
};
