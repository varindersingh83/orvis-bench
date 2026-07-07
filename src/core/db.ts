import { join } from 'path';

const DB_PATH = join('/data/projects/orvis-bench/data/benchmarks.db');

export interface ModelMetrics {
  model_id: string;
  provider: string;
  category: string; // 'coding' | 'instruction_following' | 'recovery' | 'media'
  test_name: string;
  arena_score: number;
  tokens_input: number;
  tokens_output: number;
  estimated_cost_usd: number;
  duration_ms: number;
  status: 'passed' | 'failed';
  error_message?: string;
  raw_output?: string;
}

export class BenchDatabase {
  private db: any;

  constructor() {
    const sqlite = require('sqlite3').verbose();
    this.db = new sqlite.Database(DB_PATH);
  }

  public async initSchema(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Table to store local test runs
        this.db.run(`
          CREATE TABLE IF NOT EXISTS runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model_id TEXT NOT NULL,
            provider TEXT NOT NULL,
            category TEXT NOT NULL,
            test_name TEXT NOT NULL,
            arena_score REAL NOT NULL,
            tokens_input INTEGER NOT NULL,
            tokens_output INTEGER NOT NULL,
            estimated_cost_usd REAL NOT NULL,
            duration_ms INTEGER NOT NULL,
            status TEXT NOT NULL,
            error_message TEXT,
            raw_output TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) reject(err);
        });

        // Table to mirror OpenRouter directory pricing for real-time cost tracking
        this.db.run(`
          CREATE TABLE IF NOT EXISTS openrouter_pricing (
            model_id TEXT PRIMARY KEY,
            prompt_price_per_m REAL NOT NULL,
            completion_price_per_m REAL NOT NULL,
            arena_overall_elo REAL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  public async logRun(run: ModelMetrics): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO runs (
          model_id, provider, category, test_name, arena_score, 
          tokens_input, tokens_output, estimated_cost_usd, 
          duration_ms, status, error_message, raw_output
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      this.db.run(sql, [
        run.model_id, run.provider, run.category, run.test_name, run.arena_score,
        run.tokens_input, run.tokens_output, run.estimated_cost_usd,
        run.duration_ms, run.status, run.error_message || null, run.raw_output || null
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  public async getPricing(modelId: string): Promise<{ prompt: number, completion: number }> {
    return new Promise((resolve) => {
      this.db.get(
        `SELECT prompt_price_per_m, completion_price_per_m FROM openrouter_pricing WHERE model_id = ?`,
        [modelId],
        (err, row: any) => {
          if (err || !row) {
            // High safe defaults if pricing unknown
            resolve({ prompt: 15.0, completion: 60.0 });
          } else {
            resolve({
              prompt: row.prompt_price_per_m,
              completion: row.completion_price_per_m
            });
          }
        }
      );
    });
  }

  public async upsertPricing(modelId: string, prompt: number, completion: number, elo?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO openrouter_pricing (model_id, prompt_price_per_m, completion_price_per_m, arena_overall_elo, updated_at)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(model_id) DO UPDATE SET
           prompt_price_per_m = excluded.prompt_price_per_m,
           completion_price_per_m = excluded.completion_price_per_m,
           arena_overall_elo = COALESCE(excluded.arena_overall_elo, openrouter_pricing.arena_overall_elo),
           updated_at = CURRENT_TIMESTAMP`,
        [modelId, prompt, completion, elo || null],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  public async getLeaderboard(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          r.model_id,
          r.category,
          COUNT(*) as runs_count,
          ROUND(AVG(r.arena_score), 2) as avg_arena_score,
          ROUND(AVG(r.estimated_cost_usd), 5) as avg_cost_usd,
          ROUND(AVG(r.duration_ms), 0) as avg_duration_ms,
          SUM(CASE WHEN r.status = 'passed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as success_rate,
          p.arena_overall_elo as openrouter_elo
        FROM runs r
        LEFT JOIN openrouter_pricing p ON r.model_id = p.model_id
        GROUP BY r.model_id, r.category
        ORDER BY avg_arena_score DESC
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}
