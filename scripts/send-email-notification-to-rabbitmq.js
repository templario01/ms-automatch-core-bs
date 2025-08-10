const amqp = require('amqplib');
const crypto = require('crypto');

async function sendToQueue() {
    const queue = process.env.RABBIT_MQ_EMAIL_NOTIFICATION_QUEUE || 'notify_user_email_queue';
    const payload = {
        pattern: 'notify_user_email_queue',
        data: {
            productId: 'example_product_id',
        },
    };

    let connection;
    try {
        connection = await amqp.connect(process.env.RABBIT_MQ_HOST);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), { persistent: true, messageId: crypto.randomUUID() });
        console.log(`Payload sent to queue "${queue}":`, payload);

        await channel.close();
    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

sendToQueue();