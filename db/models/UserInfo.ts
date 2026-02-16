import mongoose, { Schema } from "mongoose";

const UserInfoSchema = new Schema(
    {
        theUserIs: {
            type: String,
            default: "",
        },
        theUserLikes: {
            type: String,
            default: "",
        },
        theUserDislikes: {
            type: String,
            default: "",
        },
        theUserHobbies: {
            type: String,
            default: "",
        }
    },
    {
        timestamps: true,
    }
);

const UserInfo = mongoose.models.UserInfo || mongoose.model("UserInfo", UserInfoSchema);

export default UserInfo;
