const mongoose = require("mongoose")
const axios = require("axios")



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
        startingPoint: {
            type: String
        },
        endingPoint: {
            type: String
        },
        description: {
            type: String
        },
        tags: [],
        pois: []
        // evaluation: [{ type: ObjectId, ref: "User" }]
    }, { timestamps: true }
)



const Route = mongoose.model("Route", RouteSchema);

async function getRoutes() {
    const allRoutes = await axios("https://pilgrimtests.000webhostapp.com/mockapi/getall/")
    allRoutes.data.map((R) => {
        const route = new Route({
            difficulty: R.difficulty,
            duration: R.duration,
            startingPoint: R.startingPoint,
            endingPoint: R.endingPoint,
            description: R.description,
            tags: R.tags,
            pois: R.pois
        })
        route.save()
    })
}

// getRoutes()

module.exports = Route;