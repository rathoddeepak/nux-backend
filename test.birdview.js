const fs = require("fs");

const YOLOV8 = require("./src/models/yoloV8.js");
const helper = require("./src/utils/");
const cv = require("@u4/opencv4nodejs");
const yolo = new YOLOV8();

const COLOR_RED = new cv.Vec(0, 0, 255);
const COLOR_GREEN = new cv.Vec(0, 255, 0);
const COLOR_BLUE = new cv.Vec(255, 0, 0);
const BIG_CIRCLE = 60;
const SMALL_CIRCLE = 3;
const start = async () => {
    /**
     * @Step: 1 | Bird Eye View Config
     */

    let width_og = 750;
    let height_og = 1000;
    let size_frame = "1000";
    let imgPath = "./res/image/static_frame_from_video.jpg"; //Image path for original frame
    const cornerPoints = [];
    for (const point of [
        new cv.Point2(50, 329),
        new cv.Point2(327, 153),
        new cv.Point2(672, 626),
        new cv.Point2(982, 209),
    ]) {
        cornerPoints.push(point);
    }
    console.log("Bird Eye View Configuration Loaded");

    /**
     * @Step: 2 | Model Setup
     */

    const yolo = new YOLOV8();
    console.log("Model Loaded");

    /**
     * @Step: 3 | Video Setup
     */

    const videoPath = "./res/video/PETS2009.avi";

    /**
     * @Step: 4 |  Compute transformation matrix
     * Compute  transformation matrix from the original frame
     */
    const image = cv.imread(imgPath);
    const [matrix, imgOutput] = await helper.computePerspectiveTransform(
        cornerPoints,
        width_og,
        height_og,
        image
    );
    const [width, height] = imgOutput.sizes;
    console.log(width, height)

    /**
     * @Step: 5 |  Start Video Stream
     */

    const vs = new cv.VideoCapture("rtsp://192.168.85.60:1935/");
    const outputVideo1 = null;
    const outputVideo2 = null;    
    while (true) {
        const img = cv.imread("./res/image/chemin_1.png")
        const birdViewImg = img.resize(width, height, cv.INTER_AREA);        

        const frame = vs.read();
        if(frame.empty){
            break;
        }else{
            const [boxes, scores, classes] = await yolo.predict(frame, height_og);
            if(boxes && scores && classes){
                const centroids = helper.getCentroids(boxes);
                const transformedPoints = helper.computePointPerspectiveTransformation(matrix, centroids);
                for(point of transformedPoints){
                    const [x,y] = point;
                    const pt1 = new cv.Point(x,y);
                    birdViewImg.drawCircle(pt1, BIG_CIRCLE, COLOR_GREEN, 2)
                    birdViewImg.drawCircle(pt1, SMALL_CIRCLE, COLOR_GREEN, -1)
                }
                cv.imshow("Bird view", birdViewImg);
                cv.waitKey(1);
                // console.log("Bird View Shown")
                // let video = new cv.VideoWriter("./out.avi",cv.VideoWriter.fourcc("MJPG"), 25, new cv.Size(width, height), true);             
                // video.write(birdViewImg);
                // video.release();
            }
            // console.log(outputs);
            // if(!outputs[0]){
            //     break;
            // }
        }
    }
};