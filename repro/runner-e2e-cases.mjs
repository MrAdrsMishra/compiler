import axios from "axios";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUNNER_PORT = 4100;
const RUNNER_URL = `http://localhost:${RUNNER_PORT}`;

const LANGUAGE_CASES = [
  { selectedLanguage: "c",
    code: '#include <stdio.h>\nint main(){ int x; scanf("%d", &x); printf("c-result:%d", x+1); return 0; }',
    stdin: "41", expectedIncludes: ["c-result:42"] },
  { selectedLanguage: "cpp",
    code: '#include <iostream>\nint main(){ long long n; std::cin >> n; std::cout << "cpp-result:" << n*n; return 0; }',
    stdin: "7", expectedIncludes: ["cpp-result:49"] },
  { selectedLanguage: "python",
    code: "a = int(input())\nb = int(input())\nprint('python-result:' + str(a+b))",
    stdin: "2\n3", expectedIncludes: ["python-result:5"] },
  { selectedLanguage: "go",
    code: 'package main\nimport "fmt"\nfunc main(){ var a, b int; fmt.Scan(&a, &b); fmt.Printf("go-result:%d", a+b) }',
    stdin: "10 20", expectedIncludes: ["go-result:30"] },
  { selectedLanguage: "rust",
    code: 'use std::io::Read; fn main(){ let mut s = String::new(); std::io::stdin().read_to_string(&mut s).unwrap(); let v: Vec<i32> = s.trim().split_whitespace().map(|x| x.parse().unwrap()).collect(); print!("rust-result:{}", v[0]+v[1]); }',
    stdin: "5 6", expectedIncludes: ["rust-result:11"] },
  { selectedLanguage: "javascript",
    code: "const rl = require('readline').createInterface({input: process.stdin}); rl.on('line', l => { const [a,b] = l.split(' ').map(Number); console.log('js-result:' + (a+b)); process.exit(0); });",
    stdin: "3 4", expectedIncludes: ["js-result:7"] },
  { selectedLanguage: "typescript",
    code: "const fmt = (n: number) => `ts-result:${n}`; const rl = require('readline').createInterface({input: process.stdin}); rl.on('line', l => { const [a,b] = l.split(' ').map(Number); console.log(fmt(a+b)); process.exit(0); });",
    stdin: "8 9", expectedIncludes: ["ts-result:17"] },
  { selectedLanguage: "java",
    code: 'import java.util.*; public class code { public static void main(String[] a){ Scanner sc = new Scanner(System.in); int x = sc.nextInt(); int y = sc.nextInt(); System.out.println("java-result:" + (x*y)); } }',
    stdin: "4 5", expectedIncludes: ["java-result:20"] },
  { selectedLanguage: "csharp",
    code: 'using System; class P { static void Main(){ string[] p = Console.ReadLine().Split(); int a = int.Parse(p[0]); int b = int.Parse(p[1]); Console.WriteLine("csharp-result:" + (a+b)); } }',
    stdin: "7 8", expectedIncludes: ["csharp-result:15"] },
  { selectedLanguage: "php",
    code: "<?php $in = fgets(STDIN); $p = explode(' ', $in); echo 'php-result:' . ((int)$p[0] + (int)$p[1]); ?>",
    stdin: "12 13", expectedIncludes: ["php-result:25"] },
  { selectedLanguage: "ruby",
    code: "p = gets.split.map(&:to_i)\nputs \"ruby-result:#{p[0] + p[1]}\"",
    stdin: "14 15", expectedIncludes: ["ruby-result:29"] },
  { selectedLanguage: "kotlin",
    code: 'fun main() { val (a, b) = readLine()!!.split(" ").map { it.toInt() }; println("kotlin-result:${a + b}") }',
    stdin: "1 2", expectedIncludes: ["kotlin-result:3"] },
  { selectedLanguage: "swift",
    code: 'let p = readLine()!.split(separator: " ").map { Int($0)! }; print("swift-result:\\(p[0] + p[1])")',
    stdin: "9 10", expectedIncludes: ["swift-result:19"] },
  { selectedLanguage: "r",
    code: 'input <- readLines(file("stdin"))\nnums <- as.integer(strsplit(input, " ")[[1]])\ncat("r-result:", sum(nums))',
    stdin: "6 7\n", expectedIncludes: ["r-result: 13"] },
  { selectedLanguage: "bash",
    code: "read a b\necho \"bash-result:$((a + b))\"",
    stdin: "2 2", expectedIncludes: ["bash-result:4"] },
];

const MALICIOUS_CASES = [
  { selectedLanguage: "python", code: 'import os\nos.system("rm -rf /")', label: "python os.system" },
  { selectedLanguage: "bash", code: ":(){ :|:& };:", label: "bash fork bomb" },
  { selectedLanguage: "javascript", code: 'require("child_process").execSync("id")', label: "js child_process" },
];

async function testRateLimit() {
  const responses = [];
  for (let i = 0; i < 40; i++) {
    const r = await axios.post(
      `${RUNNER_URL}/run`,
      { selectedLanguage: "python", userCode: "print(1)", userInput: "" },
      { validateStatus: () => true }
    );
    responses.push(r.status);
  }
  const blocked = responses.filter((s) => s === 429).length;
  const ok = blocked > 0;
  console.log(`${ok ? "   ✅" : "  ❌"} rate limit: 40 rapid requests -> ${blocked} blocked (429)`);
  return ok;
}

export { LANGUAGE_CASES, MALICIOUS_CASES, RUNNER_URL, RUNNER_PORT, testRateLimit, __dirname };