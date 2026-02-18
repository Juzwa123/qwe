// ================= HELPERS =================
function cleanTIN(tin){
    if(!tin) return "000000000";
    return tin.replace(/[^0-9]/g,"").substring(0,9).padStart(9,'0');
}

function formatDate(dateStr){
    if(!dateStr) return "01/01/2026";
    let d = new Date(dateStr);
    if(isNaN(d)) return "01/01/2026";
    let m = String(d.getMonth()+1).padStart(2,'0');
    let day = String(d.getDate()).padStart(2,'0');
    let y = d.getFullYear();
    return `${m}/${day}/${y}`;
}

// ================= RELIEF PURCHASE LINE =================
function reliefLine(r){

    let buyerTIN = cleanTIN(r.business.tin);
    let branch = "000";
    let supplierTIN = cleanTIN(r.invoice.client_tin);

    let name = (r.invoice.sold_to || "UNKNOWN")
        .replace(/[^A-Z0-9 ]/gi,"")
        .substring(0,60);

    let addr1 = (r.invoice.address1 || "ADDRESS")
        .replace(/[^A-Z0-9 ]/gi,"")
        .substring(0,60);

    let addr2 = (r.invoice.address2 || "CITY")
        .replace(/[^A-Z0-9 ]/gi,"")
        .substring(0,60);

    let total = Number(r.vat.total_sales || 0).toFixed(2);
    let net = Number(r.vat.net_vat || 0).toFixed(2);
    let vat = Number(r.vat.less_vat || 0).toFixed(2);

    let date = formatDate(r.invoice.date);

    return [
        buyerTIN,            //1
        branch,              //2
        supplierTIN,         //3
        name,                //4
        "", "", "",          //5-7
        addr1,               //8
        addr2,               //9
        total,               //10
        "0.00",              //11
        "0.00",              //12
        total,               //13
        net,                 //14
        "0.00",              //15
        "0.00",              //16
        net,                 //17
        "12.00",             //18
        vat,                 //19
        date                 //20
    ].join("|");
}

// ================= SAVE =================
function saveData(){

    let record = {
        business:{
            tin: document.getElementById("businessTIN").value
        },
        invoice:{
            sold_to: document.getElementById("soldTo").value,
            client_tin: document.getElementById("clientTIN").value,
            address1: document.getElementById("address1").value,
            address2: document.getElementById("address2").value,
            date: document.getElementById("invoiceDate").value
        },
        vat:{
            total_sales: document.getElementById("totalSales").value,
            less_vat: document.getElementById("lessVAT").value,
            net_vat: document.getElementById("netVAT").value
        }
    };

    let records = JSON.parse(localStorage.getItem("records")) || [];
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));

    alert("Saved!");
    window.location.href="records.html";
}

// ================= EXPORT =================
function exportAll(){
    let records = JSON.parse(localStorage.getItem("records")) || [];
    let lines = records.map(r => reliefLine(r)).join("\n");

    let blob = new Blob([lines], {type:"text/plain"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "RELIEF.RLF";
    a.click();

    alert("Exported! Save as ANSI before upload.");
}
