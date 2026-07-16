const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Deployment Success</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f0f2f5; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; }
                h1 { color: #2ecc71; margin-bottom: 10px; }
                p { color: #555; font-size: 1.1em; }
                .badge { background: #3498db; color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.9em; display: inline-block; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🚀 Deployment Successful!</h1>
                <p>Your Node.js application is running live on AWS ECS Fargate.</p>
                <div class="badge">Deployed via GitHub Actions</div>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});