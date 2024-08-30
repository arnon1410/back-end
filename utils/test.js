function fnSetHeader(){
    var strHTML = ''
    strHTML += "<th class='text-center textHeadTable'>ภารกิจตามกฎหมายที่จัดตั้งหน่วยงานของรัฐหรือภารกิจตามแผนการหรือภารกิจอื่น ๆ ที่สำคัญของหน่วยงานของรัฐ/วัตถุประสงค์</th>"
    strHTML += "<th class='text-center textHeadTable'>ความเสี่ยงที่ยังมีอยู่</th>"
    strHTML += "<th class='text-center textHeadTable'>การปรับปรุงการควบคุมภายใน</th>"
    strHTML += "<th class='text-center textHeadTable'>หน่วยงานที่รับผิดชอบ</th>"
    strHTML += "<th class='text-center textHeadTable'>สถานการณ์ดำเนินการ % ความคืบหน้า</th>"
    strHTML += "<th class='text-center textHeadTable'>ปัญหาอุปสรรคและแนวทางแก้ไข</th>"
    return strHTML
}

async function fnDrawTableForm(access) {
    if (access == 'admin') {
        // fnGetDataSelect()
    }
     // Get data selete before create table 
    var strHTML = ''
    var strYear = ''
    var strUserId = fnGetCookie("userId")
    var currentYear = new Date().getFullYear();
    var laterYear = new Date().getFullYear() - 1;
    strYear = currentYear + 543; // หลังจากกรอกข้่อมูลปีที่แล้วเสร็จเปลี่ยนเป็น laterYear

    var dataHighRiskSQL = await fnGetDataResultHighRisk(strUserId, strYear)
    var dataConPKF5SQL = await fnGetDataResultConPKF5(strUserId)
    // ตรวจสอบว่า dataSummary มีข้อมูลและไม่เป็น undefined หรือ null
    var idConPKF5 = (dataConPKF5SQL && dataConPKF5SQL.length > 0) ? dataConPKF5SQL[0].id : '';
    var prefixAsessor = (dataConPKF5SQL && dataConPKF5SQL.length > 0) ? dataConPKF5SQL[0].prefixAsessor : '';
    var signPath = (dataConPKF5SQL && dataConPKF5SQL.length > 0) ? dataConPKF5SQL[0].signPath : '';
    var position = (dataConPKF5SQL && dataConPKF5SQL.length > 0) ? dataConPKF5SQL[0].position : '';
    var dateAsessor = (dataConPKF5SQL && dataConPKF5SQL.length > 0) ? dataConPKF5SQL[0].dateAsessor : '';
    var shortName = (dataConPKF5SQL && dataConPKF5SQL.length > 0) ? dataConPKF5SQL[0].shortName : '';
    
    var strCurrentYear = ''
    var strLasterYear = ''
    if (dateAsessor) {
        var dateSplit = dateAsessor.split('-');
        strCurrentYear = parseInt(dateSplit[0]) + 543
        strLasterYear = (parseInt(dateSplit[0]) - 1) + 543
    } else {
        strCurrentYear = currentYear + 543
        strLasterYear = laterYear + 543
    }

    var DateFix = 'ณ วันที่ ๑ เดือน ตุลาคม ' + fnConvertToThaiNumeralsAndPoint(strLasterYear) + ' ถึง วันที่ ๓๐ เดือน กันยายน ' + fnConvertToThaiNumeralsAndPoint(strCurrentYear)
    strHTML += " <div class='text-end'>แบบติดตาม ปค.๕</div> "
    strHTML += " <div class='title'><input type='hidden' id='inputIdConPKF5' name='inputIdConPKF5' value='" + idConPKF5 + "'></div> "
    strHTML += " <div class='title'><span class='unit-label'>หน่วยงาน</span><span id='spanNameUnit' style='width: 232px;' class='underline-dotted'>" + shortName + "</span> </div>"
    strHTML += " <div class='title'>รายงานการติดตามการประเมินการควบคุมภายใน</div> "
    strHTML += " <div class='title'>" + DateFix + "</div> "
    strHTML += " <div class='a4-size'> "
    strHTML += "<table id='tb_PKF5'>"
    strHTML += "<thead>"
    strHTML += "<tr class='colspan-header'>"
    strHTML += fnSetHeader() 
    strHTML += "</tr>"
    strHTML += "</thead>"
    strHTML += "<tbody>"

    if (dataHighRiskSQL.length > 0) {
        strHTML += await fnDrawTablePerformance(dataHighRiskSQL)
    }  else { // ไม่มีข้อมูล
        strHTML += "<tr>";
        strHTML += `<td colspan='6' class='text-center align-top' style='width: 100%;'>`;
        strHTML += ` <span id='spanNotHaveData'>ไม่มีข้อมูลแบบติดตามปค. ๕</span> `;
        strHTML += "<tr>";
    }
   
    strHTML += "</tbody>"
    strHTML += "</table>"

    strHTML += await fnDrawCommentDivEvaluation(prefixAsessor,signPath,position,dateAsessor,strUserId)

    strHTML += " </div> "

    strHTML += " <div class='dvFooterForm'> "
    strHTML += "    <button type='button' class='btn btn-success' id='btnSaveData'>บันทึกฉบับร่าง</button>"
    // strHTML += "    <button type='button' class='btn btn-success' id='btnExportPDF' onclick='fnExportDocument()'>Export PDF</button>"
    strHTML += " </div> "

    $("#dvFormAssessment")[0].innerHTML = strHTML

    fnAddSaveButtonEventListener(dataHighRiskSQL, strUserId)
}


