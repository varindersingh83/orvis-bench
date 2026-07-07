import { BenchDatabase } from './core/db';

export interface TestCase {
  name: string;
  category: string;
  prompt: string;
  expected_checks: string[];
}

export class Evaluator {
  private apiKey: string;
  private db: BenchDatabase;

  constructor(apiKey: string, db: BenchDatabase) {
    this.apiKey = apiKey;
    this.db = db;
  }

  // Uses OpenRouter directly so we have precise control over models, tracking, and telemetry
  public async evaluateModel(modelId: string, testCase: TestCase): Promise<void> {
    console.log(`\n🚀 [orvis-bench] Evaluating model: ${modelId} on [${testCase.category}] -> "${testCase.name}"`);
    const pricing = await this.db.getPricing(modelId);
    
    const startTime = Date.now();
    let status: 'passed' | 'failed' = 'failed';
    let errorMessage = '';
    let arenaScore = 800; // base floor
    let rawOutput = '';
    let inputTokens = 0;
    let outputTokens = 0;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/varindersingh83/orvis-bench',
          'X-Title': 'Orvis Benchmarking Framework'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: testCase.prompt }],
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter API fail: ${response.status} - ${errText}`);
      }

      const data: any = await response.json();
      rawOutput = data.choices[0]?.message?.content || '';
      inputTokens = data.usage?.prompt_tokens || 0;
      outputTokens = data.usage?.completion_tokens || 0;

      // Assess pass conditions (all checks must list in output)
      const checksPass = testCase.expected_checks.every(check => 
        new RegExp(check, 'i').test(rawOutput)
      );

      if (checksPass) {
        status = 'passed';
        arenaScore = 1400; // Perfect structural compliance
      } else {
        const passedCount = testCase.expected_checks.filter(check => 
          new RegExp(check, 'i').test(rawOutput)
        ).length;
        arenaScore = 800 + Math.round((passedCount / testCase.expected_checks.length) * 400); // partial credit
        errorMessage = `Failed validation checks. Passed: ${passedCount}/${testCase.expected_checks.length}`;
      }

    } catch (e: any) {
      status = 'failed';
      arenaScore = 600; // API / parsing fatal floor
      errorMessage = e.message || 'Unknown execution error';
    }

    const duration = Date.now() - startTime;
    const estimatedCost = ((inputTokens / 1_000_000) * pricing.prompt) + 
                          ((outputTokens / 1_000_000) * pricing.completion);

    await this.db.logRun({
      model_id: modelId,
      provider: modelId.split('/')[0],
      category: testCase.category,
      test_name: testCase.name,
      arena_score: arenaScore,
      tokens_input: inputTokens,
      tokens_output: outputTokens,
      estimated_cost_usd: estimatedCost,
      duration_ms: duration,
      status,
      error_message: errorMessage,
      raw_output: rawOutput
    });

    console.log(`📊 Result: Status=${status.toUpperCase()} | Score=${arenaScore} | Cost=$${estimatedCost.toFixed(5)} | Time=${duration}ms`);
  }
}
