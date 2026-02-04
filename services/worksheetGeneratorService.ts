/**
 * Worksheet Generator Service
 * Uses Gemini AI to generate quiz questions for Grade 3 English & Math
 */

import { GoogleGenAI } from "@google/genai";
import { getStoredApiKey } from '../hooks/useAppSettings';

export interface WorksheetConfig {
    subject: 'math' | 'english';
    gradeLevel: number;
    topic: string;
    subtopics: string;
    numberOfQuestions: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface GeneratedQuestion {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: 'A' | 'B' | 'C' | 'D';
    hint: string;
    worksheetNo: number;
}

/**
 * Generate quiz questions using Gemini AI
 */
export async function generateWorksheet(config: WorksheetConfig): Promise<GeneratedQuestion[]> {
    const apiKey = getStoredApiKey();

    if (!apiKey) {
        console.warn('No API key configured. Returning sample questions.');
        return generateSampleQuestions(config);
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Generate ${config.numberOfQuestions} multiple choice questions for Grade ${config.gradeLevel} students on the topic of "${config.topic}".

Subject: ${config.subject === 'math' ? 'Mathematics' : 'English'}
${config.subtopics ? `Subtopics to cover: ${config.subtopics}` : ''}
Difficulty: ${config.difficulty}

Requirements:
- Each question should have 4 options (A, B, C, D)
- Questions should be age-appropriate for ${config.gradeLevel}-year-old students
- Include a helpful hint for each question
- Make questions engaging and educational
- ${config.subject === 'math' ? 'Use numbers and calculations appropriate for Grade ' + config.gradeLevel : 'Use vocabulary and concepts suitable for Grade ' + config.gradeLevel}

Return the questions in this exact JSON format (array of objects):
[
  {
    "question": "The question text here",
    "optionA": "First option",
    "optionB": "Second option",
    "optionC": "Third option",
    "optionD": "Fourth option",
    "correctAnswer": "A",
    "hint": "A helpful hint"
  }
]

Only return valid JSON, no additional text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: { parts: [{ text: prompt }] },
        });

        const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Extract JSON from response (handle markdown code blocks)
        let jsonStr = responseText;
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        }

        const questions: Omit<GeneratedQuestion, 'worksheetNo'>[] = JSON.parse(jsonStr.trim());

        return questions.map((q) => ({
            ...q,
            worksheetNo: 1,
        }));

    } catch (error) {
        console.error('Error generating worksheet:', error);
        return generateSampleQuestions(config);
    }
}

/**
 * Fetch questions directly from a Google Sheet URL
 */
