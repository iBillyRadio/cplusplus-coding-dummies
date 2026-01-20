export const normalizeCode = (code: string): string => {
    // 1. Remove single-line comments //...
    const noComments = code.replace(/\/\/.*$/gm, '');

    // 2. Tokenize by string literals
    // Regex matches double-quoted strings, handling escaped quotes
    const stringRegex = /"(?:[^"\\]|\\.)*"/g;

    const parts = noComments.split(stringRegex);
    const matches = noComments.match(stringRegex) || [];

    let result = '';

    for (let i = 0; i < parts.length; i++) {
        // Strip whitespace and 'std::' namespace from code part
        result += parts[i].replace(/\s+/g, '').replace(/std::/g, '');

        // Append the string literal if it exists
        if (i < matches.length) {
            result += matches[i];
        }
    }

    return result;
};

/**
 * Checks if the code matches a regex solution and captures named groups.
 * @param code The user's raw code.
 * @param solutionRegex The regex string (without 'regex:' prefix).
 */
export const checkAndCapture = (code: string, solutionRegex: string): { isMatch: boolean; captured?: Record<string, string> } => {
    try {
        const pattern = new RegExp(solutionRegex);
        // We match against trimmed code, but NOT normalized, because regex might depend on spaces
        // However, for flexible matching allowing loose spacing, the regex itself should use \s*
        const match = code.match(pattern);

        if (match) {
            return {
                isMatch: true,
                captured: match.groups // Returns undefined if no groups
            };
        }
        return { isMatch: false };
    } catch (e) {
        console.error("Invalid regex in solution:", solutionRegex);
        return { isMatch: false };
    }
};

/**
 * Interpolates a template string with values from the context.
 * Replaces {{key}} with context[key].
 */
export const interpolateSolution = (template: string, context: Record<string, string>): string => {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return context[key] || match; // Keep original if not found (or maybe empty string?)
    });
};
