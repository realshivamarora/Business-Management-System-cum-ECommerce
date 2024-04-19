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
        const collection = db.collection('c_Details');

        const c_details = await collection.find({}).toArray();

        console.log(`Found the following Customer Details:`);

        console.dir(c_details);

        return c_details;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

async function generateHTMLTable(c_details) {
    let html = '<div class="table-container">';
    html += '<table class="table table-bordered table-striped">';
    html += '<thead><tr><th>Customer ID</th><th>Customer Name</th><th>Customer Address</th><th>Customer Mobile Number</th><th>Balance</th></tr></thead>';
    html += '<tbody>';

    c_details.forEach(p => {
        html += `<tr><td>${p.CustomerID}</td><td>${p.CustomerName}</td><td>${p.CustomerAddresss}</td><td>${p.CustomerMobile}</td><td>${p.Balance}</td></tr>`;
    });

    html += '</tbody></table></div>';

    return html;
}



async function writeToHTMLFile(html) {
    try {
        // Read existing HTML content
        let existingHtml = await fs.promises.readFile('c_details.html', 'utf8');
        
        // Find the position to insert the new HTML content
        const insertPosition = existingHtml.indexOf('<footer class="footer">');

        // Insert the new HTML content just before the footer
        const updatedHtml = existingHtml.slice(0, insertPosition) + html + existingHtml.slice(insertPosition);

        // Write the updated HTML back to the file
        await fs.promises.writeFile('c_details.html', updatedHtml);
        
        console.log('HTML content appended successfully.');
    } catch (err) {
        console.error('Error appending HTML content:', err);
    }
}


async function run() {
    try {
        const c_details = await main();
        const htmlTable = await generateHTMLTable(c_details);
        await writeToHTMLFile(htmlTable);
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
