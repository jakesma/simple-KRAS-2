import type { Request, Response } from 'express';
import { handlePaymentVerification } from '../../server/payments.js';

export default async function handler(req: Request, res: Response) {
  await handlePaymentVerification(req, res);
}
