
import csv
import random

# Existing file path
file_path = 'public/Worksheet 7 - Fractions/questions.csv'

# New questions data structure
new_questions = []

# 1. Word Problems (20 questions) - Hard
word_problems = [
    {
        "q": "Sarah has a chocolate bar with 12 pieces. She eats 1/3 of it. How many pieces does she eat?",
        "options": ["3", "4", "6", "2"],
        "ans": "4",
        "hint": "Divide 12 by the denominator (3).",
        "know_more": "To find a fraction of a number, divide the number by the denominator.",
        "link": "https://www.mathsisfun.com/fractions_multiplication.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Tom has 20 marbles. 1/4 of them are blue. How many blue marbles does he have?",
        "options": ["4", "5", "10", "2"],
        "ans": "5",
        "hint": "Divide 20 by 4.",
        "know_more": "Finding a fraction of a group is division.",
        "link": "https://www.mathsisfun.com/fractions_multiplication.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "A pizza is cut into 8 slices. John eats 3 slices. What fraction of the pizza is left?",
        "options": ["3/8", "5/8", "1/2", "4/8"],
        "ans": "5/8",
        "hint": "Subtract the eaten slices from the total slices.",
        "know_more": "The whole is 8/8. Subtract 3/8.",
        "link": "https://www.mathsisfun.com/fractions_subtraction.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "There are 24 students in a class. 1/2 of them are girls. How many boys are there?",
        "options": ["12", "10", "14", "24"],
        "ans": "12",
        "hint": "If 1/2 are girls, the other 1/2 are boys.",
        "know_more": "Half of 24 is 12.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Mary reads 1/5 of a 100-page book. How many pages did she read?",
        "options": ["10", "20", "25", "50"],
        "ans": "20",
        "hint": "Divide 100 by 5.",
        "know_more": "1/5 of 100 means 100 divided by 5.",
        "link": "https://www.mathsisfun.com/fractions_multiplication.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "A garden has 15 flowers. 2/3 of them are red. How many red flowers are there?",
        "options": ["5", "10", "15", "3"],
        "ans": "10",
        "hint": "First find 1/3, then multiply by 2.",
        "know_more": "1/3 of 15 is 5. So 2/3 is 2 times 5.",
        "link": "https://www.mathsisfun.com/fractions_multiplication.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Bob has 16 apples. He gives 1/4 to his friend. How many apples does he have left?",
        "options": ["4", "8", "12", "10"],
        "ans": "12",
        "hint": "Find 1/4 first (4 apples), then subtract from 16.",
        "know_more": "Subtracting the part given away finds the remainder.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Lisa baked 12 cookies. She ate 1/6 of them. How many cookies did she eat?",
        "options": ["1", "2", "3", "4"],
        "ans": "2",
        "hint": "Divide 12 by 6.",
        "know_more": "1/6 of 12 is 12 divided by 6.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "A tank is 3/4 full. If it holds 40 liters, how many liters are in it?",
        "options": ["10", "20", "30", "40"],
        "ans": "30",
        "hint": "Find 1/4 (10 liters) then multiply by 3.",
        "know_more": "3/4 is 3 times 1/4.",
        "link": "https://www.mathsisfun.com/fractions_multiplication.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Jerry had $50. He spent 1/5 of it on a toy. How much did the toy cost?",
        "options": ["$5", "$10", "$15", "$20"],
        "ans": "$10",
        "hint": "Divide 50 by 5.",
        "know_more": "1/5 means one part out of five equal parts.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Farmer Joe has 30 animals. 1/3 are cows. How many cows are there?",
        "options": ["10", "15", "5", "20"],
        "ans": "10",
        "hint": "Divide 30 by 3.",
        "know_more": "",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "A ribbon is 18 meters long. Cut 1/3 of it. How long is the cut piece?",
        "options": ["3m", "6m", "9m", "12m"],
        "ans": "6m",
        "hint": "Divide 18 by 3.",
        "know_more": "",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "There are 40 students. 3/8 walk to school. How many walk?",
        "options": ["5", "10", "15", "20"],
        "ans": "15",
        "hint": "Find 1/8 first (40/8=5), then multiply by 3.",
        "know_more": "To find 3/8, find 1/8 and multiply by 3.",
        "link": "https://www.mathsisfun.com/fractions_multiplication.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "A bag has 24 candies. 1/6 are red. How many are NOT red?",
        "options": ["4", "20", "18", "6"],
        "ans": "20",
        "hint": "Find red candies (24/6=4), then subtract from total.",
        "know_more": "Or find 5/6 of 24.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Sam slept for 1/3 of a day (24 hours). How many hours did he sleep?",
        "options": ["6", "8", "10", "12"],
        "ans": "8",
        "hint": "Divide 24 by 3.",
        "know_more": "A day has 24 hours.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "A jug holds 2 liters. It is 1/2 full. How many milliliters is that? (1 liter = 1000 ml)",
        "options": ["500ml", "1000ml", "1500ml", "200ml"],
        "ans": "1000ml",
        "hint": "1/2 of 2 liters is 1 liter. Convert to ml.",
        "know_more": "1 liter = 1000 milliliters.",
        "link": "https://www.mathsisfun.com/measure/metric-volume.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Amy has 12 stickers. She gives 1/4 to Ben and 1/4 to Sue. How many does she give away in total?",
        "options": ["3", "4", "6", "8"],
        "ans": "6",
        "hint": "1/4 + 1/4 = 2/4 = 1/2. Find 1/2 of 12.",
        "know_more": "Adding fractions with same denominator is easy.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "A recipe needs 1/2 cup sugar. You want to make double. How much sugar?",
        "options": ["1/2 cup", "1 cup", "1 1/2 cups", "2 cups"],
        "ans": "1 cup",
        "hint": "1/2 + 1/2 = 1.",
        "know_more": "Doubling a half makes a whole.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "A class lasts 60 minutes. 1/4 is for reading. How many minutes for reading?",
        "options": ["10", "15", "20", "30"],
        "ans": "15",
        "hint": "Divide 60 by 4.",
        "know_more": "A quarter of an hour is 15 minutes.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Tom runs 1/2 km. Jack runs 1/2 km. How far did they run together?",
        "options": ["1/2 km", "1 km", "2 km", "1.5 km"],
        "ans": "1 km",
        "hint": "Add the distances.",
        "know_more": "Two halves make a whole.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    }
]

# 2. Addition of Fractions (10 questions) - Medium/Hard
addition_problems = [
    {
        "q": "1/5 + 2/5 = ?",
        "options": ["3/10", "3/5", "2/5", "1/5"],
        "ans": "3/5",
        "hint": "Add the numerators, keep the denominator.",
        "know_more": "When denominators are the same, just add the top numbers.",
        "link": "https://www.mathsisfun.com/fractions_addition.html",
        "type": "MCQ",
        "difficulty": "Medium"
    },
    {
        "q": "3/7 + 2/7 = ?",
        "options": ["5/14", "6/7", "5/7", "1/7"],
        "ans": "5/7",
        "hint": "3 + 2 = 5. Keep the 7.",
        "know_more": "Like fractions have the same bottom number.",
        "link": "https://www.mathsisfun.com/fractions_addition.html",
        "type": "MCQ",
        "difficulty": "Medium"
    },
    {
        "q": "1/4 + 1/4 = ?",
        "options": ["2/8", "1/2", "1/4", "3/4"],
        "ans": "1/2",
        "hint": "2/4 simplifies to 1/2.",
        "know_more": "Always simplify your answer if possible.",
        "link": "https://www.mathsisfun.com/simplifying-fractions.html",
        "type": "MCQ",
        "difficulty": "Medium"
    },
    {
        "q": "2/9 + 4/9 = ?",
        "options": ["6/18", "6/9", "8/9", "2/9"],
        "ans": "6/9",
        "hint": "2 + 4 = 6. Can you simplify 6/9?",
        "know_more": "6/9 simplifies to 2/3.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Medium"
    },
    {
        "q": "5/8 + 1/8 = ?",
        "options": ["6/16", "4/8", "6/8", "7/8"],
        "ans": "6/8",
        "hint": "5 + 1 = 6. Denominator stays 8.",
        "know_more": "6/8 is the same as 3/4.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Medium"
    },
    {
        "q": "1/10 + 3/10 = ?",
        "options": ["4/20", "4/10", "2/10", "3/10"],
        "ans": "4/10",
        "hint": "Add numerators.",
        "know_more": "4/10 simplifies to 2/5.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Medium"
    },
    {
        "q": "1/3 + 1/3 = ?",
        "options": ["2/6", "2/3", "1/3", "3/3"],
        "ans": "2/3",
        "hint": "1 + 1 = 2.",
        "know_more": "Two thirds.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Medium"
    },
    {
        "q": "3/12 + 4/12 = ?",
        "options": ["7/24", "7/12", "1/12", "12/12"],
        "ans": "7/12",
        "hint": "Just add the top numbers.",
        "know_more": "",
        "link": "",
        "type": "MCQ",
        "difficulty": "Medium"
    },
    {
        "q": "2/6 + 3/6 = ?",
        "options": ["5/12", "5/6", "1/6", "4/6"],
        "ans": "5/6",
        "hint": "2 + 3 = 5.",
        "know_more": "",
        "link": "",
        "type": "MCQ",
        "difficulty": "Medium"
    },
    {
        "q": "1/2 + 0 = ?",
        "options": ["0", "1/2", "1", "2"],
        "ans": "1/2",
        "hint": "Adding zero changes nothing.",
        "know_more": "Identity property of addition.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Medium"
    }
]

# 3. Assertion and Reasoning (20 questions) - Hard
# Format: Assertion (A): ..., Reason (R): ...
# Options: Both correct & R explains A, Both correct but R doesn't explain A, A true R false, A false R true
assertion_problems = [
    {
        "q": "Assertion (A): 1/2 is greater than 1/3. Reason (R): In fractions, if numerators are same, the one with smaller denominator is larger.",
        "options": ["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is NOT the correct explanation of A", "A is true but R is false", "A is false but R is true"],
        "ans": "Both A and R are true and R is the correct explanation of A",
        "hint": "Check if 1/2 > 1/3. Then check the rule.",
        "know_more": "Smaller pieces mean you need more to make a whole, so 1/2 > 1/3.",
        "link": "https://www.mathsisfun.com/fractions_comparing.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 2/4 is equal to 1/2. Reason (R): Equivalent fractions have the same value.",
        "options": ["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is NOT the correct explanation of A", "A is true but R is false", "A is false but R is true"],
        "ans": "Both A and R are true and R is the correct explanation of A",
        "hint": "Simplify 2/4.",
        "know_more": "Equivalent fractions represent the same part of a whole.",
        "link": "https://www.mathsisfun.com/equivalent_fractions.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 5/5 is equal to 1. Reason (R): When numerator and denominator are the same, the fraction equals 1.",
        "options": ["Both A and R are true and R is the correct explanation of A", "Both A and R are true but R is NOT the correct explanation of A", "A is true but R is false", "A is false but R is true"],
        "ans": "Both A and R are true and R is the correct explanation of A",
        "hint": "5 divided by 5 is 1.",
        "know_more": "A whole can be split into any number of parts.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 1/4 + 2/4 = 3/8. Reason (R): We add numerators and denominators.",
        "options": ["Both A and R are true", "Both A and R are false", "A is true but R is false", "A is false but R is true"], # Simplified options for Grade 3/4? No, stick to standard or simplify text.
        # Let's use standard options but shorter
        "ans": "Both A and R are false", # Wait, 1/4+2/4=3/4. A is false. R is false (we don't add denominators).
        "options": ["Both A and R are true", "A is true, R is false", "A is false, R is true", "Both A and R are false"],
        "ans": "Both A and R are false",
        "hint": "1/4 + 2/4 = 3/4. Never add denominators.",
        "know_more": "When adding fractions, denominators stay the same.",
        "link": "https://www.mathsisfun.com/fractions_addition.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
     {
        "q": "Assertion (A): 1/3 of 12 is 4. Reason (R): 3 x 4 = 12.",
        "options": ["Both A and R are true and R explains A", "Both A and R are true but R does not explain A", "A is true but R is false", "A is false"],
        "ans": "Both A and R are true and R explains A",
        "hint": "Division is the inverse of multiplication.",
        "know_more": "Finding a fraction is related to multiplication tables.",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 7/8 is smaller than 1/8. Reason (R): 7 is bigger than 1.",
        "options": ["Both A and R are true", "A is false but R is true", "A is true but R is false", "Both false"],
        "ans": "A is false but R is true",
        "hint": "7/8 is almost a whole. 1/8 is tiny.",
        "know_more": "With same denominator, larger numerator means larger fraction.",
        "link": "https://www.mathsisfun.com/fractions_comparing.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 3/4 is a proper fraction. Reason (R): The numerator is smaller than the denominator.",
        "options": ["Both A and R are true and R explains A", "Both true but R doesn't explain A", "A true, R false", "A false"],
        "ans": "Both A and R are true and R explains A",
        "hint": "Check the definition of proper fraction.",
        "know_more": "Proper fractions are less than 1.",
        "link": "https://www.mathsisfun.com/proper_fractions.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 4/3 is an improper fraction. Reason (R): The numerator is greater than the denominator.",
        "options": ["Both A and R are true and R explains A", "Both true but R doesn't explain A", "A true, R false", "A false"],
        "ans": "Both A and R are true and R explains A",
        "hint": "Top is bigger than bottom.",
        "know_more": "Improper fractions are greater than 1.",
        "link": "https://www.mathsisfun.com/improper_fractions.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 1/2 = 2/4 = 3/6. Reason (R): These are equivalent fractions.",
        "options": ["Both A and R are true and R explains A", "Both true but R doesn't explain A", "A true, R false", "A false"],
        "ans": "Both A and R are true and R explains A",
        "hint": "Multiply top and bottom by same number.",
        "know_more": "",
        "link": "https://www.mathsisfun.com/equivalent_fractions.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 0/5 is 0. Reason (R): Zero divided by anything is zero.",
        "options": ["Both A and R are true and R explains A", "Both true but R doesn't explain A", "A true, R false", "A false"],
        "ans": "Both A and R are true and R explains A",
        "hint": "If you have 0 pieces, you have nothing.",
        "know_more": "",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 1/2 + 1/3 = 2/5. Reason (R): Add tops and add bottoms.",
        "options": ["Both A and R are true", "A is false and R is false", "A is true, R false", "A false, R true"], # R is a false statement about method
        "ans": "A is false and R is false", # Actually R states a method (add tops add bottoms) which is a FALSE method.
        "hint": "You need a common denominator to add 1/2 and 1/3.",
        "know_more": "Never just add the top and bottom numbers separately.",
        "link": "https://www.mathsisfun.com/fractions_addition.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): A unit fraction always has 1 as the numerator. Reason (R): 1/5, 1/8, 1/100 are unit fractions.",
        "options": ["Both A and R are true and R is example of A", "Both true but R doesn't relate", "A true, R false", "A false"],
        "ans": "Both A and R are true and R is example of A",
        "hint": "Unit means one.",
        "know_more": "Unit fractions represent one part of a whole.",
        "link": "https://www.mathsisfun.com/definitions/unit-fraction.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 2/2 is a whole number. Reason (R): 2 divided by 2 is 1.",
        "options": ["Both A and R are true and R explains A", "Both true but R doesn't explain A", "A true, R false", "A false"],
        "ans": "Both A and R are true and R explains A",
        "hint": "Any number divided by itself is 1.",
        "know_more": "",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): We use fractions to represent parts of a whole. Reason (R): A pizza slice is a fraction of a pizza.",
        "options": ["Both A and R are true", "A false", "R false", "Both false"],
        "ans": "Both A and R are true",
        "hint": "Fractions mean broken parts.",
        "know_more": "",
        "link": "https://www.mathsisfun.com/fractions.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 3/5 is bigger than 4/5. Reason (R): 3 is smaller than 4.",
        "options": ["Both A and R are true", "A is false but R is true", "A is true, R false", "Both false"],
        "ans": "A is false but R is true",
        "hint": "Compare numerators when denominators are same.",
        "know_more": "",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): The bottom number is the Denominator. Reason (R): D stands for Down.",
        "options": ["Both A and R are true and R is a good mnemonic", "A true, R false", "A false", "Both false"],
        "ans": "Both A and R are true and R is a good mnemonic",
        "hint": "Numerator is North (Up), Denominator is Down.",
        "know_more": "Denominator tells how many parts make a whole.",
        "link": "https://www.mathsisfun.com/definitions/denominator.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): You can simplify 4/8 to 1/2. Reason (R): Both 4 and 8 can be divided by 4.",
        "options": ["Both A and R are true and R explains A", "Both true no explanation", "A true R false", "A false"],
        "ans": "Both A and R are true and R explains A",
        "hint": "Divide top and bottom by the greatest common divisor.",
        "know_more": "",
        "link": "https://www.mathsisfun.com/simplifying-fractions.html",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 1/2 is equivalent to 50/100. Reason (R): 50 is half of 100.",
        "options": ["Both A and R are true and R explains A", "Both true no explanation", "A true R false", "A false"],
        "ans": "Both A and R are true and R explains A",
        "hint": "Percentages are fractions out of 100.",
        "know_more": "",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): If you eat 8/8 of a cake, you ate the whole cake. Reason (R): 8/8 equals 1.",
        "options": ["Both A and R are true", "A false", "R false", "Both false"],
        "ans": "Both A and R are true",
        "hint": "The whole thing.",
        "know_more": "",
        "link": "",
        "type": "MCQ",
        "difficulty": "Hard"
    },
    {
        "q": "Assertion (A): 1/10 is larger than 1/5. Reason (R): 10 is larger than 5.",
        "options": ["Both A and R are true", "A is false but R is true", "A true, R false", "Both false"],
        "ans": "A is false but R is true",
        "hint": "Would you rather have 1/5 of a cake or 1/10? 1/5 is bigger.",
        "know_more": "Larger denominator means smaller parts.",
        "link": "https://www.mathsisfun.com/fractions_comparing.html",
        "type": "MCQ",
        "difficulty": "Hard"
    }
]

