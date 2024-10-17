const {
    fnCheckQRFileDocPDFSQL,
    fnUpdateQRFileDocPDFSQL,
    fnSetQRFileDocPDFSQL,


} = require("../utils/sqlQuestion");

const {

    fnCheckCollationFileDocPDFSQL,
    fnUpdateCollationFileDocPDFSQL,
    fnUpdateStatusDocCollationSQL
    
} = require("../utils/sqlFunctions");

const fnGetQRFileDocPDF = async (req, res) => {
    const { idQR, username } = req.body;
    
    if (!idQR || !username) {
        return res.status(400).json({ error: "idQR or username fields cannot be empty!" });
    }

    try {
        const result = await fnCheckQRFileDocPDFSQL({ idQR });

        if (result) {
            const fileBuffer = result.fileData;
            const sanitizedFileName = result.fileName.replace(/[^\w.-]/g, '_');
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Length': fileBuffer.length,
                'Content-Disposition': `attachment; filename=${sanitizedFileName}`
            });
            res.end(fileBuffer)
            // version 1
            // const pdfBase64 = result.fileData.toString('base64');
            // res.json({
            //     image: `data:application/pdf;base64,${pdfBase64}`,
            //     fileName: result.fileName
            // });
        } else {
            res.status(404).json({ message: "ไม่พบไฟล์เอกสาร" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnDownloadFileDocPDF = async (req, res) => {
const { idQR } = req.query;

try {
    const result = await fnCheckQRFileDocPDFSQL({ idQR });
    if (result) {
    const pdfBuffer = Buffer.from(result.fileData, 'base64');

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(result.fileName)}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
    } else {
    res.status(404).json({ message: "ไม่พบไฟล์เอกสาร" });
    }
} catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
}
};

const fnSetQRFileDocPDF = async (req, res) => {  
    const { idQR, username, image, fileName } = req.body;
  
    if (!image || !fileName) {
        return res.status(400).json({ error: "image or fileName fields cannot be empty!" });
    }
    try {
    console.log("/api/store/fnSetQRFileDocPDF");
        const checkFile = await fnCheckQRFileDocPDFSQL({ idQR });
        const imageData = image.split(',')[1]; // แยกข้อมูล Base64
        if (checkFile) {
            console.log('fnUpdateQRFileDocPDFSQL')
            const resultFile = await fnUpdateQRFileDocPDFSQL({ idQR, username, image: imageData, fileName });
            if (resultFile) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            console.log('fnSetQRFileDocPDFSQL')
            const resultFile = await fnSetQRFileDocPDFSQL({ idQR, username, image: imageData, fileName });
            if (resultFile) {

                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        }
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetCollationFileDocPDF = async (req, res) => {
    const { collationId, username } = req.body;
    
    if (!collationId || !username) {
        return res.status(400).json({ error: "collationId or username fields cannot be empty!" });
    }

    try {
        const result = await fnCheckCollationFileDocPDFSQL({ collationId });
        
        if (result.fileName) {
            const pdfBase64 = result.fileData.toString('base64');
            res.json({
                image: `data:application/pdf;base64,${pdfBase64}`,
                fileName: result.fileName
            });
        } else {
            res.status(200).json({ result : [] });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetCollationFileDocPDF = async (req, res) => {  
    const { userDocId, collationId, username, image, fileName } = req.body;
  
    const data = { userDocId, username };

    if (!image || !fileName) {
        return res.status(400).json({ error: "image or fileName fields cannot be empty!" });
    }
    try {
    console.log("/api/store/fnSetCollationFileDocPDF");
        const imageData = image.split(',')[1]; // แยกข้อมูล Base64
        console.log('fnUpdateCollationFileDocPDFSQL')
        const resultFile = await fnUpdateCollationFileDocPDFSQL({ collationId, username, image: imageData, fileName });
        if (resultFile) {
            console.log('fnUpdateStatusDocCollationSQL')
            await fnUpdateStatusDocCollationSQL(data); 
            res.status(200).json({ result: 'success' });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

module.exports = {
    fnGetQRFileDocPDF,
    fnDownloadFileDocPDF,
    fnSetQRFileDocPDF,
    fnGetCollationFileDocPDF,
    fnSetCollationFileDocPDF
};