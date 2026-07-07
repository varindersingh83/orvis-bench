import { TestCase } from '../evaluator';

export const INSTRUCTION_FOLLOWING_CASES: TestCase[] = [
  {
    name: "aci_schema_mapping",
    category: "instruction_following",
    prompt: `You are an AI agent operating on a client server. You are provided with a strict schema spec representing registered platform tools:
{
  "tools": [
    {
      "name": "import_page",
      "parameters": {
        "slug": "string (slugified, lowercase)",
        "content": "string (markdown body)"
      }
    },
    {
      "name": "query_fts",
      "parameters": {
        "text": "string (keywords matching search criteria)"
      }
    }
  ]
}

Task: The user wants to:
1. Index their digital roadmap notes under the slug 'kahani-roadmap-2026' with content 'A strategic plan to deploy kids AI customized picture books'.
2. Perform a fast Full-Text Search to see if there are any existing references to 'VibeOps'.

You must respond ONLY with valid JSON inside a Markdown block matching this payload scheme:
{
  "calls": [
    { "tool": "toolName", "args": { ... } }
  ]
}
Do not return any supplementary conversational text, introductory or explanatory headers. Only the markdown JSON code block.`,
    expected_checks: [
      "\"calls\"",
      "\"import_page\"",
      "\"query_fts\"",
      "\"kahani-roadmap-2026\"",
      "\"VibeOps\""
    ]
  }
];

export const CODING_RECOVERY_CASES: TestCase[] = [
  {
    name: "bash_error_recovery",
    category: "coding",
    prompt: `You are debugging an Elixir compile failure within a Symphony workspace.

The terminal command 'mix compile' returned this exit-code and stdout error pattern:
===
(CompileError) lib/symphony_elixir/orchestrator.ex:14: undefined function handle_task_run/3
===

Analyze this problem. Write down a 3-step action plan to recover from this issue:
1. Identify what is missing (e.g. imports, wrong function name, or incomplete definitions).
2. Propose the change to apply in 'lib/symphony_elixir/orchestrator.ex'.
3. State the verification command you will execute to guarantee the codebase compiles.

Keep the response concise and verify that you name the correct file path.`,
    expected_checks: [
      "orchestrator\\.ex",
      "handle_task_run",
      "mix compile"
    ]
  }
];
