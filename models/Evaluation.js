const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const EvaluationSchema = new mongoose.Schema({
    comment: {
        type: String,
        minlength: [20,"Necesitamos su sugerencia, por favor ingrese al menos 20 caracteres"],
        required: [true, "Tu sugerencia es muy importate para nosotros"]
    },
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