function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
}

const line = 'Which is larger?,1/2,1/8,1/10,1/100,1/2,Think about sharing a pizza.,,,,https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Pizza_pie_chart.svg/320px-Pizza_pie_chart.svg.png,MCQ,Math,4';
const parts = parseCSVLine(line);

console.log('Parts length:', parts.length);
console.log('Part 6 (Hint):', parts[6]);
console.log('Part 7 (KM):', parts[7]);
console.log('Part 8 (Link):', parts[8]);
console.log('Part 9 (YT):', parts[9]);
console.log('Part 10 (Image):', parts[10]);
