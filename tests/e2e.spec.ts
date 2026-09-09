import { test, expect } from '@playwright/test';

test.describe('KRAS App basic flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Setup test data in localStorage
    await page.evaluate(() => {
      // Do NOT set kras_dashboard_visited - show LandingPage
      localStorage.removeItem('kras_dashboard_visited');
      localStorage.removeItem('kras_guest_mode');
      localStorage.removeItem('kras_subscription_plan');
      // Reset assessments to sample data
      localStorage.setItem('kras_manufacturing_assessments', JSON.stringify([
        {
          id: 'assess_sample_1',
          title: '2026년 상반기 정기 제조업 금속 가공공정 위험성평가',
          assessmentType: 'regular',
          createdAt: '2026-03-10',
          updatedAt: '2026-03-15',
          version: 1,
          status: 'completed',
          companyProfile: {
            companyName: '(주)우성정밀공업',
            ceoName: '김우성',
            address: '경기도 시흥시 시화벤처로 234 반월국가산업단지',
            employeeCount: 45,
            businessRegNo: '124-81-99882',
            siteManager: '이주형 부장',
            department: '안전관리부'
          },
          processes: []
        },
        {
          id: 'assess_sample_2',
          title: '아크 용접 공정 전용 수시 위험성평가 (신규 도입 장비)',
          assessmentType: 'occasional',
          createdAt: '2026-07-10',
          updatedAt: '2026-07-12',
          version: 1,
          status: 'draft',
          companyProfile: {
            companyName: '(주)우성정밀공업',
            ceoName: '김우성',
            address: '경기도 시흥시 시화벤처로 234 반월국가산업단지',
            employeeCount: 45,
            businessRegNo: '124-81-99882',
            siteManager: '이주형 부장',
            department: '안전관리부'
          },
          processes: []
        }
      ]));
    });
    await page.reload();
  });

  test('PRD tab is not present', async ({ page }) => {
    const prd = await page.$('text=제품 전략 기획서');
    expect(prd).toBeNull();
  });

  test('Gemini API rejects unauthenticated requests', async ({ request }) => {
    const response = await request.post('/api/gemini/generate-hazard', {
      data: { processName: '프레스 공정' }
    });

    expect(response.status()).toBe(401);
  });

  test('Pro selection continues through guest access and activates the plan', async ({ page }) => {
    await page.getByRole('button', { name: 'PRO 시작하기' }).click();
    await page.getByRole('button', { name: '비회원으로 계속하기' }).click();

    await expect(page.getByRole('heading', { name: '결제 시스템' })).toBeVisible();
    await expect(page.getByText('SIMPLE KRAS Pro 플랜 연간 구독료')).toBeVisible();
    await expect(page.getByText('₩380,000')).toBeVisible();

    await page.getByRole('button', { name: '무통장입금' }).click();
    await page.getByPlaceholder('입금자 이름').fill('홍길동');
    await page.getByRole('button', { name: '다음' }).click();
    await page.getByRole('button', { name: '결제 완료' }).click();

    await expect(page.getByRole('heading', { name: '결제가 완료되었습니다!' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('kras_subscription_plan'))).toBe('Pro');

    await page.getByRole('button', { name: '홈으로 돌아가기' }).click();
    await page.getByRole('button', { name: '신규 위험성평가 생성' }).first().click();
    await page.locator('main button').filter({ hasText: '신규 위험성평가 생성' }).first().click();
    await page.getByRole('button', { name: '다음 단계' }).click();
    await page.getByRole('button', { name: '다음 단계' }).click();
    await expect(page.locator('button[id^="ai-suggest-btn-"]').first()).toBeEnabled();
  });

  test('create -> duplicate -> delete flow', async ({ page }) => {
    // We start on LandingPage
    // Wait for LandingPage to load
    await page.waitForSelector('section', { timeout: 5000 });
    
    // Count initial assessments (we're not on dashboard yet)
    
    // Step 1: Click "Create" button on Landing Page
    const landingButton = page.locator('button').filter({ hasText: '신규 위험성평가 생성' }).first();
    await landingButton.click();
    await page.getByRole('button', { name: '비회원으로 계속하기' }).click();
    
    // Step 2: Now we should be on Dashboard, get initial count
    await page.waitForSelector('main', { timeout: 5000 });
    let assessmentCount = await page.locator('main h3').count();
    
    // Step 3: Click "Create" button on Dashboard
    const dashboardButton = page.locator('main button').filter({ hasText: '신규 위험성평가 생성' }).first();
    await dashboardButton.click();
    
    // Step 4: Wait for AssessmentForm to load
    await page.waitForSelector('#wizard-progress', { timeout: 10000 });
    await expect(page.locator('text=목록 대시보드로 복귀')).toBeVisible();

    await page.getByRole('button', { name: '다음 단계' }).click();
    await page.getByRole('button', { name: '다음 단계' }).click();
    const freeAiButton = page.locator('button[id^="ai-suggest-btn-"]').first();
    await expect(freeAiButton).toBeDisabled();
    await expect(freeAiButton).toContainText('PRO 전용 AI 분석');

    // Step 5: Return to dashboard
    await page.click('text=목록 대시보드로 복귀');
    await page.waitForSelector('main', { timeout: 5000 });
    
    // Step 6: Verify a new assessment was created (h3 count increased)
    const newCount = await page.locator('main h3').count();
    expect(newCount).toBeGreaterThan(assessmentCount);

    // Step 7: Duplicate an assessment
    const duplicateBtn = page.locator('button#duplicate-btn-assess_sample_2').first();
    if (await duplicateBtn.isVisible()) {
      await duplicateBtn.click();
      await page.waitForTimeout(500);
    }

    // Step 8: Delete an assessment
    page.on('dialog', dialog => dialog.accept());
    const deleteBtn = page.locator('button[id^="delete-btn-"]').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('risk is assessed directly as high, medium, or low', async ({ page }) => {
    await page.locator('button').filter({ hasText: '신규 위험성평가 생성' }).first().click();
    await page.getByRole('button', { name: '비회원으로 계속하기' }).click();
    await page.locator('main button').filter({ hasText: '신규 위험성평가 생성' }).first().click();

    await page.getByRole('button', { name: '다음 단계' }).click();
    await page.getByRole('button', { name: '다음 단계' }).click();
    await page.getByRole('button', { name: '요인 직접 기재' }).first().click();
    await page.getByRole('button', { name: '다음 단계' }).click();

    await expect(page.getByText('위험성 상·중·하 판단 및 감소 대책 계획')).toBeVisible();
    const initialRiskSelect = page.getByText('최초 위험성 수준').locator('..').locator('select');
    await expect(initialRiskSelect).toHaveValue('Medium');
    await initialRiskSelect.selectOption('High');
    await expect(page.getByText('위험성이 상 또는 중으로 판단되어')).toBeVisible();
    await expect(page.getByText('위험 점수')).toHaveCount(0);
  });

  test('document includes a ten-person participant signature sheet', async ({ page }) => {
    await page.locator('button').filter({ hasText: '신규 위험성평가 생성' }).first().click();
    await page.getByRole('button', { name: '비회원으로 계속하기' }).click();
    await page.locator('#view-doc-btn-assess_sample_1').click();

    const signatureSheet = page.locator('#assessment-attendee-signatures');
    await expect(signatureSheet.getByRole('heading', { name: '위험성평가 참석자 서명부' })).toBeVisible();
    await expect(signatureSheet.locator('thead th')).toHaveText(['NO', '성명', '직책', '서명', '비고']);
    await expect(signatureSheet.locator('tbody tr')).toHaveCount(10);
    await expect(signatureSheet.locator('tbody tr').last().locator('td').first()).toHaveText('10');
  });

  test('report aligns employee count and stacks responsible person details', async ({ page }) => {
    await page.evaluate(() => {
      const assessments = JSON.parse(localStorage.getItem('kras_manufacturing_assessments') || '[]');
      assessments[0].companyProfile.employeeCount = '';
      assessments[0].processes = [{
        id: 'process_layout',
        processName: 'CNC선반',
        detailedWorkContent: '가공 작업',
        supervisor: '이주형 부장',
        workerNames: [],
        equipmentUsed: ['CNC선반'],
        chemicalsUsed: [],
        hazards: [{
          id: 'hazard_layout',
          hazardCategory: 'Mechanical',
          machineryRelated: 'CNC선반',
          hazardSituation: '회전체 접촉 위험',
          accidentType: '끼임',
          legalBasis: '산업안전보건기준',
          currentSafetyMeasures: '방호덮개 설치',
          likelihood: 3,
          severity: 3,
          riskScore: 9,
          riskLevel: 'Medium',
          isAcceptable: false,
          reductionMeasures: '방호장치 점검',
          plannedDate: '',
          completionDate: '',
          responsiblePerson: '이주형 부장',
          postLikelihood: 2,
          postSeverity: 2,
          postRiskScore: 4,
          postRiskLevel: 'Low'
        }]
      }];
      localStorage.setItem('kras_manufacturing_assessments', JSON.stringify(assessments));
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('button').filter({ hasText: '신규 위험성평가 생성' }).first().click();
    await page.getByRole('button', { name: '비회원으로 계속하기' }).click();
    await page.locator('#view-doc-btn-assess_sample_1').click();

    const employeeBox = await page.locator('#employee-count-value').boundingBox();
    const dateBox = await page.locator('#assessment-date-value').boundingBox();
    expect(employeeBox).not.toBeNull();
    expect(dateBox).not.toBeNull();
    expect(Math.abs((employeeBox!.x + employeeBox!.width) - (dateBox!.x + dateBox!.width))).toBeLessThan(1);

    const responsibleCell = page.locator('#kras-master-table tbody tr').first();
    await expect(responsibleCell.locator('[data-responsible-name]')).toHaveText('이주형');
    await expect(responsibleCell.locator('[data-responsible-position]')).toHaveText('부장');
  });
});
