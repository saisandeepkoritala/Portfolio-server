import multer from 'multer';
import { Router } from 'express';
import { splitDocumentsIntoChunks } from '@/Rag/Kb/splitData';
import { ingestDocuments } from '@/Rag/Kb/ingestData';
import { loadFileAsDocuments } from '@/Rag/Kb/loadData';

export const kbRouter = Router();


const upload = multer({
    dest : "uploads/",
    limits : {
        fieldSize:10*1021*1024 // Max 10MB
    }
});

kbRouter.post("/upload",upload.single('file'),async(req,res)=>{
    try{

        const namespace = req.body.namespace ?? 'Default';

        if(!req.file){
            return res.status(400).json({
                ok:false,
                message:'No file uploaded'
            })
        }

        const {path, mimetype, originalname} = req.file;

        const rawDocs = await loadFileAsDocuments(
            {filePath:path,mimeType:mimetype,originalName:originalname}
        ); //1

        if( !rawDocs ||  !rawDocs.length){
            return res.status(400).json({
                ok:false,
                message:'File not loaded'
            })
        }

        const chunks = await splitDocumentsIntoChunks(rawDocs); //2

        if(!chunks || !chunks.length){
            return res.status(400).json({
                ok:false,
                message:'File uploaded but no chunks created'
            })
        }

        const summary = await ingestDocuments(namespace,chunks); //3

        return res.status(200).json({
            ok : summary.ok,
            namespace : summary.namespace,
            totalChunks : summary.totalChunks,
            sources : summary.sources
        });

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error:'error',
            messsage:'something went wrong while uploading file',
            err:err as any
        })
    }
})