async function fnDrawTablePerformance(data) {
    var strHTML = '';
    var tab = '&emsp;&emsp;&emsp;&emsp;';
    const sides = [
        'ด้านการกำลังพล', 'ด้านยุทธการ', 'ด้านการข่าว', 
        'ด้านการส่งกำลังบำรุง', 'ด้านการสื่อสาร', 
        'ด้านระบบเทคโนโลยีสารสนเทศในการบริหารจัดการ', 
        'ด้านกิจการพลเรือน', 'ด้านการงบประมาณ', 
        'ด้านการเงินและการบัญชี', 'ด้านพัสดุและทรัพย์สิน'
    ];

    sides.forEach((side, index) => {
        const idSides = (index + 2).toString(); // + 2 เพราะใน SQL เริ่มต้นด้วย 2
        const foundRisks = data.filter(risk => risk.idSides == idSides);

        if (foundRisks.length > 0) {
            let headRisksContent = [];
            let strObjRisk = foundRisks[0].objRisk;

            foundRisks.forEach(risk => {
                if (!headRisksContent.includes(risk.headRisk)) {
                    headRisksContent.push(risk.headRisk);
                }
            });

            const headRisks = headRisksContent.join('<br>- ');

            // First row with rowspan for the first column
            strHTML += "<tr>";
            strHTML += `<td rowspan='${foundRisks.length}' id='headRisk${foundRisks[0].id}' class='text-left align-top' style='width: 25%;'>`;
            strHTML += " <div> ";
            strHTML += ` <span id='spanHeadRisk${foundRisks[0].id}' style='font-weight: bold;'>${fnConvertToThaiNumeralsAndPoint(idSides - 1)}. ${side}</span> `;
            strHTML += " </div> ";
            strHTML += " <div> ";
            strHTML += ` <span id='spanHeadRisk${foundRisks[0].id}' style='font-weight: bold;'>${tab}วัตถุประสงค์</span> `;
            strHTML += " </div> ";
            strHTML += " <div> ";
            strHTML += ` <span id='spanHeadRisk${foundRisks[0].id}' class='text-left align-top'>${tab}${strObjRisk}</span> `;
            strHTML += " </div> ";
            strHTML += " <div> ";
            strHTML += ` <span id='spanHeadRisk${foundRisks[0].id}' style='font-weight: bold;'>${tab}กิจกรรม</span> `;
            strHTML += " </div> ";
            strHTML += " <div> ";
            strHTML += " <div style='text-indent: 17px;'> ";
            strHTML += ` <span id='spanHeadRisk${foundRisks[0].id}'>- ${headRisks}</span> `;
            strHTML += " </div> ";
            strHTML += "</td>";

            strHTML += "<td class='text-left align-top' style='width: 12%;'>";
            strHTML += " <div style='text-indent: 17px;'> ";
            strHTML += ` <span id='spanRisking${foundRisks[0].id}'>${foundRisks[0].risking ? foundRisks[0].risking : '-'}</span> `;
            strHTML += " </div> ";
            strHTML += "</td>";

            // if (foundRisks[0].improvementControl) {
            //     strHTML += "<td class='text-left align-top' style='width: 12%;'>";
            //     strHTML += " <div style='text-indent: 17px;'> ";
            //     strHTML += ` <span id='displayTextImprovementControl${foundRisks[0].id}'>${foundRisks[0].improvementControl}</span> `;
            //     strHTML += " </div> ";
            //     strHTML += "</td>";
            // } else {
            //     strHTML += "<td id='ImprovementControl" + foundRisks[0].id + "' class='text-left align-top' style='width: 12%;'>";
            //     strHTML += "<div style='text-align: center;'>";
            //     strHTML += "    <textarea id='textImprovementControl" + foundRisks[0].id + "' name='textImprovementControl" + foundRisks[0].id + "' rows='6' cols='10' style='width: 100%;'></textarea> ";
            //     strHTML += "</div> ";
            //     strHTML += "<div class='text-end'>";
            //     strHTML += "    <button class='btn btn-secondary' type='submit' id='submitImprovementControl" + foundRisks[0].id + "' onclick='fnSubmitText(\"" + foundRisks[0].id + "\", \"improvementControl\")'>ยืนยัน</button>";
            //     strHTML += "</div>";
            //     strHTML += "<div class='text-start' style='text-indent: 17px;'>";
            //     strHTML += "    <span id='displayTextImprovementControl" + foundRisks[0].id + "' style='white-space: pre-wrap;'></span>";
            //     strHTML += "    <i class='las la-pencil-alt' id='editIconImprovementControl" + foundRisks[0].id + "' style='display:none; cursor:pointer; margin-left: 10px;' onclick='fnEditText(\"" + foundRisks[0].id + "\", \"improvementControl\")'></i> ";
            //     strHTML += "</div>";
            //     strHTML += "</td>";
            // }

            strHTML += "<td class='text-left align-top' style='width: 12%;'>";
            strHTML += " <div style='text-indent: 17px;'> ";
            strHTML += ` <span id='displayTextImprovementControl${foundRisks[0].id}'>${foundRisks[0].improvementControl ? foundRisks[0].improvementControl : '-'}</span> `;
            strHTML += " </div> ";
            strHTML += "</td>";

            strHTML += "<td class='text-left align-top' style='width: 12%;'>";
            strHTML += " <div style='text-indent: 17px;'> ";
            strHTML += ` <span id='displayTextimprovementControl${foundRisks[0].id}'>${foundRisks[0].responsibleAgency ? foundRisks[0].responsibleAgency : '-'}</span> `;
            strHTML += " </div> ";
            strHTML += "</td>";

            if (foundRisks[0].progressControl) {
                strHTML += "<td class='text-left align-top' style='width: 12%;'>";
                strHTML += " <div style='text-indent: 17px;'> ";
                strHTML += ` <span id='displayTextProgressControl${foundRisks[0].id}'>${foundRisks[0].progressControl}</span> `;
                strHTML += " </div> ";
                strHTML += "</td>";
            } else {
                strHTML += "<td id='progressControl" + foundRisks[0].id + "' class='text-left align-top' style='width: 12%;'>";
                strHTML += "<div style='text-align: center;'>";
                strHTML += "    <textarea id='textProgressControl" + foundRisks[0].id + "' name='textProgressControl" + foundRisks[0].id + "' rows='6' cols='10' style='width: 100%;'></textarea> ";
                strHTML += "</div> ";
                strHTML += "<div class='text-end'>";
                strHTML += "    <button class='btn btn-secondary' type='submit' id='submitProgressControl" + foundRisks[0].id + "' onclick='fnSubmitText(\"" + foundRisks[0].id + "\", \"progressControl\")'>ยืนยัน</button>";
                strHTML += "</div>";
                strHTML += "<div style='text-indent: 17px;'>";
                strHTML += "    <span id='displayTextProgressControl" + foundRisks[0].id + "' style='white-space: pre-wrap;'></span>";
                strHTML += "    <i class='las la-pencil-alt' id='editIconProgressControl" + foundRisks[0].id + "' style='display:none; cursor:pointer; margin-left: 10px;' onclick='fnEditText(\"" + foundRisks[0].id + "\", \"ProgressControl\")'></i> ";
                strHTML += "</div>";
                strHTML += "</td>";
            }

            if (foundRisks[0].solutionsControl) {
                strHTML += "<td class='text-left align-top' style='width: 12%;'>";
                strHTML += " <div style='text-indent: 17px;'> ";
                strHTML += ` <span id='displaySolutionsControl${foundRisks[0].id}'>${foundRisks[0].solutionsControl}</span> `;
                strHTML += " </div> ";
                strHTML += "</td>";
            } else {
                strHTML += "<td id='solutionsControl" + foundRisks[0].id + "' class='text-left align-top' style='width: 12%;'>";
                strHTML += "<div style='text-align: center;'>";
                strHTML += "    <textarea id='textSolutionsControl" + foundRisks[0].id + "' name='textSolutionsControl" + foundRisks[0].id + "' rows='6' cols='10' style='width: 100%;'></textarea> ";
                strHTML += "</div> ";
                strHTML += "<div class='text-end'>";
                strHTML += "    <button class='btn btn-secondary' type='submit' id='submitSolutionsControl" + foundRisks[0].id + "' onclick='fnSubmitText(\"" + foundRisks[0].id + "\", \"solutionsControl\")'>ยืนยัน</button>";
                strHTML += "</div>";
                strHTML += "<div style='text-indent: 17px;'>";
                strHTML += "    <span id='displayTextSolutionsControl" + foundRisks[0].id + "' style='white-space: pre-wrap;'></span>";
                strHTML += "    <i class='las la-pencil-alt' id='editIconSolutionsControl" + foundRisks[0].id + "' style='display:none; cursor:pointer; margin-left: 10px;' onclick='fnEditText(\"" + foundRisks[0].id + "\", \"SolutionsControl\")'></i> ";
                strHTML += "</div>";
                strHTML += "</td>";
            }

            strHTML += "</tr>";


            // Subsequent rows for the remaining risks
            for (let i = 1; i < foundRisks.length; i++) {
                strHTML += "<tr>";

                strHTML += "<td class='text-left align-top' style='width: 12%;'>";
                strHTML += " <div style='text-indent: 17px;'> ";
                strHTML += ` <span id='displayTextRisking${foundRisks[i].id}'>${foundRisks[i].risking ? foundRisks[i].risking : ''}</span> `;
                strHTML += " </div> ";
                strHTML += "</td>";

                strHTML += "<td class='text-left align-top' style='width: 12%;'>";
                strHTML += " <div style='text-indent: 17px;'> ";
                strHTML += ` <span id='displayTextExistingControl${foundRisks[i].id}'>${foundRisks[i].existingControl ? foundRisks[i].existingControl : '-'}</span> `;
                strHTML += " </div> ";
                strHTML += "</td>";

                strHTML += "<td class='text-left align-top' style='width: 12%;'>";
                strHTML += " <div style='text-indent: 17px;'> ";
                strHTML += ` <span id='displayTextResponsibleAgency${foundRisks[i].id}'>${foundRisks[i].responsibleAgency ? foundRisks[i].responsibleAgency : '-'}</span> `;
                strHTML += " </div> ";
                strHTML += "</td>";

                if (foundRisks[i].progressControl) {
                    strHTML += "<td class='text-left align-top' style='width: 12%;'>";
                    strHTML += " <div style='text-indent: 17px;'> ";
                    strHTML += ` <span id='displayTextProgressControl${foundRisks[i].id}'>${foundRisks[i].progressControl}</span> `;
                    strHTML += " </div> ";
                    strHTML += "</td>";
                } else {
                    strHTML += "<td id='progressControl" + foundRisks[i].id + "' class='text-left align-top' style='width: 12%;'>";
                    strHTML += "<div style='text-align: center;'>";
                    strHTML += "    <textarea id='textProgressControl" + foundRisks[i].id + "' name='textProgressControl" + foundRisks[i].id + "' rows='6' cols='10' style='width: 100%;'></textarea> ";
                    strHTML += "</div> ";
                    strHTML += "<div class='text-end'>";
                    strHTML += "    <button class='btn btn-secondary' type='submit' id='submitProgressControl" + foundRisks[i].id + "' onclick='fnSubmitText(\"" + foundRisks[i].id + "\", \"progressControl\")'>ยืนยัน</button>";
                    strHTML += "</div>";
                    strHTML += "<div style='text-indent: 17px;'>";
                    strHTML += "    <span id='displayTextProgressControl" + foundRisks[i].id + "' style='white-space: pre-wrap;'></span>";
                    strHTML += "    <i class='las la-pencil-alt' id='editIconProgressControl" + foundRisks[i].id + "' style='display:none; cursor:pointer; margin-left: 10px;' onclick='fnEditText(\"" + foundRisks[i].id + "\", \"progressControl\")'></i> ";
                    strHTML += "</div>";
                    strHTML += "</td>";
                }

                if (foundRisks[i].solutionsControl) {
                    strHTML += "<td class='text-left align-top' style='width: 12%;'>";
                    strHTML += " <div style='text-indent: 17px;'> ";
                    strHTML += ` <span id='displayTextSolutionsControl${foundRisks[i].id}'>${foundRisks[i].SolutionsControl}</span> `;
                    strHTML += " </div> ";
                    strHTML += "</td>";
                } else {
                    strHTML += "<td id='solutionsControl" + foundRisks[i].id + "' class='text-left align-top' style='width: 12%;'>";
                    strHTML += "<div style='text-align: center;'>";
                    strHTML += "    <textarea id='textSolutionsControl" + foundRisks[i].id + "' name='textSolutionsControl" + foundRisks[i].id + "' rows='6' cols='10' style='width: 100%;'></textarea> ";
                    strHTML += "</div> ";
                    strHTML += "<div class='text-end'>";
                    strHTML += "    <button class='btn btn-secondary' type='submit' id='submitSolutionsControl" + foundRisks[i].id + "' onclick='fnSubmitText(\"" + foundRisks[i].id + "\", \"solutionsControl\")'>ยืนยัน</button>";
                    strHTML += "</div>";
                    strHTML += "<div style='text-indent: 17px;'>";
                    strHTML += "    <span id='displayTextSolutionsControl" + foundRisks[i].id + "' style='white-space: pre-wrap;'></span>";
                    strHTML += "    <i class='las la-pencil-alt' id='editIconSolutionsControl" + foundRisks[i].id + "' style='display:none; cursor:pointer; margin-left: 10px;' onclick='fnEditText(\"" + foundRisks[i].id + "\", \"solutionsControl\")'></i> ";
                    strHTML += "</div>";
                    strHTML += "</td>";
                }

                strHTML += "</tr>";
            }
        }
    });

    return strHTML;
}

