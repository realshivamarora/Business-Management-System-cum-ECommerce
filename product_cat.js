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
        const collection = db.collection('products');

        const prod = await collection.find({}).toArray();

        console.log(`Found the following Payments:`);

        console.dir(prod);

        return prod;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

async function generateHTMLTable(prod) {
    let html = '<div class="table-container">';
    html += '<table class="table table-bordered table-striped">';
    html += '<thead><tr><th>Product ID</th><th>Product</th><th>Firm</th><th>Firm Address</th><th>Product Category</th><th>Stock Left</th><th>Cost Price</th><th>GST (in %)</th><th>Gross Cost Price</th></tr></thead>';
    html += '<tbody>';

    prod.forEach(p => {
        html += `<tr><td>${p.ProductID}</td><td>${p.Product}</td><td>${p.Firm}</td><td>${p.FirmAddress}</td><td>${p.ProductCategory}</td><td>${p.StockLeft}</td><td>${p.CostPrice}</td><td>${p.GST}</td><td>${p.GrossCostPrice}</td></tr>`;
    });

    html += '</tbody></table></div>';

    return html;
}



async function writeToHTMLFile(html) {
    try {
        // Read existing HTML content
        let existingHtml = await fs.promises.readFile('product_catalog.html', 'utf8');
        
        // Find the position to insert the new HTML content
        const insertPosition = existingHtml.indexOf('<footer class="footer">');

        // Insert the new HTML content just before the footer
        const updatedHtml = existingHtml.slice(0, insertPosition) + html + existingHtml.slice(insertPosition);

        // Write the updated HTML back to the file
        await fs.promises.writeFile('product_catalog.html', updatedHtml);
        
        console.log('HTML content appended successfully.');
    } catch (err) {
        console.error('Error appending HTML content:', err);
    }
}


async function run() {
    try {
        const prod = await main();
        const htmlTable = await generateHTMLTable(prod);
        await writeToHTMLFile(htmlTable);
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
