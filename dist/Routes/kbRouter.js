"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kbRouter = void 0;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const splitData_1 = require("@/Rag/Kb/splitData");
const ingestData_1 = require("@/Rag/Kb/ingestData");
const loadData_1 = require("@/Rag/Kb/loadData");
exports.kbRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: "uploads/",
    limits: {
        fieldSize: 10 * 1021 * 1024 // Max 10MB
    }
});
exports.kbRouter.post("/upload", upload.single('file'), async (req, res) => {
    try {
        const namespace = req.body.namespace ?? 'Default';
        if (!req.file) {
            return res.status(400).json({
                ok: false,
                message: 'No file uploaded'
            });
        }
        const { path, mimetype, originalname } = req.file;
        const rawDocs = await (0, loadData_1.loadFileAsDocuments)({ filePath: path, mimeType: mimetype, originalName: originalname }); //1
        if (!rawDocs || !rawDocs.length) {
            return res.status(400).json({
                ok: false,
                message: 'File not loaded'
            });
        }
        const chunks = await (0, splitData_1.splitDocumentsIntoChunks)(rawDocs); //2
        if (!chunks || !chunks.length) {
            return res.status(400).json({
                ok: false,
                message: 'File uploaded but no chunks created'
            });
        }
        const summary = await (0, ingestData_1.ingestDocuments)(namespace, chunks); //3
        return res.status(200).json({
            ok: summary.ok,
            namespace: summary.namespace,
            totalChunks: summary.totalChunks,
            sources: summary.sources
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'error',
            messsage: 'something went wrong while uploading file',
            err: err
        });
    }
});
