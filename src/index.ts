import { BenchDatabase } from './core/db';
import { Evaluator } from './evaluator';
import { INSTRUCTION_FOLLOWING_CASES, CODING_RECOVERY_CASES } from './cases/suites';

import { OPENROUTER_API_KEY as KEY } from './key';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || KEY;

// Active candidate models spanning both cheap frontiers and luxury frontiers
const MODELS_TO_BENCH = [
  "sakana/fugu-ultra",
  "anthropic/claude-sonnet-5",
  "~anthropic/claude-fable-latest",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "openai/gpt-5.5",
  "openai/gpt-5.6-luna-pro",
  "openai/gpt-5.6-terra-pro",
  "openai/gpt-5.6-sol-pro"
];

async function main() {
  const db = new BenchDatabase();
  await db.initSchema();

  console.log("📥 Seeding OpenRouter and Arena.ai model directory pricing into local database...");
  await db.upsertPricing("sakana/fugu-ultra", 5.0, 30.0, 1315);
  await db.upsertPricing("anthropic/claude-sonnet-5", 2.0, 10.0, 1342);
  await db.upsertPricing("~anthropic/claude-fable-latest", 15.0, 75.0, 1395);
  await db.upsertPricing("nvidia/nemotron-3-ultra-550b-a55b:free", 0.0, 0.0, 1285);
  await db.upsertPricing("openai/gpt-5.5", 5.0, 15.0, 1380);
  await db.upsertPricing("openai/gpt-5.6-luna-pro", 1.0, 6.0, 1330);
  await db.upsertPricing("openai/gpt-5.6-terra-pro", 2.5, 15.0, 1365);
  await db.upsertPricing("openai/gpt-5.6-sol-pro", 5.0, 30.0, 1420);

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
