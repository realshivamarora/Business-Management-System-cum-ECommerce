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
        const collection = db.collection('pd');

        const pd = await collection.find({}).toArray();

        console.log(`Found the following Payments:`);

        console.dir(pd);

        return pd;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

async function generateHTMLTable(pd) {
    let html = '<div class="table-container">';
    html += '<table class="table table-bordered table-striped">';
    html += '<thead><tr><th>Customer ID</th><th>Customer Name</th><th>Customer Address</th><th>Mobile Number</th><th>Payment Amount</th><th>Mode</th><th>Date</th></tr></thead>';
    html += '<tbody>';

    pd.forEach(p => {
        html += `<tr><td>${p.FirmID}</td><td>${p.FirmName}</td><td>${p.FirmAddress}</td><td>${p.Phone}</td><td>${p.PaymentCleared}</td><td>${p.Mode}</td><td>${p.Date}</td></tr>`;
    });

    html += '</tbody></table></div>';

    return html;
}



async function writeToHTMLFile(html) {
    try {
        // Read existing HTML content
        let existingHtml = await fs.promises.readFile('payments_done.html', 'utf8');
        
        // Find the position to insert the new HTML content
        const insertPosition = existingHtml.indexOf('<footer class="footer">');

        // Insert the new HTML content just before the footer
        const updatedHtml = existingHtml.slice(0, insertPosition) + html + existingHtml.slice(insertPosition);

        // Write the updated HTML back to the file
        await fs.promises.writeFile('payments_done.html', updatedHtml);
        
        console.log('HTML content appended successfully.');
    } catch (err) {
        console.error('Error appending HTML content:', err);
    }
}


async function run() {
    try {
        const pr = await main();
        const htmlTable = await generateHTMLTable(pr);
        await writeToHTMLFile(htmlTable);
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
