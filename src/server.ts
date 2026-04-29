import express from "express";
import "./database/database"; // inicializa o banco na startup

const app = express();
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
