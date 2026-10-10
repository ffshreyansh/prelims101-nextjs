import cron from 'node-cron';
import ArticleFetchingService from './articleFetchingService';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

export class CronScheduler {
  private fetchingService: ArticleFetchingService;
  private logDir: string;
  private isRunning: boolean = false;
  
  constructor() {
    this.fetchingService = new ArticleFetchingService();
    this.logDir = path.join(process.cwd(), 'logs');
    
    // Ensure log directory exists
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Start the cron job scheduler
   */
  start(): void {
    console.log('Starting PIB article fetching cron job scheduler...');
    
    // Check environment configuration
    const envCheck = this.fetchingService.checkEnvironment();
    if (!envCheck.ok) {
      console.error('Missing required environment variables:', envCheck.missing);
      console.error('Please set these variables in your .env file');
      return;
    }

    console.log('Environment check passed ✓');
    console.log(`Cron job will run daily at 02:00 AM (UTC)`);

    // Schedule daily job at 2:00 AM UTC (7:30 AM IST)
    cron.schedule('0 2 * * *', async () => {
      await this.runScheduledJob();
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    // Also schedule a test run immediately (for debugging)
    cron.schedule('* * * * *', async () => {
      console.log('Test cron job running every minute (for debugging)');
      // Uncomment to enable test runs
      // await this.runScheduledJob();
    }, {
      scheduled: false // Set to true for debugging
    });

    console.log('Cron scheduler started successfully!');
    
    // Manual trigger option
    console.log('\nTo manually trigger article fetching, use:');
    console.log('  npm run fetch-articles');
    console.log('  npm run fetch-articles:dry');
  }

  /**
   * Run the scheduled article fetching job
   */
  async runScheduledJob(): Promise<void> {
    if (this.isRunning) {
      console.log('Previous job is still running, skipping this run.');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = path.join(this.logDir, `fetch-${timestamp}.log`);

    console.log(`\n${new Date().toISOString()} - Starting scheduled article fetch...`);

    try {
      const result = await this.fetchingService.run();

      // Log results
      const logEntry = {
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        result: result
      };

      writeFileSync(logFile, JSON.stringify(logEntry, null, 2));
      
      if (result.success) {
        console.log(`✓ Job completed successfully in ${logEntry.duration}ms`);
        console.log(`  Message: ${result.message}`);
        console.log(`  Stats:`, result.stats);
      } else {
        console.error(`✗ Job failed after ${logEntry.duration}ms`);
        console.error(`  Error: ${result.message}`);
        if (result.error) {
          console.error(`  Stack:`, result.error.stack);
        }
      }

      // Send notification (you can integrate with email, Slack, etc. here)
      await this.sendNotification(result);

    } catch (error) {
      console.error('Unexpected error in scheduled job:', error);
      writeFileSync(logFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : 'Unknown error'
      }, null, 2));
    } finally {
      this.isRunning = false;
      console.log(`${new Date().toISOString()} - Job completed\n`);
    }
  }

  /**
   * Manually trigger article fetching
   */
  async triggerManually(dryRun: boolean = false): Promise<void> {
    console.log(`\n${new Date().toISOString()} - Manually triggering article fetch (${dryRun ? 'dry run' : 'full run'})...`);
    
    const envCheck = this.fetchingService.checkEnvironment();
    if (!envCheck.ok) {
      console.error('Missing required environment variables:', envCheck.missing);
      return;
    }

    const startTime = Date.now();

    try {
      const result = dryRun 
        ? await this.fetchingService.runDry()
        : await this.fetchingService.run();

      const duration = Date.now() - startTime;

      if (result.success) {
        console.log(`✓ Manual trigger completed successfully in ${duration}ms`);
        console.log(`  Message: ${result.message}`);
        console.log(`  Stats:`, result.stats);
      } else {
        console.error(`✗ Manual trigger failed after ${duration}ms`);
        console.error(`  Error: ${result.message}`);
        if (result.error) {
          console.error(`  Stack:`, result.error.stack);
        }
      }

    } catch (error) {
      console.error('Unexpected error in manual trigger:', error);
    }
  }

  /**
   * Send notification about job results
   */
  private async sendNotification(result: any): Promise<void> {
    // Implement your notification logic here
    // Examples: Email, Slack, Discord, etc.
    
    const notification = {
      timestamp: new Date().toISOString(),
      success: result.success,
      message: result.message,
      stats: result.stats
    };

    console.log('Notification:', JSON.stringify(notification, null, 2));
    
    // Example: Save to file for now
    const notificationFile = path.join(this.logDir, 'notifications.json');
    let notifications = [];
    
    if (existsSync(notificationFile)) {
      try {
        const data = require(notificationFile);
        notifications = Array.isArray(data) ? data : [];
      } catch (e) {
        notifications = [];
      }
    }
    
    notifications.push(notification);
    writeFileSync(notificationFile, JSON.stringify(notifications.slice(-100), null, 2));
  }

  /**
   * Check job status
   */
  getStatus(): { isRunning: boolean; lastRun?: string } {
    const notificationFile = path.join(this.logDir, 'notifications.json');
    let lastRun = undefined;
    
    if (existsSync(notificationFile)) {
      try {
        const notifications = require(notificationFile);
        if (Array.isArray(notifications) && notifications.length > 0) {
          lastRun = notifications[notifications.length - 1];
        }
      } catch (e) {
        // Ignore errors
      }
    }
    
    return {
      isRunning: this.isRunning,
      lastRun
    };
  }
}

export default CronScheduler;