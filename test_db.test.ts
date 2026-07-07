import { describe, test, expect, beforeAll } from "bun:test";
import { BenchDatabase } from "./src/core/db";

describe("Orvis Bench - Core Database Verification", () => {
  let db: BenchDatabase;

  beforeAll(async () => {
    db = new BenchDatabase();
    await db.initSchema();
  });

  test("upsert pricing and retrieval returns correct values", async () => {
    await db.upsertPricing("test/model", 0.5, 1.5, 1200);
    const pricing = await db.getPricing("test/model");
    expect(pricing.prompt).toBe(0.5);
    expect(pricing.completion).toBe(1.5);
  });

  test("pricing queries return safe fallback defaults if unknown", async () => {
    const pricing = await db.getPricing("unknown/model");
    expect(pricing.prompt).toBe(15.0);
    expect(pricing.completion).toBe(60.0);
  });
});
