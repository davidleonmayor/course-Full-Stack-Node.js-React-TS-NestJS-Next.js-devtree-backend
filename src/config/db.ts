import mongoose from "mongoose";
import { bgRed, cyan } from "colors";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      cyan.bold(`DB connected in: ${connection.host}: ${connection.port}`)
    );
  } catch (error) {
    console.error(bgRed.white.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};
