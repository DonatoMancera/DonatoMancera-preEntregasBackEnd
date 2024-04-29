import { promises as fs } from 'fs';

class CartManager {
    constructor() {
        this.cartsFile = "Carts.json";
        this.nextCartId = 1;
    }

    async initialize() {
        try {
            const carts = await this.readCarts();
            if (carts.length === 0) {
                // Solo inicializa si no hay carritos existentes
                await this.addInitialCarts();
            } else {
                // Encuentra el ID máximo existente y ajusta el siguiente ID
                const maxId = Math.max(...carts.map(cart => cart.id));
                this.nextCartId = maxId + 1;
            }
        } catch (error) {
            console.error("Error initializing CartManager:", error);
        }
    }

    async addInitialCarts(){
        try {
            await this.createCart({
                products:[
                    {
                        title: "Banano",
                        description: "Descripcion",
                        price: 500,
                        thumbnail: 'Ruta/imagen',
                        code: "P001",
                        stock: 10,
                        status: true
                    }
                ]
            })
            await this.createCart({
                products: [
                    {
                        title: "Mandarina",
                        description: "Descripcion",
                        price: 1000,
                        thumbnail: 'Ruta/imagen',
                        code: "P005",
                        stock: 10,
                        status: true
                    },
                    {
                        title: "mora",
                        description: "Descripcion",
                        price: 50,
                        thumbnail: 'Ruta/imagen',
                        code: "P008",
                        stock: 10,
                        status: true
                    }
                ]
            })
            await this.createCart({
                products: [
                    {
                        title: "Rabano",
                        description: "Descripcion",
                        price: 1000,
                        thumbnail: 'Ruta/imagen',
                        code: "P005",
                        stock: 10,
                        status: true
                    },
                    {
                        title: "Mango",
                        description: "Descripcion",
                        price: 50,
                        thumbnail: 'Ruta/imagen',
                        code: "P008",
                        stock: 10,
                        status: true
                    },
                    {
                        title: "Sandia",
                        description: "Descripcion",
                        price: 50,
                        thumbnail: 'Ruta/imagen',
                        code: "P008",
                        stock: 10,
                        status: true
                    }
                ]
            })
        } catch (error) {
            console.error("Error adding initial products:", error);
        }
    }

    async createCart(newCart) {
        try {
            const carts = await this.readCarts();
            const cartWithId = { id: this.nextCartId++, ...newCart };
    
            carts.push(cartWithId);
    
            await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
        } catch (error) {
            console.error("Error creating cart:", error);
        }
    }

    async readCarts() {
        try {
            const data = await fs.readFile(this.cartsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            } else {
                throw error;
            }
        }
    }

    async getCartById(cartId) {
        try {
            const carts = await this.readCarts();
            const cart = carts.find(c => c.id === cartId);
            return cart || null;
        } catch (error) {
            console.error("Error retrieving cart by ID:", error);
            return null;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const carts = await this.readCarts();
            const cartIndex = carts.findIndex(c => c.id === cartId);

            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
                const productIndex = cart.products.findIndex(p => p.id === productId);

                if (productIndex !== -1) {
                    // Si el producto ya existe en el carrito, incrementar la cantidad
                    cart.products[productIndex].quantity += quantity;
                } else {
                    // Si el producto no existe en el carrito, agregarlo
                    cart.products.push({ id: productId, quantity });
                }

                // Escribir de nuevo la lista actualizada de carritos en el archivo
                await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
            } else {
                console.error(`Cart with ID ${cartId} not found.`);
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    }
}

export default CartManager;