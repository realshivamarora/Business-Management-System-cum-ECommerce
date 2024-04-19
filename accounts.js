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
        const collection = db.collection('accounts');

        const accounts = await collection.find({}).toArray();

        console.log(`Found the following Accounts:`);

        console.dir(accounts);

        return accounts;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

async function generateHTMLTable(accounts) {
    let html = '<div class="table-container">';
    html += '<table class="table table-bordered table-striped">';
    html += '<thead><tr><th>Firm ID</th><th>Firm Name</th><th>Firm Address</th><th>Phone Number</th><th>Balance</th></tr></thead>';
    html += '<tbody>';

    accounts.forEach(p => {
        html += `<tr><td>${p.FirmID}</td><td>${p.FirmName}</td><td>${p.FirmAddress}</td><td>${p.Phone}</td><td>${p.Balance}</td></tr>`;
    });

    html += '</tbody></table></div>';

    return html;
}



async function writeToHTMLFile(html) {
    try {
        // Read existing HTML content
        let existingHtml = await fs.promises.readFile('accounts.html', 'utf8');
        
        // Find the position to insert the new HTML content
        const insertPosition = existingHtml.indexOf('<footer class="footer">');

        // Insert the new HTML content just before the footer
        const updatedHtml = existingHtml.slice(0, insertPosition) + html + existingHtml.slice(insertPosition);

        // Write the updated HTML back to the file
        await fs.promises.writeFile('accounts.html', updatedHtml);
        
        console.log('HTML content appended successfully.');
    } catch (err) {
        console.error('Error appending HTML content:', err);
    }
}


async function run() {
    try {
        const accounts = await main();
        const htmlTable = await generateHTMLTable(accounts);
        await writeToHTMLFile(htmlTable);
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
