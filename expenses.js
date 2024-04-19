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
        const collection = db.collection('expenses');

        const expenses = await collection.find({}).toArray();

        console.log(`Found the following Expenses:`);

        console.dir(expenses);

        return expenses;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

async function generateHTMLTable(expenses) {
    let html = '<div class="table-container">';
    html += '<table class="table table-bordered table-striped">';
    html += '<thead><tr><th>Expense</th><th>Amount</th><th>Mode</th><th>Date</th></tr></thead>';
    html += '<tbody>';

    expenses.forEach(p => {
        html += `<tr><td>${p.Expense}</td><td>${p.Amount}</td><td>${p.Mode}</td><td>${p.Date}</td></tr>`;
    });

    html += '</tbody></table></div>';

    return html;
}



async function writeToHTMLFile(html) {
    try {
        // Read existing HTML content
        let existingHtml = await fs.promises.readFile('expenses.html', 'utf8');
        
        // Find the position to insert the new HTML content
        const insertPosition = existingHtml.indexOf('<footer class="footer">');

        // Insert the new HTML content just before the footer
        const updatedHtml = existingHtml.slice(0, insertPosition) + html + existingHtml.slice(insertPosition);

        // Write the updated HTML back to the file
        await fs.promises.writeFile('expenses.html', updatedHtml);
        
        console.log('HTML content appended successfully.');
    } catch (err) {
        console.error('Error appending HTML content:', err);
    }
}


async function run() {
    try {
        const expenses = await main();
        const htmlTable = await generateHTMLTable(expenses);
        await writeToHTMLFile(htmlTable);
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
