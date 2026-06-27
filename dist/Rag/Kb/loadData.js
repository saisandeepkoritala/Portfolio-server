"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFileAsDocuments = loadFileAsDocuments;
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const text_1 = require("@langchain/classic/document_loaders/fs/text");
;
// sairesume.pdf
function getExtension(name) {
    const index = name.lastIndexOf(".");
    if (index === -1) {
        return '';
    }
    else {
        return name.slice(index + 1).toLowerCase();
    }
}
async function loadFileAsDocuments(fileArgs) {
    const { filePath, mimeType, originalName } = fileArgs;
    const extractedExtension = getExtension(originalName);
    const isPdf = extractedExtension === 'pdf' || mimeType === 'application/pdf';
    const isText = extractedExtension === 'txt' || mimeType === 'text/plain';
    const isMarkdown = extractedExtension === 'md' ||
        extractedExtension === 'markdown' || mimeType === 'text/markdown';
    if (isPdf) {
        const loader = new pdf_1.PDFLoader(filePath);
        const docs = await loader.load();
        return docs.map((doc) => {
            return {
                ...doc,
                metadata: {
                    ...doc.metadata,
                    source: originalName
                }
            };
        });
    }
    if (isMarkdown || isText) {
        const loader = new text_1.TextLoader(filePath);
        const docs = await loader.load();
        return docs.map((doc) => {
            return {
                ...doc,
                metadata: {
                    ...doc.metadata,
                    source: originalName
                }
            };
        });
    }
    return []; // Unsupported Type Format
}
;
