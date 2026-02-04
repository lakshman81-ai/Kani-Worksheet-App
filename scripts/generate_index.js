import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'master_index.json');

function generateIndex() {
    console.log('Scanning for Worksheet folders...');

    if (!fs.existsSync(PUBLIC_DIR)) {
        console.error('Public directory not found!');
        process.exit(1);
    }

    const items = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true });
    const worksheets = [];

    items.forEach(item => {
        if (item.isDirectory() && item.name.startsWith('Worksheet')) {
            // Generate ID from name (e.g., "Worksheet 1" -> "ws1")
            const numberMatch = item.name.match(/\d+/);
            const number = numberMatch ? numberMatch[0] : '0';
            const id = `ws${number}`;

            worksheets.push({
                id: id,
                name: item.name,
                path: item.name,
                description: `Auto-generated from folder ${item.name}`
            });
        }
    });

    // Sort by ID number if possible
    worksheets.sort((a, b) => {
        const numA = parseInt(a.id.replace('ws', '')) || 0;
        const numB = parseInt(b.id.replace('ws', '')) || 0;
        return numA - numB;
    });

    const jsonContent = JSON.stringify(worksheets, null, 2);
    fs.writeFileSync(OUTPUT_FILE, jsonContent);

    console.log(`✅ Successfully generated master_index.json with ${worksheets.length} worksheets.`);
    console.log(worksheets);
}

generateIndex();
