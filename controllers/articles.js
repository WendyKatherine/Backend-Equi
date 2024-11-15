import Article from '../models/articles.js';
import fs from 'fs';
import path from 'path';

//Metodo de prueba Article
export const testArticle = (req, res) => {
    return res.status(200).send({
        message: 'Article test',
    });
};

//Metodo guardar articulo
export const saveArticle = async (req, res) => {
    try {
        let params = req.body;

        if(!params.title || !params.content || !params.summary || !params.status || !params.tags || !params.created_by ) {
            return res.status(400).json({
                status: "error",
                message: "Falta información",
            });
        }

    let newArticle = new Article(params);

     // Guardar la nueva publicación en la BD
     const articleStored = await newArticle.save();

    // Verificar que se guardó la nueva publicación en la BD (si existe articleStored)
    if(!articleStored){
        return res.status(500).send({
          status: "error",
          message: "No se ha guardado la publicación"
        });
      }

      // Devolver el articulo registrado
    return res.status(201).json({
        status: "created",
        message: "Registro de articulo exitoso",
        articleStored
      });
    } catch (error) {
        console.log("Error en el registro de articulo: ", error);
        // Devolver mensaje de error
        return res.status(500).send({
        status: "error",
        message: "Error en el registro de articulo"
        });
    }
};

//Metodo guardar imagen del articulo
export const uploadImageArticle = async (req, res) => {
    const articleId = req.params.id;
  
    if (!req.files || !req.files.image) {
        return res.status(400).send({
            message: "No se ha subido ninguna imagen",
        });
    }
  
    try {
        const filePath = req.files.image.path; // Ruta completa del archivo
        const fileName = path.basename(filePath); // Solo el nombre del archivo
        const fileExt = path.extname(fileName).toLowerCase(); // Extensión del archivo
  
        // Validar extensiones permitidas
        const validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
        if (!validExtensions.includes(fileExt)) {
            // Eliminar archivo si la extensión no es válida
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error eliminando archivo:", err);
                }
            });
            return res.status(400).send({ message: "La extensión no es válida" });
        }
  
        // Actualizar el autor con el nombre del archivo
        const articleUpdated = await Article.findByIdAndUpdate(
            articleId,
            { image: fileName }, // Guardar solo el nombre del archivo
            { new: true }
        );
  
        if (!articleUpdated) {
            return res.status(404).send({ message: "El au no existe" });
        }
  
        return res.status(200).send({
            status: "success",
            article: articleUpdated,
        });
  
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        return res.status(500).send({
            message: "Error al subir la imagen",
            error,
        });
    }
  };
  
  export const getImageFile = async (req, res) => {
    const file = req.params.image;
    const path_file = path.resolve('./uploads/', file); // Usa path.resolve para generar la ruta absoluta
  
    fs.access(path_file, fs.constants.F_OK, (err) => {
        if (!err) {
            return res.sendFile(path_file); // Enviar el archivo si existe
        } else {
            return res.status(404).send({
                message: "No existe la imagen.",
            });
        }
    });
  };

//Metodo para mostrar articulo
export const getArticle = async (req, res) => {
    try {
    const articleId = req.params.id;

    // Buscar el usuario en la BD y excluimos los datos que no queremos mostrar
    const articleProfile = await Article.findById(articleId).select();

    // Verificar si el Articulo buscado no existe
    if(!articleProfile){
        return res.status(404).send({
          status: "success",
          message: "Articulo no encontrado"
        });
    }

    return res.status(200).json({
        status: "success",
        article: articleProfile
      });

    } catch (error) {
    console.log("Error al obtener articulo: ", error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener el articulo"
    });
    }
};

//Metodo para listar autores
export const listArticle = async (req, res) => {
    try {
        //Gestionar la paginación
        //1. Controlar la paginacion actual
        let page = req.params.page ? parseInt(req.params.page, 10) : 1;
        //2. Configurar los items por pagina a mostrar
        let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 8;
        //Realizar la consulta paginada

        const options = {
            page: page,
            limit: itemsPerPage
        };

        const article = await Article.paginate({}, options);

        if(!article || article.docs.length === 0){
            return res.status(404).send({
                status: "error",
                message: "No hay autores registrados"
            });
        }

        //Devolver los autores rpaginados
        return res.status(200).json({
            status: "success",
            article: article.docs,
            totalDocs: article.totalDocs,
            totalPages: article.totalPages,
            CurrentPage: article.page
        });

    } catch (error) {
        console.log("Error al listar los autores: ", error);
        return res.status(500).send({
        status: "error",
        message: "Error al listar los autores"
        });
    }
};

//Metodo para actualizar lo datos del autor
export const updateArticle = async (req, res) => {
    try {

        //Obtener la información del autor a actualizar
        let articleIdentity = req.params.id;
        let articleToUpdate = req.body;

        //Eliminar los campos que sobran por que no los vamos a utilizar
        delete articleToUpdate.iat;
        delete articleToUpdate.exp;

        let articleUpdated = await Article.findByIdAndUpdate(articleIdentity, articleToUpdate, {new: true});

        if(!articleUpdated){
            return res.status(400).send({
                status: "error",
                message: "Error al actualizar el Articulo"
            });
        };

        //Devolver respuesta exitosa
        return res.status(200).send({
            status: "success",
            message: "Articulo actualizado correctamente",
            article: articleUpdated
        });

    } catch (error) {
        console.log("Error al actualizar los datos del articulo: ", error);
        return res.status(500).send({
        status: "error",
        message: "Error al actualizar los datos del articulo"
        });
    }
};

//Metodo para eliminar autor
export const deleteArticle = async (req, res) => {
    try {
        const articleId = req.params.id;

        const articleDeleted = await Article.findOneAndDelete({ _id: articleId });

        if (!articleDeleted) {
            return res.status(404).json({
                status: "error",
                message: "Artículo no encontrado"
            });
        }

        // Devolvemos respuesta exitosa
        return res.status(200).json({
            status: "success",
            message: "Autor eliminado con éxito",
            article: articleDeleted
        });
    } catch (error) {
        console.log(`Error al eliminar el autor: ${ error }`);
        return res.status(500).send({
        status: "error",
        message: "Error al eliminar el articulo"
        });
    }
};