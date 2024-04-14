const cron = require('node-cron');
const Visitor = require('./models/visitor');

let scheduledJob;
// Function to check and update expired visitors
const checkExpiredVisitors = async () => {
    console.log('Checking for expired visitors...');
    const now = new Date();
    const expiredVisitors = await Visitor.find({
        entry: { $lte: new Date(now.getTime() - (tenure_hours * 1000)) },
        isExpired: { $ne: true } // Add this line to exclude already expired visitors
    });
    console.log(expiredVisitors)
    if (expiredVisitors.length === 0) {
        console.log('No expired visitors found.');
    } else {
        console.log(`Found ${expiredVisitors.length} expired visitors.`);
        for (const visitor of expiredVisitors) {
            visitor.isExpired = true;
            await visitor.save();
            // Perform any other necessary actions
        }
    }
};

// Schedule the job to run every 10 minutes
cron.schedule('* * * * *', checkExpiredVisitors);

console.log('Scheduled job started');