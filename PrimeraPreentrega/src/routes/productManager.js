import { promises as fs } from 'fs';

class ProductManager{
    constructor(){
        this.productsFile = "Products.json";
        this.nextProductId = 1
    }

    async initialize() {
        try {
            let products = await this.leerProduct();
            if (products.length === 0) {
                // Solo inicializa si no hay productos existentes
                await this.addInitialProducts();
            } else {
                // Encuentra el ID máximo existente y ajusta el siguiente ID
                const maxId = Math.max(...products.map(product => product.id));
                this.nextProductId = maxId + 1;
            }
        } catch (error) {
            console.error("Error initializing ProductManager:", error);
        }
    }
    async addInitialProducts() {
        try {
            await this.addProduct({
                title: "Manzana",
                description: "Descripcion",
                price: 100,
                thumbnail: 'Ruta/imagen',
                code: "P001",
                stock: 10,
                status: true
            });
            await this.addProduct({
                title: "Pera",
                description: "Descripcion",
                price: 200,
                thumbnail: 'Ruta/imagen2',
                code: "P002",
                stock: 11,
                status: true
            });
            await this.addProduct({
                title: "Mandarina",
                description: "Descripcion",
                price: 300,
                thumbnail: 'Ruta/imagen2',
                code: "P003",
                stock: 12,
                status: false
            });
        } catch (error) {
            console.error("Error adding initial products:", error);
        }
    }

    async addProduct(product) {
        try {
            let products = await this.leerProduct();

            product.id = this.nextProductId++;
            products.push(product);

            await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }
    async getProducts(){
        try {
            const products = await this.leerProduct();
            return products
        } catch (error) {
            console.error("error", error)
            return []
        }
    }

    async leerProduct(){
        try {
            const data = await fs.readFile(this.productsFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            } else {
                throw error;
            }
        }
    }

    async getProductById(id){
        try {
            const products = await this.getProducts();
            console.log("Products:", products);
            const product = products.find(p => p.id === id);
            console.log("Product:", product);
            return product || null;
        } catch (error) {
            console.error("Error retrieving product by ID:", error);
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            let products = await this.leerProduct();
            
            // Buscar el índice del producto con el ID especificado
            const productIndex = products.findIndex(p => p.id === id);
    
            console.log("Product Index:", productIndex);
            console.log("Updated Fields:", updatedFields);
        
            if (productIndex !== -1) {
                // Actualizar el producto con los campos proporcionados en updatedFields
                products[productIndex] = { ...products[productIndex], ...updatedFields };
        
                // Escribir de nuevo la lista actualizada de productos en el archivo
                await fs.writeFile(this.productsFile, JSON.stringify(products, null, 2));
                const mostrar = await this.getProducts();
                console.log(mostrar)
            } else {
                console.error(`Product with ID ${id} not found.`);
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.leerProduct();
    
            // Filtrar la lista de productos para excluir el producto con el ID especificado
            const filteredProducts = products.filter(p => p.id !== id);
    
            if (filteredProducts.length !== products.length) {
                // Si se eliminó algún producto, escribir la lista actualizada de productos en el archivo
                await fs.writeFile(this.productsFile, JSON.stringify(filteredProducts, null, 2));
                const mostrar = await this.getProducts();
                console.log(mostrar)
            } else {
                console.error(`Product with ID ${id} not found.`);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
}

export default ProductManager ;