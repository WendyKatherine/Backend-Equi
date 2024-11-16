import User from '../models/users.js';
import bcrypt from 'bcrypt';
import { createToken } from '../services/jwt.js';
import fs from 'fs';
import path from 'path';
import upload from '../middlewares/upload.js';

// Método de prueba del controlador user
export const testUser = (req, res) => {
    return res.status(200).send({
      message: "Mensaje enviado desde el controlador de Usuarios"
    });
  };

// Método Registro de Usuarios
export const register = async (req, res) => {
  try {
    // Obtener los datos de la petición
    let params = req.body;

    // Validar los datos obtenidos (que los datos obligatorios existan)
    if(!params.name || !params.last_name || !params.nick || !params.email || !params.password) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos por enviar"
      });
    }

    // Crear el objeto del usuario con los datos que validamos
    let user_to_save = new User(params);

    // Control de usuarios duplicados
    const existingUser = await User.findOne({
      $or: [
        { email: user_to_save.email.toLowerCase() },
        { nick: user_to_save.nick.toLowerCase() }
      ]
    });

    // Validar el existingUser
    if (existingUser) {
      return res.status(409).send({
        status: "error",
        message: "¡El usuario ya existe en la BD!"
      });
    }

    // Cifrar la contraseña
    // Genera los saltos para encriptar
    const salt = await bcrypt.genSalt(10);

    // Encriptar la contraseña y guardarla en hashedPassword
    const hashedPassword = await bcrypt.hash(user_to_save.password, salt);

    // Asignar la contraseña encriptada al objeto del usauario
    user_to_save.password = hashedPassword;

    // Guardar el usuario en la base de datos
    await user_to_save.save();

    // Devolver el usuario registrado
    return res.status(201).json({
      status: "created",
      message: "Registro de usuario exitoso",
      user_to_save
    });

  } catch (error) {
    console.log("Error en el registro de usuario: ", error);
    // Devolver mensaje de error
    return res.status(500).send({
      status: "error",
      message: "Error en el registro de usuario"
    });
  }
};

  // Método de Login (usar JWT)
export const login = async (req, res) => {
  try {

    // Obtener los parámetros del body (enviados en la petición)
    let params = req.body;

    // Validar que si recibimos el email y el password
    if (!params.email || !params.password) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos por enviar"
      });
    }

    // Buscar en la BD si existe el email registrado
    const userBD = await User.findOne({ email: params.email.toLowerCase() });

    // Si no existe el usuario buscado
    if (!userBD) {
      return res.status(404).send({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    // Comprobar su contraseña
    const validPassword = await bcrypt.compare(params.password, userBD.password);

    // Si la contraseña es incorrecta (false)
    if (!validPassword) {
      return res.status(401).send({
        status: "error",
        message: "Contraseña incorrecta"
      });
    }

    // Generar token de autenticación (JWT)
    const token = createToken(userBD);

    // Devolver respuesta de login exitoso
    return res.status(200).json({
      status: "success",
      message: "Autenticación exitosa",
      token,
      userBD: {
        id: userBD._id,
        name: userBD.name,
        last_name: userBD.last_name,
        email: userBD.email,
        nick: userBD.nick,
        image: userBD.image
      }
    });

  } catch (error) {
    console.log("Error en la autenticación del usuario: ", error);
    // Devolver mensaje de error
    return res.status(500).send({
      status: "error",
      message: "Error en la autenticación del usuario"
    });
  }
};

export const uploadImageUser = async (req, res) => {
  const userId = req.params.id;

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

      // Actualizar el usuario con el nombre del archivo
      const userUpdated = await User.findByIdAndUpdate(
          userId,
          { image: fileName }, // Guardar solo el nombre del archivo
          { new: true }
      );

      if (!userUpdated) {
          return res.status(404).send({ message: "El usuario no existe" });
      }

      return res.status(200).send({
          status: "success",
          user: userUpdated,
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

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const userProfile = await User.findById(userId).select();

    if (!userProfile) {
      return res.status(404).send({
      status: "error",
      message: "Usuario no encontrado"
      })
    };

    return res.status(200).json({
      status: 'success',
      user: userProfile
    })

  } catch (error) {
    console.log("Error al obtener el perfil del usuario: ", error);
    return res.status(500).send({
      status: "error",
      message: "Error al obtener el perfil del usuario"
    });
  }
};

//Metodo para listar usuarios
export const listUsers = async (req, res) => {
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

      const users = await User.paginate({}, options);

      if(!users || users.docs.length === 0){
          return res.status(404).send({
              status: "error",
              message: "No hay usuarios registrados"
          });
      }

      //Devolver los usuarios rpaginados
      return res.status(200).json({
          status: "success",
          users: users.docs,
          totalDocs: users.totalDocs,
          totalPages: users.totalPages,
          CurrentPage: users.page
      });

  } catch (error) {
      console.log("Error al listar los usuarios: ", error);
      return res.status(500).send({
      status: "error",
      message: "Error al listar los usuarios"
      });
  }
};

//Metodo para actualizar lo datos del usuario
export const updateUser = async (req, res) => {
  try {

      //Obtener la información del usuario a actualizar
      let userIdentity = req.params.id;
      let userToUpdate = req.body;

      //Eliminar los campos que sobran por que no los vamos a utilizar
      delete userToUpdate.iat;
      delete userToUpdate.exp;

      let userUpdated = await User.findByIdAndUpdate(userIdentity, userToUpdate, {new: true});

      if(!userUpdated){
          return res.status(400).send({
              status: "error",
              message: "Error al actualizar el usuario"
          });
      };

      //Devolver respuesta exitosa
      return res.status(200).send({
          status: "success",
          message: "usuario actualizado correctamente",
          user: userUpdated
      });

  } catch (error) {
      console.log("Error al actualizar los datos del usuario: ", error);
      return res.status(500).send({
      status: "error",
      message: "Error al actualizar los datos del usuario"
      });
  }
};

//Metodo para eliminar usuario
export const deleteUser = async (req, res) => {
  try {
      const userId = req.params.id;

      const userDeleted = await User.findOneAndDelete({ _id: userId });

      if (!userDeleted) {
          return res.status(404).json({
              status: "error",
              message: "Usuario no encontrado"
          });
      }

      // Devolvemos respuesta exitosa
      return res.status(200).json({
          status: "success",
          message: "User eliminado con éxito",
          user: userDeleted
      });
  } catch (error) {
      console.log(`Error al eliminar el user: ${ error }`);
      return res.status(500).send({
      status: "error",
      message: "Error al eliminar rl user"
      });
  }
};