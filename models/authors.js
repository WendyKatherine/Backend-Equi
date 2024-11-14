import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const AuthorSchema =    Schema({
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    socialLinks:{
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "default_user.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Configurar plugin de paginación
AuthorSchema.plugin(mongoosePaginate);

export default model("Author", AuthorSchema, "authors")

