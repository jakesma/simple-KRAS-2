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

/** PLUS 플랜(월 35,000원) 전용 결제창 */
export default function PlusPaymentPage(props: PlanPaymentPageProps) {
  return <PaymentPage planKey="Plus" {...props} />;
}

