// Importar dependencias (configurar en package.json)
import express from "express";
import connection from "./database/connection.js";
import cors from "cors";
import bodyParser from "body-parser";
import UserRoutes from "./routes/users.js";
import AuthorRoutes from "./routes/authors.js";
import ArticleRoutes from "./routes/articles.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname y __filename en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("API Node Equi en ejecución");

connection();

// Crear el servidor Node
const app = express();
const puerto = process.env.PORT || 3900;

// Configurar cors para que acepte peticiones del frontend
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: "Content-Type,Authorization",
}));

// Decodificar los datos desde los formularios para convertirlos en objetos de JavaScript
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar rutas del aplicativo (módulos)
app.use('/api/user', UserRoutes);
app.use('/api/author', AuthorRoutes);
app.use('/api/article', ArticleRoutes);

// Configurar carpeta de archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar el servidor de Node
app.listen(puerto, () => {
  console.log("Servidor de Node en el puerto", puerto);
});

export default app;