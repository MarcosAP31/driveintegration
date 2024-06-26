"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DriveServiceImpl_1 = require("../ServicesImpl/DriveServiceImpl");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
class DriveController {
    // Constructor del servicio
    constructor() {
        this.driveService = new DriveServiceImpl_1.DriveServiceImpl();
        // Asegura que el método esté vinculado al contexto correcto
        this.uploadFileDrive = this.uploadFileDrive.bind(this);
        this.uploadExcelDrive = this.uploadExcelDrive.bind(this);
        this.uploadExcelRootDrive = this.uploadExcelRootDrive.bind(this);
    }
    uploadFileDrive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                            }
                            else {
                                folderName = folderName + element + '/';
                            }
                        });
                    }
                    //newStr=newStr.replace('/api/drive/'+fileName+'/','');
                    //console.log(uploadedFile);
                }
                const uploadedFile = yield this.driveService.uploadFileToDrive(fileName, folderName, folderId, newUrl);
                return res.json(uploadedFile);
                // Ejemplo de respuesta
                //res.json({ text: 'holaaa', url: decodedUrl });
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
    }
    uploadExcelDrive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { fileName, folderName, folderId } = req.params;
                let data = [];
                console.log("dasdasasd");
                // Escuchar los datos del archivo binario
                req.on('data', (chunk) => {
                    data.push(chunk);
                });
                // Manejar el final de la carga del archivo
                req.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    const buffer = Buffer.concat(data);
                    console.log('Archivo recibido, tamaño:', buffer.length);
                    try {
                        const uploadedFile = yield this.driveService.uploadExcelToDrive(fileName, folderName, folderId, buffer);
                        res.json(uploadedFile);
                    }
                    catch (error) {
                        console.error('Error al subir archivo a Google Drive:', error);
                        res.status(500).send('Error al subir archivo a Google Drive.');
                    }
                }));
                req.on('error', (err) => {
                    console.error('Error al recibir el archivo:', err);
                    res.status(500).send('Error al recibir el archivo.');
                });
            }
            catch (error) {
                console.error('Error en la carga del archivo:', error);
                res.status(500).send('Error en la carga del archivo.');
            }
        });
    }
    uploadExcelRootDrive(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { fileName, folderId } = req.params;
                let data = [];
                // Escuchar los datos del archivo binario
                req.on('data', (chunk) => {
                    data.push(chunk);
                });
                console.log('hola');
                // Manejar el final de la carga del archivo
                req.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    const buffer = Buffer.concat(data);
                    console.log('Archivo recibido, tamaño:', buffer.length);
                    try {
                        const uploadedFile = yield this.driveService.uploadExcelToDrive(fileName, '', folderId, buffer);
                        console.log(uploadedFile);
                        res.json(uploadedFile);
                    }
                    catch (error) {
                        console.error('Error al subir archivo a Google Drive:', error);
                        res.status(500).send('Error al subir archivo a Google Drive.');
                    }
                }));
                req.on('error', (err) => {
                    console.error('Error al recibir el archivo:', err);
                    res.status(500).send('Error al recibir el archivo.');
                });
            }
            catch (error) {
                console.error('Error en la carga del archivo:', error);
                res.status(500).send('Error en la carga del archivo.');
            }
        });
    }
}
const driveController = new DriveController;
exports.default = driveController;
