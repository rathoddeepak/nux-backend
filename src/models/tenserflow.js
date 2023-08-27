const tf = require('@tensorflow/tfjs-node');

class TF {
	constructor() {
		this.darknetPath = "./res/model/faster_rcnn_inception_v2_coco_2018_01_28/frozen_inference_graph.pb";
		this.model = null;
	}

	init = async () => {
		this.model = await tf.node.loadSavedModel();
	};

	predict = async (frame) => {
		try {
			
		} catch (err) {

			return [null, null, null];
		}
	};
}

module.exports = TF;