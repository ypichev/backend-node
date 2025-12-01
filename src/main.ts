import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Hello!" });
});

app.get("/healthcheck", (_req, res) => {
  res.status(200).json({
    status: "ok",
    date: new Date().toISOString(),
  });
});

const port = Number(process.env.PORT ?? 8080);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
