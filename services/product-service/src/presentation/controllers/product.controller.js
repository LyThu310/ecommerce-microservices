import {
  productIdSchema,
  createProductSchema,
  updateProductSchema
} from "../validators/product.schemas.js";

export class ProductController {
  constructor(
    createProduct,
    getAllProducts,
    getProductByPid,
    updateProduct,
    deleteProduct
  ) {
    this.createProduct = createProduct;
    this.getAllProducts = getAllProducts;
    this.getProductByPid = getProductByPid;
    this.updateProduct = updateProduct;
    this.deleteProduct = deleteProduct;
  }

  create = async (req, res) => {
    try {
      const parsed = createProductSchema.safeParse(
        req.body
      );

      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: parsed.error.flatten()
        });
      }

      const result =
        await this.createProduct.execute(
          parsed.data
        );

      return res.status(201).json({
        message: "Create product successfully",
        data: result
      });
    } catch (error) {
      if (
        error.message === "Product already exists" ||
        error.code === 11000
      ) {
        return res.status(409).json({
          message: "Product already exists"
        });
      }

      console.error(
        "Create product controller error:",
        error
      );

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  getAll = async (req, res) => {
    try {
      const result =
        await this.getAllProducts.execute();

      return res.status(200).json({
        message: "Get products successfully",
        data: result
      });
    } catch (error) {
      console.error(
        "Get products controller error:",
        error
      );

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  getByPid = async (req, res) => {
    try {
      const parsed = productIdSchema.safeParse(
        req.params
      );

      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid product id",
          errors: parsed.error.flatten()
        });
      }

      const result =
        await this.getProductByPid.execute(
          parsed.data.pid
        );

      return res.status(200).json({
        message: "Get product successfully",
        data: result
      });
    } catch (error) {
      if (error.message === "Product not found") {
        return res.status(404).json({
          message: error.message
        });
      }

      console.error(
        "Get product controller error:",
        error
      );

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  update = async (req, res) => {
    try {
      const parsedId =
        productIdSchema.safeParse(req.params);

      if (!parsedId.success) {
        return res.status(400).json({
          message: "Invalid product id",
          errors: parsedId.error.flatten()
        });
      }

      const parsedBody =
        updateProductSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: parsedBody.error.flatten()
        });
      }

      const result =
        await this.updateProduct.execute(
          parsedId.data.pid,
          parsedBody.data
        );

      return res.status(200).json({
        message: "Update product successfully",
        data: result
      });
    } catch (error) {
      if (error.message === "Product not found") {
        return res.status(404).json({
          message: error.message
        });
      }

      console.error(
        "Update product controller error:",
        error
      );

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  delete = async (req, res) => {
    try {
      const parsed = productIdSchema.safeParse(
        req.params
      );

      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid product id",
          errors: parsed.error.flatten()
        });
      }

      const result =
        await this.deleteProduct.execute(
          parsed.data.pid
        );

      return res.status(200).json({
        message: "Delete product successfully",
        data: result
      });
    } catch (error) {
      if (error.message === "Product not found") {
        return res.status(404).json({
          message: error.message
        });
      }

      console.error(
        "Delete product controller error:",
        error
      );

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
}