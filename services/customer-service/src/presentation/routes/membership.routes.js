import { Router } from "express";

import {
  MembershipController
} from "../controllers/membership.controller.js";

import {
  PrismaMembershipRepository
} from "../../infrastructure/repositories/PrismaMembershipRepository.js";

import {
  ListMemberships
} from "../../application/use-cases/ListMemberships.js";

import {
  GetMembership
} from "../../application/use-cases/GetMembership.js";

import {
  CreateMembership
} from "../../application/use-cases/CreateMembership.js";

import {
  UpdateMembership
} from "../../application/use-cases/UpdateMembership.js";

import {
  DeleteMembership
} from "../../application/use-cases/DeleteMembership.js";

const router = Router();

const membershipRepository =
  new PrismaMembershipRepository();

const listMemberships =
  new ListMemberships(
    membershipRepository
  );

const getMembership =
  new GetMembership(
    membershipRepository
  );

const createMembership =
  new CreateMembership(
    membershipRepository
  );

const updateMembership =
  new UpdateMembership(
    membershipRepository
  );

const deleteMembership =
  new DeleteMembership(
    membershipRepository
  );

const membershipController =
  new MembershipController(
    listMemberships,
    getMembership,
    createMembership,
    updateMembership,
    deleteMembership
  );

router.get(
  "/",
  membershipController.list
);

router.get(
  "/:mid",
  membershipController.getById
);

router.post(
  "/",
  membershipController.create
);

router.put(
  "/:mid",
  membershipController.update
);

router.delete(
  "/:mid",
  membershipController.delete
);

export default router;