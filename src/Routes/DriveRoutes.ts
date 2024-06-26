import express, { Router } from 'express';

import driveController from '../Controllers/DriveController';

class DriveRoutes {

    router: Router = Router();

    constructor() {
        this.config();
        
    }

    config() {
        this.router.get('/:fileName/:folderName/:folderId/:url(*)', driveController.uploadFileDrive);
        //this.router.get('/:fileName/:folderId/:url(*)', driveController.uploadFileDrive);

        //To be able to separate folders in this path, use the character '_' 
        this.router.get('/:fileName/:folderName(*)/:folderId', driveController.uploadExcelDrive);
        this.router.get('/:fileName/:folderId', driveController.uploadExcelRootDrive);
    }

}
export default new DriveRoutes().router;