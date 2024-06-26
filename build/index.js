"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const IndexRoutes_1 = __importDefault(require("./Routes/IndexRoutes"));
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const DriveRoutes_1 = __importDefault(require("./Routes/DriveRoutes"));
// Configuración de Multer para almacenar archivos en memoria
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
//import getMessagesByConversationId from './controllers/messageController';
const http = require('http');
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/', IndexRoutes_1.default);
        this.app.use('/api/drive', DriveRoutes_1.default);
        this.app.use(body_parser_1.default.json());
        // Ruta para subir el archivo
        this.app.get('/upload', (req, res) => {
            let data = [];
            // Escuchar los datos del archivo binario
            req.on('data', (chunk) => {
                data.push(chunk);
            });
            // Manejar el final de la carga del archivo
            req.on('end', () => {
                const buffer = Buffer.concat(data);
                console.log('Archivo recibido, tamaño:', buffer.length);
                // Aquí puedes manejar el archivo como desees, por ejemplo, guardarlo en el sistema de archivos
                // fs.writeFileSync('output.bin', buffer);
                // O simplemente enviar una respuesta
                res.send(buffer);
            });
            req.on('error', (err) => {
                console.error('Error al recibir el archivo:', err);
                res.status(500).send('Error al recibir el archivo.');
            });
        });
    }
    start() {
        const server = http.createServer(this.app);
        server.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
        /*
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });*/
    }
}
const server = new Server();
server.start();
