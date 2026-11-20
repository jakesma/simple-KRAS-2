import type { Request, Response } from 'express';
import { handlePaymentEntitlement } from '../../server/payments.js';

export default async function handler(req: Request, res: Response) {
  await handlePaymentEntitlement(req, res);
}