async function fnDrawCommentDivEvaluation(prefixAsessor,signPath,position,dateAsessor,strUserId) {
    var strHTML = ''
    var strUpload = 'Upload'
    var strEpen = 'Epen'
    strHTML += " <div class='form-group'> ";
    strHTML += "     <input type='hidden' id='inputIdUsers' class='form-control' value='" + strUserId + "' > "; // เก็บ IdUser
    strHTML += " </div> ";

    strHTML += " <div id='dvSignature' class='dvSignature' style='position: relative; text-align: center;'> "
    if (prefixAsessor && signPath) { //prefixAsessor && signPath
        strHTML += " <div class='title'><input type='hidden' id='inputPrefixAsessor' name='inputPrefixAsessor' value='" + prefixAsessor + "'></div> "
        strHTML += `<div>ลายมือชื่อ : <span style="width: 193px;" class="underline-dotted">${prefixAsessor} <img src="${signPath}" alt="ลายเซ็น" /></span></div>`
    } else if (prefixAsessor && !signPath) { //prefixAsessor && !signPath
        strHTML += " <div class='title'><input type='hidden' id='inputPrefixAsessor' name='inputPrefixAsessor' value='" + prefixAsessor + "'></div> "
        strHTML += " <div id='dvSignature' class='dvSignature' style='position: relative; text-align: center;'> ";
        strHTML += " <div style='position: relative; display: inline-block;'> ";
            strHTML += " <div style='position: absolute; left: 120px; transform: translate(30%, -35%);'> ";
                strHTML += " <button type='button' id='btnSignatureUpload' class='btn btn-sm btn-primary' onclick='fnDrawSignatureSection(\"" + signPath + "\", \"" + strUserId + "\", \"" + strUpload + "\")' data-bs-toggle='modal' data-bs-target='#signatureModal'>Upload</button> ";
            strHTML += " </div> ";
            strHTML += " <div style='position: absolute; right: 40px; transform: translate(50%, -35%);> ";
                strHTML += " <button type='button' id='btnSignatureEPen' class='btn btn-sm btn-danger' onclick='fnDrawSignatureSection(\"" + signPath + "\", \"" + strUserId + "\", \"" + strEpen + "\")' data-bs-toggle='modal' data-bs-target='#signatureModal'>E-pen</button> ";
            strHTML += " </div> ";
            strHTML += `<div>ลายมือชื่อ : <span style="width: 193px;text-align:left" class="underline-dotted">${prefixAsessor}</span></div>`
        strHTML += " </div> ";
    strHTML += " </div> ";
    } else {
        strHTML += " <div id='dvSignature' class='dvSignature' style='position: relative;'> ";
        strHTML += " <div style='position: relative; display: inline-block;'> ";
            strHTML += " <div style='position: absolute; left: 120px; transform: translate(-20%, -35%);'> ";
                strHTML += " <button type='button' id='btnSignatureUpload' class='btn btn-sm btn-primary' onclick='fnDrawSignatureSection(\"" + signPath + "\", \"" + strUserId + "\", \"" + strUpload + "\")' data-bs-toggle='modal' data-bs-target='#signatureModal'>Upload</button> ";
            strHTML += " </div> ";
            strHTML += " <div style='position: absolute; right: 40px; transform: translate(0%, -35%);> ";
                strHTML += " <button type='button' id='btnSignatureEPen' class='btn btn-sm btn-danger' onclick='fnDrawSignatureSection(\"" + signPath + "\", \"" + strUserId + "\", \"" + strEpen + "\")' data-bs-toggle='modal' data-bs-target='#signatureModal'>E-pen</button> ";
            strHTML += " </div> ";
            // strHTML += " <div style='line-height: 1.5;'>ลายมือชื่อ .................................................</div> ";
            strHTML += ` <div>ลายมือชื่อ <span style="width: 197px;text-align: left;" class="underline-dotted">:</span></div> `
        strHTML += " </div> ";
    strHTML += " </div> ";
    }
    strHTML += " </div> "

    strHTML += " <div id='dvAssessor' class='dvAssessor' style='position: relative; text-align: center;'> ";
    if (position) {
        strHTML += `<div><div>ตำแหน่ง: <span style="width: 205px;" class="underline-dotted">${position}</span></div>`
    } else {
        strHTML += ` <div>ตำแหน่ง <span style="width: 211px;text-align: left;" class="underline-dotted">:</span></div> `
    }

    if (dateAsessor) {
        strHTML += `<div>วันที่: <span style="width: 232px;" class="underline-dotted">${fnFormatDateToThai(dateAsessor)}</span></div>`
    } else {
        strHTML += `<div>วันที่ <span style="width: 237px;text-align: left;" class="underline-dotted">:</span></div>`
    }
    strHTML += " </div> "
    strHTML += " <div id='dv-btn-Signature' class='dv-btn-Signature' > "
    strHTML += "    <button id='btnEditSignature' type='button' class='btn btn-warning btn-sm' onclick='fnDrawModalAssessor(\"" + prefixAsessor + "\", \"" + signPath + "\", \"" + position + "\", \"" + dateAsessor + "\", \"" + strUserId + "\")' data-bs-toggle='modal' data-bs-target='#assessorModal'> "
    strHTML += "    <i class='las la-pen mr-1' aria-hidden=;'true' style='margin-right:5px'></i><span>กรอกข้อมูลผู้ประเมิน<span> "
    strHTML += "    </button> "
    strHTML += " </div> "
    return strHTML
}

