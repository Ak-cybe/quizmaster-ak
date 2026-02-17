import { QuizCategory } from "@/types/quiz";

// Sample quiz data - Replace with your own questions!
export const quizCategories: QuizCategory[] = [
  {
    id: "python-basics",
    name: "Python Basics",
    description: "Test your knowledge of Python fundamentals",
    icon: "Code",
    color: "from-blue-500 to-cyan-400",
    timePerQuestion: 30,
    questions: [
      {
        id: 1,
        question: "What keyword is used to define a function in Python?",
        options: [
          { id: "A", text: "function" },
          { id: "B", text: "def" },
          { id: "C", text: "func" },
          { id: "D", text: "define" },
        ],
        correctAnswer: "B",
        explanation:
          "In Python, the 'def' keyword is used to define a function. For example: def my_function(): followed by the function body.",
      },
      {
        id: 2,
        question: "Which of the following is a valid variable name in Python?",
        options: [
          { id: "A", text: "2variable" },
          { id: "B", text: "my-variable" },
          { id: "C", text: "_my_variable" },
          { id: "D", text: "my variable" },
        ],
        correctAnswer: "C",
        explanation:
          "Variable names in Python can start with a letter or underscore, but not with a number. They cannot contain spaces or hyphens.",
      },
      {
        id: 3,
        question: "What is the output of: print(type([]))?",
        options: [
          { id: "A", text: "<class 'array'>" },
          { id: "B", text: "<class 'list'>" },
          { id: "C", text: "<class 'tuple'>" },
          { id: "D", text: "<class 'dict'>" },
        ],
        correctAnswer: "B",
        explanation:
          "Empty square brackets [] create an empty list in Python. The type() function returns <class 'list'> for list objects.",
      },
      {
        id: 4,
        question: "Which operator is used for exponentiation in Python?",
        options: [
          { id: "A", text: "^" },
          { id: "B", text: "**" },
          { id: "C", text: "^^" },
          { id: "D", text: "exp()" },
        ],
        correctAnswer: "B",
        explanation:
          "Python uses ** for exponentiation. For example, 2**3 equals 8. The ^ operator is used for bitwise XOR, not exponentiation.",
      },
      {
        id: 5,
        question: "What does the 'len()' function return for the string 'Hello'?",
        options: [
          { id: "A", text: "4" },
          { id: "B", text: "5" },
          { id: "C", text: "6" },
          { id: "D", text: "Error" },
        ],
        correctAnswer: "B",
        explanation:
          "The len() function returns the number of characters in a string. 'Hello' has 5 characters: H, e, l, l, o.",
      },
    ],
  },
  {
    id: "javascript-fundamentals",
    name: "JavaScript Fundamentals",
    description: "Master the basics of JavaScript programming",
    icon: "Braces",
    color: "from-yellow-500 to-orange-400",
    timePerQuestion: 25,
    questions: [
      {
        id: 1,
        question: "Which keyword declares a block-scoped variable in JavaScript?",
        options: [
          { id: "A", text: "var" },
          { id: "B", text: "let" },
          { id: "C", text: "const" },
          { id: "D", text: "Both B and C" },
        ],
        correctAnswer: "D",
        explanation:
          "Both 'let' and 'const' declare block-scoped variables. 'var' is function-scoped. 'const' is for variables that won't be reassigned.",
      },
      {
        id: 2,
        question: "What is the result of: typeof null?",
        options: [
          { id: "A", text: "'null'" },
          { id: "B", text: "'undefined'" },
          { id: "C", text: "'object'" },
          { id: "D", text: "'boolean'" },
        ],
        correctAnswer: "C",
        explanation:
          "This is a famous JavaScript quirk. typeof null returns 'object' due to a legacy bug in the language that was never fixed for backwards compatibility.",
      },
      {
        id: 3,
        question: "Which method adds an element to the end of an array?",
        options: [
          { id: "A", text: "push()" },
          { id: "B", text: "pop()" },
          { id: "C", text: "shift()" },
          { id: "D", text: "unshift()" },
        ],
        correctAnswer: "A",
        explanation:
          "push() adds elements to the end, pop() removes from the end, unshift() adds to the beginning, and shift() removes from the beginning.",
      },
      {
        id: 4,
        question: "What does '===' check in JavaScript?",
        options: [
          { id: "A", text: "Value equality only" },
          { id: "B", text: "Type equality only" },
          { id: "C", text: "Value and type equality" },
          { id: "D", text: "Reference equality" },
        ],
        correctAnswer: "C",
        explanation:
          "The strict equality operator (===) checks both value and type without type coercion. '5' === 5 is false because string !== number.",
      },
      {
        id: 5,
        question: "Which is NOT a JavaScript data type?",
        options: [
          { id: "A", text: "Symbol" },
          { id: "B", text: "BigInt" },
          { id: "C", text: "Float" },
          { id: "D", text: "Undefined" },
        ],
        correctAnswer: "C",
        explanation:
          "JavaScript has 8 data types: String, Number, BigInt, Boolean, Undefined, Null, Symbol, and Object. There is no separate Float type - all numbers are Number type.",
      },
    ],
  },
  {
    id: "web-development",
    name: "Web Development",
    description: "HTML, CSS, and web concepts",
    icon: "Globe",
    color: "from-purple-500 to-pink-400",
    timePerQuestion: 30,
    questions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: [
          { id: "A", text: "Hyper Text Markup Language" },
          { id: "B", text: "Home Tool Markup Language" },
          { id: "C", text: "Hyperlinks Text Mark Language" },
          { id: "D", text: "Hyperlinking Text Marking Language" },
        ],
        correctAnswer: "A",
        explanation:
          "HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages and web applications.",
      },
      {
        id: 2,
        question: "Which CSS property is used to change text color?",
        options: [
          { id: "A", text: "text-color" },
          { id: "B", text: "font-color" },
          { id: "C", text: "color" },
          { id: "D", text: "text-style" },
        ],
        correctAnswer: "C",
        explanation:
          "The 'color' property in CSS is used to set the color of text. Despite seeming counterintuitive, 'text-color' and 'font-color' are not valid CSS properties.",
      },
      {
        id: 3,
        question: "What is the correct HTML element for the largest heading?",
        options: [
          { id: "A", text: "<heading>" },
          { id: "B", text: "<h6>" },
          { id: "C", text: "<head>" },
          { id: "D", text: "<h1>" },
        ],
        correctAnswer: "D",
        explanation:
          "HTML headings are defined with <h1> to <h6> tags. <h1> is the largest/most important heading, while <h6> is the smallest.",
      },
      {
        id: 4,
        question: "Which CSS property controls the space between elements?",
        options: [
          { id: "A", text: "spacing" },
          { id: "B", text: "margin" },
          { id: "C", text: "padding" },
          { id: "D", text: "Both B and C" },
        ],
        correctAnswer: "D",
        explanation:
          "Margin controls space outside an element (between elements), while padding controls space inside an element (between content and border). Both affect spacing.",
      },
      {
        id: 5,
        question: "What does CSS stand for?",
        options: [
          { id: "A", text: "Colorful Style Sheets" },
          { id: "B", text: "Cascading Style Sheets" },
          { id: "C", text: "Computer Style Sheets" },
          { id: "D", text: "Creative Style Sheets" },
        ],
        correctAnswer: "B",
        explanation:
          "CSS stands for Cascading Style Sheets. The 'cascading' refers to how styles are applied in order of specificity and source order.",
      },
    ],
  },
  {
    id: "general-knowledge",
    name: "General Knowledge",
    description: "Test your trivia skills",
    icon: "Lightbulb",
    color: "from-green-500 to-emerald-400",
    timePerQuestion: 20,
    questions: [
      {
        id: 1,
        question: "What is the capital of Japan?",
        options: [
          { id: "A", text: "Seoul" },
          { id: "B", text: "Beijing" },
          { id: "C", text: "Tokyo" },
          { id: "D", text: "Bangkok" },
        ],
        correctAnswer: "C",
        explanation:
          "Tokyo is the capital city of Japan and one of the most populous metropolitan areas in the world with over 37 million people.",
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: [
          { id: "A", text: "Venus" },
          { id: "B", text: "Mars" },
          { id: "C", text: "Jupiter" },
          { id: "D", text: "Saturn" },
        ],
        correctAnswer: "B",
        explanation:
          "Mars is called the Red Planet because of iron oxide (rust) on its surface, which gives it a reddish appearance visible from Earth.",
      },
      {
        id: 3,
        question: "How many continents are there on Earth?",
        options: [
          { id: "A", text: "5" },
          { id: "B", text: "6" },
          { id: "C", text: "7" },
          { id: "D", text: "8" },
        ],
        correctAnswer: "C",
        explanation:
          "There are 7 continents: Africa, Antarctica, Asia, Australia/Oceania, Europe, North America, and South America.",
      },
      {
        id: 4,
        question: "Who painted the Mona Lisa?",
        options: [
          { id: "A", text: "Vincent van Gogh" },
          { id: "B", text: "Pablo Picasso" },
          { id: "C", text: "Leonardo da Vinci" },
          { id: "D", text: "Michelangelo" },
        ],
        correctAnswer: "C",
        explanation:
          "Leonardo da Vinci painted the Mona Lisa between 1503-1519. It's now displayed at the Louvre Museum in Paris, France.",
      },
      {
        id: 5,
        question: "What is the largest ocean on Earth?",
        options: [
          { id: "A", text: "Atlantic Ocean" },
          { id: "B", text: "Indian Ocean" },
          { id: "C", text: "Arctic Ocean" },
          { id: "D", text: "Pacific Ocean" },
        ],
        correctAnswer: "D",
        explanation:
          "The Pacific Ocean is the largest and deepest ocean, covering about 63 million square miles - more than all land area combined!",
      },
    ],
  },
];
