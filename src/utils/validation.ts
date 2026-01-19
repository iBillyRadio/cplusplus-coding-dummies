export const normalizeCode = (code: string): string => {
    // 1. Remove single-line comments //...
    const noComments = code.replace(/\/\/.*$/gm, '');

    // 2. Tokenize by string literals
    // Regex matches double-quoted strings, handling escaped quotes
    const stringRegex = /"(?:[^"\\]|\\.)*"/g;

    // Split by strings, but capture the delimiters (the strings themselves)
    // validation logic:
    // We want " std::cout << " to become "std::cout<<"
    // But "Hello World" to stay "Hello World"

    const parts = noComments.split(stringRegex);
    const matches = noComments.match(stringRegex) || [];

    let result = '';

    for (let i = 0; i < parts.length; i++) {
        // Strip whitespace and 'std::' namespace from code part
        result += parts[i].replace(/\s+/g, '').replace(/std::/g, '');

        // Append the string literal if it exists (matches has one less item than parts usually, or same if ends with string)
        if (i < matches.length) {
            result += matches[i];
        }
    }

    return result;
};
