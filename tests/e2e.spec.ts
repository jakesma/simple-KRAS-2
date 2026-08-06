import { test, expect } from '@playwright/test';

test.describe('KRAS App basic flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Setup test data in localStorage
    await page.evaluate(() => {
      // Do NOT set kras_dashboard_visited - show LandingPage
      localStorage.removeItem('kras_dashboard_visited');
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

  test('create -> duplicate -> delete flow', async ({ page }) => {
    // We start on LandingPage
    // Wait for LandingPage to load
    await page.waitForSelector('section', { timeout: 5000 });
    
    // Count initial assessments (we're not on dashboard yet)
    
    // Step 1: Click "Create" button on Landing Page
    const landingButton = page.locator('button').filter({ hasText: '신규 위험성평가 생성' }).first();
    await landingButton.click();
    await page.waitForTimeout(500);
    
    // Step 2: Now we should be on Dashboard, get initial count
    await page.waitForSelector('main', { timeout: 5000 });
    let assessmentCount = await page.locator('main h3').count();
    
    // Step 3: Click "Create" button on Dashboard
    const dashboardButton = page.locator('main button').filter({ hasText: '신규 위험성평가 생성' }).first();
    await dashboardButton.click();
    
    // Step 4: Wait for AssessmentForm to load
    await page.waitForSelector('#wizard-progress', { timeout: 10000 });
    await expect(page.locator('text=목록 대시보드로 복귀')).toBeVisible();

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
});
