import { connectToDatabase } from "./utils/config";
import contentFeedRouter from "./routes/contentFeed";
import express, { Request, Response } from "express";
import cors from "cors";
import middleware from "./utils/middleware";
import mentorRouter from "./routes/mentor";
import userRouter from "./routes/userDetails";
import discussionRouter from "./routes/discussion";
import paymentsRouter from "./routes/payments";
import bookingRouter from "./routes/booking";
import jobRouter from "./routes/job";
import messageRouter from "./routes/message";
import bodyParser from "body-parser";
import { app, server } from "./socket/socket";
import networkingrouter from "./routes/networking";
import { authMiddleware } from "./utils/authMiddleware";
import { NextFunction } from "express-serve-static-core";

connectToDatabase();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(middleware.morganMiddleWare);

const conditionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authExcludedPaths = ["/userDetails/add"];

  if (authExcludedPaths.includes(req.originalUrl)) {
    next();
  } else {
    authMiddleware(req, res, next);
  }
};
app.use("/userDetails/", conditionalAuthMiddleware, userRouter);
app.use("/user", userRouter);
app.use("/contentfeed", contentFeedRouter);
app.use("/mentor", mentorRouter);
app.use("/discussions", discussionRouter);
app.use("/payments", paymentsRouter);
app.use("/job", jobRouter);
app.use("/bookings", bookingRouter);
app.use("/message", messageRouter);
app.use("/networking", networkingrouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

export { app, server };