export async function fetchQuestionsFromSheetUrl(sheetUrl: string): Promise<GeneratedQuestion[]> {
    try {
        // Convert to CSV export format if needed
        let csvUrl = sheetUrl;
        if (sheetUrl.includes('/edit')) {
            csvUrl = sheetUrl.replace('/edit#gid=0', '/export?format=csv').replace('/edit', '/export?format=csv');
        }

        // Add cache-busting
        const url = csvUrl + (csvUrl.includes('?') ? '&' : '?') + 't=' + Date.now();

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch from Google Sheets`);
        }

        const csvText = await response.text();
        return parseCSVToGeneratedQuestions(csvText);
    } catch (error) {
        console.error('Error fetching from sheet:', error);
        throw error;
    }
}

/**
 * Parse CSV to GeneratedQuestion format
 */
function parseCSVToGeneratedQuestions(csvText: string): GeneratedQuestion[] {
    const lines = csvText.trim().split('\n');
    const questions: GeneratedQuestion[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = parseCSVLine(line);

        if (parts.length >= 6) {
            const questionText = parts[0];
            const option1 = parts[1];
            const option2 = parts[2];
            const option3 = parts[3];
            const option4 = parts[4];
            const correctAnswerText = parts[5];
            const hint = parts[6] || '';
            const worksheetNo = parts[13] ? parseInt(parts[13], 10) : 1;

            // Determine correct answer letter by matching text
            const options = [option1, option2, option3, option4];
            let correctAnswer: 'A' | 'B' | 'C' | 'D' = 'A';
            const optionLetters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

            for (let j = 0; j < options.length; j++) {
                if (options[j].trim().toLowerCase() === correctAnswerText.trim().toLowerCase()) {
                    correctAnswer = optionLetters[j];
                    break;
                }
            }

            questions.push({
                question: questionText,
                optionA: option1,
                optionB: option2,
                optionC: option3,
                optionD: option4,
                correctAnswer,
                hint,
                worksheetNo,
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
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
}

/**
 * Generate sample questions when API is not available
 */
function generateSampleQuestions(config: WorksheetConfig): GeneratedQuestion[] {
    if (config.subject === 'math') {
        return generateSampleMathQuestions(config);
    } else {
        return generateSampleEnglishQuestions(config);
    }
}

function generateSampleMathQuestions(config: WorksheetConfig): GeneratedQuestion[] {
    const questions: GeneratedQuestion[] = [
        { question: 'What is 5 + 3?', optionA: '6', optionB: '7', optionC: '8', optionD: '9', correctAnswer: 'C', hint: 'Count forward from 5', worksheetNo: 1 },
        { question: 'What is 12 - 4?', optionA: '6', optionB: '7', optionC: '8', optionD: '9', correctAnswer: 'C', hint: 'Count backward from 12', worksheetNo: 1 },
        { question: 'What is 3 × 4?', optionA: '10', optionB: '11', optionC: '12', optionD: '14', correctAnswer: 'C', hint: 'Add 3 four times', worksheetNo: 1 },
        { question: 'What is 15 ÷ 3?', optionA: '3', optionB: '4', optionC: '5', optionD: '6', correctAnswer: 'C', hint: 'How many times does 3 go into 15?', worksheetNo: 1 },
        { question: 'What number comes after 99?', optionA: '98', optionB: '100', optionC: '101', optionD: '109', correctAnswer: 'B', hint: 'Think about what comes after ninety-nine', worksheetNo: 1 },
        { question: 'How many sides does a triangle have?', optionA: '2', optionB: '3', optionC: '4', optionD: '5', correctAnswer: 'B', hint: 'The name gives you a clue!', worksheetNo: 1 },
        { question: 'What is 7 × 2?', optionA: '12', optionB: '13', optionC: '14', optionD: '15', correctAnswer: 'C', hint: 'Double 7', worksheetNo: 1 },
        { question: 'If you have 20 apples and give away 8, how many do you have left?', optionA: '10', optionB: '11', optionC: '12', optionD: '13', correctAnswer: 'C', hint: '20 minus 8', worksheetNo: 1 },
        { question: 'What is half of 16?', optionA: '6', optionB: '7', optionC: '8', optionD: '9', correctAnswer: 'C', hint: 'Divide 16 by 2', worksheetNo: 1 },
        { question: 'What is 9 + 6?', optionA: '13', optionB: '14', optionC: '15', optionD: '16', correctAnswer: 'C', hint: 'Make 10 first, then add the rest', worksheetNo: 1 },
    ];
    return questions.slice(0, config.numberOfQuestions);
}

function generateSampleEnglishQuestions(config: WorksheetConfig): GeneratedQuestion[] {
    const questions: GeneratedQuestion[] = [
        { question: 'Which word is a noun?', optionA: 'Run', optionB: 'Happy', optionC: 'Cat', optionD: 'Quickly', correctAnswer: 'C', hint: 'A noun is a person, place, or thing', worksheetNo: 1 },
        { question: 'What is the opposite of "hot"?', optionA: 'Warm', optionB: 'Cold', optionC: 'Cool', optionD: 'Fire', correctAnswer: 'B', hint: 'Think about winter temperature', worksheetNo: 1 },
        { question: 'Which word is spelled correctly?', optionA: 'Beautful', optionB: 'Beautiful', optionC: 'Beutiful', optionD: 'Beautifl', correctAnswer: 'B', hint: 'Sound it out: beau-ti-ful', worksheetNo: 1 },
        { question: 'What is the plural of "child"?', optionA: 'Childs', optionB: 'Childes', optionC: 'Children', optionD: 'Childrens', correctAnswer: 'C', hint: 'This is an irregular plural', worksheetNo: 1 },
        { question: 'Which word is a verb?', optionA: 'Book', optionB: 'Jump', optionC: 'Happy', optionD: 'Blue', correctAnswer: 'B', hint: 'A verb is an action word', worksheetNo: 1 },
        { question: 'What punctuation goes at the end of a question?', optionA: 'Period (.)', optionB: 'Comma (,)', optionC: 'Question mark (?)', optionD: 'Exclamation (!)', correctAnswer: 'C', hint: 'Look at the end of this sentence!', worksheetNo: 1 },
        { question: 'Which word means the same as "big"?', optionA: 'Small', optionB: 'Tiny', optionC: 'Large', optionD: 'Little', correctAnswer: 'C', hint: 'Think of another word for big', worksheetNo: 1 },
        { question: 'Complete the sentence: "The dog ___ barking."', optionA: 'is', optionB: 'are', optionC: 'am', optionD: 'be', correctAnswer: 'A', hint: 'Dog is singular (one)', worksheetNo: 1 },
        { question: 'Which word is an adjective?', optionA: 'Run', optionB: 'Quickly', optionC: 'Tall', optionD: 'House', correctAnswer: 'C', hint: 'Adjectives describe nouns', worksheetNo: 1 },
        { question: 'What is the past tense of "go"?', optionA: 'Goes', optionB: 'Going', optionC: 'Went', optionD: 'Gone', correctAnswer: 'C', hint: 'Yesterday I ___ to school', worksheetNo: 1 },
    ];
    return questions.slice(0, config.numberOfQuestions);
}