# Combine all new questions
new_questions.extend(word_problems)
new_questions.extend(addition_problems)
new_questions.extend(assertion_problems)

# Read existing file
lines = []
with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    lines = list(reader)

# Update header
header = lines[0]
if 'Difficulty' not in header:
    header.append('Difficulty')

# Update existing rows (set default Difficulty to 'Medium')
updated_lines = [header]
for i in range(1, len(lines)):
    row = lines[i]
    # Ensure row has enough columns before appending difficulty
    # Original header length was 14.
    # If row is shorter, pad it.
    while len(row) < 14:
        row.append('')

    # Append Difficulty if not present (check if length matches new header length)
    if len(row) < len(header):
        row.append('Medium')
    updated_lines.append(row)

# Append new questions
# Columns: Question, Option 1, Option 2, Option 3, Option 4, Answer, Hint, Know More, Link, YouTube, Image, Type, Concept/Subtopic, Worksheet No, Difficulty
for q in new_questions:
    row = [
        q['q'],
        q['options'][0],
        q['options'][1],
        q['options'][2],
        q['options'][3],
        q['ans'],
        q['hint'],
        q['know_more'], # Know More Text
        q['link'],      # Link URL
        '',             # YouTube
        '',             # Image
        q['type'],
        'Fractions',    # Concept
        '7',            # Worksheet No
        q['difficulty']
    ]
    updated_lines.append(row)

# Write back to file
with open(file_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerows(updated_lines)

print(f"Successfully added {len(new_questions)} questions and updated headers.")
