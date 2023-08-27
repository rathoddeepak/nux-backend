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

const createStream = async ({ id, hubId, name, rtspUrl }) => {
	try {		
		if(!validation.validName(name)){
			return {
				message: err.invalid_name
			}
		}
		if(!validation.validRTSPUrl(rtspUrl)){
			return {
				message: err.invalid_rtsp
			}
		}
		let updateable = {
			name,
			rtspUrl
		};
		if(id){			
			await Models.Streams.update(updateable, {
				where: {
					id
				}
			});
			updateable.id = id;
		}else{
			const mHubId = parseInt(hubId);
			if(!validation.validId(mHubId)){
				return {
					message: err.invalid_request
				};
			}
			const relativeOrder = await Models.Streams.count({
				where: {
					hubId: mHubId,
					isActive: true
				},				
			});
			if(relativeOrder >= 6){
				return {
					message: err.max_stream
				}
			}
			updateable.hubId = mHubId;
			updateable.relativeOrder = relativeOrder + 1;
			const data = await Models.Streams.create(updateable);
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

const getStreams = async ({ hubId, isActive = true }) => {
	try {
		const mHubId = parseInt(hubId);
		if(isNaN(mHubId)){
			return {
				message: err.invalid_login
			}
		}
		const data = await Models.Streams.findAll({
			where: {
				hubId: mHubId,
				isActive
			},
			order: [
				["relative_order", "asc"]
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

const getStream = async ({ streamId  }) => {
	try {
		const mStream = parseInt(streamId);
		if(isNaN(mStream)){
			return {
				message: err.invalid_request
			}
		}
		const data = await Models.Streams.findOne({
			where: {
				id: mStream
			},
			order: [
				["relative_order", "asc"]
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

const disableStream = async ({ streamId, isActive = false }) => {
	try {
		const mStreamId = parseInt(streamId);
		if(isNaN(mStreamId)){
			return {
				message: err.invalid_request
			}
		}
		await Models.Streams.update({
			isActive
		}, {
			where: {
				id: mStreamId
			}
		});
		return {
			success: true,
			data: { streamId },
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

const latestStreamFrame = async ({ hubId }) => {
	try {
		const mHubId = parseInt(hubId);
		if(isNaN(mHubId)){
			return {
				message: err.invalid_request
			}
		}
		const streams = await Models.Streams.findAll({
			where: {
				hubId: mHubId,
				isActive: true
			},
			order: [
				['relative_order', 'asc']
			]
		});
		const finalStreams = [];
		for(const stream of streams){
			const streamObject = {
				...stream.toJSON()
			}
			const frame = await Models.Frames.findOne({
				where: {
					streamId: stream.id,
				},
				order: [
					['created_at', 'desc']
				]
			});
			if(frame){
				streamObject.frame = frame;
			}else{
				streamObject.frame = {};
			}
			finalStreams.push(streamObject);
		}
		return {
			success: true,
			data: finalStreams,
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

const updateStreamOrder = async ({ streamIds }) => {
	try {
		let relativeOrder = 1;
		for(const streamId of streamIds){
			await Models.Streams.update({relativeOrder}, {
				where: {
					id: streamId
				}
			});
			relativeOrder += 1;
		}
		return {
			success: true,
			data: streamIds,
		};
	} catch (tryErr) {
		onehealthCapture.catchError(tryErr);
		return {
			message: err.server_error,
		};
	}
};

module.exports = {
	getStreams,
	getStream,
	createStream,
	disableStream,
	latestStreamFrame,
	updateStreamOrder
}
