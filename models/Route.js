const mongoose = require("mongoose")

const RouteSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        difficulty: {
            type: String
        },
        duration: {
            type: Number
        },
        startingPoing: {
            type: String
        },
        endingPoing: {
            type: String
        },
        description: {
            type: String
        },
        tags: [],
        evaluation: [{ type: ObjectId, ref: "User" }]
    }, { timestamps: true }
)

const Route = mongoose.model("Route", RouteSchema);

module.exports = Route;