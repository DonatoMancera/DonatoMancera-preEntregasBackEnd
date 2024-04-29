import express from "express";
import ProductManager from "./productManager.js"; 

const router = express.Router();


const manager = new ProductManager();
manager.initialize();

router.get("/products", async (req,res)=>{
    try {
        const limit = req.query.limit; // Obtener el parámetro de consulta limit
        let products = await manager.getProducts();

        // Aplicar límite si se proporciona el parámetro limit
        if (limit) {
            const parsedLimit = parseInt(limit, 10); // Convertir a número entero
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
                products = products.slice(0, parsedLimit); // Obtener solo los primeros 'limit' productos
            }
        }

        res.json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/products", async (req,res)=>{
    try {
        const product = await manager.getProducts();
        res.json({product})
    } catch (error) {
        console.error("Error getchng product by ID: ", error)
        res.status(500).json({error: "Internal server error"})
    }
})

router.get("/products/:pid", async (req,res)=>{
    try {
        const pid = req.params.pid;
        const product = await manager.getProductById(parseInt(pid));

        if (!product) {
            console.log("Product not found with ID:", pid);
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({product})
    } catch (error) {
        console.error("Error getchng product by ID: ", error)
        res.status(500).json({error: "Internal server error"})
    }
})

router.post("/", async (req,res)=>{

    try {
        const newProduct = req.body
        await manager.addProduct(newProduct)
        res.json({message: "Producto agregado exitosamente"})
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    

})

router.put("/products/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const info = req.body;
        await manager.updateProduct(pid, info);

        res.status(200).json({message: "Producto actualizado con exito"})
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/products/:pid", async (req,res)=>{
    try {
        const pid = parseInt(req.params.pid);
        await manager.deleteProduct(pid)
        res.json({message: "Producto exitosamente eliminado"})
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})


export default router;