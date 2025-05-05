import express from 'express';
import morgan from 'morgan';
import userRoutes from './src/routes/user.routes.js';
import courseRoutes from './src/routes/course.routes.js';
import { catchError } from './src/services/error.middleware.js';
import connectDB from './src/config/db.js';
import logger from './src/library/logger.js';

logger.info('server starting...');
const app = express();
app.use(express.json());
connectDB
app.use(morgan('dev'));

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

app.use(catchError);

const PORT = +process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
