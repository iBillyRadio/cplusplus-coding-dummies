
const checkAndCapture = (code, solutionRegex) => {
    try {
        const pattern = new RegExp(solutionRegex);
        const match = code.match(pattern);
        if (match) {
            return { isMatch: true, captured: match.groups };
        }
        return { isMatch: false };
    } catch (e) {
        console.error("Regex error:", e.message);
        return { isMatch: false, error: e.message };
    }
};

const interpolate = (tpl, ctx) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => ctx[k] || _);

// Mock Data
const context = { targetType: 'int', varName: 'score' };

// Step 1 Regex from lessons.ts
// Note: We must emulate the string double-escaping from TS file
// In TS file: 'regex:{{targetType}}\\s+(?<varName>\\w+)\\s*=\\s*(?:[\\d\\.]+|"[^"]*")\\s*;'
// In JS string: matches the above
const step1Raw = '{{targetType}}\\s+(?<varName>\\w+)\\s*=\\s*(?:[\\d\\.]+|"[^"]*")\\s*;';
const step1Resolved = interpolate(step1Raw, context);

console.log("Step 1 Pattern:", step1Resolved);
const code1 = "int score = 10;";
console.log(`Checking '${code1}':`, checkAndCapture(code1, step1Resolved));

const code1_spaces = "int   score  =  10 ;";
console.log(`Checking '${code1_spaces}':`, checkAndCapture(code1_spaces, step1Resolved));

// Step 2 Regex
const step2Raw = '{{varName}}\\s*=\\s*(?:[\\d\\.]+|"[^"]*")\\s*;';
const step2Resolved = interpolate(step2Raw, context);

console.log("Step 2 Pattern:", step2Resolved);
const code2 = "score = 20;";
console.log(`Checking '${code2}':`, checkAndCapture(code2, step2Resolved));

const code2_fail = "score = ;"; // Missing value
console.log(`Checking '${code2_fail}':`, checkAndCapture(code2_fail, step2Resolved));
