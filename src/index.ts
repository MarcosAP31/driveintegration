import express from 'express';
import indexRoutes from './Routes/IndexRoutes';
import multer from 'multer';
import bodyParser from 'body-parser';
import driveRoutes from './Routes/DriveRoutes'

// Configuración de Multer para almacenar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

//import getMessagesByConversationId from './controllers/messageController';

const http = require('http');



class Server {

  public app: any;
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {

    this.app.set('port', process.env.PORT || 3000);



    this.app.use(express.json());

    this.app.use(express.urlencoded({ extended: false }));

  }

  routes(): void {

    this.app.use('/', indexRoutes);
    this.app.use('/api/drive', driveRoutes);
    this.app.use(bodyParser.json());
    // Ruta para subir el archivo
    this.app.get('/upload', (req:any, res:any) => {
      let data:any = [];

      // Escuchar los datos del archivo binario
      req.on('data', (chunk:any) => {
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

      req.on('error', (err:any) => {
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