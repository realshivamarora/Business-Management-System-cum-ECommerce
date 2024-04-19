const { MongoClient } = require('mongodb');
const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

const uri = 'mongodb://localhost:27017';
const dbname = 'AroraGarments';

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log(`Connected to the database`);
        const db = client.db(dbname);
        const collection = db.collection('sales');

        const sales = await collection.find({}).toArray();

        console.log(`Found the following Sales:`);

        console.dir(sales);

        return sales;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

async function generateHTMLTable(sales) {
    let html = '<div class="table-container">';
    html += '<table class="table table-bordered table-striped">';
    html += '<thead><tr><th>Bill Number</th><th>Customer Name</th><th>Customer Address</th><th>State</th><th>Mobile Number</th><th>Bill Amount</th><th>Cleared Amount</th><th>Payment Mode</th><th>Date</th><th>Amount Due</th></tr></thead>';
    html += '<tbody>';

    sales.forEach(p => {
        html += `<tr><td>${p.BillNumber}</td><td>${p.CustomerName}</td><td>${p.CustomerAddresss}</td><td>${p.State}</td><td>${p.CustomerMobile}</td><td>${p.BillAmount}</td><td>${p.Paid}</td><td>${p.PaymentMode}</td><td>${p.Date}</td><td>${p.DueAmount}</td></tr>`;
    });

    html += '</tbody></table></div>';

    return html;
}



async function writeToHTMLFile(html) {
    try {
        // Read existing HTML content
        let existingHtml = await fs.promises.readFile('sales.html', 'utf8');
        
        // Find the position to insert the new HTML content
        const insertPosition = existingHtml.indexOf('<footer class="footer">');

        // Insert the new HTML content just before the footer
        const updatedHtml = existingHtml.slice(0, insertPosition) + html + existingHtml.slice(insertPosition);

        // Write the updated HTML back to the file
        await fs.promises.writeFile('sales.html', updatedHtml);
        
        console.log('HTML content appended successfully.');
    } catch (err) {
        console.error('Error appending HTML content:', err);
    }
}


async function run() {
    try {
        const sales = await main();
        const htmlTable = await generateHTMLTable(sales);
        await writeToHTMLFile(htmlTable);
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
