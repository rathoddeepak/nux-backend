/**
 * @Page: Stream Routes
 * @Description: Create stream related routes here
 */
const { successRes, serverError, errorRes } = require("#utils/common");
const streamService = require("#services/stream");
const onehealthCapture = require("#utils/oneHealthCapture");
const router = require("express").Router();


router.post("/get_streams", async (req, res) => {
	try {
		let response = await streamService.getStreams(req.body);
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

router.post("/stream_data", async (req, res) => {
	try {
		let response = await streamService.getStream(req.body);
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

router.post("/create_update_stream", async (req, res) => {
	try {
		let response = await streamService.createStream(req.body);
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

router.post("/toggle_stream_status", async (req, res) => {
	try {
		let response = await streamService.disableStream(req.body);
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

router.post("/latest_stream_frame", async (req, res) => {
	try {
		let response = await streamService.latestStreamFrame(req.body);
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

router.post("/update_stream_order", async (req, res) => {
	try {
		let response = await streamService.updateStreamOrder(req.body);
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