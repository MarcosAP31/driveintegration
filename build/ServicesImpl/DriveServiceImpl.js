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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriveServiceImpl = void 0;
const DriveRepository_1 = require("../Repositories/DriveRepository");
class DriveServiceImpl {
    // Constructor del servicio
    constructor() {
        this.driveRepository = new DriveRepository_1.DriveRepository();
    }
    /*public async fetchFileFromURL(fileUrl: any): Promise<any> {
        
    }
    public async authorize(authClient: any, fileContent: string, fileName: string, folderId: string): Promise<any> {

    }
    public async uploadFile(fileUrl: any, fileName: string, folderId: string): Promise<any> {

    }*/
    uploadFileToDrive(fileName, folderName, folderId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.driveRepository.uploadFileToDrive(fileName, folderName, folderId, url);
        });
    }
    uploadExcelToDrive(fileName, folderName, folderId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.driveRepository.uploadExcelToDrive(fileName, folderName, folderId, file);
        });
    }
}
exports.DriveServiceImpl = DriveServiceImpl;