async function fnGetDataResultHighRisk(userId, strYear) {
    var dataSend = {
        userId: userId,
        strYear: strYear
    }

    try {
        const response = await axios.post('http://localhost:3000/api/documents/fnGetResultHighRisk', dataSend)
        var res = response.data
        if (res.length > 0) {
            return res
        } else {
            return []
        }
    } catch (error) {
        await Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'userId หรือ sideId ไม่ถูกต้อง',
            icon: 'error'
        })
        return []
    }
}

async function fnGetDataResultConPKF5(userId) {
    var dataSend = {
        userId: userId
    }

    try {
        const response = await axios.post('http://localhost:3000/api/documents/fnGetResultConPKF5', dataSend)
        var res = response.data
        if (res.length > 0) {
            return res
        } else {
            return []
        }
    } catch (error) {
        await Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'userId หรือ sideId ไม่ถูกต้อง',
            icon: 'error'
        })
        return []
    }
}

/* ฟังก์ชันสำหรับการยืนยันข้อความ */
function fnSubmitText(index, sides) {
    var textarea = ''
    var button = ''
    var displayText = ''
    var editIcon = ''
    var tab = ''
    var format = ''

    // if (sides == 'ImprovementControl') {
    //     textarea = document.getElementById('textImprovementControl' + index);
    //     button = document.getElementById('submitImprovementControl' + index);
    //     displayText = document.getElementById('displayTextImprovementControl' + index);
    //     editIcon = document.getElementById('editIconImprovementControl'+ index);
    // } else if (sides == 'responsibleAgency') {
    //     textarea = document.getElementById('textResponsibleAgency' + index);
    //     button = document.getElementById('submitResponsibleAgency' + index);
    //     displayText = document.getElementById('displayTextResponsibleAgency' + index)
    //     editIcon = document.getElementById('editIconResponsibleAgency'+ index);
    // }
    if (sides == 'progressControl') {
        textarea = document.getElementById('textProgressControl' + index);
        button = document.getElementById('submitProgressControl' + index);
        displayText = document.getElementById('displayTextProgressControl' + index); 
        editIcon = document.getElementById('editIconProgressControl'+ index); 
    } else {
        textarea = document.getElementById('textSolutionsControl' + index);
        button = document.getElementById('submitSolutionsControl' + index);
        displayText = document.getElementById('displayTextSolutionsControl' + index); 
        editIcon = document.getElementById('editIconSolutionsControl'+ index);   
    }

    if (textarea.value) {
        format = textarea.value.replace(/\n/g, '<br>');
        displayText.innerHTML = tab + format

        /* ซ่อน textarea และปุ่ม */
        textarea.style.display = 'none';
        button.style.display = 'none';  
        editIcon.style.display = 'inline';
    } else {
        Swal.fire({
            title: "",
            text: "กรุณากรอกข้อมูลให้ครบถ้วน",
            icon: "warning"
        });
    }
}

