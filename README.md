# Secure Code Runner Platform

A **Docker‑based, sandboxed online code execution system** inspired by online judges (Codeforces, LeetCode, HackerRank).
It securely compiles and runs **untrusted user code** across multiple languages with strict resource and filesystem isolation.

---

## 🚀 Features

*  Strong sandboxing** (read‑only filesystem, no network)
*  Multi‑language support** (C++, Go, Rust, Java, Node.js)
*  Resource limits** (CPU, memory, PIDs)
*  Isolated execution** using tmpfs
*  No root execution** inside containers
*  Designed to handle **malicious or infinite user code**

---

## 🧱 Architecture Overview

```
Client
  │
  ▼
Main API (Express.js)
  │
  ▼
Language Runner Service (Docker)
  │
  ├─ Mount user code (read‑only)
  ├─ Compile code
  ├─ Execute binary in exec‑enabled tmpfs
  └─ Capture stdout / stderr
```

Each language runs inside its **own minimal Docker image**.

---

## 🧩 Services

### 1️⃣ Main Service (`server.js`)

* Receives code + input
* Chooses correct runner
* Spawns Docker container with security flags
* Collects output & verdict

Runs on **port 3000**.

---

### 2️⃣ Runner Services

Each language has a dedicated image:

| Language | Image         | Notes                 |
| -------- | ------------- | --------------------- |
| C++      | `cpp-runner`  | Uses `g++`            |
| Go       | `go-runner`   | Custom `GOCACHE`      |
| Rust     | `rust-runner` | `rustc` static binary |
| Java     | `java-runner` | JVM based             |
| Node     | `node-runner` | JS runtime            |

---

## 🔐 Security Model

### Filesystem

| Path        | Permission           | Purpose           |
| ----------- | -------------------- | ----------------- |
| `/app/work` | RW, **noexec**       | User code + input |
| `/tmp`      | RW, **exec allowed** | Compiled binaries |
| `/`         | Read‑only            | System safety     |

---

### Docker Restrictions

```bash
--read-only
--network=none
--pids-limit=64
--memory=256m
--cpus=0.5
--cap-drop=ALL
--security-opt=no-new-privileges
--tmpfs=/tmp:rw,nosuid,size=64m
```

---

## 🏃 Execution Flow

1. User submits code + input
2. Main service writes files to `/app/work`
3. Docker container is spawned
4. Code is **compiled** in `/app/work`
5. Binary copied to `/tmp`
6. Binary executed safely
7. Output collected

---

## 🧪 Example Request

```json
{
  "selectedLanguage": "rust",
  "userCode": "fn main(){println!(\"Hello\");}",
  "userInput": ""
}
```

### Response

```json
{
  "success": true,
  "verdict": "AC",
  "output": "Hello",
  "error": null
}
```

---

## ⚙️ Runner Script Secrity

* **Never execute from user‑writable directory**
* **Compile errors redirected to writable paths**
* **Execution happens only from exec‑enabled tmpfs**

Ensure Docker daemon is running.


**Adarsh Mishra**
Backend / Systems Engineering Enthusiast

---

## ⭐ Final Note

This is **not a tutorial project** — it’s a **real‑world sandbox** i have used this on my T-P-App repo.
If you understand this codebase**.
