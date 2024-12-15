import { Router } from "express";
import {
  createAccount,
  login,
  getUser,
  updateProfile,
  uploadImage,
  getUserByHandler,
  searchByHandle
} from "../handlers/index";
import { body } from "express-validator";
import { validateInputs } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Authorization
router.post(
  "/auth/register",
  [
    body("handle").notEmpty().withMessage("Handle must be added"),
    body("name").notEmpty().withMessage("Name must be added"),
    body("email").notEmpty().withMessage("E-mail must be added"),
    body("password").isLength({ min: 5 }).withMessage("Password must be added"),

    validateInputs,
  ],
  createAccount
);
router.post(
  "/auth/login",
  [
    body("email").notEmpty().withMessage("E-mail must be added"),
    body("password").notEmpty().withMessage("Password must be added"),
    validateInputs,
  ],
  login
);

// User
router.get("/user", [authenticate], getUser);
router.patch(
  "/user",
  [
    body("handle").notEmpty().isString().withMessage("Handle must be added"),
    body("description").isString(),
    validateInputs,

    authenticate,
  ],
  updateProfile
);
// Image
router.post(
  "/user/image",
  [ authenticate ],
  uploadImage
);
// Visualization profile
router.get("/:handle", getUserByHandler);

// Search handle if is available to register
router.post('/search',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    validateInputs,
    searchByHandle
)

export default router;
