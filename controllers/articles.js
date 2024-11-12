import Article from '../models/articles.js';

//Metodo de prueba Articles
export const testArticle = (req, res) => {
    return res.status(200).send({
        message: 'Article test',
    });
};