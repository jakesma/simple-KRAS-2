/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import PaymentPage from './PaymentPage';
import type { PaymentSuccessResult } from '../services/portone';

interface PlanPaymentPageProps {
  onSuccess?: (result: PaymentSuccessResult) => void;
  onCancel?: () => void;
  onComplete?: () => void;
}

/** PRO 플랜(연 380,000원) 전용 결제창 */
export default function ProPaymentPage(props: PlanPaymentPageProps) {
  return <PaymentPage planKey="Pro" {...props} />;
}

