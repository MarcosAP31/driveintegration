import { Request, Response } from 'express';

import { DriveServiceImpl } from '../ServicesImpl/DriveServiceImpl';
import { DriveService } from '../Services/DriveService';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
class DriveController {
    protected driveService: DriveService;
    // Constructor del servicio
    constructor() {
        this.driveService = new DriveServiceImpl();
        // Asegura que el método esté vinculado al contexto correcto
        this.uploadFileDrive = this.uploadFileDrive.bind(this);
        this.uploadExcelDrive = this.uploadExcelDrive.bind(this);
        this.uploadExcelRootDrive = this.uploadExcelRootDrive.bind(this);
    }
    public async uploadFileDrive(req: Request, res: Response): Promise<any> {
        try {
            let { fileName, folderName, folderId, url } = req.params;
            let newUrl = url;

            //const decodedUrl = decodeURIComponent(url);
            //console.log(decodedUrl); // Aquí deberías ver la URL completa y decodificada
            //console.log(req.originalUrl);
            // Aquí puedes realizar cualquier lógica adicional con la URL decodificada

            const text = req.originalUrl;
            //console.log(req.originalUrl);
            const delimiter = '/https';
            const array = text.split(delimiter);
            //console.log(array); 
            newUrl = 'https' + array[1];
            //console.log(folderId);
            let newFolderId = folderName;
            if (folderId == 'https:') {
                folderName = '';
                folderId = newFolderId;
            }
            if (folderName != '') {
                let str = req.originalUrl;

                let newStr = str.replace('/' + newUrl, '');

                newStr = newStr.replace('/api/drive/' + fileName + '/', '');
                //console.log(newStr);
                const newArray = newStr.split('/');

                if (newArray.length > 2) {
                    folderName = '';
                    folderId = newArray[newArray.length - 1];
                    newArray.splice(newArray.length - 1, 1);
                    newArray.forEach((element, index) => {
                        if (index == newArray.length - 1) {
                            folderName = folderName + element;
                        } else {
                            folderName = folderName + element + '/';
                        }
                    })
                }

                //newStr=newStr.replace('/api/drive/'+fileName+'/','');
                //console.log(uploadedFile);
            }
            const uploadedFile = await this.driveService.uploadFileToDrive(fileName, folderName, folderId, newUrl);
            return res.json(uploadedFile);


            // Ejemplo de respuesta
            //res.json({ text: 'holaaa', url: decodedUrl });

        } catch (error: any) {
            res.status(500).json({ error: error });
        }
    }

    public async uploadExcelDrive(req: Request, res: Response): Promise<any> {
        try {
            let { fileName, folderName, folderId } = req.params;
            let data: any[] = [];
            console.log("dasdasasd");
            // Escuchar los datos del archivo binario
            req.on('data', (chunk: any) => {
                data.push(chunk);
            });

            // Manejar el final de la carga del archivo
            req.on('end', async () => {
                const buffer = Buffer.concat(data);

                console.log('Archivo recibido, tamaño:', buffer.length);

                try {
                    const uploadedFile = await this.driveService.uploadExcelToDrive(fileName, folderName, folderId, buffer);
                    res.json(uploadedFile);
                } catch (error) {
                    console.error('Error al subir archivo a Google Drive:', error);
                    res.status(500).send('Error al subir archivo a Google Drive.');
                }
            });

            req.on('error', (err: any) => {
                console.error('Error al recibir el archivo:', err);
                res.status(500).send('Error al recibir el archivo.');
            });
        } catch (error) {
            console.error('Error en la carga del archivo:', error);
            res.status(500).send('Error en la carga del archivo.');
        }
    }

    public async uploadExcelRootDrive(req: Request, res: Response): Promise<any> {
        try {
            let { fileName, folderId } = req.params;
            let data: any[] = [];
            // Escuchar los datos del archivo binario
            req.on('data', (chunk: any) => {
                data.push(chunk);
            });
            console.log('hola');
            // Manejar el final de la carga del archivo
            req.on('end', async () => {
                const buffer = Buffer.concat(data);

                console.log('Archivo recibido, tamaño:', buffer.length);

                try {
                    const uploadedFile = await this.driveService.uploadExcelToDrive(fileName, '', folderId, buffer);
                    console.log(uploadedFile);
                    res.json(uploadedFile);
                } catch (error) {
                    console.error('Error al subir archivo a Google Drive:', error);
                    res.status(500).send('Error al subir archivo a Google Drive.');
                }
            });

            req.on('error', (err: any) => {
                console.error('Error al recibir el archivo:', err);
                res.status(500).send('Error al recibir el archivo.');
            });
        } catch (error) {
            console.error('Error en la carga del archivo:', error);
            res.status(500).send('Error en la carga del archivo.');
        }
    }

}
const driveController = new DriveController;
export default driveController;