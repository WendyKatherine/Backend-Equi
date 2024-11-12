import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ArticleSchema = Schema ({
    author_id: {
        type: Schema.ObjectId,
        ref: 'Author',
        required: true
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    summary: {
        type: String,
    },
    status: {
        type: String,
    },
    tags: {
        type: String,
    },
    created_by: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

// Configurar plugin de paginación
ArticleSchema.plugin(mongoosePaginate);

export default model("Article", ArticleSchema, "articles");