/**
 * @Page: Route Index
 * @Description: Import all routes files here
 */

const init = (app) => {
	app.use(`/station`, require("./station"));
	app.use(`/hub`, require("./hub"));
	app.use(`/stream`, require("./stream"));
	app.use(`/detection`, require("./detection"));
	app.use(`/analysis`, require("./analysis"));
};

module.exports = init;