/* ฟังก์ชันสำหรับการแก้ไขข้อความ */
function fnEditText(index, sides) {
    var textarea = ''
    var button = ''
    var editIcon = ''
    var displayText = ''

    // if (sides == 'improvementControl') {
    //     textarea = document.getElementById('textImprovementControl' + index);
    //     button = document.getElementById('submitImprovementControl' + index);
    //     displayText = document.getElementById('displayTextImprovementControl' + index);
    //     editIcon = document.getElementById('editIconImprovementControl'+ index);
    // } else if (sides == 'responsibleAgency') {
    //     textarea = document.getElementById('textResponsibleAgency' + index);
    //     button = document.getElementById('submitResponsibleAgency' + index);
    //     displayText = document.getElementById('displayTextResponsibleAgency' + index)
    //     editIcon = document.getElementById('editIconResponsibleAgency'+ index);
    // }
    if (sides == 'progressControl') {
        textarea = document.getElementById('textProgressControl' + index);
        button = document.getElementById('submitProgressControl' + index);
        displayText = document.getElementById('displayTextProgressControl' + index); 
        editIcon = document.getElementById('editIconProgressControl'+ index); 
    } else {
        textarea = document.getElementById('textSolutionsControl' + index);
        button = document.getElementById('submitSolutionsControl' + index);
        displayText = document.getElementById('displayTextSolutionsControl' + index); 
        editIcon = document.getElementById('editIconSolutionsControl'+ index);   
    }
    /* แสดง textarea และปุ่ม */
    textarea.style.display = 'inline';
    button.style.display = 'inline';

    /* ซ่อนไอคอนแก้ไข */
    editIcon.style.display = 'none';

    /* เติมข้อความที่จะแก้ไขใน textarea */
    textarea.value = displayText.innerText.trim();
}

