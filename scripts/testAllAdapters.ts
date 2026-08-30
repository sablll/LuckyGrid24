import { IngestionEngine } from '../server/services/ingestionEngine';
import { LotteryStore } from '../server/storage';

async function main() {
  console.log('--- TESTING ALL 10 LOTTERY ADAPTERS LIVE ---');
  const store = new LotteryStore();
  const engine = new IngestionEngine(
    (results) => store.saveResults(results),
    (id) => store.hasResult(id)
  );
  engine.registerDefaultAdapters();

  const adapters = engine.getAdapters();
  console.log(`Found ${adapters.length} registered adapters:\n`);

  for (const adapter of adapters) {
    console.log(`\n========================================`);
    console.log(`Testing Adapter: [${adapter.id}] (${adapter.stateName} - ${adapter.name})`);
    console.log(`Base URL: ${adapter.baseUrl}`);
    console.log(`----------------------------------------`);
    
    try {
      const startTime = Date.now();
      const execution = await engine.runAdapterIngestion(adapter.id);
      const elapsed = Date.now() - startTime;

      console.log(`Elapsed: ${elapsed}ms`);
      console.log(`Success: ${execution.success}`);
      console.log(`Records Ingested: ${execution.recordsIngested}`);
      console.log(`Records Skipped (Duplicates): ${execution.recordsSkippedDuplicates}`);
      console.log(`Validation Rejections: ${execution.recordsRejectedValidation}`);
      if (execution.errors && execution.errors.length > 0) {
        console.log(`Errors:`, execution.errors);
      }

      // Check results in store
      const { results } = store.getAllResults({ stateCode: adapter.stateCode, limit: 5 });
      console.log(`Stored Results Count for ${adapter.stateCode}: ${results.length}`);
      if (results.length > 0) {
        const top = results[0];
        console.log(`  Top Result ID: ${top.id}`);
        console.log(`  Lottery Name: ${top.lotteryName}`);
        console.log(`  Draw Number: ${top.drawNumber}`);
        console.log(`  Draw Date: ${top.drawDate}`);
        console.log(`  Draw Time: ${top.drawTime}`);
        console.log(`  1st Prize: ${top.firstPrize.winningTicket} (${top.firstPrize.amountFormatted})`);
        console.log(`  Official Source: ${top.officialSource.sourceName}`);
        console.log(`  Source URL: ${top.officialSource.sourceUrl}`);
        console.log(`  Verification: ${top.verificationStatus} (isDemo: ${top.isDemoData})`);
      }
    } catch (err: any) {
      console.error(`FAILED running adapter ${adapter.id}:`, err.message);
    }
  }

  console.log('\n========================================');
  console.log('SUMMARY OF STORE AFTER RUNNING ALL ADAPTERS:');
  const allResults = store.getAllResults({ limit: 100 });
  console.log(`Total records in store: ${allResults.total}`);
}

main().catch(console.error);
