const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
	const { electronPlatformName, appOutDir } = context;
	if (electronPlatformName !== "darwin") {
		return;
	}
	const appName = context.packager.appInfo.productFilename;
	return await notarize({
		appBundleId: process.env.APP_BUNDLE_ID, // e.g. com.croissantlabs.tacotac
		appPath: `${appOutDir}/${appName}.app`,
		appleApiKey: {
			keyId: process.env.APPLE_API_KEY_ID, // Your API key ID
			key: process.env.APPLE_API_KEY, // Path to your key file (.p8)
			issuerId: process.env.APPLE_API_KEY_ISSUER, // Issuer ID
		},
		// teamId: process.env.APPLE_TEAM_ID,
	});
};
