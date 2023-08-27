/**
 * @Page: Station Services
 * @Description: Create station related functions here
 */

//Models
const Models = require("#db");
const err = require("#utils/errors");
const onehealthCapture = require("#utils/oneHealthCapture");

const login = async ({ stationId, password }) => {
	try {
		const mStationId = parseInt(stationId);
		if(isNaN(mStationId) || typeof password !== "string"){
			return {
				message: err.invalid_login
			}
		}
		const data = await Models.Stations.findOne({
			where: {
				id: mStationId,
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

const getStationById = async ({ stationId }) => {
	try {
		const mStationId = parseInt(stationId);
		if(isNaN(mStationId)){
			return {
				message: err.invalid_login
			}
		}
		const data = await Models.Stations.findOne({
			where: {
				id: mStationId,
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

const getStationHubs = async ({ stationId, isActive = true }) => {
	try {
		const mStationId = parseInt(stationId);
		if(isNaN(mStationId)){
			return {
				message: err.invalid_login
			}
		}
		const data = await Models.Stations.findOne({
			where: {
				id: mStationId
			},
			include: {
				as: "hubs",
				model: Models.Hubs,
				where: {
					isActive
				},
				include: {
					as: "streams",
					attributes: [ "id" ],
					model: Models.Streams,
					required: false
				},
				required: false
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

module.exports = {
	getStationById,
	getStationHubs,
	login
}
