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

//Metodo para mostrar el perfil del autor
export const getAuthorProfile = async (req, res) => {
    try {
        const authorId = req.params.id;

        // Verificar si el usuario buscado no existe
    if(!userProfile){
        return res.status(404).send({
          status: "success",
          message: "Usuario no encontrado"
        });
      }
    } catch (error) {
        
    }
};