import 'dotenv/config';
import app from './server';

// Start the application by listening to specific port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.info('COVID 19 statistics server start on port: ' + port);
});
