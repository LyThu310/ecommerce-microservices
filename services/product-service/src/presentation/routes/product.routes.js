import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { MongooseProductRepository } from "../../infrastructure/repositories/MongooseProductRepository.js";
import { CreateProduct } from "../../application/use-cases/CreateProduct.js";
import { GetAllProducts } from "../../application/use-cases/GetAllProducts.js";
import { GetProductByPid } from "../../application/use-cases/GetProductByPid.js";
import { UpdateProduct } from "../../application/use-cases/UpdateProduct.js";
import { DeleteProduct } from "../../application/use-cases/DeleteProduct.js";

const router = Router();

const productRepository =
  new MongooseProductRepository();

const createProduct =
  new CreateProduct(productRepository);

const getAllProducts =
  new GetAllProducts(productRepository);

const getProductByPid =
  new GetProductByPid(productRepository);

const updateProduct =
  new UpdateProduct(productRepository);

const deleteProduct =
  new DeleteProduct(productRepository);

const productController =
  new ProductController(
    createProduct,
    getAllProducts,
    getProductByPid,
    updateProduct,
    deleteProduct
  );

router.post("/", productController.create);
router.get("/", productController.getAll);
router.get("/:pid", productController.getByPid);
router.put("/:pid", productController.update);
router.delete("/:pid", productController.delete);

export default router;