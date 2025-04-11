const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');

    await request.post('/api/users', {
      data: {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      },
    });

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong');
      await expect(page.getByText('wrong username or password')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');
    });

    test('A blog can be created', async ({ page }) => {
      createBlog(
        page,
        'React patterns',
        'Michael Chan',
        'https://reactpatterns.com/',
      );

      await expect(page.getByText('React patterns Michael Chan')).toBeVisible();
    });

    describe('and a blog has been created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'React patterns',
          'Michael Chan',
          'https://reactpatterns.com/',
        );
      });

      test('A blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'like' }).click();
        await expect(page.getByText('likes 1')).toBeVisible();
      });

      test('A blog can be removed', async ({ page }) => {
        page.on('dialog', (dialog) => dialog.accept());
        await page.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'remove' }).click();

        await expect(
          page.getByText('React patterns Michael Chan'),
        ).not.toBeVisible();
      });

      test('Only the creator can remove a blog', async ({ page, request }) => {
        await request.post('/api/users', {
          data: { username: 'test', name: 'test', password: 'test' },
        });

        await page.getByRole('button', { name: 'logout' }).click();
        await loginWith(page, 'test', 'test');
        await page.getByRole('button', { name: 'view' }).click();

        await expect(
          page.getByRole('button', { name: 'remove' }),
        ).not.toBeVisible();
      });

      test.only('Blogs are ordered according to likes', async ({ page }) => {
        await createBlog(
          page,
          'Go To Statement Considered Harmful',
          'Edsger W. Dijkstra',
          'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        );

        await page.getByRole('button', { name: 'view' }).first().click();
        await page.getByRole('button', { name: 'view' }).click();
        await page.getByRole('button', { name: 'like' }).nth(1).click();
        await page.getByText('likes 1').waitFor();
        
        await expect(page.locator('.blog').first()).toContainText(/likes 1/);
        await expect(page.locator('.blog').nth(1)).toContainText(/likes 0/);
      });
    });
  });
});
