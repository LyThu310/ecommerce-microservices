import {
  customerIdSchema,
  updateCustomerSchema
} from "../validators/customer.schemas.js";

export class CustomerController {
  constructor(
    getCustomerProfile,
    updateCustomerProfile
  ) {
    this.getCustomerProfile = getCustomerProfile;
    this.updateCustomerProfile = updateCustomerProfile;
  }

  getById = async (req, res) => {
    try {
      const parsedId = customerIdSchema.safeParse(
        req.params
      );

      if (!parsedId.success) {
        return res.status(400).json({
          message: "Invalid customer id",
          errors: parsedId.error.flatten()
        });
      }

      const result =
        await this.getCustomerProfile.execute(
          parsedId.data.uid
        );

      return res.status(200).json({
        message: "Get customer successfully",
        data: result
      });
    } catch (error) {
      if (error.message === "Customer not found") {
        return res.status(404).json({
          message: error.message
        });
      }

      console.error(
        "Get customer controller error:",
        error
      );

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };

  update = async (req, res) => {
    try {
      const parsedId = customerIdSchema.safeParse(
        req.params
      );

      if (!parsedId.success) {
        return res.status(400).json({
          message: "Invalid customer id",
          errors: parsedId.error.flatten()
        });
      }

      const parsedBody =
        updateCustomerSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: parsedBody.error.flatten()
        });
      }

      const result =
        await this.updateCustomerProfile.execute(
          parsedId.data.uid,
          parsedBody.data
        );

      return res.status(200).json({
        message: "Update customer successfully",
        data: result
      });
    } catch (error) {
      if (error.message === "Customer not found") {
        return res.status(404).json({
          message: error.message
        });
      }

      console.error(
        "Update customer controller error:",
        error
      );

      return res.status(500).json({
        message: "Internal server error"
      });
    }
  };
}