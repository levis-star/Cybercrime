import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url) });

const { createApp } = await import('./app.js');

const port = process.env.PORT || 4000;
const app = createApp();

app.listen(port, () => {
  console.log(`Cybercrime API listening on http://localhost:${port}`);
});
