export interface DriveService{
    /*fetchFileFromURL(fileUrl: any)
    authorize()
    uploadFile(authClient: any, fileContent: string, fileName: string, folderId: string)
    uploadFileToDrive(fileUrl:any, fileName:string, folderId:string){*/
    /*fetchFileFromURL(fileUrl: any):Promise<any>
    authorize(authClient: any, fileContent: string, fileName: string, folderId: string):Promise<any>
    uploadFile(fileUrl:any, fileName:string, folderId:string):Promise<any>*/
    uploadFileToDrive(fileName:string, folderName:string, folderId:string,url:string):Promise<any>
    uploadExcelToDrive(fileName: string, folderName: string, folderId: string, file: any): Promise<any>
}
