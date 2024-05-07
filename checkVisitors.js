const cron = require('node-cron');
const Visitor = require('./models/visitor');

let scheduledJob;
// Function to check and update expired visitors
const checkExpiredVisitors = async () => {
    console.log('Checking for expired visitors... trying my best saar!!11!1!');

    const now = new Date();
    const Visitors = await Visitor.find({})
    const expiredVisitors = await Visitor.find({ isExpired: { $e: true } }); // Find non-expired visitors

    if (expiredVisitors.length === 0) {
        console.log('No expired visitors found.');
    } else {
        console.log(`Found ${expiredVisitors.length} expired visitors.`);
    }
    for (const visitor of Visitors) {
        console.log(visitor)

        const expiryThreshold = new Date(visitor.entry.getTime() + (visitor.tenure_hours * 60 * 1000));
        console.log(now, expiryThreshold)
        if (now > expiryThreshold) {
            console.log(visitor)
            visitor.isExpired = true;
            await visitor.save();
            // Perform any other necessary actions
        }
    }

};

// Schedule the job to run every 10 minutes
cron.schedule('* * * * *', checkExpiredVisitors);

console.log('Scheduled job started');