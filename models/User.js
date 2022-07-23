const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: [3, "Por favor ingrese al menos 3 caracteres"],
        required: [true, "Por favor, introduzca su nombre"],
    },
    lastName: {
        type: String,
        minlength: [3, "Por favor ingrese al menos 3 caracteres"],
        required: [true, "Por favor, introduzca su apellido"],
    },
    role: {
        type: String
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "El formato del correo está incorrecto",
        ],
        required: [true, "Por favor introduzca su correo"],
        unique: true,
    },
    password: {
        type: String
    },
    age: {
        type: String
    },
    gender: {
        type: String,
    },
    accompaniment: {
        type: String
    },
    duration: {
        type: String
    },
    price: {
        type: String
    },
    difficulty: {
        type: String
    },
    transportation: {
        type: String
    },
    typeOfRoute: {
        type: String
    },
    AIAvailable: {
        type: Boolean,
        default: false
    },
    tokens: [],
    evaluationIds: [{ type: ObjectId, ref: "Evaluation" }],
    favoriteRouteIds: [{ type: Number }],
    favoritePlaceIds: [{ type: Number }]
}, { timestamps: true });

UserSchema.methods.toJSON = function () {
    const user = this._doc;
    delete user.tokens;
    delete user.password;
    delete user.email;
    return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;