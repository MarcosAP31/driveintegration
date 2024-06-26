"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DriveController_1 = __importDefault(require("../Controllers/DriveController"));
class DriveRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:fileName/:folderName/:folderId/:url(*)', DriveController_1.default.uploadFileDrive);
        //this.router.get('/:fileName/:folderId/:url(*)', driveController.uploadFileDrive);
        this.router.get('/:fileName/:folderName(*)/:folderId', DriveController_1.default.uploadExcelDrive);
        this.router.get('/:fileName/:folderId', DriveController_1.default.uploadExcelRootDrive);
    }
}
exports.default = new DriveRoutes().router;
