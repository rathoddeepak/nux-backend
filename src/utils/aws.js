const onehealthCapture = require("./onehealthCapture");
const S3 = require("aws-sdk/clients/s3");
const constants = require("./constants");
const config = new S3({
	endpoint: constants.s3URL, // for docker, http://minio:9000
	credentials: {
		accessKeyId: constants.s3User, // MINIO_ROOT_USER
		secretAccessKey: constants.s3Pass, // MINIO_ROOT_PASSWORD
	},
	s3ForcePathStyle: true, // important
});

//BUCKETS
const STREAM_FRAMES_BUCKET = "nuxframes";

const addFileToBucket = async ({ name, file }, Bucket) => {
	try {
		let params = {
			Bucket,
			Body: file.buffer,
			Key: name,
			ContentType: file.mimetype,
			ContentLength: file.size,
		};
		await config.putObject(params).promise();
		const path = `${Bucket}/${name}`;
		return [false, path];
	} catch (err) {
		onehealthCapture.catchError(err);
		return [true, false];
	}
};

const deleteFileFromBucket = async (Key, Bucket) => {
	try {
		let params = {
			Bucket,
			Key,
		};
		await config.deleteObject(params).promise();
		return [false, true];
	} catch (err) {
		onehealthCapture.catchError(err);
		return [true, false];
	}
};

const moveToBucket = async (currentFile, Bucket) => {
	try {
		const parts = (currentFile || "").split("/");
		const currentBucketName = parts?.[0];
		const currentKey = parts?.[1];
		await config
			.copyObject({
				CopySource: `${currentBucketName}/${currentKey}`, // old file Key
				Bucket,
				Key: currentKey,
			})
			.promise();

		await config
			.deleteObject({
				Bucket: currentBucketName,
				Key: currentKey,
			})
			.promise();

		const path = `${Bucket}/${currentKey}`;
		return [false, path];
	} catch (err) {
		onehealthCapture.catchError(err);
		return [true, false];
	}
};

module.exports = {
	addFileToBucket,
	deleteFileFromBucket,
	moveToBucket,
	STREAM_FRAMES_BUCKET,
	config
};