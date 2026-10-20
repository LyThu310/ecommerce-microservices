import {
  membershipIdSchema,
  createMembershipSchema,
  updateMembershipSchema
} from "../validators/membership.schemas.js";

export class MembershipController {
  constructor(
    listMemberships,
    getMembership,
    createMembership,
    updateMembership,
    deleteMembership
  ) {
    this.listMemberships =
      listMemberships;

    this.getMembership =
      getMembership;

    this.createMembership =
      createMembership;

    this.updateMembership =
      updateMembership;

    this.deleteMembership =
      deleteMembership;
  }

  list = async (req, res) => {
    try {
      const result =
        await this.listMemberships.execute();

      return res.status(200).json({
        message:
          "Get memberships successfully",
        data: result
      });
    } catch (error) {
      console.error(
        "List memberships error:",
        error
      );

      return res.status(500).json({
        message:
          "Internal server error"
      });
    }
  };

  getById = async (req, res) => {
    try {
      const parsedId =
        membershipIdSchema.safeParse(
          req.params
        );

      if (!parsedId.success) {
        return res.status(400).json({
          message:
            "Invalid membership id",
          errors:
            parsedId.error.flatten()
        });
      }

      const result =
        await this.getMembership.execute(
          parsedId.data.mid
        );

      return res.status(200).json({
        message:
          "Get membership successfully",
        data: result
      });
    } catch (error) {
      if (
        error.message ===
        "Membership not found"
      ) {
        return res.status(404).json({
          message: error.message
        });
      }

      console.error(
        "Get membership error:",
        error
      );

      return res.status(500).json({
        message:
          "Internal server error"
      });
    }
  };

  create = async (req, res) => {
    try {
      const parsedBody =
        createMembershipSchema.safeParse(
          req.body
        );

      if (!parsedBody.success) {
        return res.status(400).json({
          message:
            "Invalid request data",
          errors:
            parsedBody.error.flatten()
        });
      }

      const result =
        await this.createMembership.execute(
          parsedBody.data
        );

      return res.status(201).json({
        message:
          "Create membership successfully",
        data: result
      });
    } catch (error) {
      console.error(
        "Create membership error:",
        error
      );

      return res.status(500).json({
        message:
          "Internal server error"
      });
    }
  };

  update = async (req, res) => {
    try {
      const parsedId =
        membershipIdSchema.safeParse(
          req.params
        );

      if (!parsedId.success) {
        return res.status(400).json({
          message:
            "Invalid membership id",
          errors:
            parsedId.error.flatten()
        });
      }

      const parsedBody =
        updateMembershipSchema.safeParse(
          req.body
        );

      if (!parsedBody.success) {
        return res.status(400).json({
          message:
            "Invalid request data",
          errors:
            parsedBody.error.flatten()
        });
      }

      const result =
        await this.updateMembership.execute(
          parsedId.data.mid,
          parsedBody.data
        );

      return res.status(200).json({
        message:
          "Update membership successfully",
        data: result
      });
    } catch (error) {
      if (
        error.message ===
        "Membership not found"
      ) {
        return res.status(404).json({
          message: error.message
        });
      }

      console.error(
        "Update membership error:",
        error
      );

      return res.status(500).json({
        message:
          "Internal server error"
      });
    }
  };

  delete = async (req, res) => {
    try {
      const parsedId =
        membershipIdSchema.safeParse(
          req.params
        );

      if (!parsedId.success) {
        return res.status(400).json({
          message:
            "Invalid membership id",
          errors:
            parsedId.error.flatten()
        });
      }

      const result =
        await this.deleteMembership.execute(
          parsedId.data.mid
        );

      return res.status(200).json({
        message:
          "Delete membership successfully",
        data: result
      });
    } catch (error) {
      if (
        error.message ===
        "Membership not found"
      ) {
        return res.status(404).json({
          message: error.message
        });
      }

      /*
        Membership đang được Customer sử dụng
        thì PostgreSQL không cho xóa vì
        onDelete: Restrict.
      */
      if (error.code === "P2003") {
        return res.status(409).json({
          message:
            "Membership is being used by customers"
        });
      }

      console.error(
        "Delete membership error:",
        error
      );

      return res.status(500).json({
        message:
          "Internal server error"
      });
    }
  };
}