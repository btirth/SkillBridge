import * as admin from "firebase-admin";
import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

const serviceAccount = {
  type: "service_account",
  project_id: "skill-bridge-905b8",
  private_key_id: "14d588fec3a5fd5b9c9a24ca19b6e13a82b601e7",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3NmPmXo/cE149\nZg7e4eZOY5gkIt6uTBp0PGVF4ZldmlwrtWkiB76UvYH/IUtI91X88jw4UjCYTmCg\niSaDJbyw/9P/eVcNBu9YyfTmp1rmzWXzFh2/mR5oOhK49Hg6TXwXdi1r15wsj880\nV+L5fqF/NrPoytDPZz1o/LMuAg0g9jVoBH2jkIxvzHPmsxiKmMwr97p/gSuJRSOl\nE9jIU2LZEGAYlpYoqMbh+8JlnpSE2EttmBkVXvGExAh7nvkq4HeBR75rVKfiiHla\n3h+wK96cXoM/c6FgREVF8Jigc6vZHto9Jexq0k5efsorO0wTM3JBLv7cycqrKc0P\nDXo5ux5jAgMBAAECggEACHQqB+c1HCKIpqye4wnpZpSR4Jj7TW+ViOeAhMj0Gq2U\nsy+bukZBNPvJk8wlfShsf09uF+sy8tQrAT1S2ZpUKpajYZZnveIkCSTIeBwgxaWU\nnrLWjJC0JnsHgiFFqusIXszFK8S3IBdCqFel0X1WVlhf1M4G9Ir++mkum2Dc2jht\n+dYZj8PngNLK7ok6hXpmgD7x7GAKEspTQPWLrZBuuu67v4bTON6crkrmWiKGVFhs\nOYYFRRqvbBBuxQNtKK/lwGV1OPwhKUCwKey80DO/9DOXFeTid5fSY5SPSPPf7iW3\nTRUi0jrPil/DvWPqSSFYXXwBrEWS3pL2GADsm/emgQKBgQD1cxQrKQSmrJbeCXNO\nRmXxg6bKQ6Acsp+SzDNKTwJzz8szb8YfsTepNfYzO9WsFijxwtXckzPa04Z/Uzg8\noHt2lSKNeohm2TA2jeEwVTV52lw7RiNU1OT+6n+WUmZJrNoTAW1Z0py1/3tcFurN\nmOFaJXWY1kT3G5DvaHZ6xI7+/QKBgQC/FnTGeA1QXhra1MUeWs72M15MvGPl9shF\nZP/+okfEFaznujR2fg8fSdstNpQLEVSM+SEnP80+wYGyr6pHB0HrOcHWUjULwWZc\n/gMjFdXfWA7e3+tbvfjXrXo/d8YymCaEoEFikEhohlpHCi9WF8/vkozFfnSlKClm\n4Zf2PUcA3wKBgQDz7dEub45SwpUQxx2TvfzUP71DqF94BcD2l/+lKs5KIElWrg+d\nMXcasCkkk6NvaXp5geMeWiCfqbYx1Ze/ENKCcAYtyofChrgWj3wrl5MUrYEZ20OD\nrCyEdrIjx3ImaCU13CY7rUbWzLdhNtlVSEk1WKL9KHzTg87PTubobW2bVQKBgFxF\nXbIQem1aY6FTqLOVqeZcu6ZWOe7rkZ1gvfSZLApVZR6oXXjyOh8jrMBSYH5PqgJA\nsm+fcV5iVlyQUqrlqEELrLvvCkpY4zL4PU+N1a55eQTKH343Z5fN3wASuBPqQH8+\nWxRbE3vVlHZFRsJN0Uyf+XXMMEsn74YMXTK8ODMFAoGAAP1Fxil6A2vsm5c7DI5W\nzcX65KmJaKc6x/akfHbC0YmCE0vAkbcXhzfBkMExpxqDZHSkowq9bELEPmZan9rM\n9N+LEO6O12HC5dpID4P/rFrg8fo0rwWxEntRdjt5O3JWoity72Lqv1xUbngEAShB\nJ/Sf+jGB2WBcS3Y/zwi6goo=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-m7nwm@skill-bridge-905b8.iam.gserviceaccount.com",
  client_id: "108941428751793587823",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-m7nwm%40skill-bridge-905b8.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const auth = admin.auth();

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.headers.authorization?.split("Bearer ")[1] ?? "";

  if (!token) {
    return res
      .status(500)
      .json({ message: "Error verifying Firebase token: Token missing" });
  }

  return auth
    .verifyIdToken(token)
    .then((decodedToken) => {
      (req as AuthRequest).user = decodedToken;
      return next();
    })
    .catch((error) => {
      console.error("Error verifying Firebase token:", error);
      return res
        .status(500)
        .json({ message: "Error verifying Firebase token: Invalid token" });
    });
};
