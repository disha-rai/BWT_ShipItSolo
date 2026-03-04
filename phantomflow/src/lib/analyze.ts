export type AnalyzerResult = {
  greeting: string;
  summary: string[];
  draftCode: string;
  hypeMessage: string;
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectLanguage(lower: string): "python" | "java" | "cpp" | "c" | "js" | "unknown" {
  if (/\bdef\b|\bimport\b|print\(|__name__/.test(lower)) return "python";
  if (/public\s+class|static\s+void\s+main|system\.out/.test(lower)) return "java";
  if (/#include\s*<\w+>|std::|using\s+namespace\s+std|cout|cin/.test(lower)) return "cpp";
  if (/#include\s*<stdio\.h>|printf\(|scanf\(/.test(lower)) return "c";
  if (/function\s+|export\s+|import\s+|console\.log/.test(lower)) return "js";
  return "unknown";
}

function collectSignals(lower: string): string[] {
  const bullets: string[] = [];
  if (/jwt|jsonwebtoken/.test(lower)) bullets.push("Auth with JWT");
  if (/middleware/.test(lower)) bullets.push("Middleware lifecycle");
  if (/fetch\(|axios|httpclient|requests\.get|urllib|http/.test(lower)) bullets.push("Network/API calls");
  if (/usestate|useeffect|react|jsx/.test(lower)) bullets.push("React component state/effects");
  if (/class\s+\w+|interface\s+\w+/.test(lower)) bullets.push("Object-oriented structure");
  if (/map|unordered_map|hashmap|dict|set|vector|list|arraylist/.test(lower)) bullets.push("Data structures used");
  if (/sort\(|collections\.sort|std::sort|sorted\(/.test(lower)) bullets.push("Sorting logic");
  if (/queue|stack|bfs|dfs/.test(lower)) bullets.push("Graph traversal or stack/queue use");
  if (/file|fs\.|fstream|BufferedReader|Scanner|open\(/.test(lower)) bullets.push("File or input parsing");
  if (/main\s*\(|static\s+void\s+main|__name__/.test(lower)) bullets.push("Program entry point");
  if (!bullets.length) bullets.push("General refactor and iteration");
  return bullets.slice(0, 5);
}

function draftForLanguage(lang: string): string {
  if (lang === "python") {
    return "def next_step():\n    return True\n";
  }
  if (lang === "java") {
    return "public class NextStep {\n  public static String nextStep() { return \"\"; }\n}\n";
  }
  if (lang === "cpp") {
    return "int nextStep() { return 0; }\n";
  }
  if (lang === "c") {
    return "int next_step() { return 0; }\n";
  }
  if (lang === "js") {
    return "export function nextStep() { return true; }\n";
  }
  return "function nextStep() { return true; }\n";
}

function draftForIntent(lang: string, intent: string): string {
  if (intent === "arithmetic_add") {
    if (lang === "python") return "def add_two_numbers(a, b):\n    return a + b\nprint(add_two_numbers(2, 3))\n";
    if (lang === "java") return "public static int addTwoNumbers(int a, int b) { return a + b; }\nSystem.out.println(addTwoNumbers(2, 3));\n";
    if (lang === "cpp") return "int addTwoNumbers(int a, int b) { return a + b; }\n// std::cout << addTwoNumbers(2, 3);\n";
    if (lang === "c") return "int add_two_numbers(int a, int b) { return a + b; }\n/* printf(\"%d\", add_two_numbers(2, 3)); */\n";
    if (lang === "js") return "export function addTwoNumbers(a, b) { return a + b; }\nconsole.log(addTwoNumbers(2, 3));\n";
    return "function addTwoNumbers(a, b) { return a + b; }\n";
  }
  if (intent === "function_incomplete") {
    if (lang === "python") return "def compute(a, b):\n    result = a + b\n    return result\n";
    if (lang === "java") return "static int compute(int a, int b) {\n  int result = a + b;\n  return result;\n}\n";
    if (lang === "cpp") return "int compute(int a, int b) {\n  int result = a + b;\n  return result;\n}\n";
    if (lang === "c") return "int compute(int a, int b) {\n  int result = a + b;\n  return result;\n}\n";
    if (lang === "js") return "export function compute(a, b) {\n  const result = a + b;\n  return result;\n}\n";
    return "function compute(a, b) { const result = a + b; return result; }\n";
  }
  if (intent === "io_sum") {
    if (lang === "python") return "a = int(input())\nb = int(input())\nprint(a + b)\n";
    if (lang === "java") return "var sc = new java.util.Scanner(System.in);\nint a = sc.nextInt();\nint b = sc.nextInt();\nSystem.out.println(a + b);\n";
    if (lang === "cpp") return "int a, b; std::cin >> a >> b; std::cout << (a + b);\n";
    if (lang === "c") return "int a, b; scanf(\"%d %d\", &a, &b); printf(\"%d\", a + b);\n";
    if (lang === "js") return "export function addFromInputs(a, b) { return a + b; }\n";
    return "function addFromInputs(a, b) { return a + b; }\n";
  }
  if (intent === "sorting") {
    if (lang === "python") return "arr = [3,1,2]\nprint(sorted(arr))\n";
    if (lang === "java") return "int[] arr = {3,1,2};\njava.util.Arrays.sort(arr);\n";
    if (lang === "cpp") return "std::vector<int> v{3,1,2};\nstd::sort(v.begin(), v.end());\n";
    if (lang === "c") return "/* Implement qsort on an array */\n";
    if (lang === "js") return "const arr = [3,1,2];\nconsole.log(arr.sort((a,b)=>a-b));\n";
    return "const arr = [3,1,2];\narr.sort((a,b)=>a-b);\n";
  }
  if (intent === "traversal") {
    if (lang === "python") return "from collections import deque\ndef bfs(start, graph):\n    q = deque([start])\n    seen = {start}\n    order = []\n    while q:\n        u = q.popleft()\n        order.append(u)\n        for v in graph.get(u, []):\n            if v not in seen:\n                seen.add(v)\n                q.append(v)\n    return order\n";
    if (lang === "java") return "java.util.Queue<Integer> q = new java.util.ArrayDeque<>();\njava.util.Set<Integer> seen = new java.util.HashSet<>();\n";
    if (lang === "cpp") return "std::queue<int> q; std::unordered_set<int> seen;\n";
    if (lang === "c") return "/* Implement BFS using arrays for queue and visited */\n";
    if (lang === "js") return "export function bfs(start, graph){ const q=[start]; const seen=new Set([start]); const order=[]; while(q.length){ const u=q.shift(); order.push(u); for(const v of (graph[u]||[])){ if(!seen.has(v)){ seen.add(v); q.push(v); } } } return order; }\n";
    return "function bfs(start, graph){ return []; }\n";
  }
  if (intent === "string_reverse") {
    if (lang === "python") return "def reverse(s):\n    return s[::-1]\n";
    if (lang === "java") return "static String reverse(String s){ return new StringBuilder(s).reverse().toString(); }\n";
    if (lang === "cpp") return "std::string reverse(std::string s){ std::reverse(s.begin(), s.end()); return s; }\n";
    if (lang === "c") return "/* Implement reverse by swapping from ends */\n";
    if (lang === "js") return "export function reverse(s){ return s.split('').reverse().join(''); }\n";
    return "function reverse(s){ return s; }\n";
  }
  if (intent === "class_main") {
    if (lang === "java") return "public class Main{\n  public static void main(String[] args){\n    System.out.println(\"Start\");\n  }\n}\n";
    return draftForLanguage(lang);
  }
  return draftForLanguage(lang);
}

export function analyze(code: string, note?: string): AnalyzerResult {
  const lower = code.toLowerCase();
  const lang = detectLanguage(lower);
  const summary = collectSignals(lower);
  let draft = "";
  let nextHint = "";

  if (/jwt/.test(lower) && /middleware/.test(lower)) {
    draft = draftForIntent(lang, "function_incomplete");
    nextHint = "Next: add function to validate token and handle refresh/expiry.";
  } else if (/sort\(|sorted\(|std::sort|collections\.sort/.test(lower)) {
    draft = draftForIntent(lang, "sorting");
    nextHint = "Next: implement sorting routine and verify order with a test.";
  } else if (/bfs|dfs|queue|stack/.test(lower)) {
    draft = draftForIntent(lang, "traversal");
    nextHint = "Next: complete traversal and return/print the visited order.";
  } else if (/usestate|useeffect|react/.test(lower)) {
    draft = draftForIntent(lang, "function_incomplete");
    nextHint = "Next: wire state transitions and render derived UI.";
  } else if (/printf\(|cout|system\.out|print\(/.test(lower)) {
    draft = draftForIntent(lang, "io_sum");
    nextHint = "Next: format output and validate with sample inputs.";
  } else if (/(int|double|float)\s+\w+\s*;/.test(lower) || /(let|const|var)\s+\w+\s*;?/.test(lower) || /\b[a-z]\s*=\s*\d+/.test(lower)) {
    draft = draftForIntent(lang, "arithmetic_add");
    nextHint = "Next: define addTwoNumbers(a, b) and return a + b; add a quick test.";
  } else if (/reverse|reversal/.test(lower)) {
    draft = draftForIntent(lang, "string_reverse");
    nextHint = "Next: implement reverse(s) and verify with a sample string.";
  } else if (/public\s+class|static\s+void\s+main/.test(lower)) {
    draft = draftForIntent(lang, "class_main");
    nextHint = "Next: flesh out main and call your functions with sample inputs.";
  } else {
    draft = draftForIntent(lang, "function_incomplete");
    nextHint = "Next: identify goal and implement a minimal function that returns a result.";
  }

  const hypeChoices = [
    "Yo legend — momentum is back 🔥 Dial it in.",
    "Locked in — ship mode activated ⚡",
    "Let’s land this — clean and strong 🚀",
    "Energy’s up — you’re close, send it 💥",
    "Flow restored — precision time 🎯",
    "Dialed — finish elegantly ✨",
    "Future self says thanks — ship it 📦",
    "You’ve got this — one decisive push 🧠",
    "Clarity unlocked — execute next ✅",
  ];
  const greeting = note?.trim() ? `Back to "${note.trim()}" — let’s lock it in.` : "Welcome back — resuming your last momentum.";

  return {
    greeting,
    summary: [nextHint, ...summary],
    draftCode: draft,
    hypeMessage: pick(hypeChoices),
  };
}
