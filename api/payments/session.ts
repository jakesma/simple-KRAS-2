import type { Request, Response } from 'express';
import { handlePaymentSession } from '../../server/payments.js';

export default function handler(req: Request, res: Response) {
  handlePaymentSession(req, res);
}
