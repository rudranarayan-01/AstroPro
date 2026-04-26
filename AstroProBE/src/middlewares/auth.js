import { supabase } from "../config/supabase.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token." });
    }

    // Attach user data to the request object
    req.user = user;
    next();
  } catch (err) {
    next(err); // Pass to our global error handler
  }
};
