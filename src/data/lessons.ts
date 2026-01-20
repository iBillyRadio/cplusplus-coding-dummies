export type ModuleType = 'PG1' | 'PG2' | 'SYSTEMS' | 'DSA' | 'SE' | 'INTERVIEW';

export const MODULE_SKILLS: Record<ModuleType, string> = {
  'PG1': 'C++ Fundamentals',
  'PG2': 'Control Flow Mastery',
  'SYSTEMS': 'Memory Management',
  'DSA': 'Algorithmic Thinking',
  'SE': 'Clean Code Architecture',
  'INTERVIEW': 'Technical Interview Readiness'
};

export interface Stage {
  step: number;
  instruction: string;
  codeTemplate: string;
  solution: string | string[];
  hint: string;
  previewCode?: string;
}

export interface Lesson {
  id: string;
  title: string;
  module: ModuleType;
  concept: string;
  description: string;
  intro: {
    story: string;       // Modern/Layman explanation
    exampleCode: string; // Muscle memory code block
    efficiencyTip?: string; // Optional Big O / STL tip
  };
  variants?: Record<string, string[]>; // Context variables for randomization
  previewCode?: string; // Code snippet to demonstrate validity
  stages: Stage[];
}

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Output',
    module: 'PG1',
    concept: 'The Voice',
    description: "Computers are silent until we give them a voice. In C++, we use `cout` to speak.",
    intro: {
      story: "Imagine your program is a mute robot. It might be doing genius calculations, but unless it speaks, you'll never know. `cout` (Reference: Character Output) is how you hand the robot a microphone.",
      exampleCode: "cout << \"I can speak!\";",
      efficiencyTip: "Printing to screen is actually slow (relatively speaking)! In competitive programming, we use `\\n` instead of `endl` because `endl` forces a 'flush' which takes extra time."
    },
    previewCode: "cout << \"Hello World\";",
    stages: [
      {
        step: 1,
        instruction: "Make the computer say 'Hello World'.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Output: Hello World\n  \n  return 0;\n}",
        solution: ['cout << "Hello World";', 'cout << "Hello World" << endl;', 'cout << "Hello World\\n";'],
        hint: "Use `cout << \"Text\";`"
      },
      {
        step: 2,
        instruction: "Now print two things on separate lines: 'Hello' then 'C++'. Use `\\n` for a new line.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << \"Hello\\n\";\n  // Print C++ below\n  \n  return 0;\n}",
        solution: ['cout << "C++";', 'cout << "C++\\n";', 'cout << "C++ \\n";', 'cout << "C++" << endl;', 'cout << "C++ " << endl;'],
        hint: "Just like the first line, but with different text."
      },
      {
        step: 3,
        instruction: "Chain them together! Print 'Level' and 'Up' in one statement using `<<` twice.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Print LevelUp\n  \n  return 0;\n}",
        solution: ['cout << "Level" << "Up";', 'cout << "Level" << "Up" << endl;', 'cout << "Level" << "Up\\n";', 'cout << "LevelUp";'],
        hint: "Pattern: `cout << part1 << part2;`"
      }
    ]
  },
  {
    id: 'lesson-2',
    title: 'Variables',
    module: 'PG1',
    concept: 'The Box',
    description: "Variables are named storage containers. C++ is 'strongly typed', meaning specific boxes for specific shapes.",
    intro: {
      story: "You have a lot of stuff to store. You wouldn't put soup in a cardboard box, right? C++ is strict about this. `int` is for whole numbers, `double` is for decimals, and `string` is for text. Pick the right box for the job.",
      exampleCode: "int health = 100;\nstring hero = \"Geralt\";",
      efficiencyTip: "Choosing the smallest type used to matter for memory (like `short` vs `int`), but nowadays for standard logical variables, just use `int`. Processors are optimized for it."
    },
    variants: {
      targetType: ['int', 'double', 'string'],
    },
    previewCode: "int score = 10;\ndouble price = 4.99;\nstring name = \"Player\";",
    stages: [
      {
        step: 1,
        instruction: "Create a `{{targetType}}` variable with **any name you want** and set it to an initial value.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Create {{targetType}} variable\n  \n  return 0;\n}",
        // Regex to match: type name = value;
        // Allows for int x=10; double y = 5.5; string s = "Hello";
        // Captures 'varName'
        // We match type exactly, but allow any value (numeric or string)
        solution: 'regex:{{targetType}}\\s+(?<varName>\\w+)\\s*=\\s*(?:[\\d\\.]+|"[^"]*");',
        hint: "Follow the pattern: `{{targetType}} name = value;` e.g. `{{targetType}} myVar = ...;`"
      },
      {
        step: 2,
        instruction: "Now update your `{{targetType}}` variable `{{varName}}` to be a new value.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  {{targetType}} {{varName}} = ...;\n  // Update {{varName}}\n  \n  return 0;\n}",
        // Context validation: we expect the exact varName they used before.
        // We accept different values based on type? 
        // For simplicity, let's just use a regex that accepts any value assignment to that specific varName (numeric or string literal).
        // Matches: name = 50;  or name = "Updated";
        solution: 'regex:(?:context:){{varName}}\\s*=\\s*(?:[\\d\\.]+|"[^"]*");',
        hint: "Just use `{{varName}} = new_value;`."
      },
      {
        step: 3,
        instruction: "Output your variable `{{varName}}` using `cout`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Print {{varName}}\n  \n  return 0;\n}",
        solution: 'context:cout << {{varName}};',
        hint: "`cout << {{varName}};`"
      }
    ]
  },
  {
    id: 'lesson-input',
    title: 'Input',
    module: 'PG1',
    concept: 'The Ear',
    description: "Programs need to listen. `cin` allows us to take input from the keyboard to variables.",
    intro: {
      story: "A conversation is a two-way street. `cin` (Character Input) is the ear of your program. It pauses the Matrix and waits for the user to type something. The arrows `>>` point WHERE the data goes.",
      exampleCode: "int age;\ncin >> age;",
      efficiencyTip: "When taking huge amounts of input (like 100,000 numbers), turn off 'unsync with stdio' to make C++ input faster than Python or Java."
    },
    previewCode: "int age;\ncin >> age;",
    stages: [
      {
        step: 1,
        instruction: "Read a number into the variable `score`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int score;\n  // Read input into score\n  \n  return 0;\n}",
        solution: ['cin >> score;', 'cin >>score;'],
        hint: "Use `cin >> variableName;`"
      },
      {
        step: 2,
        instruction: "Multiple Inputs: Read `width` then `height`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int width; int height;\n  // Read width then height\n  \n  return 0;\n}",
        solution: ['cin >> width >> height;', 'cin >> width; cin >> height;', 'cin>>width>>height;'],
        hint: "Chain them: `cin >> a >> b;`"
      },
      {
        step: 3,
        instruction: "Interactive: Print 'Enter age: ', then read `age`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int age;\n  // Print prompt then read\n  \n  return 0;\n}",
        solution: ['cout << "Enter age: "; cin >> age;', 'cout << "Enter age: " << endl; cin >> age;'],
        hint: "First `cout`, then `cin`."
      }
    ]
  },
  {
    id: 'lesson-3',
    title: 'Conditionals',
    module: 'PG1',
    concept: 'The Fork',
    description: "Data comes down the wire and logic decides where it goes.",
    intro: {
      story: "Life is full of choices. 'If' I have money, I buy pizza. 'Else', I eat leftovers. Your code needs to make these same decisions. We use `if`, `else`, and logic gates like `&&` (AND) and `||` (OR).",
      exampleCode: "if (hasKey) {\n  openDoor();\n} else {\n  cout << \"Locked\";\n}",
      efficiencyTip: "Order matters! In `if (A && B)`, if A is false, the computer doesn't even bother checking B. Put the cheapest or mostly-likely-to-fail check first."
    },
    previewCode: "if (score > 100) {\n  cout << \"Win\";\n} else {\n  cout << \"Try Again\";\n}",
    stages: [
      {
        step: 1,
        instruction: "If `health` is 0, print 'Game Over'.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int health = 0;\n  // Check health\n  \n  return 0;\n}",
        solution: 'regex:if\\s*\\(\\s*health\\s*==\\s*0\\s*\\)\\s*\\{?\\s*cout\\s*<<\\s*"Game Over"\\s*;?\\s*\\}?',
        hint: "Comparison uses `==`. `if (health == 0) { ... }`"
      },
      {
        step: 2,
        instruction: "Else logic: If `coins` is greater than 10, print 'Rich', otherwise print 'Poor'.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int coins = 5;\n  // Logical check\n  \n  return 0;\n}",
        solution: 'regex:if\\s*\\(\\s*coins\\s*>\\s*10\\s*\\)\\s*\\{?\\s*cout\\s*<<\\s*"Rich"\\s*;?\\s*\\}?\\s*else\\s*\\{?\\s*cout\\s*<<\\s*"Poor"\\s*;?\\s*\\}?',
        hint: "`if (cond) { } else { }`"
      },
      {
        step: 3,
        instruction: "Compound Logic: Check if `level` > 5 AND `key` is true. Use `&&`. If so, print 'Enter'.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int level = 10; bool key = true;\n  // Check both\n  \n  return 0;\n}",
        solution: 'regex:if\\s*\\(\\s*((level\\s*>\\s*5\\s*&&\\s*key)|(key\\s*&&\\s*level\\s*>\\s*5))\\s*\\)\\s*\\{?\\s*cout\\s*<<\\s*"Enter"\\s*;?\\s*\\}?',
        hint: "`if (A && B) { ... }`"
      }
    ]
  },
  {
    id: 'lesson-4',
    title: 'Loops',
    module: 'PG1',
    concept: 'The Cycle',
    description: "Algorithms often require visiting every item or repeating until done.",
    intro: {
      story: "Don't repeat yourself (DRY). If you need to do something 100 times, don't write 100 lines of code. Write a loop. `for` loops are for when you know how many times, `while` loops are for when you don't.",
      exampleCode: "for(int i=0; i<5; i++) {\n  cout << \"Repetition is key\";\n}",
      efficiencyTip: "Prefix increment `++i` is slightly preferred over `i++` in complex C++ iterators, but for simple integers, the compiler optimizes them to be identical."
    },
    previewCode: "for (int i = 0; i < 5; i++) {\n  cout << i;\n}",
    stages: [
      {
        step: 1,
        instruction: "Write a standard `for` loop from 0 to 9 (10 times). Print `i`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Loop 0 to 9\n  \n  return 0;\n}",
        solution: 'regex:for\\s*\\(\\s*int\\s+(\\w+)\\s*=\\s*0\\s*;\\s*\\1\\s*<\\s*10\\s*;\\s*\\1\\+\\+\\s*\\)\\s*\\{\\s*cout\\s*<<\\s*\\1\\s*;\\s*\\}',
        hint: "`for (int i = 0; i < N; i++)`"
      },
      {
        step: 2,
        instruction: "Accumulator Pattern: Sum numbers 1 to 5 using a loop.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int sum = 0;\n  for (int i = 1; i <= 5; i++) {\n     // Add i to sum\n  }\n  cout << sum;\n  return 0;\n}",
        solution: 'regex:sum\\s*\\+=\\s*(\\w+)\\s*;|sum\\s*=\\s*sum\\s*\\+\\s*(\\w+)\\s*;',
        hint: "Short for `sum = sum + i;`"
      },
      {
        step: 3,
        instruction: "While Loop: Run while `fuel > 0`. Inside, print the **variable** `fuel` (no quotes!), then decrease `fuel` by 1.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int fuel = 10;\n  while (fuel > 0) {\n     // 1. Print variable 'fuel' (e.g. cout << fuel)\n     // 2. Decrement 'fuel'\n  }\n  return 0;\n}",
        solution: 'regex:cout\\s*<<\\s*fuel\\s*;\\s*(fuel\\s*--|--\\s*fuel|fuel\\s*-=\\s*1|fuel\\s*=\\s*fuel\\s*-\\s*1)\\s*;',
        hint: "Make sure you don't use quotes around `fuel`! Using quotes prints the word, not the number."
      }
    ]
  },
  {
    id: 'lesson-control-2',
    title: 'Advanced Control',
    module: 'PG1',
    concept: 'The Switch',
    description: "Handling complex choices and guaranteed execution loops.",
    intro: {
      story: "Sometimes an `if/else` chain gets too messy. A `switch` is like a vending machine selection panel—clean and direct. And `do-while`? That's for when you definitely want to do something at least once, like checking a password.",
      exampleCode: "switch(direction) {\n  case 1: goNorth(); break;\n  case 2: goSouth(); break;\n}",
    },
    previewCode: "switch(choice) {\n  case 1: play(); break;\n  case 2: quit(); break;\n}",
    stages: [
      {
        step: 1,
        instruction: "Switch Statement: Check `day`. Case 1 prints \"Mon\", Case 2 prints \"Tue\".",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int day = 1;\n  switch (day) {\n    // Case 1 and 2\n  }\n  return 0;\n}",
        solution: [
          'case 1: cout << "Mon"; break; case 2: cout << "Tue"; break;',
          'case 1: cout << "Mon"; break;\n    case 2: cout << "Tue"; break;'
        ],
        hint: "Don't forget `break;` after each case!"
      },
      {
        step: 2,
        instruction: "Do-While: Inside the `do { ... }` block, print the **variable** `retry`, then decrement it. The condition `while(retry > 0);` checks if we should go again.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int retry = 3;\n  do {\n    // 1. Print variable 'retry'\n    // 2. Decrement 'retry'\n  } while (retry > 0);\n  \n  return 0;\n}",
        solution: 'cout << retry; retry--;',
        hint: "Remember: `cout << retry` prints the number. `cout << \"retry\"` prints the word. We want the number!"
      },
      {
        step: 3,
        instruction: "Break: Loop 0 to 10, but `break` if `i` is 5 (don't print 5).",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  for (int i = 0; i < 10; i++) {\n    // if i is 5, break\n    cout << i;\n  }\n  return 0;\n}",
        solution: [
          'if (i == 5) break;',
          'if (i == 5) { break; }'
        ],
        hint: "Place the check before the print."
      }
    ]
  },
  {
    id: 'lesson-5',
    title: 'Vectors',
    module: 'PG1',
    concept: 'The Shelf',
    description: "Resizing arrays. Essential for LeetCode dynamic problems.",
    intro: {
      story: "Old-school arrays are rigid; you set the size and you're stuck. `std::vector` is a magic backpack that grows as you shove more stuff into it. It's the most used container in modern C++.",
      exampleCode: "vector<int> nums = {1, 2, 3};\nnums.push_back(4); // Now it has 4 elements!",
      efficiencyTip: "Vectors prefer to be contiguous in memory. This makes them CPU cache-friendly and extremely fast to iterate over compared to lists."
    },
    previewCode: "vector<int> nums = {1, 2, 3};\ncout << nums[0];",
    stages: [
      {
        step: 1,
        instruction: "Create an empty vector of ints called `nums` and add 100 to it.",
        codeTemplate: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n  // Setup vector\n  \n  return 0;\n}",
        solution: 'vector<int> nums; nums.push_back(100);',
        hint: "`push_back(value)` adds to the end.",
        previewCode: "vector<int> v; v.push_back(5);"
      },
      {
        step: 2,
        instruction: "Access: Print the FIRST and LAST element of `prices`.",
        codeTemplate: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n  vector<int> prices = {10, 50, 90};\n  // Print first and last\n  return 0;\n}",
        solution: [
          'cout << prices[0] << prices[2];',
          'cout << prices[0] << prices[2] << endl;',
          'cout << prices[0] << " " << prices[2];'
        ],
        hint: "Indices start at 0. Size is 3, so last is 2.",
        previewCode: "cout << v[0];"
      },
      {
        step: 3,
        instruction: "Iteration: Loop through `data` and print each element.",
        codeTemplate: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n  vector<int> data = {1,2,3,4};\n  for (int i = 0; i < data.size(); i++) {\n    // Print data[i]\n  }\n  return 0;\n}",
        solution: 'cout << data[i];',
        hint: "Just access the element using the loop variable `i`.",
        previewCode: "cout << v[i];"
      }
    ]
  },
  {
    id: 'lesson-6',
    title: 'Functions',
    module: 'PG1',
    concept: 'The Recipe',
    description: "Breaking big problems into small, testable chunks.",
    intro: {
      story: "A 1000-line main function is a nightmare. Functions let you package code into reusable 'spells'. You define the spell once, give it a name, and cast it whenever you need it.",
      exampleCode: "int heal(int hp) {\n  return hp + 10;\n}\n\n// Usage: hp = heal(hp);",
    },
    previewCode: "void sayHi() {\n  cout << \"Hi\";\n}\nusing namespace std;\n\nint main() {\n  sayHi();\n  return 0;\n}",
    stages: [
      {
        step: 1,
        instruction: "Structure: Define a function named `sayHi` before `main`. Inside it, print \"Hi\". Then, call `sayHi();` inside `main`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\n// 1. Define the function\nvoid sayHi() {\n  // Print \"Hi\"\n}\n\nint main() {\n  // 2. Call the function\n  \n  return 0;\n}",
        solution: 'void sayHi() { cout << "Hi"; } int main() { sayHi(); return 0; }',
        hint: "Inside main, just type `sayHi();`.",
        previewCode: "void f() { cout<<\"A\"; } f();"
      },
      {
        step: 2,
        instruction: "Parameters: Complete the `add` function to return `include a + b`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint add(int a, int b) {\n  // Return the sum\n}\n\nint main() {\n  cout << add(5, 10);\n  return 0;\n}",
        solution: 'regex:int\\s+add\\s*\\(\\s*int\\s+(\\w+)\\s*,\\s*int\\s+(\\w+)\\s*\\)\\s*\\{\\s*return\\s+\\1\\s*\\+\\s*\\2\\s*;\\s*\\}',
        hint: "Use `return a + b;`",
        previewCode: "int sum(int a, int b) { return a+b; }"
      },
      {
        step: 3,
        instruction: "Logic in Func: `isEven` returns true if number % 2 is 0.",
        codeTemplate: "#include <iostream>\n\nbool isEven(int n) {\n  // Logic\n}\nusing namespace std;\n\nint main() {\n  return 0;\n}",
        solution: [
          'return n % 2 == 0;',
          'return (n % 2 == 0);',
          'if (n % 2 == 0) return true; else return false;',
          'if (n % 2 == 0) { return true; } else { return false; }'
        ],
        hint: "Modulo operator `%` gives the remainder.",
        previewCode: "return n % 2 == 0;"
      }
    ]
  },
  {
    id: 'lesson-functions-2',
    title: 'Advanced Functions',
    module: 'PG1',
    concept: 'The Link',
    description: "Scope, References, and Globals. Control exactly what your function can see and touch.",
    intro: {
      story: "Variables have a 'territory'. A local variable lives in its function and dies when the function ends. A Reference (`&`) is a tunnel to a variable outside the function, letting you change the original.",
      exampleCode: "void swap(int& a, int& b) {\n  int t = a; a = b; b = t;\n}",
    },
    previewCode: "void update(int &score) {\n  score += 10; // Changes original\n}",
    stages: [
      {
        step: 1,
        instruction: "References: Define `doublePoints` that takes `int &score` and multiplies it by 2.",
        codeTemplate: "#include <iostream>\n\n// void doublePoints(int &score) { ... }\nusing namespace std;\n\nint main() {\n  int s = 10;\n  // call it\n  return 0;\n}",
        solution: 'void doublePoints(int &score) { score *= 2; }',
        hint: "Use `&` explicitly in the argument: `int &name`."
      },
      {
        step: 2,
        instruction: "Scope: Access the global `MAX_SCORE` inside `check`. Do not redeclare it.",
        codeTemplate: "#include <iostream>\n\nint MAX_SCORE = 100;\n\nvoid check(int score) {\n  // If score > MAX_SCORE print Win\n}\nusing namespace std;\n\nint main() { return 0; }",
        solution: ['if (score > MAX_SCORE) { cout << "Win"; }', 'if (score > MAX_SCORE) cout << "Win";'],
        hint: "Global variables are visible everywhere."
      },
      {
        step: 3,
        instruction: "Const Ref: Create `printName` taking `const string &name`. Print it.",
        codeTemplate: "#include <iostream>\n#include <string>\n\n// Func taking const ref\nusing namespace std;\n\nint main() { return 0; }",
        solution: ['void printName(const string &name) { cout << name; }', 'void printName(const string& name) { cout << name; }'],
        hint: "`const Type &name` prevents copying and modifying."
      }
    ]
  },
  {
    id: 'lesson-7',
    title: 'Strings',
    module: 'PG1',
    concept: 'The Chain',
    description: "Text processing is the core of many algorithms(Palindromes, Anagrams).",
    intro: {
      story: "Strings are just fancy arrays of characters. They can be added together (`+`), sliced (`substr`), and searched. Mastering strings is mastering communication.",
      exampleCode: "string s = \"Loading...\";\ns += \" Done\";",
    },
    previewCode: "string s = \"Hello\";\ncout << s.length();",
    stages: [
      {
        step: 1,
        instruction: "Concatenation: Create a new string `s` that joins `first` and `last` with a space.",
        codeTemplate: "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string first = \"John\";\n  string last = \"Doe\";\n  // Combine them\n  return 0;\n}",
        solution: 'regex:string\\s+\\w+\\s*=\\s*first\\s*\\+\\s*" "\\s*\\+\\s*last\\s*;',
        hint: "Create a new string variable. Example: `string s = first + \" \" + last;`",
        previewCode: "string s = a + \" \" + b;"
      },
      {
        step: 2,
        instruction: "Access: Print the first character of the string `s`.",
        codeTemplate: "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string s = \"Code\";\n  // Print first char\n  return 0;\n}",
        solution: 'cout << s[0];',
        hint: "Strings act like arrays of characters.",
        previewCode: "char c = s[0];"
      },
      {
        step: 3,
        instruction: "Substrings: Create a string `sub` that is just \"World\" from \"Hello World\".",
        codeTemplate: "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string text = \"Hello World\";\n  // substr(start, length)\n  return 0;\n}",
        solution: 'string sub = text.substr(6, 5);',
        hint: "`substr(index, length)`. 'W' is at index 6.",
        previewCode: "s.substr(0, 5);"
      }
    ]
  },
  {
    id: 'lesson-8',
    title: 'Maps',
    module: 'DSA',
    concept: 'The Dictionary',
    description: "O(1) lookups. The secret weapon for 50% of interview questions (Two Sum, Frequency Count).",
    intro: {
      story: "A dictionary connects a word (Key) to a definition (Value). A Map does exactly the same. You give it a magic key, and it instantly gives you the stored value, no matter how much data you have.",
      exampleCode: "map<string, int> scores;\nscores[\"Player1\"] = 9000;",
      efficiencyTip: "`unordered_map` is O(1) mostly, while `map` is O(log n). If order doesn't matter, use `unordered_map` for speed."
    },
    previewCode: "map<string, int> scores;\nscores[\"Player1\"] = 100;",
    stages: [
      {
        step: 1,
        instruction: "Setup: Create a map `counts` mapping `string` to `int`.",
        codeTemplate: "#include <iostream>\n#include <map>\nusing namespace std;\n\nint main() {\n  // Define map\n  return 0;\n}",
        solution: 'map<string, int> counts;',
        hint: "`map<Key, Value> name;`",
        previewCode: "map<string, int> m;"
      },
      {
        step: 2,
        instruction: "Insert/Update: Set the count for \"apple\" to 1, then increment it.",
        codeTemplate: "#include <iostream>\n#include <map>\nusing namespace std;\n\nint main() {\n  map<string, int> counts;\n  // Set apple to 1, then add 1\n  return 0;\n}",
        solution: [
          'counts["apple"] = 1; counts["apple"]++;',
          'counts["apple"] = 1; ++counts["apple"];',
          'counts["apple"] = 1; counts["apple"] += 1;',
          'counts["apple"] = 1; counts["apple"] = counts["apple"] + 1;'
        ],
        hint: "Use `[]` operator.",
        previewCode: "m[\"key\"] = 5;"
      },
      {
        step: 3,
        instruction: "Check Exists: Check if \"banana\" is in the map using `.count()`.",
        codeTemplate: "#include <iostream>\n#include <map>\nusing namespace std;\n\nint main() {\n  map<string, int> counts;\n  // if banana is in map...\n  return 0;\n}",
        solution: 'if (counts.count("banana") > 0)',
        hint: "`.count(key)` returns 1 if found, 0 if not.",
        previewCode: "if (m.count(\"k\"))"
      }
    ]
  },
  {
    id: 'lesson-structs',
    title: 'Structs',
    module: 'PG1',
    concept: 'The Bundle',
    description: "Grouping related variables together. The precursor to Classes.",
    intro: {
      story: "Instead of carrying a sword, a shield, and a potion separately, put them all in an 'Inventory' bag. A Struct groups variables under one name to keep things organized.",
      exampleCode: "struct Player {\n  string name;\n  int hp;\n};",
      efficiencyTip: "Structs are just classes where everything is 'public' by default."
    },
    previewCode: "struct Point {\n  int x;\n  int y;\n};",
    stages: [
      {
        step: 1,
        instruction: "Define: Create a struct named `Stats` with `int health` and `int mana`.",
        codeTemplate: "#include <iostream>\n\n// struct Stats\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'struct Stats { int health; int mana; };',
        hint: "Ends with a semicolon: `struct Name { ... };`",
        previewCode: "struct Point { int x; };"
      },
      {
        step: 2,
        instruction: "Use: Create a `Stats` variable named `player` and set `health` to 100.",
        codeTemplate: "#include <iostream>\n\nstruct Stats { int health; int mana; };\nusing namespace std;\n\nint main() {\n  // Create player, set health\n  \n  return 0;\n}",
        solution: [
          'Stats player; player.health = 100;',
          'Stats player; player.health=100;'
        ],
        hint: "Use dot operator: `name.member = value;`",
        previewCode: "Point p; p.x = 10;"
      },
      {
        step: 3,
        instruction: "Init: definition and initialization in one line. `Stats enemy = {50, 10};`",
        codeTemplate: "#include <iostream>\n\nstruct Stats { int health; int mana; };\nusing namespace std;\n\nint main() {\n  // Create enemy with 50 health, 10 mana\n  \n  return 0;\n}",
        solution: 'Stats enemy = {50, 10};',
        hint: "Use curly braces: `{val1, val2}`.",
        previewCode: "Point p = {1, 2};"
      }
    ]
  },
  {
    id: 'lesson-9',
    title: 'Classes',
    module: 'PG2',
    concept: 'The Blueprint',
    description: "Custom data structures. Essential for Linked Lists and Trees.",
    intro: {
      story: "Structs are just for data. Classes are for data + behavior. A 'Car' class doesn't just have 'fuel', it also has 'drive()'. This is the blueprint for creating objects.",
      exampleCode: "class Car {\n  void drive() {\n    cout << \"Vroom\";\n  }\n};",
      efficiencyTip: "Keep your data private and your functions public. This is called Encapsulation."
    },
    previewCode: "class Cat {\npublic:\n  void meow() {\n    cout << \"Meow\";\n  }\n};",
    stages: [
      {
        step: 1,
        instruction: "Define: Create a class `Node` with one integer `val`.",
        codeTemplate: "#include <iostream>\n\n// class Node\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'class Node { public: int val; };',
        hint: "Default access is private, so use `public:`.",
        previewCode: "class Box { public: int size; };"
      },
      {
        step: 2,
        instruction: "Constructor: Add a constructor that takes `v` and sets `val`.",
        codeTemplate: "#include <iostream>\n\nclass Node {\npublic:\n  int val;\n  // Constructor\n};\nusing namespace std;\n\nint main() { return 0; }",
        solution: ['Node(int v) { val = v; }', 'Node(int v) : val(v) {}'],
        hint: "Constructor has the same name as the class.",
        previewCode: "Box(int s) { size = s; }"
      },
      {
        step: 3,
        instruction: "Instantiation: Create a Node variable named `head` with value 5.",
        codeTemplate: "#include <iostream>\n\nclass Node { public: Node(int v) {} };\nusing namespace std;\n\nint main() {\n  // Create head\n  return 0;\n}",
        solution: 'Node head(5);',
        hint: "Like a function call: `Type name(arg);`",
        previewCode: "Box b(10);"
      }
    ]
  },
  {
    id: 'lesson-pointers',
    title: 'Pointers',
    module: 'PG2',
    concept: 'The Compass',
    description: "Variables store data, pointers store where that data lives.",
    intro: {
      story: "A pointer is not the house; it's the address of the house written on a piece of paper. If you follow the address, you find the house. Using pointers, we can share massive objects without copying them.",
      exampleCode: "int money = 100;\nint* ptr = &money;\n*ptr = 200; // Changes money to 200",
      efficiencyTip: "Dereferencing a pointer is fast, but chasing a long chain of pointers (pointer chasing) can cause cache misses."
    },
    previewCode: "int x = 10;\nint* ptr = &x;\n*ptr = 20;",
    stages: [
      {
        step: 1,
        instruction: "Address Of: Print the memory address of `score` using `&`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int score = 10;\n  // Print address\n  \n  return 0;\n}",
        solution: 'cout << &score;',
        hint: "`&variable` gives the address."
      },
      {
        step: 2,
        instruction: "Pointer: Create a pointer `p` that points to `score`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int score = 10;\n  // int* p = ...\n  \n  return 0;\n}",
        solution: 'int* p = &score;',
        hint: "`Type* name = &variable;`"
      },
      {
        step: 3,
        instruction: "Dereference: Change the value of `score` to 50 using only `p`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int score = 10;\n  int* p = &score;\n  // Change score via p\n  \n  return 0;\n}",
        solution: '*p = 50;',
        hint: "`*p` accesses the value pointed to."
      }
    ]
  },
  {
    id: 'lesson-memory',
    title: 'Dynamic Memory',
    module: 'PG2',
    concept: 'The Heap',
    description: "Allocating memory manually allows for flexible storage that outlives functions.",
    intro: {
      story: "Sometimes you don't know how much memory you need until the program runs. The 'Heap' is a giant free store of memory. You ask for a chunk (`new`), use it, and then give it back (`delete`).",
      exampleCode: "int* bigData = new int[1000];\n// ... use it ...\ndelete[] bigData;",
      efficiencyTip: "Forgetting to `delete` causes Memory Leaks. Modern C++ uses `unique_ptr` and `shared_ptr` to handle this automatically."
    },
    previewCode: "int* p = new int(5);\ndelete p;",
    stages: [
      {
        step: 1,
        instruction: "Allocate: Create an integer on the heap using `new` and store it in `p`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // int* p = ...\n  \n  return 0;\n}",
        solution: 'int* p = new int;',
        hint: "`new Type;` returns a pointer."
      },
      {
        step: 2,
        instruction: "Assign & Clean: Set value to 100, then delete it.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int* p = new int;\n  // *p = 100\n  // delete\n  return 0;\n}",
        solution: '*p = 100; delete p;',
        hint: "Don't forget to `delete p;` to prevent leaks."
      },
      {
        step: 3,
        instruction: "Arrays: Allocate an array of 10 ints, then `delete[]` it.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Create arr\n  // Delete arr\n  return 0;\n}",
        solution: [
          'int* arr = new int[10]; delete[] arr;',
          'int* arr = new int[10]; delete [] arr;'
        ],
        hint: "`delete[] name;` forces array deletion."
      }
    ]
  },
  {
    id: 'lesson-classes-2',
    title: 'Encapsulation',
    module: 'PG2',
    concept: 'The Vault',
    description: "Protecting your data. Use getters, setters, and destructors.",
    intro: {
      story: "You wouldn't let a stranger reach into your wallet. You hand them cash. Classes are similar: variables are private (the wallet), and methods are public (handing cash). This protects data from being messed up.",
      exampleCode: "class Bank {\n  private: int balance;\n  public: void deposit(int amt) {\n    balance += amt;\n  }\n};",
    },

    previewCode: "class Bank {\nprivate:\n  int balance;\npublic:\n  int getBalance() { return balance; }\n};",
    stages: [
      {
        step: 1,
        instruction: "Private: Make `secret` private and `reveal` public.",
        codeTemplate: "#include <iostream>\n\nclass Box {\n  // secret (int)\npublic:\n  // reveal (func prints secret)\n};\nusing namespace std;\n\nint main() { return 0; }",
        solution: [
          'private: int secret; public: void reveal() { cout << secret; }',
          'int secret; public: void reveal() { cout << secret; }'
        ],
        hint: "Members are private by default in `class`. Explicitly use `private:` if you want."
      },
      {
        step: 2,
        instruction: "Getter/Setter: Create `setAge(int a)` and `getAge()` for private `age`.",
        codeTemplate: "#include <iostream>\n\nclass Person {\n  int age;\npublic:\n  // logic\n};\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'void setAge(int a) { age = a; } int getAge() { return age; }',
        hint: "Setter returns void, Getter returns int."
      },
      {
        step: 3,
        instruction: "Destructor: Define a destructor `~Log()` that prints \"End\".",
        codeTemplate: "#include <iostream>\n\nclass Log {\npublic:\n  // Destructor\n};\nusing namespace std;\n\nint main() { return 0; }",
        solution: '~Log() { cout << "End"; }',
        hint: "Destructor name is `~ClassName`."
      }
    ]
  },
  {
    id: 'lesson-inheritance',
    title: 'Inheritance',
    module: 'PG2',
    concept: 'The Hierarchy',
    description: "Don't reinvent the wheel. Extend existing classes to build powerful hierarchies.",
    intro: {
      story: "A 'Dog' IS-A 'Animal'. It gets all the Animal features for free, but adds barking. Inheritance lets you build on top of what exists without copy-pasting code.",
      exampleCode: "class Dog : public Animal {\n  void speak() override {\n    cout << \"Woof\";\n  }\n};",
      efficiencyTip: "Virtual functions add a tiny bit of overhead (vtable lookup) but are essential for polymorphism."
    },

    previewCode: "class Dog : public Animal {\n  void speak() override {\n    cout << \"Woof\";\n  }\n};",
    stages: [
      {
        step: 1,
        instruction: "Inherit: Create class `Dog` that inherits from `Animal`.",
        codeTemplate: "#include <iostream>\n\nclass Animal {};\n// class Dog ...\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'class Dog : public Animal {};',
        hint: "`class Derived : public Base {}`"
      },
      {
        step: 2,
        instruction: "Virtual: Add `virtual void speak()` to `Animal` that prints \"Noise\".",
        codeTemplate: "#include <iostream>\n\nclass Animal {\npublic:\n  // Add virtual speak\n};\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'virtual void speak() { cout << "Noise"; }',
        hint: "Use the `virtual` keyword."
      },
      {
        step: 3,
        instruction: "Override: In `Dog`, override `speak` to print \"Woof\".",
        codeTemplate: "#include <iostream>\n\nclass Animal { public: virtual void speak() {} };\n\nclass Dog : public Animal {\npublic:\n  // Override speak\n};\nusing namespace std;\n\nint main() { return 0; }",
        solution: ['void speak() override { cout << "Woof"; }', 'void speak() { cout << "Woof"; }'],
        hint: "Use `override` for clarity."
      }
    ]
  },
  {
    id: 'lesson-abstract',
    title: 'Abstract Classes',
    module: 'SYSTEMS',
    concept: 'The Contract',

    description: "Interfaces allow us to define WHAT something does without defining HOW. Essential for large systems.",
    intro: {
      story: "A 'Shape' is an abstract idea. You can't draw just 'a Shape'; you draw a Circle or a Square. Abstract classes define the required methods (the contract), but leave the details to the specific children.",
      exampleCode: "class Shape {\n  virtual void draw() = 0; // Pure Virtual\n};",
    },
    previewCode: "class Shape {\n  virtual void draw() = 0;\n};",
    stages: [
      {
        step: 1,
        instruction: "Pure Virtual: Make `draw` pure virtual in `Shape` (assign it to 0).",
        codeTemplate: "#include <iostream>\n\nclass Shape {\npublic:\n  // virtual void draw ...\n};\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'virtual void draw() = 0;',
        hint: "`virtual void name() = 0;`"
      },
      {
        step: 2,
        instruction: "Implement: Create `Circle` that inherits `Shape` and implements `draw` to print \"O\".",
        codeTemplate: "#include <iostream>\n\nclass Shape { public: virtual void draw() = 0; };\n// class Circle ...\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'class Circle : public Shape { public: void draw() override { cout << "O"; } };',
        hint: "You MUST implement all pure virtual functions."
      },
      {
        step: 3,
        instruction: "Polymorphism: Create a `Shape*` named `s` that points to a new `Circle`.",
        codeTemplate: "#include <iostream>\n\nclass Shape { public: virtual void draw() = 0; };\nclass Circle : public Shape { public: void draw() override {} };\nusing namespace std;\n\nint main() {\n  // Shape* s = ...\n  return 0;\n}",
        solution: 'Shape* s = new Circle();',
        hint: "You can't make a `Shape` directly, but you can have a pointer to it."
      }
    ]
  },
  {
    id: 'lesson-errors',
    title: 'Error Handling',
    module: 'SYSTEMS',
    concept: 'The Safety Net',
    description: "Things break. Good robust code anticipates failure and handles it gracefully.",
    intro: {
      story: "Sometimes things go wrong—files don't exist, internet goes down. Exceptions allow your program to scream 'HELP!' and jump to a safety net (`catch` block) instead of crashing immediately.",
      exampleCode: "try {\n  openFile(\"ghost.txt\");\n} catch (exception& e) {\n  cout << \"File needed!\";\n}",
    },
    previewCode: "try {\n  if (fail) throw 500;\n} catch (int e) {\n  cout << \"Error \" << e;\n}",
    stages: [
      {
        step: 1,
        instruction: "Throw: If `input` is negative, throw the integer -1.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int input = -5;\n  // Check and throw\n  return 0;\n}",
        solution: 'if (input < 0) throw -1;',
        hint: "`throw value;`"
      },
      {
        step: 2,
        instruction: "Catch: Wrap the code in a `try` block and `catch (int e)` to print \"Error\".",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // try { throw 1; } catch... \n  return 0;\n}",
        solution: 'try { throw 1; } catch (int e) { cout << "Error"; }',
        hint: "`try { ... } catch (Type name) { ... }`"
      },
      {
        step: 3,
        instruction: "Standard Exception: Catch `exception` variable `e` and print `e.what()`.",
        codeTemplate: "#include <iostream>\n#include <exception>\nusing namespace std;\n\nint main() {\n  try {\n    throw runtime_error(\"Fail\");\n  } // catch here\n  return 0;\n}",
        solution: 'catch (exception& e) { cout << e.what(); }',
        hint: "Catch by reference: `exception& e`"
      }
    ]
  },
  {
    id: 'lesson-memory-sys',
    title: 'Memory Model',
    module: 'SYSTEMS',
    concept: 'The Stack & Heap',
    description: "Understanding where variables live is crucial for performance and avoiding crashes.",
    intro: {
      story: "The Stack is like a pile of plates—fast, easy, but small. The Heap is like a giant warehouse—huge, but you have to drive there to get stuff. Local variables go on the Stack; `new` goes on the Heap.",
      exampleCode: "int stackVar = 10; // Fast\nint* heapVar = new int(10); // Manual",
    },
    previewCode: "int stackVar = 10;\nint* heapVar = new int(10);",
    stages: [
      {
        step: 1,
        instruction: "Stack: Create an array `arr` of size 5. This lives on the Stack.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Create array size 5\n  return 0;\n}",
        solution: 'int arr[5];',
        hint: "Fixed size arrays go on the stack: `int name[Size];`"
      },
      {
        step: 2,
        instruction: "Heap: Create an array `arr` of size 5 using `new`. This lives on the Heap.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  // Create heap array\n  return 0;\n}",
        solution: 'int* arr = new int[5];',
        hint: "`new type[Size]`"
      },
      {
        step: 3,
        instruction: "Stack Frame: Call `func`. Notice `x` is destroyed when `func` returns.",
        codeTemplate: "#include <iostream>\n\nvoid func() {\n  int x = 10;\n  cout << x;\n}\nusing namespace std;\n\nint main() {\n  // Call func\n  return 0;\n}",
        solution: 'func();',
        hint: "Just call it."
      }
    ]
  },
  {
    id: 'lesson-file-io',
    title: 'File I/O',
    module: 'SYSTEMS',
    concept: 'Persistence',
    description: "Data lost when the program ends is useless. Save it to files.",
    intro: {
      story: "RAM is amnesiac; it forgets everything when the power goes out. Files are the long-term memory. Reading and writing text files is how you make your data survive a reboot.",
      exampleCode: "ofstream save(\"game.txt\");\nsave << \"Score: 100\";",
    },
    previewCode: "ofstream file(\"save.txt\");\nfile << \"Game Saved\";",
    stages: [
      {
        step: 1,
        instruction: "Write: Create `ofstream` named `file` for \"data.txt\".",
        codeTemplate: "#include <iostream>\n#include <fstream>\nusing namespace std;\n\nint main() {\n  // Open file\n  return 0;\n}",
        solution: 'ofstream file("data.txt");',
        hint: "`ofstream name(\"filename\");`"
      },
      {
        step: 2,
        instruction: "Output: Write \"Hello\" to the file using `<<`.",
        codeTemplate: "#include <iostream>\n#include <fstream>\nusing namespace std;\n\nint main() {\n  ofstream file(\"data.txt\");\n  // Write string\n  return 0;\n}",
        solution: 'file << "Hello";',
        hint: "Just like cout: `file << value;`"
      },
      {
        step: 3,
        instruction: "Read: Create `ifstream` named `in` for \"data.txt\" and read into `s`.",
        codeTemplate: "#include <iostream>\n#include <fstream>\n#include <string>\nusing namespace std;\n\nint main() {\n  string s;\n  // Open input file\n  // Read into s\n  return 0;\n}",
        solution: [
          'ifstream in("data.txt"); in >> s;',
          'ifstream in("data.txt"); getline(in, s);'
        ],
        hint: "`ifstream` for input. `in >> s`."
      }
    ]
  },
  {
    id: 'lesson-big-o',
    title: 'Big O Complexity',
    module: 'DSA',
    concept: 'Efficiency',
    description: "Measuring how code slows down as data grows. O(1) is instant, O(n) is linear.",
    intro: {
      story: "If you have 10 friends, finding one takes 10 seconds. If you have 1,000,000, does it take 1,000,000 seconds? Big O notation measures how your algorithm 'scales up' as the work gets harder.",
      exampleCode: "// O(n) - Linear\nfor (int i = 0; i < n; i++) { ... }",
      efficiencyTip: "Memorize: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)."
    },
    previewCode: "for(int i=0; i<n; i++) { ... } // O(n)",
    stages: [
      {
        step: 1,
        instruction: "O(n) Linear: Write a loop that runs `n` times (from 0 to n).",
        codeTemplate: "#include <iostream>\n\nvoid loop(int n) {\n  // Loop 0 to n\n}\nusing namespace std;\n\nint main() { return 0; }",
        solution: ['for (int i = 0; i < n; i++)', 'for(int i=0;i<n;++i)', 'for (int i = 0; i < n; ++i)'],
        hint: "Standard for loop."
      },
      {
        step: 2,
        instruction: "O(n^2) Quadratic: Nested Loops. Write a loop inside a loop, both 0 to `n`.",
        codeTemplate: "#include <iostream>\n\nvoid nested(int n) {\n  // Outer loop\n    // Inner loop\n}\nusing namespace std;\n\nint main() { return 0; }",
        solution: [
          'for (int i = 0; i < n; i++) { for (int j = 0; j < n; j++) { } }',
          'for (int i = 0; i < n; i++) for (int j = 0; j < n; j++)'
        ],
        hint: "Use `i` for outer, `j` for inner."
      },
      {
        step: 3,
        instruction: "O(log n) Logarithmic: Loop where `i` starts at 1 and DOUBLES each time (i *= 2).",
        codeTemplate: "#include <iostream>\n\nvoid logLoop(int n) {\n  // Loop doubling i\n}\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'for (int i = 1; i < n; i *= 2)',
        hint: "`i *= 2` instead of `i++` cuts the steps drastically."
      }
    ]
  },
  {
    id: 'lesson-linked-list',
    title: 'Linked Lists',
    module: 'DSA',
    concept: 'The Chain',
    description: "Nodes linked together. Dynamic size, but O(n) access. The hello world of data structures.",
    intro: {
      story: "Arrays are neighbors in a long apartment block. Linked Lists are a scavenger hunt: each item holding the address to the next one. Great for adding/removing items, terrible for jumping to the 5th item instantly.",
      exampleCode: "Node* head = new Node(1);\nhead->next = new Node(2);",
    },
    previewCode: "struct Node {\n  int val;\n  Node* next;\n};",
    stages: [
      {
        step: 1,
        instruction: "Define Node: Create a struct `Node` with `int data` and `Node* next`.",
        codeTemplate: "#include <iostream>\n\n// struct Node\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'struct Node { int data; Node* next; };',
        hint: "Pointer to same type: `Node* next;`"
      },
      {
        step: 2,
        instruction: "Link: Create two nodes `n1`, `n2`. Set `n1.next` to the address of `n2`.",
        codeTemplate: "#include <iostream>\n\nstruct Node { int data; Node* next; };\nusing namespace std;\n\nint main() {\n  Node n1; Node n2;\n  // Link n1 to n2\n  return 0;\n}",
        solution: 'n1.next = &n2;',
        hint: "Use address-of operator `&`."
      },
      {
        step: 3,
        instruction: "Traverse: Loop while `curr` is not `nullptr` and move `curr` to `curr->next`.",
        codeTemplate: "#include <iostream>\n\nstruct Node { int data; Node* next; };\nusing namespace std;\n\nint main() {\n  Node* curr = nullptr;\n  while (curr != nullptr) {\n     // Move to next\n  }\n  return 0;\n}",
        solution: 'curr = curr->next;',
        hint: "Advance the pointer: `curr = curr->next;`"
      }
    ]
  },
  {
    id: 'lesson-sorting',
    title: 'Sorting',
    module: 'DSA',
    concept: 'Order from Chaos',
    description: "Organizing data makes searching faster. Bubble sort is easiest, `sort` is fastest.",
    intro: {
      story: "It's hard to find a name in a shuffled phone book. Sorting organizes data so we can find things instantly. `std::sort` is a highly optimized mix of QuickSort, HeapSort, and InsertionSort.",
      exampleCode: "vector<int> v = {3, 1, 2};\nsort(v.begin(), v.end()); // {1, 2, 3}",
      efficiencyTip: "Never write your own sort in a real app. `std::sort` is O(n log n) and beaten by almost nothing manually written."
    },
    previewCode: "sort(v.begin(), v.end());",
    stages: [
      {
        step: 1,
        instruction: "Swap: Write code to swap `a` and `b` using a temporary variable `temp`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int a = 1, b = 2;\n  // Swap them\n  return 0;\n}",
        solution: [
          'int temp = a; a = b; b = temp;',
          'int t = a; a = b; b = t;'
        ],
        hint: "Save one to `temp` first."
      },
      {
        step: 2,
        instruction: "Bubble Step: If `arr[0]` > `arr[1]`, swap them.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int arr[] = {5, 1};\n  // Check and swap\n  return 0;\n}",
        solution: 'if (arr[0] > arr[1]) { int t = arr[0]; arr[0] = arr[1]; arr[1] = t; }',
        hint: "Combine logic: `if (arr[0] > arr[1]) swap code`"
      },
      {
        step: 3,
        instruction: "The Pro Way: Use `sort` to sort the vector `v`.",
        codeTemplate: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n  vector<int> v = {3, 1, 2};\n  // Sort it\n  return 0;\n}",
        solution: 'sort(v.begin(), v.end());',
        hint: "`sort(begin, end);`"
      }
    ]
  },
  {
    id: 'lesson-trees',
    title: 'Trees',
    module: 'DSA',
    concept: 'The Hierarchy',
    description: "Hierarchical data. Binary Search Trees (BST) allow fast O(log n) lookups.",
    intro: {
      story: "Filesystems, HTML DOMs, and Organization Charts are all Trees. A root node branches into children. In a BST, everything smaller is on the left, everything larger is on the right.",
      exampleCode: "if (val < root->val) goLeft();\nelse goRight();",
    },
    previewCode: "struct Node {\n  int val;\n  Node* left;\n  Node* right;\n};",
    stages: [
      {
        step: 1,
        instruction: "Define: Create `Node` with `int val`, `Node* left`, `Node* right`.",
        codeTemplate: "#include <iostream>\n\n// struct Node\nusing namespace std;\n\nint main() { return 0; }",
        solution: 'struct Node { int val; Node* left; Node* right; };',
        hint: "Two pointers this time."
      },
      {
        step: 2,
        instruction: "Root: Create a root node with value 10, and a left child with value 5.",
        codeTemplate: "#include <iostream>\n\nstruct Node { int val; Node* left; Node* right; Node(int v) : val(v), left(nullptr), right(nullptr) {} };\nusing namespace std;\n\nint main() {\n  // Node* root = ...\n  // root->left = ...\n  return 0;\n}",
        solution: 'Node* root = new Node(10); root->left = new Node(5);',
        hint: "Use `new`: `root->left = new Node(5);`"
      },
      {
        step: 3,
        instruction: "BST Logic: If `val` (7) < `root->val` (10), print \"Left\", else \"Right\".",
        codeTemplate: "#include <iostream>\n\nstruct Node { int val = 10; };\nusing namespace std;\n\nint main() {\n  Node* root = new Node();\n  int val = 7;\n  // Check constraint\n  return 0;\n}",
        solution: ['if (val < root->val) cout << "Left"; else cout << "Right";', 'if (val < root->val) { cout << "Left"; } else { cout << "Right"; }'],
        hint: "Basic comparison logic used in insertion."
      }
    ]
  },
  {
    id: 'lesson-debugging',
    title: 'Debugging',
    module: 'SE',
    concept: 'The Detective',
    description: "Code rarely works the first time. Reading error messages and fixing logic is 90% of the job.",
    intro: {
      story: "Programming is 10% writing code and 90% figuring out why it doesn't work. Debugging is the art of acting like a detective in a crime movie where you are also the murderer.",
      exampleCode: "cout << \"DEBUG: x is \" << x << endl;",
    },
    previewCode: "// Error: missing semicolon\nint x = 5",
    stages: [
      {
        step: 1,
        instruction: "Syntax Error: Fix the missing semicolon.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int x = 10\n  cout << x;\n  return 0;\n}",
        solution: 'int x = 10;',
        hint: "Look at the end of the line `int x = 10`."
      },
      {
        step: 2,
        instruction: "Logic Error: The loop should run 5 times (0 to 4), but it runs 0 times. Fix the condition.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  for (int i = 0; i > 5; i++) {\n    cout << i;\n  }\n  return 0;\n}",
        solution: ['i < 5', 'i <= 4'],
        hint: "`i > 5` is false immediately if `i` is 0."
      },
      {
        step: 3,
        instruction: "Off-By-One: The array has size 3. Fix the crash by changing the loop limit.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int arr[3] = {1, 2, 3};\n  for (int i = 0; i <= 3; i++) {\n    cout << arr[i];\n  }\n  return 0;\n}",
        solution: ['i < 3', 'i <= 2'],
        hint: "Index 3 is out of bounds for size 3. Last index is 2."
      }
    ]
  },
  {
    id: 'lesson-testing',
    title: 'Testing',
    module: 'SE',
    concept: 'The Guard',
    description: "Prove your code works. Write assertions that fail if the code is wrong.",
    intro: {
      story: "Don't just 'hope' it works. Prove it. Tests are safety rails. They ensure that when you fix a bug today, you don't accidentally break something else tomorrow.",
      exampleCode: "assert(add(2, 2) == 4);\n// Crashes if false",
    },
    previewCode: "assert(add(2, 2) == 4);",
    stages: [
      {
        step: 1,
        instruction: "Assert: verification. Include `<cassert>` and `assert(true)`.",
        codeTemplate: "#include <iostream>\n// Include assert header\nusing namespace std;\n\nint main() {\n  // assert true\n  return 0;\n}",
        solution: '#include <cassert> int main() { assert(true); return 0; }',
        hint: "`#include <cassert>`"
      },
      {
        step: 2,
        instruction: "Unit Test: Write an assert that checks if `add(2, 3)` equals 5.",
        codeTemplate: "#include <iostream>\n#include <cassert>\n\nint add(int a, int b) { return a + b; }\nusing namespace std;\n\nint main() {\n  // Check add\n  return 0;\n}",
        solution: 'assert(add(2, 3) == 5);',
        hint: "`assert(condition);`"
      },
      {
        step: 3,
        instruction: "Boundary Check: Assert that `items` is not empty (size > 0).",
        codeTemplate: "#include <iostream>\n#include <vector>\n#include <cassert>\nusing namespace std;\n\nint main() {\n  vector<int> items = {1};\n  // Assert size > 0\n  return 0;\n}",
        solution: 'assert(items.size() > 0);',
        hint: "Use `.size()`."
      }
    ]
  },
  {
    id: 'lesson-refactoring',
    title: 'Refactoring',
    module: 'SE',
    concept: 'The Cleanup',
    description: "Make code cleaner without changing what it does. Rename variables to be descriptive.",
    intro: {
      story: "Your code works, but it looks like a mess. Refactoring is cleaning up the kitchen after cooking. You aren't making new food, just organizing so the next person (or you in 6 months) doesn't scream.",
      exampleCode: "// Before\nint x = 86400;\n// After\nint secondsInDay = 86400;",
    },
    previewCode: "// Bad\nint x = 5;\n// Good\nint score = 5;",
    stages: [
      {
        step: 1,
        instruction: "Rename: Change `int n = 100` to `int health = 100`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int n = 100;\n  // Rename n to health\n  return 0;\n}",
        solution: 'int health = 100;',
        hint: "Clarity matters."
      },
      {
        step: 2,
        instruction: "Extract Constant: Instead of `3.14` in the math, use `const double PI = 3.14;`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  double area = 3.14 * 5 * 5;\n  return 0;\n}",
        solution: 'const double PI = 3.14; double area = PI * 5 * 5;',
        hint: "Define `PI` first."
      },
      {
        step: 3,
        instruction: "Simplify: Replace `if (isDead == true)` with `if (isDead)`.",
        codeTemplate: "#include <iostream>\nusing namespace std;\n\nint main() {\n  bool isDead = true;\n  if (isDead == true) {\n    cout << \"Game Over\";\n  }\n  return 0;\n}",
        solution: 'if (isDead) { cout << "Game Over"; }',
        hint: "Booleans don't need `== true`."
      }
    ]
  },
  {
    id: 'lesson-sets',
    title: 'Sets',
    module: 'INTERVIEW',
    concept: 'The Unique Collection',
    description: "Keep only unique items. 'set' is sorted (O(log n)), 'unordered_set' is fast (O(1)).",
    intro: {
      story: "A Club Guest List where everyone can only enter once. If you try to add 'John' twice, the Set says 'He's already here' and does nothing. Perfect for deduplication.",
      exampleCode: "set<int> present;\npresent.insert(1);\npresent.insert(1); // Ignored",
    },
    previewCode: "set<int> s;\\ns.insert(1);\\nif (s.count(1)) found();",
    stages: [
      {
        step: 1,
        instruction: "Basic Set: Create a `set<int>` named `s` and insert the number 5.",
        codeTemplate: "#include <iostream>\\n#include <set>\\n\\nint main() {\\n  // Create set, insert 5\\n  return 0;\\n}",
        solution: 'set<int> s; s.insert(5);',
        hint: "`s.insert(value);`"
      },
      {
        step: 2,
        instruction: "Check Expectation: Check if 5 exists in the set using `.count()`. Output 'Found' if true.",
        codeTemplate: "#include <iostream>\\n#include <set>\\n\\nint main() {\\n  set<int> s = {5};\\n  // Check if 5 is in s\\n  return 0;\\n}",
        solution: ['if (s.count(5)) cout << "Found";', 'if (s.count(5) > 0) cout << "Found";'],
        hint: "`.count(key)` returns 1 if present, 0 if not."
      },
      {
        step: 3,
        instruction: "Unordered: Switch to `unordered_set` for O(1) speed. Create one named `fast`.",
        codeTemplate: "#include <iostream>\\n#include <unordered_set>\\n\\nint main() {\\n  // Create unordered_set\\n  return 0;\\n}",
        solution: 'unordered_set<int> fast;',
        hint: "Just like set, but `unordered_set`."
      }
    ]
  },
  {
    id: 'lesson-stack-queue',
    title: 'Stacks & Queues',
    module: 'INTERVIEW',
    concept: 'Order Matters',
    description: "LIFO (Stack) for backtracking/parsing. FIFO (Queue) for scheduling/BFS.",
    intro: {
      story: "A Stack is a stack of pancakes (eat the top one first). A Queue is a line at the DMV (first come, first served). Simple rules, but they power everything from browser history to printer jobs.",
      exampleCode: "stack.push(1); stack.pop(); // LIFO\nqueue.push(1); queue.pop(); // FIFO",
    },
    previewCode: "stack<int> s;\\ns.push(1);\\nint top = s.top(); s.pop();",
    stages: [
      {
        step: 1,
        instruction: "Stack LIFO: Create a `stack<int>` named `s`, push 1, then push 2.",
        codeTemplate: "#include <iostream>\\n#include <stack>\\n\\nint main() {\\n  // Create stack, push 1, 2\\n  return 0;\\n}",
        solution: 'stack<int> s; s.push(1); s.push(2);',
        hint: "`push(val)` adds to the top."
      },
      {
        step: 2,
        instruction: "Stack Pop: Print the top element (`.top()`) then remove it (`.pop()`).",
        codeTemplate: "#include <iostream>\\n#include <stack>\\n\\nint main() {\\n  stack<int> s; s.push(10);\\n  // Print top, then pop\\n  return 0;\\n}",
        solution: 'cout << s.top(); s.pop();',
        hint: "`top()` peeks, `pop()` removes (returns void)."
      },
      {
        step: 3,
        instruction: "Queue FIFO: Create `queue<int>` named `q`, push 1. Access front with `.front()`.",
        codeTemplate: "#include <iostream>\\n#include <queue>\\n\\nint main() {\\n  // Create queue, push 1, print front\\n  return 0;\\n}",
        solution: 'queue<int> q; q.push(1); cout << q.front();',
        hint: "Queues use `front()`, Stacks use `top()`."
      }
    ]
  },
  {
    id: 'lesson-recursion',
    title: 'Recursion',
    module: 'INTERVIEW',
    concept: 'The Mirror',
    description: "A function that calls itself. The key to Trees, Graphs, and Dynamic Programming.",
    intro: {
      story: "To understand recursion, you must first understand recursion. It's a function that calls itself to solve a smaller version of the problem, until it hits a simple 'Base Case'.",
      exampleCode: "void dive(int depth) {\n  if (depth == 0) return;\n  dive(depth - 1);\n}",
    },
    previewCode: "int fact(int n) {\\n  if (n <= 1) return 1;\\n  return n * fact(n-1);\\n}",
    stages: [
      {
        step: 1,
        instruction: "Base Case: In function `run`, if `n` is 0, return. This stops the recursion.",
        codeTemplate: "#include <iostream>\\n\\nvoid run(int n) {\\n  // Base case: if n is 0, return\\n  cout << n;\\n}\\n\\nint main() { return 0; }",
        solution: 'if (n == 0) return;',
        hint: "Always check the stop condition first."
      },
      {
        step: 2,
        instruction: "Recursive Step: Call `run(n - 1)` after printing `n`. This counts down.",
        codeTemplate: "#include <iostream>\\n\\nvoid run(int n) {\\n  if (n == 0) return;\\n  cout << n;\\n  // Recursive call\\n}\\n\\nint main() { return 0; }",
        solution: 'run(n - 1);',
        hint: "Call the same function with a smaller input."
      },
      {
        step: 3,
        instruction: "Factorial: Return `n * fact(n - 1)`. If `n <= 1` return 1.",
        codeTemplate: "#include <iostream>\\n\\nint fact(int n) {\\n  if (n <= 1) return 1;\\n  // Return n * fact(n-1)\\n}\\n\\nint main() { return 0; }",
        solution: 'return n * fact(n - 1);',
        hint: "The math definition: 5! = 5 * 4!"
      }
    ]
  },
  {
    id: 'lesson-binary-search',
    title: 'Binary Search',
    module: 'INTERVIEW',
    concept: 'The Divider',
    description: "Don't scan the whole list. Cut it in half every time. O(log n).",
    intro: {
      story: "Guess a number between 1 and 100. '50?' 'Higher.' '75?' 'Lower.' You just eliminated half the possibilities. That's Binary Search. It searches billions of items in mere steps.",
      exampleCode: "while (L <= R) {\n  mid = L + (R-L)/2;\n  if (arr[mid] < target) L = mid + 1;\n}",
    },
    previewCode: "int mid = L + (R - L) / 2;\\nif (arr[mid] < target) L = mid + 1;",
    stages: [
      {
        step: 1,
        instruction: "Midpoint: Calculate `mid` safely using `L` and `R`.",
        codeTemplate: "#include <iostream>\\n\\nint main() {\\n  int L = 0, R = 10;\\n  // int mid = ...\\n  return 0;\\n}",
        solution: 'int mid = L + (R - L) / 2;',
        hint: "`L + (R - L) / 2` prevents overflow compared to `(L + R) / 2`."
      },
      {
        step: 2,
        instruction: "The Loop: Run while `L` is less than or equal to `R`.",
        codeTemplate: "#include <iostream>\\n\\nint main() {\\n  int L = 0, R = 10;\\n  // while loop\\n  return 0;\\n}",
        solution: 'while (L <= R)',
        hint: "Standard BS condition: `L <= R`."
      },
      {
        step: 3,
        instruction: "Decision: If `val` < `target`, we need higher numbers. Set `L = mid + 1`.",
        codeTemplate: "#include <iostream>\\n\\nint main() {\\n  int val = 5, target = 10, L = 0, mid = 5;\\n  // If val < target, move L\\n  return 0;\\n}",
        solution: ['if (val < target) L = mid + 1;', 'if (val < target) { L = mid + 1; }'],
        hint: "Move the left boundary past the middle."
      }
    ]
  },
  {
    id: 'lesson-bfs-dfs',
    title: 'BFS / DFS',
    module: 'INTERVIEW',
    concept: 'The Explorer',
    description: "How to visit every node in a maze (Graph/Tree). BFS uses Queue, DFS uses Stack/Recursion.",
    intro: {
      story: "BFS works like water spreading out evenly (level by level). DFS works like a maze runner going as deep as possible before backtracking. Use BFS for 'Shortest Path'.",
      exampleCode: "queue<int> q;\nq.push(start);\nwhile (!q.empty()) { ... }",
    },
    previewCode: "queue<int> q; q.push(start);\\nwhile (!q.empty()) { ... }",
    stages: [
      {
        step: 1,
        instruction: "BFS Setup: Create a queue of ints `q` and push the `start` node (0).",
        codeTemplate: "#include <iostream>\\n#include <queue>\\n\\nint main() {\\n  int start = 0;\\n  // Setup q\\n  return 0;\\n}",
        solution: 'queue<int> q; q.push(start);',
        hint: "Breadth-First Search starts with a Queue."
      },
      {
        step: 2,
        instruction: "The Loop: Run while the queue is NOT empty (`!q.empty()`).",
        codeTemplate: "#include <iostream>\\n#include <queue>\\n\\nint main() {\\n  queue<int> q; q.push(0);\\n  // Loop\\n  return 0;\\n}",
        solution: 'while (!q.empty())',
        hint: "Keep exploring until we run out of nodes."
      },
      {
        step: 3,
        instruction: "Process: Get `curr` from front, then pop. `int curr = q.front(); q.pop();`",
        codeTemplate: "#include <iostream>\\n#include <queue>\\n\\nint main() {\\n  queue<int> q; q.push(0);\\n  while(!q.empty()) {\\n    // Get curr and pop\\n  }\\n  return 0;\\n}",
        solution: 'int curr = q.front(); q.pop();',
        hint: "Standard Queue operation."
      }
    ]
  }
];
