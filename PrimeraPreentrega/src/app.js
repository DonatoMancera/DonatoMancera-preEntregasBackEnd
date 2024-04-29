import express from "express";
import { json, urlencoded } from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 8080;
app.use(json()); // Middleware para que entienda JSON
app.use(urlencoded({ extended: true })); // Middleware para tomar parámetros de la URL
app.use(express.static(join(__dirname, 'public')));



app.use("/api", productsRouter)
app.use("/api", cartsRouter)






app.get("/", (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
