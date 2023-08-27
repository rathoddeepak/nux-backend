const constants = require("#utils/constants");
const cv = require("@u4/opencv4nodejs");
const sharp = require("sharp");
const path = require("path");
const minConfidence = 0.75;
const nmsThreshold = 0.3;

class YOLOV8 {
	constructor() {
		this.darknetPath = "./res/model/v2/";
		this.pbFile = path.resolve(
			this.darknetPath,
			"frozen_inference_graph_V2.pb"
		);
		this.pbTxt = path.resolve(
			this.darknetPath,
			"ssd_mobilenet_v2_coco_2018_03_29.pbtxt"
		);
		this.model = null;
		this.init();
	}

	init = () => {
		this.model = cv.readNetFromTensorflow(this.pbFile, this.pbTxt);
	};

	predict = async (frame, classesToDetect, maxHeight = null) => {
		try {
			if(maxHeight){
				frame = frame.resizeToMax(maxHeight);
			}
			const vec3 = new cv.Vec(0, 0, 0);
			const [imgWidth, imgHeight] = frame.sizes;
			const size = new cv.Size(300, 300);
			// const inputBlob = cv.blobFromImage(frame);
			const inputBlob = cv.blobFromImage(frame);
			this.model.setInput(inputBlob);
			// forward pass input through entire network
			const outputBlob = this.model.forward();
			// find all labels with a minimum confidence
			const numRows = outputBlob.sizes.slice(2, 3);

			const boxes = [];
			const confidences = [];
			const classIDs = [];
			const objects = [];

			for (let i = 0; i < numRows; i += 1) {
				const confidence = outputBlob.at([0, 0, i, 2]);
				if (confidence > 0.5) {
					const classId = outputBlob.at([0, 0, i, 1]);
					if (!classesToDetect.has(classId)) {
						continue;
					}
					const d1 = outputBlob.at([0, 0, i, 3]);
					const d2 = outputBlob.at([0, 0, i, 4]);
					const d3 = outputBlob.at([0, 0, i, 5]);
					const d4 = outputBlob.at([0, 0, i, 6]);

					const className = constants.classesNumberMap[classId];
					const boxX = imgHeight * d1;
					const boxY = imgWidth * d2;
					const boxWidth = imgHeight * d3;
					const boxHeight = imgWidth * d4;

					boxes.push([
						boxY,
						boxX,
						boxHeight,
						boxWidth
					]);

					objects.push({
						coord: [
							d1,
							d2,
							d3,
							d4
						],
						name: className
					});
					// [(116, 137, 166, 164), (84, 267, 126, 285), (130, 342, 174, 363)]					
					// confidences.push(confidence);
					classIDs.push(className);

					// const pt1 = new cv.Point(boxX, boxY);
					// const pt2 = new cv.Point(boxWidth, boxHeight);
					// const rectColor = new cv.Vec(23, 230, 210);
					// const rectThickness = 2;
					// const rectLineType = cv.LINE_8;

					// draw the rect for the object
					// frame.drawRectangle(
					// 	pt1,
					// 	pt2,
					// 	rectColor,
					// 	rectThickness,
					// 	rectLineType
					// );

					// const text = `${className} ${confidence.toFixed(5)}`;
					// const org = new cv.Point(boxX, boxY + 15);
					// const fontFace = cv.FONT_HERSHEY_SIMPLEX;
					// const fontScale = 0.5;
					// const textColor = new cv.Vec(255, 0, 0);
					// const thickness = 2;

					// put text on the object
					// frame.putText(
					// 	text,
					// 	org,
					// 	fontFace,
					// 	fontScale,
					// 	textColor,
					// 	thickness
					// );
				}
			}

			// cv.imshow("Temsorflow Object Detection", frame);
			return {boxes, confidences, classIDs, objects, frame};
		} catch (err) {
			console.log(err);
			return [null, null, null];
		}
	};
}

module.exports = YOLOV8;