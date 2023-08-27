/**
 * @Page: Detection Services
 * @Description: Create hub related functions here
 */

//Models
const Models = require("#db");
const err = require("#utils/errors");
const onehealthCapture = require("#utils/oneHealthCapture");
const validation = require("#utils/validation");
const constants = require("#utils/constants");
const aws = require("#utils/aws");
const { QueryTypes } = require("sequelize");
const sequilize = require("#utils/dbConnection");

const YOLOV8 = require("#models/yoloV8.js");
const cv = require("@u4/opencv4nodejs");
const yolo = new YOLOV8();

const saveDetection = async ({ streamId }, file, callback) => {
    try {
        if (!streamId) {
            callback({
                message: err.invalid_request,
            });
            return;
        }
        let classesToDetect = [];
        const query = `select hub.classes from streams as stream left join hubs as hub on hub.id = stream.hub_id where stream.id = ${streamId}`;
        const classesData = await sequilize.query(query, {
            type: QueryTypes.SELECT,
        });
        if (classesData?.length > 0) {
            classesToDetect = classesData[0].classes;
        } else {
            classesToDetect = constants.defaultDetectionClasses;
        }
        const finalClasses = new Set();
        for (const className of classesToDetect) {
            const idx = constants.classesMap[className];
            if (idx !== undefined) {
                finalClasses.add(idx);
            }
        }
        cv.imdecodeAsync(file.buffer)
            .then((frame) => {
                yolo.predict(frame, finalClasses).then((data) => {
                    const { objects, frame } = data;
                    const [height, width] = frame.sizes; 
                    callback({
                        success: true,
                        data: {objects, height, width},
                    });
                    saveFrame(streamId, objects, frame);
                });
            })
            .catch((tryErr) => {
                console.log(tryErr);
                callback({
                    message: err.server_error,
                });
            });
    } catch (tryErr) {
        console.log(tryErr);
        callback({
            message: err.server_error,
        });
    }
};

const saveFrame = (streamId, objects, image) => {
    try {
        if (objects?.length > 0) {
            const [height, width] = image.sizes; 
            Models.Frames.create({
                streamId,
                width,
                height,
                objects,
            }).then((frame) => {
                cv.imencodeAsync(".jpg", image).then((baseBuffer) => {
                    const str = baseBuffer.toString("base64");
                    const buffer = Buffer.from(str, "base64");
                    aws.addFileToBucket(
                        {
                            file: { buffer },
                            name: `${streamId}/${frame.id}frame.jpg`,
                        },
                        aws.STREAM_FRAMES_BUCKET
                    );
                });
            });
        }
    } catch (err) {
        // Ignore
    }
};

module.exports = {
    saveDetection,
};