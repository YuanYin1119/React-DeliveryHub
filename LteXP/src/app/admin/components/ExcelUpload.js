import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import readXlsxFile from 'read-excel-file';


const ExcelUpload = (props) => {
    const [file_uploaded, setFileUploaded] = useState(false); 
    const [file_previewed, setFilePreviewed] = useState(false); 
    // const [is_reading, setIsReading] = useState(false);
    // const [is_processing, setIsProcessing] = useState(false);
    const [input_f, setInputF] = useState(null);

    const isValidZip =  /^[A-Za-z]\d[A-Za-z][ ]\d[A-Za-z]\d$/;
    const isValidPhone =  /^\d{10}$/;
    const isValidAddress = /P(ost|ostal)?([ \.]*(O|0)(ffice)?)?([ \.]*Box)/i;
    const numberPattern = /\d+/g;
     
    function onFilePreview(){ 
   
        props.setProceeding(true)
        props.setOrderRows([]);
        props.setSelectedRows([]);
        let rows_arr=[];
        readXlsxFile(input_f).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            // console.log(rows.length)
            if(rows) {
                rows.forEach(function(item) {
                    // let phone_num = String(item[21]).split('.')[0];
                    let phone_num = String(item[21]);
                 
                    let is_err=true;
                    if(item[21]!==null){
                        if(phone_num.trim()=='' || phone_num.trim().length==0) {
                     
                            is_err= isValidAddress.test(item[12]) || isValidAddress.test(item[13]) || 
                                   !isValidZip.test(item[18]);
                       }else{
                           is_err= isValidAddress.test(item[12]) || isValidAddress.test(item[13]) || 
                           !isValidZip.test(item[18]) || 
                           !isValidPhone.test(phone_num.match(numberPattern)?phone_num.match(numberPattern).join(""):'');
                       }
                       
                    }else{
                        is_err= isValidAddress.test(item[12]) || isValidAddress.test(item[13]) || 
                        !isValidZip.test(item[18]);
                    }
             
                    
                    const obj = Object.assign({tableData:{ checked: true }, is_selected:true, row_color:is_err?'#FFD700':'#FFFFFF'}, {})
                    
                    obj.trackingNumber = item[0];
                    obj.referenceNumber = item[1];
                    
                    obj.internal_account = item[2]; // item[2] Internal Account
                    obj.shipper = item[3];          //item[3]; shipper
                    obj.shipper_address1 = item[4]; // item[4];  //Shipper Address 1
                    obj.shipper_address2 = item[5]; // item[5];  //Shipper Address 2
                    obj.shipper_address3 = item[6]; // item[6];  //Shipper Address 3
                    obj.shipper_city = item[7];     // item[7];  //Shipper City
                    obj.shipper_county = item[8];  // item[8];  // Shipper County/State
                    obj.shipper_zip = item[9];       // item[9];  // Shipper Zip
                    obj.shipper_countrycode = item[10]; // item[10];  //Shipper Country Code

                    obj.receiverName = item[11]?item[11]:'';                           //Consignee
                    obj.address = item[12]?item[12]:'';                                //Address1
                    obj.address2 = item[13]?item[13]:'';                               //Address2
                    obj.address3 = item[14];  // item[14];  //Address3
                    obj.city = item[15]?item[15]:'';                                    //City
                    obj.province_name = item[16];  // item[16]; //Province
                    obj.province = item[17]?item[17]:'';                                //Province Code
                    obj.postCode = item[18]?item[18]:'';                                //Zip
                    obj.country_code = item[19]; // item[19];  //Country Code
                    obj.email = item[20];        // item[20];   //Email

                    // let phone_num = String(item[21]).split('.')[0];
                    obj.phoneNumber = item[21]?phone_num:'';                             //Phone
                    obj.pieces = item[22]?item[22]:'';       // item[22];  //Pieces
                    obj.weight = item[23]?item[23]:'';                                  //Total Weight
                    obj.weightUnit = item[24]?item[24]:'';                               //Weight UOM
                    obj.incoterms = item[25]?item[25]:'';                               //Incoterms

                    obj.itemDescription = item[26]?item[26]:'';                          //Item Description
                    obj.hs_code = item[27];      // item[27];  //Item HS Code
                    obj.quantity = item[28];     // item[28];   //Item Quantity
                    obj.item = item[29]?item[29]:'';                                    //Item Value
                    obj.orig_country = item[30]; // item[30];  //Country Of Origin
                    
                    rows_arr.push(obj)
                })  
            }
        
          rows_arr.shift();
        //   console.log(rows_arr)
          props.setOrderRows(rows_arr);
          props.setSelectedRows(rows_arr);
          setFilePreviewed(true) 
        }).catch(err => {
            console.log('err', err)
            setFileUploaded(false);
            alert("Something went wrong. Please check the format of the file.")
        })
        
        setTimeout(() => {  props.setProceeding(false) }, 1000);
    }
    function onFileUpload(){
        console.log('onFileUpload')

        props.handleImport();
    }

    function onFileChange(event){
        // console.log('onFileChange')
        // console.log(event.target.files[0])
        setFileUploaded(true);
        setFilePreviewed(false);
        props.setOrderRows([]);
        props.setSelectedRows([]);
        setInputF(event.target.files[0])      
    }


    return (
        <>
            <div>
                <span style={{color:"red"}}>Please upload excel file in .xlsx format</span>
            </div>
            <br />
            <div>
                {/* application/vnd.ms-excel */}
                <input type="file" id="input_f" name="input_f" onChange={(event) => onFileChange(event)} 
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>                
            </div>

            <div style={{marginTop:"20px", marginBottom:"20px"}}>
                <Button className="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary no-margin" 
                onClick={() => onFilePreview()}  disabled={!file_uploaded}>
                    Preview
                </Button>

                <Button className="MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary no-margin" 
                onClick={() => onFileUpload()} disabled={!file_uploaded || !file_previewed || !props.sel_warehouse}>
                    Import
                </Button>
            </div>

          
        </>
    );
}

export default ExcelUpload;