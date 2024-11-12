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
});

// Configurar plugin de paginación
AuthorSchema.plugin(mongoosePaginate);

export default model("Author", AuthorSchema, "authors")

