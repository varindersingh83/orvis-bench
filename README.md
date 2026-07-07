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
| **`nvidia/nemotron-3-ultra-550b-a55b:free`** | coding | **1400** | **$0.00000** *(free)* | **1,749ms** | PASSED |
| **`nvidia/nemotron-3-ultra-550b-a55b:free`** | instruction_following | **1400** | **$0.00000** *(free)* | 17,540ms | PASSED |
| **`anthropic/claude-sonnet-5`** | coding | **1400** | **$0.00128** | **3,485ms** | PASSED |
| **`anthropic/claude-sonnet-5`** | instruction_following | **1400** | **$0.00168** | **3,550ms** | PASSED |
| **`openai/gpt-5.5`** | instruction_following | **1400** | **$0.00235** | **2,770ms** | PASSED |
| **`~anthropic/claude-fable-latest`** | instruction_following | **1400** | **$0.01082** | 4,292ms | PASSED |
| **`~anthropic/claude-fable-latest`** | coding | **1400** | **$0.01070** | 4,926ms | PASSED |
| **`sakana/fugu-ultra`** | coding | **1400** | **$0.00996** | 9,050ms | PASSED |
| **`sakana/fugu-ultra`** | instruction_following | **1400** | **$0.01713** | 11,486ms | PASSED |

---

## 📈 Arena Pareto Grid Mapping

This grid charts the optimal boundary (the trade-off curve) balancing **Target Intelligence / Reference Elos** against **Actual API Transaction Cost**:

```
Intelligence/Elo ────────► (Higher EElo is better)
  ▲
  │                                                                 [~anthropic/claude-fable-latest]
  │                                                                   (EElo: 1395 | Cost: $0.010)
  │
  │                                             [openai/gpt-5.5]
  │                                               (EElo: 1380 | Cost: $0.002)
  │
  │                         [anthropic/claude-sonnet-5]
  │                           (EElo: 1342 | Cost: $0.001)
  │
  │             [sakana/fugu-ultra]
  │               (EElo: 1315 | Cost: $0.017)
  │
  │ [nvidia/nemotron-3-ultra-550b-a55b:free]
  │   (EElo: 1285 | Cost: $0.00)
  │
  └─────────────────────────────────────────────────────────────────────────────────────────────►
  0                                                                                   Cost (USD)
```

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
