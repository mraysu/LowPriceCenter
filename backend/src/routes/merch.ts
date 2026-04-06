import express from "express";
import {
  getAllMerch,
  getMerchById,
  getMerchByOrganization,
  getMyOrganizationMerch,
  addMerch,
  updateMerch,
  deleteMerch,
} from "src/controllers/merch";
import { authenticateUser } from "src/validators/authUserMiddleware";
import { requireStudentOrgAccess } from "src/validators/studentOrgAccess";

const router = express.Router();

router.get("/", authenticateUser, getAllMerch);
router.get(
  "/my-organization",
  authenticateUser,
  requireStudentOrgAccess,
  getMyOrganizationMerch,
);
router.get("/organization/:organizationId", authenticateUser, getMerchByOrganization);
router.get("/:id", authenticateUser, getMerchById);
router.post("/", authenticateUser, requireStudentOrgAccess, addMerch);
router.patch("/:id", authenticateUser, requireStudentOrgAccess, updateMerch);
router.delete("/:id", authenticateUser, requireStudentOrgAccess, deleteMerch);

export default router;

