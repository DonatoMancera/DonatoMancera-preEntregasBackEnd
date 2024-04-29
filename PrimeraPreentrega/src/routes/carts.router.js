import express from "express";
import CartManager from "./cartManager.js"

const router = express.Router();
const managerCart = new CartManager();
managerCart.initialize();

router.post("/carts", async (req, res) => {
    try {
        const newCart = req.body; 
        await managerCart.createCart(newCart); 
        res.json({ message: "Cart created successfully" });
    } catch (error) {
        console.error("Error creating cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/carts", async (req,res)=>{
    try {
        let carts = await managerCart.readCarts()
        res.json({carts})
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/carts/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const cart = await managerCart.getCartById(cid);

        if (!cart) {
            console.log("Cart not found with ID:", cid);
            return res.status(404).json({ error: "Cart not found" });
        }

        res.json({ cart });
    } catch (error) {
        console.error("Error fetching cart by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const quantity = parseInt(req.body.quantity || 1);

        if (isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ error: "Invalid quantity" });
        }

        await managerCart.addProductToCart(cid, pid, quantity);
        res.json({ message: "Product added to cart successfully" });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;