const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = 4000;

// Create a Registry to register the metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Custom metric example
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method'],
  registers: [register],
});

app.get('/', (req, res) => {
  httpRequestsTotal.inc({ method: 'get' });
  res.send('Hello World!');
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
