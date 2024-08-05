const {
    fnCheckFileDocPDFSQL,
    fnUpdateFileDocPDFSQL,
    fnSetFileDocPDFSQL
} = require("../utils/sqlFunctions");

const fnGetFileDocPDF = async (req, res) => {
    const { idQR, username } = req.body;
    
    if (!idQR || !username) {
        return res.status(400).json({ error: "idQR or username fields cannot be empty!" });
    }

    try {
        const result = await fnCheckFileDocPDFSQL({ idQR });

        if (result) {
            const pdfBase64 = result.fileData.toString('base64');
            res.json({
                image: `data:application/pdf;base64,${pdfBase64}`,
                fileName: result.fileName
            });
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
      const result = await fnCheckFileDocPDFSQL({ idQR });
      console.log(result.fileData)
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

const fnSetFileDocPDF = async (req, res) => {  
    const { idQR, username, image, fileName } = req.body;
  
    if (!image || !fileName) {
        return res.status(400).json({ error: "image or fileName fields cannot be empty!" });
    }
    try {
    console.log("/api/store/fnSetFileDocPDF");
        const checkFile = await fnCheckFileDocPDFSQL({ idQR });
        const imageData = image.split(',')[1]; // แยกข้อมูล Base64
        console.log(checkFile)
        if (checkFile) {
            console.log('fnUpdateFileDocPDFSQL')
            const resultFile = await fnUpdateFileDocPDFSQL({ idQR, username, image: imageData, fileName });
            if (resultFile) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            console.log('fnSetFileDocPDFSQL')
            const resultFile = await fnSetFileDocPDFSQL({ idQR, username, image: imageData, fileName });
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

module.exports = {
    fnGetFileDocPDF,
    fnDownloadFileDocPDF,
    fnSetFileDocPDF
};