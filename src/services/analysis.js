/**
 * @Page: Analysis Services
 * @Description: Create analysis related functions here
 */

//Models
const Models = require("#db");
const err = require("#utils/errors");
const { Op } = require("sequelize");
const onehealthCapture = require("#utils/oneHealthCapture");

const loadFramesBetween = async ({ streamId, offset = 0, dateFrom, dateTo }) => {
	try {
		const mStreamId = parseInt(streamId);
		if(isNaN(mStreamId)){
			return {
				message: err.invalid_request
			}
		}
		const data = await Models.Frames.findAll({
			where: {
				streamId: mStreamId,
				createdAt: {
					[Op.between]: [dateFrom, dateTo]
				}
			},
			order: [
				["created_at", "desc"]
			],
			limit: 50,
			offset
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
	loadFramesBetween
}