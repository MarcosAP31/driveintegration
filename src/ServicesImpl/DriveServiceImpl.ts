import { DriveRepository } from "../Repositories/DriveRepository";
import { DriveService } from "../Services/DriveService";

export class DriveServiceImpl implements DriveService {
    protected driveRepository: DriveRepository;
    // Constructor del servicio
    constructor() {
        
        this.driveRepository = new DriveRepository();
    }
    /*public async fetchFileFromURL(fileUrl: any): Promise<any> {
        
    }
    public async authorize(authClient: any, fileContent: string, fileName: string, folderId: string): Promise<any> {

    }
    public async uploadFile(fileUrl: any, fileName: string, folderId: string): Promise<any> {

    }*/
    public async uploadFileToDrive(fileName: string, folderName: string, folderId: string,url: string): Promise<any> {
        return this.driveRepository.uploadFileToDrive(fileName,folderName,folderId,url);
    }
    public async uploadExcelToDrive(fileName: string, folderName: string, folderId: string, file: any): Promise<any>{
        return this.driveRepository.uploadExcelToDrive(fileName,folderName,folderId,file);
    }

}

