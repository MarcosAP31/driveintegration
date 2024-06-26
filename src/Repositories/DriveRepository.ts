import pool from '../database';
const fs = require('fs');
const { google } = require('googleapis');
const axios = require('axios'); // For fetching file from URL
const { Readable } = require('stream'); // To create readable stream from fetched content

const apikeys = require('../../apikeys.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];
export class DriveRepository {

    // Function to fetch file content from URL
    public async fetchFileFromURL(fileUrl: any): Promise<any> {
        const response = await axios.get(fileUrl, {
            responseType: 'stream', // Fetch as stream for large files
        });
        return response.data;
    }

    // Function to authorize Google Drive API
    public async authorize(): Promise<any> {
        const jwtClient = new google.auth.JWT(
            apikeys.client_email,
            null,
            apikeys.private_key,
            SCOPE
        );

        await jwtClient.authorize();

        return jwtClient;
    }

    // Function to upload file content to Google Drive
    public async uploadFile(authClient: any, fileContent: any, fileName: string, folderName: string, folderId: string): Promise<any> {
        const drive = google.drive({ version: 'v3', auth: authClient });
        let readableStream:any = "";
        console.log('37 '+folderName);
        //console.log(fileContent);
        //console.log(fileContent);
        if (folderName.includes('_')) {

            folderName = folderName.replace(/_/g, '/');
            console.log(folderName);
        }
        readableStream = Readable.from(fileContent);

        /*readableStream.on('error', (error: any) => {
            console.error('Error reading stream:', error);
        });*/

        // Function to check if a folder exists
        const getFolder = async (name: string, parentFolderId: string) => {
            try {
                const response = await drive.files.list({
                    q: `mimeType='application/vnd.google-apps.folder' and name='${name}' and '${parentFolderId}' in parents and trashed=false`,
                    fields: 'files(id, name, webViewLink)'
                });

                if (response.data.files.length > 0) {
                    return response.data.files[0];
                } else {
                    return null;
                }
            } catch (error) {
                throw new Error(`Failed to retrieve folder: ${error}`);
            }
        };

        // Function to create a folder
        const createFolder = async (name: string, parentFolderId: string) => {
            const fileMetadata = {
                name: name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentFolderId]
            };

            try {
                const response = await drive.files.create({
                    resource: fileMetadata,
                    fields: 'id, webViewLink'
                });
                return response.data;
            } catch (error) {
                throw new Error(`Failed to create folder: ${error}`);
            }
        };
        try {

            if (folderName != '') {
                const newArray = folderName.split('/');
                let indexFolders = 0;
                //console.log('81'); console.log(folderName);
                //console.log('82'); console.log(newArray);
                // Check if the folder exists
                //console.log(newArray);
                if (newArray != null) {
                    let subFolder = await getFolder(folderName, folderId);
                    for (const element of newArray) {

                        subFolder = await getFolder(element, folderId);
                        // If the folder does not exist, create a new subfolder inside the specified parent folder
                        if (!subFolder) {
                            subFolder = await createFolder(element, folderId);
                        }
                        folderId = subFolder.id;
                        //console.log('96 ' + folderId);

                        //console.log('96'); console.log(element);
                        if (indexFolders == newArray.length - 1) {
                            const responses = await drive.files.list({

                                q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
                                fields: 'files(id,name,webViewLink)',
                            });
                            const array = responses.data.files;
                            const ext = fileName.split('.');

                            let file = fileName.replace('.' + ext[1], '');
                            let index = 0;
                            for (const elem of array) {
                                let name = elem.name.replace('.' + ext[1], '');
                                if (name.includes(file)) {
                                    index++;
                                }
                            }
                            if (index != 0) {
                                file = file + '(' + index + ').' + ext[1];
                                fileName = file;
                            }
                            const folderLink = subFolder.webViewLink;

                            const fileMetadata = {
                                name: fileName,
                                parents: [folderId],
                            };

                            const media = {
                                mimeType: 'application/octet-stream',
                                body: readableStream,
                            };

                            const response = await drive.files.create({
                                resource: fileMetadata,
                                media: media,
                                fields: 'webViewLink, webContentLink',
                            });

                            return {
                                file: response.data,
                                folderLink: folderLink,
                            };
                        }
                        indexFolders++;
                    }
                } else {
                    let subFolder = await getFolder(folderName, folderId);
                    //console.log(subFolder);
                    if (!subFolder) {
                        subFolder = await createFolder(folderName, folderId);
                    }
                    // If the folder does not exist, create a new subfolder inside the specified parent folder
                    const subFolderId = subFolder.id;
                    const folderLink = subFolder.webViewLink;
                    const responses = await drive.files.list({

                        q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
                        fields: 'files(id,name,webViewLink)',
                    });
                    const array = responses.data.files;
                    const ext = fileName.split('.');

                    let file = fileName.replace('.' + ext[1], '');
                    let index = 0;
                    for (const elem of array) {
                        let name = elem.name.replace('.' + ext[1], '');
                        if (name.includes(file)) {
                            index++;
                        }
                    }
                    if (index != 0) {
                        file = file + '(' + index + ').' + ext[1];
                        fileName = file;
                    }
                    const fileMetadata = {
                        name: fileName,
                        parents: [subFolderId],
                    };

                    const media = {
                        mimeType: 'application/octet-stream',
                        body: readableStream,
                    };

                    const response = await drive.files.create({
                        resource: fileMetadata,
                        media: media,
                        fields: 'webViewLink, webContentLink',
                    });

                    return {
                        file: response.data,
                        folderLink: folderLink,
                    };


                }
            } else {
                /*q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
                    fields: 'files(id,name,webViewLink)'*/
                    console.log(folderName);
                const responses = await drive.files.list({

                    q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed=false`,
                    fields: 'files(id,name,webViewLink)',
                });
                const array = responses.data.files;
                const ext = fileName.split('.');

                let file = fileName.replace('.' + ext[1], '');
                let index = 0;
                for (const element of array) {
                    let name = element.name.replace('.' + ext[1], '');
                    if (name.includes(file)) {
                        console.log('174 hola');
                        index++;
                    }
                }
                if (index != 0) {
                    file = file + '(' + index + ').' + ext[1];
                    fileName = file;
                }
                //console.log(166);console.log(responses.data.files[0].name);
                //console.log(167); console.log(responses.data);
                const respons = await drive.files.get({
                    fileId: folderId,
                    fields: 'id, name, webViewLink',
                });
                //console.log(171); console.log(respons.data);
                //console.log(respons.data);
                //console.log(respons.data.name);
                //console.log(respons.data.id);
                //const folder = await getFolder(respons.data.name, folderId);
                //console.log(folder);
                const folderLink = respons.data.webViewLink;
                const fileMetadata = {
                    name: fileName,
                    parents: [folderId],
                };

                const media = {
                    mimeType: 'application/octet-stream',
                    body: readableStream,
                };

                const response = await drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'webViewLink, webContentLink',
                });

                return {
                    file: response.data,
                    folderLink: folderLink,
                };
            }



        } catch (error) {
            throw error;
        }
    }

    public async uploadFileToDrive(fileName: string, folderName: string, folderId: string, url: string): Promise<any> {
        try {
            const authClient = await this.authorize();
            const fileContent = await this.fetchFileFromURL(url);
            const uploadedFile = await this.uploadFile(authClient, fileContent, fileName, folderName, folderId);

            //console.log('File uploaded. Web View Link:', uploadedFile.webViewLink);
            //console.log('File uploaded. Web Content Link:', uploadedFile.webContentLink);
            return uploadedFile;
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
    public async uploadExcelToDrive(fileName: string, folderName: string, folderId: string, file: any): Promise<any> {
        try {
            
            // Convert file content to readable stream
            const authClient = await this.authorize();
            const fileContent = file;
            console.log("holaaa");
            console.log(file);
            console.log("queee");
            const uploadedFile = await this.uploadFile(authClient, fileContent, fileName, folderName, folderId);

            //console.log('File uploaded. Web View Link:', uploadedFile.webViewLink);
            //console.log('File uploaded. Web Content Link:', uploadedFile.webContentLink);
            return uploadedFile;
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }



}
