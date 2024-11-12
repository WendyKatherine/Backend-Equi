import Authors from "../models/authors.js";

export const authorIds = async (req, res) => {
    try {
        const identityAuthorId = req.author.authorId;

        if(!identityAuthorId){
            return res.status(401).json({
                message: "error",
                message: "Autor no existe"
            });
        }
    } catch (error) {
        
    }
};