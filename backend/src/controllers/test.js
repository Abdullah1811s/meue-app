import schedule from 'node-schedule';

const oneHourLater = new Date(Date.now() + 60 * 60 * 1000); // Current time + 1 hour

const job = schedule.scheduleJob(oneHourLater, () => {
  console.log('This job runs exactly one hour later!');
});

// Optional: Cancel the job before it runs
// setTimeout(() => job.cancel(), 30 * 60 * 1000); // Cancels after 30 minutes
