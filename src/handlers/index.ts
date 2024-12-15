import { Request, Response } from "express";
import slug from "slug";
import bcrypt from "bcrypt";
import formidable from "formidable";
import { v4 as uuid } from "uuid";

import type {
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadApiOptions,
} from "cloudinary";

import User, { IUser } from "../model/User";
import { generateJWT } from "../utils/jwt";
import { hashPassword } from "../utils/auth";
import cloudinary from "../config/claudinary";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const createAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409).json({
        error: "A user is already registered with this email",
      });
      return;
    }

    const handleSlug = slug(req.body.handle);
    const handleExists = await User.findOne({ handle: handleSlug });
    if (handleExists) {
      res.status(409).json({
        error: "A user is already registered with this handle",
      });
      return;
    }

    // Crear y guardar el nuevo usuario
    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = handleSlug;
    await user.save();

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while creating the user",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        error: "E-mail not found",
      });
      return;
    }

    // Verificar si la contraseña es correcta
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      res.status(401).json({
        error: "Incorrect password",
      });
      return;
    }

    // Token Auth
    const token = generateJWT({ _id: user?._id, email: user?.email });

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while logging in",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const getUserByHandler = async (req: Request, res: Response) => {
  const { params } = req;

  try {
    // find unique user with handle
    const user = await User.findOne({ handle: params.handle }).select(
      "-_id -__v -password -email"
    );
    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while fetching the user",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { user, body } = req;
  // console.log(user, body);

  const handleSlug = slug(body.handle, "");

  try {
    // Check if handle is in use
    const handleExists = await User.findOne({ handle: handleSlug }).select(
      "-password"
    );
    if (handleExists && handleExists.email !== user.email) {
      res.status(409).json({
        error: "A user is already registered with this handle",
      });
      return;
    }

    // If all is right, update user info
    const condition = { _id: user._id };
    const update = {
      handle: handleSlug,
      description: body.description,
      links: body.links,
    };
    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(condition, update, options);
    if (!updatedUser) {
      res.status(500).json({
        error: "An error occurred while updating your data",
      });
      return;
    }

    res.status(200).send("Updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while updating your profile",
    });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false });

  try {
    form.parse(req, (error, fields, files) => {
      const options: UploadApiOptions = {
        public_id: uuid(),
      };
      const after = async function (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) {
        if (error) {
          res.status(500).json({ error: "Error uploading image" });
          return;
        }
        if (result) {
          // console.log("result: ", result.secure_url);
          req.user.image = result.secure_url;
          await req.user.save();

          res.status(200).json({
            message: "Image uploaded successfully",
            image: result.secure_url,
          });
        }
      };
      cloudinary.uploader.upload(files.file[0].filepath, options, after);
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      error: "An error occurred while updating your profile",
    });
  }
};

export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body
        const userExists = await User.findOne({handle})
        if(userExists) {
            const error = new Error(`${handle} ya está registrado`)
            res.status(409).json({error: error.message})
            return;
        }
        res.send(`${handle} está disponible`)
    } catch (e) {
        const error = new Error('Hubo un error')
        res.status(500).json({ error: error.message })
        return;
    }
}