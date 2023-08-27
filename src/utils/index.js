const constants = require("./constants");
const cv = require('@u4/opencv4nodejs');
const math = require("mathjs");

const computePerspectiveTransform = async (cornerPoints,width,height,image) => {
	/**
	 * Compute the transformation matrix
     * @cornerPoints : 4 corner points selected from the image
     * @height|width : size of the image
    */
    const imageParams = [
    	new cv.Point2(0,0),
    	new cv.Point2(width,0),
    	new cv.Point2(0,height),
    	new cv.Point2(width,height)
    ];
    const matrix = cv.getPerspectiveTransform(cornerPoints,imageParams);
    const wrappedTransfrom = image.warpPerspective(matrix,new cv.Size(width, height));
    return [matrix, wrappedTransfrom]; 
}

const computePointPerspectiveTransformation = (matrix,list_downoids) => {
    /*Apply the perspective transformation to every ground point which have been detected on the main frame.
    @ matrix : the 3x3 matrix 
    @ list_downoids : list that contains the points to transform
    return : list containing all the new points
    */
    // Compute the new coordinates of our points
    const list_points_to_detect = math.reshape(list_downoids, [-1, 1, 2]);
    if(list_points_to_detect.length > 0){
        const srcCorners = new cv.Mat(list_points_to_detect, cv.CV_32FC2)
        const transformed_points = srcCorners.perspectiveTransform(matrix);        
        // Loop over the points and add them to the list that will be returned
        const transformed_points_list = [];
        const arrayData = transformed_points.getDataAsArray();
        for(let i = 0; i < transformed_points.sizes[0]; i++){        
            transformed_points_list.push(
                [
                    arrayData[i][0][0],
                    arrayData[i][0][1]
                ]
            );
        }
        return transformed_points_list;
    }else{
        return [];
    }
}

const getCentroids = (boxes) => {
    /*
    For every bounding box, compute the centroid and the point located on the bottom center of the box
    @ array_boxes_detected : list containing all our bounding boxes 
    */
    const centroids = [];
    for(const rect of boxes){
        /*
        Get the center of the bounding and the point "on the ground"
        @ param = box : 2 points representing the bounding box
        @ return = centroid (x1,y1) and ground point (x2,y2)
        */
        // Center of the box x = (x1+x2)/2 et y = (y1+y2)/2

        const center_x = parseInt((rect[1] + rect[3])/2);
        const center_y = parseInt((rect[0] + rect[2])/2);
        // Coordiniate on the point at the bottom center of the box
        // const center_y_ground = center_y + ((rect.height - rect.y)/2)
        // centroids.push([center_x, center_y, center_x, center_y_ground]);
        centroids.push([center_x, center_y]);
    }
    return centroids;
}

const printGreetings = (port) => {
const greeting = `/***************************************/
            ${constants.appName} Backend
           listening on ${port}
/***************************************/`;
console.log(greeting);
}

module.exports = {
    computePointPerspectiveTransformation,
	computePerspectiveTransform,
    getCentroids,
    printGreetings
}