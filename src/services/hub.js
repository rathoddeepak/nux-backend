/**
 * @Page: Hub Services
 * @Description: Create hub related functions here
 */

//Models
const Models = require("#db");
const err = require("#utils/errors");
const onehealthCapture = require("#utils/oneHealthCapture");
const validation = require("#utils/validation");
const constants = require("#utils/constants");

const createHub = async ({ id, name, password, stationId }) => {
	try {		
		if(!validation.validName(name)){
			return {
				message: err.invalid_name
			}
		}
		if(!validation.validString(password)){
			return {
				message: err.invalid_password
			}
		}
		let updateable = {
			name,
			password			
		};
		if(id){			
			await Models.Hubs.update(updateable, {
				where: {
					id
				}
			});
			updateable.id = id;
		}else{
			const mStationId = parseInt(stationId);
			if(!validation.validId(mStationId)){
				return {
					message: err.invalid_request
				}
			}
			updateable.stationId = mStationId;
			updateable.classes = constants.defaultDetectionClasses;
			updateable.layout = constants.defaultStreamLayout;
			const data = await Models.Hubs.create(updateable);
			if(!data){
				return {
					message: err.server_error
				}
			}
			updateable.id = data.id;
		}
		return {
			success: true,
			data: updateable
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

const login = async ({ hubId, password }) => {
	try {
		const mHubId = parseInt(hubId);
		if(isNaN(mHubId) || typeof password !== "string"){
			return {
				message: err.invalid_login
			}
		}
		const data = await Models.Hubs.findOne({
			where: {
				id: mHubId,
				password: password,
				isActive: true
			}
		});
		if(!data){
			return {
				message: err.invalid_login
			}
		}
		return {
			success: true,
			data,
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

const getHubById = async ({ hubId }) => {
	try {
		const mHubId = parseInt(hubId);
		if(isNaN(mHubId)){
			return {
				message: err.invalid_login
			}
		}
		const data = await Models.Hubs.findOne({
			where: {
				id: mHubId,
				isActive: true
			}
		});
		return {
			success: true,
			data,
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

const getHubStreams = async ({ hubId }) => {
	try {
		const mHubId = parseInt(hubId);
		if(isNaN(mHubId)){
			return {
				message: err.invalid_login
			}
		}
		const data = await Models.Hubs.findOne({
			where: {
				id: mHubId
			},
			include: {
				as: "streams",
				model: Models.Streams,
				where: {
					isActive: true
				},
				required: false
			},
			order: [
				["streams", "relative_order", "asc"]
			]
		});
		return {
			success: true,
			data,
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

const disableHub = async ({ hubId, isActive = false }) => {
	try {
		const mHubId = parseInt(hubId);
		if(isNaN(mHubId)){
			return {
				message: err.invalid_request
			}
		}
		await Models.Hubs.update({
			isActive
		}, {
			where: {
				id: mHubId
			}
		});
		return {
			success: true,
			data: {
				hubId
			},
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

const updateClasses = async ({ hubId, classes = constants.defaultDetectionClasses }) => {
	try {
		const mHubId = parseInt(hubId);
		if(isNaN(mHubId)){
			return {
				message: err.invalid_request
			}
		}
		await Models.Hubs.update({
			classes
		}, {
			where: {
				id: mHubId
			}
		});
		return {
			success: true,
			data: classes,
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

const updateLayout = async ({ hubId, layout = constants.defaultStreamLayout }) => {
	try {
		const mHubId = parseInt(hubId);
		if(isNaN(mHubId)){
			return {
				message: err.invalid_request
			}
		}
		await Models.Hubs.update({
			layout
		}, {
			where: {
				id: mHubId
			}
		});
		return {
			success: true,
			data: layout,
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

module.exports = {
	login,
	getHubById,
	getHubStreams,
	createHub,
	disableHub,
	updateClasses,
	updateLayout
}
