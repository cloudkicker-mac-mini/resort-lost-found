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

test('demo reset clears progress and returns to guest report',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:/try the guest demo/i}).click();
  await page.getByRole('button',{name:/continue/i}).click();
  await page.getByRole('button',{name:/reset demo/i}).click();
  await expect(page.getByRole('heading',{name:/reset the connected demo/i})).toBeVisible();
  await page.getByRole('dialog').getByRole('button',{name:'Reset demo'}).click();
  await expect(page.getByText('Step 1 of 3')).toBeVisible();
  await expect(page.getByRole('heading',{name:/where did you last have it/i})).toBeVisible();
});

test('management inventory supports search detail and mobile intake',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:/try management demo/i}).click();
  await page.getByRole('button',{name:/found inventory/i}).click();
  await expect(page.getByRole('heading',{name:/everything found, secured, and searchable/i})).toBeVisible();
  await page.getByLabel('Search found inventory').fill('fitness watch');
  await expect(page.getByText('Silver fitness watch')).toBeVisible();
  await page.getByRole('button',{name:/add found item/i}).click();
  await expect(page.getByRole('heading',{name:/add a found item/i})).toBeVisible();
  await page.getByRole('button',{name:/save & create label/i}).click();
  await expect(page.getByRole('heading',{name:/item FI-20848 logged/i})).toBeVisible();
});

test('custody log exposes a verified item timeline',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:/try management demo/i}).click();
  await page.getByRole('button',{name:/custody log/i}).click();
  await expect(page.getByRole('heading',{name:/every handoff has a receipt/i})).toBeVisible();
  await expect(page.getByText('Found and inventoried')).toBeVisible();
  await expect(page.getByText('Secured in controlled storage')).toBeVisible();
  await page.getByLabel('Choose custody item').selectOption('FI-20846');
  await expect(page.getByRole('heading',{name:/FI-20846 custody trail/i})).toBeVisible();
  await page.getByRole('button',{name:/return to connected case/i}).click();
  await expect(page.getByText('FI-20847 · Linked case FA-84219')).toBeVisible();
});
