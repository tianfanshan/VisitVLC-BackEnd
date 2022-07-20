const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: [3,"Please enter at least three characters in the first name"],
        required: [true, "Please enter your first name"],
    },
    lastName: {
        type: String,
        minlength: [3,"Please enter at least three characters in the last name"],
        required: [true, "Please enter your last name"],
    },
    role: {
        type: String
    },
    // gender: {
    //     type: String,
    //     required: [true, "Please enter your gender"],
    // },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "The email format is incorrect",
        ],
        required: [true, "Please enter your mail"],
        unique: true,
    },
    // dateOfBirth: {
    //     type: Date,
    //     required: [true, "Please enter your date of birth"]
    // },
    // disabled: {
    //     type: Boolean
    // },
    password: {
        type: String
    },
    tokens: [],
    evaluationIds: [{ type: ObjectId, ref: "Evaluation" }],
    favoriteRouteIds: [{ type: String }],
    favoritePlaceIds: [{ type: String }]
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