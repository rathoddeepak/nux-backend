/**
 * @Page: Detection Routes
 * @Description: Create Detection related routes here
 */
const { successRes, serverError, errorRes } = require("#utils/common");
const detectionService = require("#services/detection");
const onehealthCapture = require("#utils/oneHealthCapture");
const router = require("express").Router();
const multer = require("multer");
const multerHandler = multer();


router.post("/detect_save", multerHandler.single("image"), async (req, res) => {
	try {
		detectionService.saveDetection(req.body, req.file, (response) => {
			if (response.success) {
				successRes(res, response.data);
			} else {
				errorRes(res, response.message);
			}
		});
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return serverError(res);
	}
});

module.exports = router;