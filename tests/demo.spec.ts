import {expect,test} from '@playwright/test';

test('guest and management share one case lifecycle',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:/try the guest demo/i}).click();
  await expect(page.getByRole('heading',{name:/lost something/i})).toBeVisible();
  await page.getByRole('button',{name:/continue/i}).click();
  await page.getByRole('button',{name:/continue/i}).click();
  await page.getByRole('button',{name:/submit sample report/i}).click();
  await expect(page.getByText('Report received',{exact:true}).first()).toBeVisible();
  await page.getByRole('button',{name:/resort management/i}).click();
  await page.getByRole('button',{name:/round black sunglasses/i}).click();
  await page.getByRole('button',{name:/begin investigation/i}).click();
  await page.getByRole('button',{name:/verify ownership/i}).click();
  await page.getByRole('button',{name:/guest experience/i}).click();
  await expect(page.getByText('Item matched',{exact:true}).first()).toBeVisible();
  await page.getByRole('button',{name:/tracked shipping/i}).click();
  await page.getByRole('button',{name:/resort management/i}).click();
  await page.getByRole('button',{name:/record carrier handoff/i}).click();
  await page.getByRole('button',{name:/guest experience/i}).click();
  await expect(page.getByText('Reunited',{exact:true}).first()).toBeVisible();
});
