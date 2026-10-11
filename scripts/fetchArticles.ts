#!/usr/bin/env node
import { CronScheduler } from '@/services/cronScheduler';
import { ArticleFetchingService } from '@/services/articleFetchingService';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  const scheduler = new CronScheduler();
  const fetchingService = new ArticleFetchingService();

  switch (command) {
    case 'start':
      console.log('Starting PIB article fetching service...');
      scheduler.start();
      
      // Keep the process alive
      process.on('SIGINT', () => {
        console.log('\nShutting down article fetching service...');
        process.exit(0);
      });
      
      process.on('SIGTERM', () => {
        console.log('\nTerminating article fetching service...');
        process.exit(0);
      });
      break;

    case 'run':
      console.log('Running article fetching pipeline...');
      await fetchingService.run();
      process.exit(0);
      break;

    case 'dry-run':
      console.log('Running article fetching pipeline (dry run)...');
      await fetchingService.runDry();
      process.exit(0);
      break;

    case 'check':
      console.log('Checking environment configuration...');
      const envCheck = fetchingService.checkEnvironment();
      
      console.log('\n=== Environment Check ===');
      console.log(`Gemini API: ${envCheck.geminiConfigured ? '✓ Configured' : '✗ Missing (GEMINI_API_KEY)'}`);
      console.log(`Database: ${envCheck.databaseConfigured ? '✓ Configured' : '✗ Missing (DATABASE_URL)'}`);
      
      if (!envCheck.ok) {
        console.log('\nMissing environment variables:', envCheck.missing.join(', '));
        console.log('\nPlease add these to your .env file:');
        console.log('GEMINI_API_KEY=your_gemini_api_key_here');
        console.log('DATABASE_URL=your_mongodb_connection_string_here');
        process.exit(1);
      } else {
        console.log('\n✓ All environment variables are configured!');
      }
      break;

    case 'status':
      console.log('Getting service status...');
      const status = scheduler.getStatus();
      
      console.log('\n=== Service Status ===');
      console.log(`Currently running: ${status.isRunning ? 'Yes' : 'No'}`);
      
      if (status.lastRun) {
        console.log('\nLast run:', status.lastRun);
      } else {
        console.log('\nNo previous runs found.');
      }
      break;

    case 'help':
    default:
      console.log(`
PIB Article Fetching Service CLI

Usage:
  npm run fetch-articles [command]

Commands:
  start     Start the cron job scheduler (runs daily at 2:00 AM UTC)
  run       Run the article fetching pipeline once
  dry-run   Run the pipeline without saving to database
  check     Check environment configuration
  status    Get current service status
  help      Show this help message

Examples:
  npm run fetch-articles check        # Check environment
  npm run fetch-articles dry-run      # Test without saving
  npm run fetch-articles run          # Run full pipeline once
  npm run fetch-articles start        # Start scheduled service

Environment Variables:
  Required:
    GEMINI_API_KEY    - Google Gemini API key
    DATABASE_URL      - MongoDB connection string
  
  Optional:
    NODE_ENV          - Set to "production" for production mode
    PORT              - Server port (default: 3000)
`);
      break;
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Run the CLI
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});