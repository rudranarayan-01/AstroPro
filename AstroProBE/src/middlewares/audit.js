import { supabase } from "../config/supabase.js";

export const audit = (actionType) => {
  return async (req, res, next) => {
    const start = Date.now();

    // Hook into the response finish event
    res.on("finish", async () => {
      const duration = Date.now() - start;
      const status = res.statusCode >= 400 ? "FAILURE" : "SUCCESS";

      await supabase.from("audit_logs").insert([
        {
          user_id: req.user?.id || null,
          action_type: actionType,
          status: status,
          metadata: {
            path: req.originalUrl,
            method: req.method,
            ip: req.ip,
            duration: `${duration}ms`,
            userAgent: req.get("User-Agent"),
          },
        },
      ]);
    });

    next();
  };
};