function fnSaveDraftDocument(data , strUserId,  event)  {
    event.preventDefault(); // ป้องกันการส่งฟอร์ม
    var dataSend = []
    var strDisplayTextPC = ''
    var strDisplayTextSC = ''
    var progressControl = ''
    var solutionsControl = ''
    var strUserName = fnGetCookie("username");

    // Loop ผ่าน data เพื่อเปรียบเทียบและ push ข้อมูลลงใน dataSend
    data.forEach(formItem => {
        strDisplayTextPC = $('#displayTextProgressControl' + formItem.id).text();
        strDisplayTextSC = $('#displayTextSolutionsControl' + formItem.id).text();

        progressControl = formItem.progressControl === null ? '' : formItem.progressControl;
        solutionsControl = formItem.solutionsControl === null ? '' : formItem.solutionsControl;
        
        if ((progressControl !== strDisplayTextPC ) || (solutionsControl !== strDisplayTextSC)) { // หาข้อมูลที่มีการแก้ไข
            dataSend.push({
                idPKF5: formItem.id,
                userId: strUserId,  // หรือใช้ strUserId ถ้ามีการประกาศ
                username: strUserName,
                progressControl: strDisplayTextPC,
                solutionsControl: strDisplayTextSC
            });
        }
    });
    if (dataSend && dataSend.length > 0) {
        if (!dataSend[0].progressControl) {
            Swal.fire({
                title: "",
                text: "กรุณากรอกการประเมินผลการควบคุมภายใน",
                icon: "warning"
            });
            return; // ออกจากฟังก์ชันทันทีถ้าค่าทั้งหมดว่าง
        }

        if (!dataSend[0].solutionsControl) {
            Swal.fire({
                title: "",
                text: "กรุณากรอกความเสี่ยงที่ยังมีอยู่",
                icon: "warning"
            });
            return; // ออกจากฟังก์ชันทันทีถ้าค่าทั้งหมดว่าง
        }

        Swal.fire({
            title: "",
            text: "คุณต้องการบันทึกข้อมูลแบบประเมินใช่หรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "บันทึกข้อมูล",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const results = await fnSetDataFormPKF5(dataSend)
                    if (results && results == 'success' ) {
                        Swal.fire({
                            title: "",
                            text: "บันทึกข้อมูลสำเร็จ",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "",
                            text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                            icon: "error"
                        });
                    }    
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }
}

function fnAddSaveButtonEventListener(data, strUserId) {
    const saveButton = document.getElementById('btnSaveData');
    if (saveButton) {
        saveButton.addEventListener('click', function(event) {
            event.preventDefault();
            // โค้ดสำหรับการบันทึกข้อมูล
            fnSaveDraftDocument(data, strUserId, event);
        });
    } else {
        console.error('Element with id btnSaveData not found.');
    }
}

/* start ส่วนของลายเซ็นฯ */

function fnDrawSignatureSection(strSignPath, strUserId, type) {
    var strHTML = '';
    var strHTML2 = '';

    if (type == 'Upload') {

        strHTML += " <div class='form-group'> ";
        strHTML += " <label for='signatureUpload'>อัปโหลดลายมือชื่อ</label> ";
        strHTML += " <div class='input-group'> "
        strHTML += " <input type='file' id='signatureUpload' class='form-control' accept='.png' aria-describedby='inputSignatureUpload' aria-label='Upload'> ";
        strHTML += " <button class='btn btn-outline-secondary' type='button' id='inputSignatureUpload'>.png</button>"
        strHTML += " </div> ";
        strHTML += " <div id='signatureUploadError' class='error'>กรุณาเลือกไฟล์</div> ";
        strHTML += " </div> ";

        // เพิ่ม canvas สำหรับแสดงลายมือชื่อที่อัปโหลด
        strHTML += " <div class='form-group'> ";
        strHTML += " <canvas id='signatureCanvas' width='460' height='200'></canvas> ";
        strHTML += " </div> ";
    
        strHTML2 += " <button type='button' id='submitUploadSignatureButton' class='btn btn-primary'>บันทึกข้อมูล</button> ";
        strHTML2 += " <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>ยกเลิก</button> ";
        
        $("#dvBodySignatureModal").html(strHTML);
        $("#dvFooterSignatureModal").html(strHTML2);

        $('#signatureUpload').on('change', fnUploadSignature);
        $('#submitUploadSignatureButton').on('click', function() {
            if (fnValidateFormSignature()) {
                fnSubmitSignature();
            }
        });   

    } else {
        strHTML += " <div class='form-group'> ";
        strHTML += "     <label for='evaluator'>ลายมือชื่อ (เซ็นชื่อ)</label> ";
        strHTML += "     <div class='canvas-container'> ";
        strHTML += "         <canvas id='signatureCanvas' width='460' height='200'></canvas> ";
        strHTML += "         <button class='clear-button' id='clearButton'>Clear</button> ";
        strHTML += "     </div> ";
        strHTML += "     <div id='evaluatorError' class='error'>กรุณาเซ็นชื่อ</div> ";
        strHTML += " </div> ";

        strHTML2 += " <button type='button' id='submitEpenSignatureButton' class='btn btn-primary'>บันทึกข้อมูล</button> ";
        strHTML2 += " <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>ยกเลิก</button> ";

        $("#dvBodySignatureModal").html(strHTML);
        $("#dvFooterSignatureModal").html(strHTML2);
        
        fnInitializeCanvas(strSignPath);

        $('#submitEpenSignatureButton').on('click', function() {
            if (fnValidateFormSignature()) {
                fnSubmitSignature();
            }
        })
    }

}

function fnDrawModalAssessor(strPrefixAsessor, strSignPath, strPosition, strDateAsessor, strUserId) {
    var strHTML = '';
    var strHTML2 = '';
    var strFormatDate = '';
    var strDay = '';
    var strMonth = '';
    var strYear = '';
    
    if (strDateAsessor) {
        strFormatDate = strDateAsessor.split('-');
        strYear = strFormatDate[0];
        strMonth = fnConvertThaiMonthName(strFormatDate[1]);
        strDay = strFormatDate[2];
    }

    // draw modal without signature section
    
    strHTML += " <div class='form-group'> ";
    strHTML += " <label for='prefixAsessor'>คำนำหน้าชื่อ (ยศ)</label> ";
    strHTML += " <input type='text' id='prefixAsessor' class='form-control' placeholder='กรอกชื่อคำนำหน้าชื่อ' value='" + strPrefixAsessor + "' > ";
    strHTML += " <div id='prefixAsessorError' class='error'>กรุณาใส่ชื่อคำนำหน้าชื่อ</div> ";
    strHTML += " </div> ";
    strHTML += " <div class='form-group'> ";
    strHTML += " <label for='position'>ตำแหน่ง</label> ";
    strHTML += " <input type='text' id='position' class='form-control' placeholder='กรอกตำแหน่ง' value='" + strPosition + "'> ";
    strHTML += " <div id='positionError' class='error'>กรุณาใส่ตำแหน่ง</div> ";
    strHTML += " </div> ";
    strHTML += " <div class='form-group'> ";
    strHTML += " <label for='date'>วันที่</label> ";
    strHTML += " <div class='row'> ";
    strHTML += "     <div class='col-4'> ";
    strHTML += "         <input type='text' id='day' class='form-control datepicker-day' placeholder='วัน' value='" + strDay + "'> ";
    strHTML += "         <div id='dayError' class='error'>กรุณาใส่วัน</div> ";
    strHTML += "     </div> ";
    strHTML += "     <div class='col-4'> ";
    strHTML += "         <input type='text' id='month' class='form-control datepicker-month' placeholder='เดือน' value='" + strMonth + "'> ";
    strHTML += "         <div id='monthError' class='error'>กรุณาใส่เดือน</div> ";
    strHTML += "     </div> ";
    strHTML += "     <div class='col-4'> ";
    strHTML += "         <input type='text' id='year' class='form-control datepicker-year' placeholder='ปี' value='" + strYear + "'> ";
    strHTML += "         <div id='yearError' class='error'>กรุณาใส่ปี</div> ";
    strHTML += "     </div> ";
    strHTML += " </div> ";
    strHTML += " </div> ";
 
    strHTML2 += " <button type='button' id='submitAssessorButton' class='btn btn-primary'>บันทึกข้อมูล</button> ";
    strHTML2 += " <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>ยกเลิก</button> ";
       
    $("#dvBodyAssessorModal").html(strHTML);
    $("#dvFooterAssessorModal").html(strHTML2);

    // fnDrawAssessorSection(strSignPath, strUserId);  // Call the new Assessor function

    $('.datepicker-day').datepicker({
        format: 'dd',
        language: 'th',
        autoclose: true,
        todayHighlight: true,
        minViewMode: 0,
        maxViewMode: 0,
    });
    $('.datepicker-month').datepicker({
        format: 'MM',
        language: 'th',
        autoclose: true,
        todayHighlight: true,
        minViewMode: 1,
        maxViewMode: 1,
    }).on('changeDate', function(e) {
        var fullMonthName = $(this).datepicker('getFormattedDate');
        var shortMonthName = fnConvertMonthToShort(fullMonthName);
        $(this).val(shortMonthName);
    });
    $('.datepicker-year').datepicker({
        format: 'yyyy',
        language: 'th',
        autoclose: true,
        todayHighlight: true,
        minViewMode: 2,
        maxViewMode: 2,
    });

    $('#submitAssessorButton').on('click', fnSubmitAssessor);
}

function fnUploadSignature(event) {
    const file = event.target.files[0];
    const canvas = document.getElementById('signatureCanvas'); // เปลี่ยนจาก 'signatureUpload' เป็น 'signatureCanvas'

    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const ctx = canvas.getContext('2d');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // ล้างข้อมูลเดิมใน canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // วาดภาพที่อัปโหลดลงใน canvas
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function fnInitializeCanvas(initialDataUrl) {
    const canvas = $('#signatureCanvas')[0];
    const ctx = canvas.getContext('2d');
    let drawing = false;

    // ตั้งค่าเริ่มต้นของ canvas ด้วยภาพจาก data URL
    if (initialDataUrl) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = initialDataUrl;
    }

    ctx.lineWidth = 4; // เพิ่มความหนาของเส้น
    ctx.strokeStyle = "#000000"; // เปลี่ยนสีเส้นเป็นสีดำ

    $(canvas).on('mousedown', (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    $(canvas).on('mousemove', (e) => {
        if (drawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    $(canvas).on('mouseup', () => {
        drawing = false;
    });

    $(canvas).on('mouseout', () => {
        drawing = false;
    });

    $('#clearButton').on('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

function fnValidateFormSignature() {
    const fileInput = $('#signatureUpload')[0];

    let isValid = true;

    $('#signatureUploadError').hide();
    $('#evaluatorError').hide();

    if ($('#submitUploadSignatureButton').is(':visible')) {
        // Validation for file upload
        if (fileInput && fileInput.files.length === 0) {
            $('#signatureUploadError').show();
            isValid = false;
        }
    } else {
        // Validation for canvas signature
        if (!fnValidateSignatureCanvas()) {
            $('#evaluatorError').show();
            isValid = false;
        } else {
            $('#evaluatorError').hide();
        }
    }

    return isValid;
}

function fnValidateSignatureCanvas() {
    const canvas = $('#signatureCanvas')[0];
    const ctx = canvas.getContext('2d');
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return canvasData.data.some(channel => channel !== 0);
}

function fnValidateAsessorForm() {
    let isValid = true;

    // Validate evaluator text
    const prefixAsessor = $('#prefixAsessor').val();
    if (!prefixAsessor) {
        $('#prefixAsessorError').show();
        isValid = false;
    } else {
        $('#prefixAsessorError').hide();
    }

    // Validate position
    const position = $('#position').val();
    if (!position) {
        $('#positionError').show();
        isValid = false;
    } else {
        $('#positionError').hide();
    }

    // Validate date
    const day = $('#day').val();
    const month = $('#month').val();
    const year = $('#year').val();

    if (!day || !month || !year) {
        if (!day) $('#dayError').show();
        if (!month) $('#monthError').show();
        if (!year) $('#yearError').show();
        isValid = false;
    } else {
        $('#dayError').hide();
        $('#monthError').hide();
        $('#yearError').hide();
    }

    return isValid;
}

function fnSubmitSignature() {
    // Validate the form before processing
    if (fnValidateFormSignature()) {
        // Get canvas and file input elements
        const canvas = $('#signatureCanvas')[0];
        const fileInput = $('#signatureUpload')[0];

        let signPath = '';

        if (fileInput && fileInput.files && fileInput.files[0]) {
            // Handle file upload
            const reader = new FileReader();
            reader.onload = function (e) {
                signPath = e.target.result;
                fnDisplaySignature(signPath);
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else if (canvas) {
            // Handle canvas signature
            const ctx = canvas.getContext('2d');
            signPath = canvas.toDataURL();
            fnDisplaySignature(signPath);
        } else {
            // Log error if neither file nor canvas is available
            console.error('Canvas element not found and no file uploaded');
            return;
        }
    }
}

function fnDisplaySignature(signPath) {
    const strIdConPKF5 = $('#inputIdConPKF5').val();
    const strPrefixAsessor = $('#inputPrefixAsessor').val();
    const strUserId = $('#inputIdUsers').val();
    const strUserName = fnGetCookie("username");

    // Result container to display the signature
    const resultContainer = $('#dvSignature');
    
    const data =  {
        idConPKF5: strIdConPKF5,
        userId: strUserId,
        signPath: signPath,
        username: strUserName
    };

    Swal.fire({
        title: "",
        text: "คุณต้องการบันทึกข้อมูลผู้ประเมินใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "บันทึกข้อมูล",
        cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const results = await fnSetDataSignaturePKF5(data)
                if (results && results == 'success' ) {
                    let strHTML = `
                        <div>ลายมือชื่อ: <span style="width: 197px;" class="underline-dotted">${strPrefixAsessor} <img src="${signPath}" alt="ลายเซ็น" /></span></div>
                    `;
        
                    resultContainer.html(strHTML); // Use .html() to set the content
            
                    $('#signatureModal').modal('hide');
                    $('.modal-backdrop').remove();
                    $('#btnSignatureUpload').hide();
                    $('#btnSignatureEPen').hide();

                    Swal.fire({
                        title: "",
                        text: "บันทึกข้อมูลสำเร็จ",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "",
                        text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                        icon: "error"
                    });
                }


            } catch (error) {
                console.error(error);
            }
        }
    });
}

function fnSubmitAssessor() {
    if (fnValidateAsessorForm()) {
        const strIdConPKF5 = $('#inputIdConPKF5').val();
        const strUserId = $('#inputIdUsers').val();
        const strUserName = fnGetCookie("username");
        const resultContainer = $('#dvAssessor');

        const prefixAsessor = $('#prefixAsessor').val();
        const position = $('#position').val();
        const day = $('#day').val();
        const month = $('#month').val();
        const year = $('#year').val();

        const positionText = position ? position : '................................................';
        const buddhistYear = fnConvertToBuddhistYear(year);
        const shortYear = buddhistYear.toString().slice(-2);
        const dateText = `${fnConvertToThaiNumeralsAndPoint(day)} / ${fnConvertMonthToShort(month)} / ${fnConvertToThaiNumeralsAndPoint(shortYear)}`;
        const dateFormat = `${year}-${fnConvertMonthNumber(month)}-${day}`;

        const data =  {
            idConPKF5: strIdConPKF5,
            userId: strUserId,
            prefixAsessor: prefixAsessor,
            position: position,
            dateAsessor: dateFormat,
            username: strUserName
        };
        Swal.fire({
            title: "",
            text: "คุณต้องการบันทึกข้อมูลผู้ประเมินใช่หรือไม่?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "บันทึกข้อมูล",
            cancelButtonText: "ยกเลิก"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const results = await fnSetDataAssessorPKF5(data)
                    if (results && results == 'success' ) {
                        let strHTML = `
                            <div>ตำแหน่ง: <span style="width: 205px;" class="underline-dotted">${positionText}</span></div>
                            <div>วันที่: <span style="width: 232px;" class="underline-dotted">${dateText}</span></div>
                        `;
            
                        resultContainer.html(strHTML); // Use .html() to set the content
                
                        $('#assessorModal').modal('hide');
                        $('.modal-backdrop').remove();

                        Swal.fire({
                            title: "",
                            text: "บันทึกข้อมูลสำเร็จ",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "",
                            text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                            icon: "error"
                        });
                    }

    
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }
}

async function fnSetDataAssessorPKF5(dataSend) {
    try {
        const response = await axios.post('http://localhost:3000/api/documents/fnSetAssessorPKF5', dataSend)
        var res = response.data.result
        if (res.length > 0) {
            return res
        } else {
            return []
        }
    } catch (error) {
        await Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'การบันทึกข้อมูลไม่สำเร็จ กรุณาติดต่อ admin',
            icon: 'error'
        })
        return []
    }
}

async function fnSetDataSignaturePKF5(dataSend) {
    try {
        const response = await axios.post('http://localhost:3000/api/documents/fnSetSignaturePKF5', dataSend)
        var res = response.data.result
        if (res.length > 0) {
            return res
        } else {
            return []
        }
    } catch (error) {
        await Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'การบันทึกข้อมูลไม่สำเร็จ กรุณาติดต่อ admin',
            icon: 'error'
        })
        return []
    }
}
/* end ส่วนของลายเซ็นฯ */

async function fnSetDataAssessorPKF5(dataSend) {
    try {
        const response = await axios.post('http://localhost:3000/api/documents/fnSetAssessorPKF5', dataSend)
        var res = response.data.result
        if (res.length > 0) {
            return res
        } else {
            return []
        }
    } catch (error) {
        await Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'การบันทึกข้อมูลไม่สำเร็จ กรุณาติดต่อ admin',
            icon: 'error'
        })
        return []
    }
}

async function fnSetDataFormPKF5(dataSend) {
    try {
        const response = await axios.post('http://localhost:3000/api/documents/fnSetFormPKF5', dataSend)
        var res = response.data.result
        if (res.length > 0) {
            return res
        } else {
            return []
        }
    } catch (error) {
        await Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'การบันทึกข้อมูลไม่สำเร็จ กรุณาติดต่อ admin',
            icon: 'error'
        })
        return []
    }
}
