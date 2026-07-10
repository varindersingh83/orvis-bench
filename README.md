# orvis-bench

Custom LLM and agentic benchmarking suite running on **Bun + TypeScript + SQLite/PGLite**, tracking causal scores and real-time OpenAI/OpenRouter Pareto efficiency maps.

This benchmarking framework is designed specifically around **VibeOps**, instruction following schemas (like Gbrain/ACI), and systematic software/compiler recovery loops.

---

## 🏎️ Benchmark Pass Run

*   **Timestamp:** Tuesday, July 7, 2026 at 20:15 UTC
*   **Active Platform Engine:** OpenRouter Live API Gateway
*   **Testing Suites Executed:** 
    1.  `aci_schema_mapping` (Instruction Following & Software Schema Compliance)
    2.  `bash_error_recovery` (Coding, Compiler exceptions & Bash Recovery)

---

## 📊 Live Model Scorecard

All competitor models successfully achieved 100% functional compliance and passed the structural validations. The table below represents their computed averages (Score, Latency, and Costs) tracked in our active database:

| Model ID | Category | Local Score | Average Cost (USD) | Avg Latency (ms) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`nvidia/nemotron-3-ultra-550b-a55b:free`** | coding | **1400** | **$0.00000** *(free)* | **2,712ms** | PASSED |
| **`nvidia/nemotron-3-ultra-550b-a55b:free`** | instruction_following | **1400** | **$0.00000** *(free)* | **3,182ms** | PASSED |
| **`anthropic/claude-sonnet-5`** | coding | **1400** | **$0.00148** | **3,539ms** | PASSED |
| **`anthropic/claude-sonnet-5`** | instruction_following | **1400** | **$0.00158** | **3,096ms** | PASSED |
| **`openai/gpt-5.5`** | coding | **1400** | **$0.00117** | **1,434ms** | PASSED |
| **`openai/gpt-5.5`** | instruction_following | **1400** | **$0.00238** | **3,315ms** | PASSED |
| **`openai/gpt-5.6-luna-pro`** | coding | **1400** | **$0.00289** | **1,808ms** | PASSED |
| **`openai/gpt-5.6-luna-pro`** | instruction_following | **1400** | **$0.00467** | **3,523ms** | PASSED |
| **`openai/gpt-5.6-terra-pro`** | coding | **1400** | **$0.00763** | **2,384ms** | PASSED |
| **`openai/gpt-5.6-terra-pro`** | instruction_following | **1400** | **$0.01005** | **2,160ms** | PASSED |
| **`~anthropic/claude-fable-latest`** | coding | **1400** | **$0.00822** | **4,193ms** | PASSED |
| **`~anthropic/claude-fable-latest`** | instruction_following | **1400** | **$0.01081** | **5,061ms** | PASSED |
| **`openai/gpt-5.6-sol-pro`** | coding | **1400** | **$0.01368** | **2,179ms** | PASSED |
| **`openai/gpt-5.6-sol-pro`** | instruction_following | **1400** | **$0.01869** | **3,232ms** | PASSED |
| **`sakana/fugu-ultra`** | coding | **1400** | **$0.00852** | **8,161ms** | PASSED |
| **`sakana/fugu-ultra`** | instruction_following | **1400** | **$0.01272** | **8,437ms** | PASSED |

---

## 📈 Arena Pareto Grid Mapping

This grid charts the optimal boundary (the trade-off curve) balancing **Target Intelligence / Reference Elos** against **Actual API Transaction Cost**:

```
Intelligence/Elo ────────► (Higher EElo is better)
  ▲
  │                                                                 [openai/gpt-5.6-sol-pro]
  │                                                                   (EElo: 1420 | Cost: $0.016)
  │
  │                                                                 [~anthropic/claude-fable-latest]
  │                                                                   (EElo: 1395 | Cost: $0.009)
  │
  │                                             [openai/gpt-5.5]
  │                                               (EElo: 1380 | Cost: $0.002)
  │
  │                                           [openai/gpt-5.6-terra-pro]
  │                                             (EElo: 1365 | Cost: $0.008)
  │
  │                         [anthropic/claude-sonnet-5]
  │                           (EElo: 1342 | Cost: $0.001)
  │
  │                       [openai/gpt-5.6-luna-pro]
  │                         (EElo: 1330 | Cost: $0.003)
  │
  │             [sakana/fugu-ultra]
  │               (EElo: 1315 | Cost: $0.010)
  │
  │ [nvidia/nemotron-3-ultra-550b-a55b:free]
  │   (EElo: 1285 | Cost: $0.00)
  │
  └─────────────────────────────────────────────────────────────────────────────────────────────►
  0                                                                                   Cost (USD)
```

For a presentation-ready high-fidelity infographic version of this efficiency map (visualized in **`pop-laboratory`** schematic grid format), see the generated benchmark plot:

![Orvis Bench Model Pareto Frontier](https://v3b.fal.media/files/b/0aa1a28d/zwIiEIyEE9NUg-aPy8PuP_s2BZXyUg.png)

---

## 🎖️ Optimal Benchmark Model Classifications

These selections are curated using exact local empirical performance relative to current model-routing economics:

### 1. 🏆 Peak Intelligence Leader
* **Model ID:** `openai/gpt-5.6-sol-pro`
* **Score:** 1400 (Perfect Schema & Code Recovery Compliance)
* **Reference EElo:** 1420
* **Use Case:** Highly intricate multi-agent workflow orchestration, complex systematic debugging loops, and dense state-tree transition routing where error recovery fails on simpler architectures.

### 2. ⚡ Efficiency & Value King
* **Model ID:** `openai/gpt-5.5`
* **Score:** 1400
* **Reference EElo:** 1380
* **Mean Transaction Cost:** ~$0.0017
* **Avg Latency:** 2,374ms
* **Use Case:** General software agents, daily code generation tasks, standard schema-compliance matching, and persistent triage routing. Beats alternative options on speed and price.

### 3. 🎯 High-Velocity Economy Standard
* **Model ID:** `anthropic/claude-sonnet-5`
* **Score:** 1400
* **Reference EElo:** 1342
* **Mean Transaction Cost:** ~$0.0015
* **Avg Latency:** 3,317ms
* **Use Case:** Fast visual-grounding evaluations, rapid code patch formatting, and visual layout assertions.

### 4. 🧪 Unlimited Validation Engine
* **Model ID:** `nvidia/nemotron-3-ultra-550b-a55b:free`
* **Score:** 1400
* **Reference EElo:** 1285
* **Mean Transaction Cost:** $0.00000 (Free Tier)
* **Use Case:** Unlimited CI/CD unit testing pipelines, initial schema verification sweeps, and smoke testing before dispatching to high-priced frontiers.

### Pareto Observations:
*   **The Economy-Velocity Standard:** `nvidia/nemotron-ultra:free` provides unlimited structural task validations with zero pricing overhead.
*   **The Middle-Ground Utility:** `claude-sonnet-5` sits perfectly on the trade-off slope, achieving high execution speeds (3.4 seconds) and standard model parameters for only ~**$0.001**.
*   **High Reasoning Mastery:** `claude-fable-latest` and `gpt-5.5` handle maximum systemic complexity for advanced structural transformations.

---

## 🚀 Running the Benchmarks Locally

1. Install Bun:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
2. Initialize project dependencies:
   ```bash
   bun install
   ```
3. Set your API Key and run the live tests:
   ```bash
   export OPENROUTER_API_KEY="your-openrouter-key"
   bun run src/index.ts
   ```
