const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const EvaluationSchema = new mongoose.Schema({
    comment: String,
    score: {
        type: Number,
        required: [true, "Por favor califique la ruta"]
    },
    userId: {
        type: ObjectId,
        ref: "User"
    },
    routeId: {
        type: Number
    },
    placeId: {
        type: Number
    }
}, { timestamps: true });

const Evaluation = mongoose.model("Evaluation", EvaluationSchema);

module.exports = Evaluation;