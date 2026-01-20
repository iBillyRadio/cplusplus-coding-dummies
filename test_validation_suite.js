
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

// ---------------------------------------------------------
// TEST SUITE
// ---------------------------------------------------------

// Helper to run test
const runTest = (name, pattern, code, expected) => {
    const result = checkAndCapture(code, pattern);
    const pass = result.isMatch === expected;
    console.log(`[${pass ? "PASS" : "FAIL"}] ${name}: Code='${code}' Expected=${expected} Got=${result.isMatch}`);
    if (!pass) console.log(`   Pattern: ${pattern}`);
};

console.log("=== Testing Step 1 Regex ===");
// Original from lessons.ts (after my fix for semicolon space)
// 'regex:{{targetType}}\\s+(?<varName>\\w+)\\s*=\\s*(?:[\\d\\.]+|"[^"]*")\\s*;'
const step1Raw = '{{targetType}}\\s+(?<varName>\\w+)\\s*=\\s*(?:[\\d\\.]+|"[^"]*")\\s*;';
const step1Resolved = interpolate(step1Raw, context);

runTest("Standard Int", step1Resolved, "int score = 10;", true);
runTest("Loose Spacing", step1Resolved, "int    score  =   100  ;", true);
runTest("No Space Semicolon", step1Resolved, "int score=10;", true);
runTest("Wrong Type", step1Resolved, "double score = 10.5;", false);
runTest("Missing Type", step1Resolved, "score = 10;", false);
runTest("Missing Semicolon", step1Resolved, "int score = 10", false);


console.log("\n=== Testing Step 2 Regex ===");
// 'regex:{{varName}}\\s*=\\s*(?:[\\d\\.]+|"[^"]*")\\s*;'
const step2Raw = '{{varName}}\\s*=\\s*(?:[\\d\\.]+|"[^"]*")\\s*;';
const step2Resolved = interpolate(step2Raw, context);

runTest("Update Int", step2Resolved, "score = 20;", true);
runTest("Update Loose Spacing", step2Resolved, "score  =  99   ;", true);
runTest("Wrong Var Name", step2Resolved, "points = 20;", false);
runTest("Missing Semicolon", step2Resolved, "score = 20", false);
// NOTE: "Sweet spot" issue? Maybe user wants strict semicolon check, OR maybe they hate passing it.
// Current regex strictly REQUIRES a semicolon (followed by optional space).

console.log("\n=== Testing Complex Value ===");
const stringContext = { targetType: 'string', varName: 'name' };
const step1StringResolved = interpolate(step1Raw, stringContext);

runTest("String Value", step1StringResolved, 'string name = "David";', true);
runTest("String Empty", step1StringResolved, 'string name = "";', true);
runTest("String Missing Quote", step1StringResolved, 'string name = "David;', false);

