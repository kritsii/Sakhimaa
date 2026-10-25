import { createApp } from './app.js';

const PORT = parseInt(process.env.PORT || '5001', 10);
const app = createApp();

app.listen(PORT, () => {
  console.log(`SakhiMaa Report Analysis API server running on port ${PORT}`);
});
