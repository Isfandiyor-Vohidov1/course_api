import dotenv from 'dotenv';
dotenv.config();


const connectDB = () => {
    mongoose
        .connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('DB connected successfully'))
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            process.exit(1);
        });
};

export default connectDB;
