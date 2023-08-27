/**
 * @Page: Hub Routes
 * @Description: Create Hub related routes here
 */
const { successRes, serverError, errorRes } = require("#utils/common");
const hubService = require("#services/hub");
const onehealthCapture = require("#utils/oneHealthCapture");
const router = require("express").Router();


router.post("/login", async (req, res) => {
	try {
		let response = await hubService.login(req.body);
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
		let response = await hubService.getHubById(req.body);
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

router.post("/hub_streams", async (req, res) => {
	try {
		let response = await hubService.getHubStreams(req.body);
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

router.post("/create_update_hub", async (req, res) => {
	try {
		let response = await hubService.createHub(req.body);
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

router.post("/toggle_hub_status", async (req, res) => {
	try {
		let response = await hubService.disableHub(req.body);
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

router.post("/update_layout", async (req, res) => {
	try {
		let response = await hubService.updateLayout(req.body);
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

router.post("/update_classes", async (req, res) => {
	try {
		let response = await hubService.updateClasses(req.body);
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