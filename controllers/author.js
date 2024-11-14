import Author from '../models/authors.js';

//Metodo de prueba Author
export const testAuthor = (req, res) => {
    return res.status(200).send({
        message: 'Author test',
    });
};

//Metodo guardar autor
export const saveAuthor = async (req, res) => {
    try {
        let params = req.body;

        if(!params.name || !params.last_name || !params.bio || !params.socialLinks ) {
            return res.status(400).json({
                status: "error",
                message: "Falta información",
            });
        }

        let author_to_save = new Author(params);

        // Control de autores duplicados
    const existingAuthor = await Author.findOne({
        $or: [
          { name: author_to_save.name.toLowerCase() }
        ]
      });
  
      // Validar el existingAuthor
      if (existingAuthor) {
        return res.status(409).send({
          status: "error",
          message: "¡El autor ya existe en la BD!"
        });
      }

      //Guardar autor en la base de datos
      await author_to_save.save();

      // Devolver el autor registrado
    return res.status(201).json({
        status: "created",
        message: "Registro de autor exitoso",
        author_to_save
      });
    } catch (error) {
        console.log("Error en el registro de autor: ", error);
        // Devolver mensaje de error
        return res.status(500).send({
        status: "error",
        message: "Error en el registro de autor"
        });
    }
};

//Metodo para subir la imagen
export const uploadImage = async (req, res) => {

    var authorId = req.params.id;
    var fileName = 'Imagen no subida';
  
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No se ha subido ninguna imagen'
        });
      }
  
      // Actualizar el autor con la ruta de la imagen
      const updatedAuthor = await Author.findByIdAndUpdate(
        authorId,
        { image: req.file.path }, // Actualizar el campo image con la ruta de la imagen
        { new: true } // Esto devuelve el documento actualizado
      );
  
      if (!updatedAuthor) {
        return res.status(404).json({
          status: 'error',
          message: 'autor no encontrado'
        });
      }
  
      // Responder con la información del autor actualizado
      return res.status(200).json({
        status: 'success',
        message: 'Imagen subida y asociada correctamente',
        author: {
            image: updatedAuthor.image
        }
      });
    } catch (error) {
      console.log('Error al subir la imagen: ', error);
          return res.status(500).json({
              status: 'error',
              message: 'Hubo un problema al subir la imagen',
      });
    }
  };

//Metodo para mostrar el perfil del autor
export const getAuthorProfile = async (req, res) => {
    try {
    const authorId = req.params.id;

    // Buscar el usuario en la BD y excluimos los datos que no queremos mostrar
    const authorProfile = await Author.findById(authorId).select();

    // Verificar si el Autor buscado no existe
    if(!authorProfile){
        return res.status(404).send({
          status: "error",
          message: "Autor no encontrado"
        });
    }

    return res.status(200).json({
        status: "success",
        author: authorProfile
      });

    } catch (error) {
    console.log("Error al obtener el perfil del autor: ", error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener el perfil del autor"
    });
    }
};

//Metodo para listar autores
export const listAuthors = async (req, res) => {
    try {
        //Gestionar la paginación
        //1. Controlar la paginacion actual
        let page = req.params.page ? parseInt(req.params.page, 10) : 1;
        //2. Configurar los items por pagina a mostrar
        let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 4;
        //Realizar la consulta paginada

        const options = {
            page: page,
            limit: itemsPerPage
        };

        const authors = await Author.paginate({}, options);

        if(!authors || authors.docs.length === 0){
            return res.status(404).send({
                status: "error",
                message: "No hay autores registrados"
            });
        }

        //Devolver los autores rpaginados
        return res.status(200).json({
            status: "success",
            authors: authors.docs,
            totalDocs: authors.totalDocs,
            totalPages: authors.totalPages,
            CurrentPage: authors.page
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
export const updateAuthor = async (req, res) => {
    try {

        //Obtener la información del autor a actualizar
        let authorIdentity = req.params.id;
        let authorToUpdate = req.body;

        //Eliminar los campos que sobran por que no los vamos a utilizar
        delete authorToUpdate.iat;
        delete authorToUpdate.exp;

        let authorUpdated = await Author.findByIdAndUpdate(authorIdentity, authorToUpdate, {new: true});

        if(!authorUpdated){
            return res.status(400).send({
                status: "error",
                message: "Error al actualizar el autor"
            });
        };

        //Devolver respuesta exitosa
        return res.status(200).send({
            status: "success",
            message: "Autor actualizado correctamente",
            author: authorUpdated
        });

    } catch (error) {
        console.log("Error al actualizar los datos del autor: ", error);
        return res.status(500).send({
        status: "error",
        message: "Error al actualizar los datos del autor"
        });
    }
};

//Metodo para eliminar autor
export const deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;

        const authorDeleted = await Author.findOneAndDelete({ _id: authorId });

        if (!authorDeleted) {
            return res.status(404).json({
                status: "error",
                message: "Autor no encontrado"
            });
        }

        // Devolvemos respuesta exitosa
        return res.status(200).json({
            status: "success",
            message: "Autor eliminado con éxito",
            author: authorDeleted
        });
    } catch (error) {
        console.log(`Error al eliminar el autor: ${ error }`);
        return res.status(500).send({
        status: "error",
        message: "Error al eliminar rl autor"
        });
    }
};