import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {TextLoader} from "@langchain/classic/document_loaders/fs/text";

interface FileArgs{
    filePath : string,
    mimeType : string,
    originalName : string
};

// sairesume.pdf
function getExtension(name : string){
    const index = name.lastIndexOf(".");
    if(index === -1){
        return ''
    }
    else{
        return name.slice(index+1,).toLowerCase();
    }
}


export async function loadFileAsDocuments(fileArgs : FileArgs){

    const {filePath,mimeType,originalName} = fileArgs;

    const extractedExtension = getExtension(originalName);

    const isPdf = extractedExtension === 'pdf' || mimeType === 'application/pdf';
    const isText = extractedExtension === 'txt' || mimeType === 'text/plain';
    const isMarkdown = extractedExtension ==='md' || 
    extractedExtension === 'markdown' ||mimeType === 'text/markdown';

    if(isPdf){
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        return docs.map((doc)=>{
            return {
                ...doc,
                metadata : {
                    ...doc.metadata,
                    source : originalName
                }
            };
        });
    }

    if(isMarkdown || isText){
        const loader = new TextLoader(filePath);
        const docs = await loader.load();

        return docs.map((doc)=>{
            return {
                ...doc,
                metadata : {
                    ...doc.metadata,
                    source : originalName
                }
            }
        });
    }

    return []; // Unsupported Type Format
};