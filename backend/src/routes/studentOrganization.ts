import express from "express";
import {
  getStudentOrganizations,
  getStudentOrganizationById,
  getStudentOrganizationByFirebaseUid,
  getStudentOrgCanAccess,
  createStudentOrganization,
  updateStudentOrganization,
  deleteStudentOrganization,
} from "src/controllers/studentOrganizations";
import { authenticateUser } from "src/validators/authUserMiddleware";
import { requireStudentOrgAccess } from "src/validators/studentOrgAccess";

const router = express.Router();

router.get("/", authenticateUser, getStudentOrganizations);
router.get("/can-access", authenticateUser, getStudentOrgCanAccess);
router.get(
  "/firebase/:firebaseUid",
  authenticateUser,
  requireStudentOrgAccess,
  getStudentOrganizationByFirebaseUid,
);
router.get("/:id", authenticateUser, getStudentOrganizationById);
router.post("/", authenticateUser, requireStudentOrgAccess, createStudentOrganization);
router.patch("/", authenticateUser, requireStudentOrgAccess, updateStudentOrganization);
router.delete("/", authenticateUser, requireStudentOrgAccess, deleteStudentOrganization);

export default router;

