import { Question } from '../types';

/**
 * Service to parse QA text format into Question objects
 * Format:
 * Question 1 text
 * A. Option 1
 * B. Option 2
 * C. Option 3
 * D. Option 4
 * Answer: A
 * Hint: Hint text (optional)
 * Know More: URL (optional)
 * 
 * New Question...
 */

export function parseQAText(text: string, topicId: string): Question[] {
    const questions: Question[] = [];
    const blocks = text.split(/\n\s*\n/); // Split by empty lines

    blocks.forEach((block, index) => {
        const lines = block.trim().split('\n');
        if (lines.length < 2) return;

        let questionText = '';
        const answers: { id: string; text: string }[] = [];
        let correctAnswer = '';
        let hint = '';
        let knowMore = '';
        let knowMoreText = '';
        let imageUrl = '';
        let youtubeUrl = '';

        let parsingOptions = false;

        // Extract Question Text (first line/lines)
        // It might be multiline until we hit options or "Answer:"
        let i = 0;
        for (; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.match(/^[A-D]\.\s/i) || line.startsWith('Answer:') || line.startsWith('Sentence:')) {
                break;
            }
            questionText += (questionText ? '\n' : '') + line;
        }

        // TTA/FIB Detection
        let questionType: 'MCQ' | 'TTA' | 'FIB' = 'MCQ';
        let fibSentence = '';
        let isFib = false;

        // Check for specific type override in question text or structure
        if (questionText.toLowerCase().includes('(type expected)')) {
            questionType = 'TTA';
        }

        for (; i < lines.length; i++) {
            const line = lines[i].trim();

            // Check for FIB Sentence
            if (line.startsWith('Sentence:')) {
                questionType = 'FIB';
                isFib = true;
                const match = line.match(/Sentence:\s*(.+)/i);
                if (match) {
                    const fullSentence = match[1];
                    // Replace quoted part with blank
                    fibSentence = fullSentence.replace(/"[^"]+"/g, '__________');
                }
                continue;
            }

            // Check for Options
            const optionMatch = line.match(/^([A-D])\.\s+(.+)/i);
            if (optionMatch) {
                parsingOptions = true;
                answers.push({
                    id: optionMatch[1].toUpperCase(),
                    text: optionMatch[2].trim()
                });
                continue;
            }

            // Check for Answer
            if (line.startsWith('Answer:')) {
                correctAnswer = line.substring(7).trim();
                continue;
            }

            // Check for Hint
            if (line.startsWith('Hint:')) {
                hint = line.substring(5).trim();
                continue;
            }

            // Check for Know More Link
            if (line.startsWith('Know More:')) {
                knowMore = line.substring(10).trim();
                continue;
            }

            // Check for Know More Text
            if (line.startsWith('Know More Text:')) {
                knowMoreText = line.substring(15).trim();
                continue;
            }

            // Check for Image
            if (line.startsWith('Image:')) {
                imageUrl = line.substring(6).trim();
                continue;
            }

            // Check for YouTube
            if (line.startsWith('YouTube:')) {
                youtubeUrl = line.substring(8).trim();
                continue;
            }
        }

        // Auto-detect type if not explicitly set
        if (questionType === 'MCQ' && answers.length < 2) {
            questionType = 'TTA';
        }

        // For FIB, if we extracted a sentence but didn't assume answer from quotes, 
        // we might rely on the explicit "Answer:" field. 
        // If the answer field contains pipe |, it's multiple answers

        if (questionText && correctAnswer) {
            questions.push({
                id: `${topicId}-custom-${Date.now()}-${index}`,
                text: questionText,
                answers: answers,
                correctAnswer: correctAnswer,
                hint: hint || undefined,
                knowMore: knowMore || undefined,
                knowMoreText: knowMoreText || undefined,
                imageUrl: imageUrl || undefined,
                youtubeUrl: youtubeUrl || undefined,
                topic: topicId,
                questionType,
                is_fib: isFib,
                fib_sentence: fibSentence || undefined,
                multipleAnswers: correctAnswer.includes('|') ? correctAnswer : undefined
            });
        }
    });

    return questions;
}

/**
 * Convert Questions back to text format for editing
 */
export function questionsToText(questions: Question[]): string {
    return questions.map(q => {
        let text = q.text;

        if (q.is_fib && q.fib_sentence) {
            // Reconstruct potential sentence if needed, or just append property
            text += `\nSentence: ${q.fib_sentence.replace('__________', `"${q.correctAnswer}"`)}`;
        }

        if (q.answers && q.answers.length > 0) {
            q.answers.forEach(a => {
                text += `\n${a.id}. ${a.text}`;
            });
        }

        text += `\nAnswer: ${q.correctAnswer}`;

        if (q.hint) text += `\nHint: ${q.hint}`;
        if (q.knowMore) text += `\nKnow More: ${q.knowMore}`;
        if (q.knowMoreText) text += `\nKnow More Text: ${q.knowMoreText}`;
        if (q.imageUrl) text += `\nImage: ${q.imageUrl}`;
        if (q.youtubeUrl) text += `\nYouTube: ${q.youtubeUrl}`;

        return text;
    }).join('\n\n');
}
