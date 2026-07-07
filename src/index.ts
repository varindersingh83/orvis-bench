import { BenchDatabase } from './core/db';
import { Evaluator } from './evaluator';
import { INSTRUCTION_FOLLOWING_CASES, CODING_RECOVERY_CASES } from './cases/suites';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

// Active candidate models spanning both cheap frontiers and luxury frontiers
const MODELS_TO_BENCH = [
  "google/gemini-2.5-flash",
  "meta-llama/llama-3.3-70b-instruct",
  "anthropic/claude-sonnet-5", // Correct Arena / OpenRouter Sonnet 5 slug
  "deepseek/deepseek-chat"
];

async function main() {
  const db = new BenchDatabase();
  await db.initSchema();

  console.log("📥 Seeding OpenRouter and Arena.ai model directory pricing into local database...");
  await db.upsertPricing("google/gemini-2.5-flash", 0.075, 0.3, 1268);
  await db.upsertPricing("meta-llama/llama-3.3-70b-instruct", 0.6, 0.6, 1290);
  await db.upsertPricing("anthropic/claude-sonnet-5", 2.0, 10.0, 1342); // Seed Sonnet 5 with correct OpenRouter values
  await db.upsertPricing("deepseek/deepseek-chat", 0.14, 0.28, 1310);

  const evaluator = new Evaluator(OPENROUTER_API_KEY, db);

  console.log("🏁 Starting Orvis Custom Benchmark Execution Pass...");
  
  const allCases = [
    ...INSTRUCTION_FOLLOWING_CASES,
    ...CODING_RECOVERY_CASES
  ];

  for (const modelId of MODELS_TO_BENCH) {
    for (const testCase of allCases) {
      try {
        await evaluator.evaluateModel(modelId, testCase);
      } catch (err) {
        console.error(`❌ Failed run for ${modelId}:`, err);
      }
    }
  }

  console.log("\n=======================================================");
  console.log("📈 GENERATING CUSTOM ORVIS-BENCH LEADERBOARD (ARENA PARETO FRONTIER)");
  console.log("=======================================================");
  
  const results = await db.getLeaderboard();
  console.log(String.prototype.padEnd);
  
  console.log(
    "Model ID".padEnd(35) + 
    "| Category".padEnd(25) + 
    "| Arena Score".padEnd(15) + 
    "| Cost".padEnd(10) + 
    "| Success %".padEnd(15) + 
    "| Arena Elo (Ref)"
  );
  console.log("-".repeat(115));
  
  for (const row of results) {
    console.log(
      row.model_id.padEnd(35) + 
      `| ${row.category}`.padEnd(25) + 
      `| ${row.avg_arena_score}`.padEnd(15) + 
      `| $${row.avg_cost_usd.toFixed(4)}`.padEnd(10) + 
      `| ${row.success_rate.toFixed(1)}%`.padEnd(15) + 
      `| ${row.openrouter_elo || 'N/A'}`
    );
  }
}

main().catch(console.error);
