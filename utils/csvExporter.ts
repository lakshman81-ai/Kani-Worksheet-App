/**
 * CSV Exporter Utility
 * Exports generated questions to CSV format for Google Sheets import
 */

import { GeneratedQuestion } from '../services/worksheetGeneratorService';

/**
 * Convert questions to CSV format matching Google Sheets template
 * Column format: Question, Option 1, Option 2, Option 3, Option 4, Answer, Hint, Know More, Link, YouTube, Image, Type, Concept/Subtopic, Worksheet No
 */
export function questionsToCSV(questions: GeneratedQuestion[]): string {
    // Header row
    const header = [
        'Question',
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Answer',
        'Hint',
        'Know More',
        'Link',
        'YouTube',
        'Image',
        'Type',
        'Concept/Subtopic',
        'Worksheet No'
    ].join(',');

    // Data rows
    const rows = questions.map(q => {
        // Get the correct answer text
        const answerText = q[`option${q.correctAnswer}` as keyof GeneratedQuestion] as string;

        return [
            escapeCSV(q.question),
            escapeCSV(q.optionA),
            escapeCSV(q.optionB),
            escapeCSV(q.optionC),
            escapeCSV(q.optionD),
            escapeCSV(answerText),
            escapeCSV(q.hint || ''),
            '', // Know More (description)
            '', // Link
            '', // YouTube
            '', // Image
            'MCQ', // Type
            '', // Concept/Subtopic
            q.worksheetNo.toString()
        ].join(',');
    });

    return [header, ...rows].join('\n');
}

/**
 * Escape a value for CSV (handle commas, quotes, newlines)
 */
function escapeCSV(value: string): string {
    if (!value) return '""';

    // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }

    return `"${value}"`;
}

/**
 * Trigger a CSV file download in the browser
 */
export function exportToCSV(questions: GeneratedQuestion[], filename: string = 'worksheet.csv'): void {
    const csv = questionsToCSV(questions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);
}

/**
 * Parse CSV content back to questions (for import functionality)
 */
export function parseCSVToQuestions(csvContent: string): GeneratedQuestion[] {
    const lines = csvContent.trim().split('\n');
    const questions: GeneratedQuestion[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = parseCSVLine(line);
        if (parts.length >= 6) {
            // Determine correct answer letter
            const correctAnswerText = parts[5];
            let correctAnswer: 'A' | 'B' | 'C' | 'D' = 'A';

            if (parts[1] === correctAnswerText) correctAnswer = 'A';
            else if (parts[2] === correctAnswerText) correctAnswer = 'B';
            else if (parts[3] === correctAnswerText) correctAnswer = 'C';
            else if (parts[4] === correctAnswerText) correctAnswer = 'D';

            questions.push({
                question: parts[0],
                optionA: parts[1],
                optionB: parts[2],
                optionC: parts[3],
                optionD: parts[4],
                correctAnswer,
                hint: parts[6] || '',
                worksheetNo: parseInt(parts[13], 10) || 1,
            });
        }
    }

    return questions;
}

/**
 * Parse a CSV line handling quoted fields with commas
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    return result;
}
