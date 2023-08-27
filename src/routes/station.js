/**
 * @Page: Station Routes
 * @Description: Create station related routes here
 */
const { successRes, serverError, errorRes } = require("#utils/common");
const stationService = require("#services/station");
const onehealthCapture = require("#utils/oneHealthCapture");
const router = require("express").Router();


router.post("/login", async (req, res) => {
	try {
		let response = await stationService.login(req.body);
		if (response.success) {
			successRes(res, response.data);
		} else {
			errorRes(res, response.message);
		}
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return serverError(res);
	}
});

router.post("/data", async (req, res) => {
	try {
		let response = await stationService.getStationById(req.body);
		if (response.success) {
			successRes(res, response.data);
		} else {
			errorRes(res, response.message);
		}
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return serverError(res);
	}
});

router.post("/station_hubs", async (req, res) => {
	try {
		let response = await stationService.getStationHubs(req.body);
		if (response.success) {
			successRes(res, response.data);
		} else {
			errorRes(res, response.message);
		}
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return serverError(res);
	}
});

module.exports = router;