/**
 * @Page: Analysis Routes
 * @Description: Create analysis related routes here
 */
const { successRes, serverError, errorRes } = require("#utils/common");
const analysisService = require("#services/analysis");
const onehealthCapture = require("#utils/oneHealthCapture");
const router = require("express").Router();


router.post("/load_frames", async (req, res) => {
	try {
		let response = await analysisService.loadFramesBetween(req.body);
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