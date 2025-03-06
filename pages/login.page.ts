import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  protected page: Page;
  readonly loginInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly role: Locator;
  readonly errorPopUp: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginInput = page.locator("#id_username");
    this.passwordInput = page.locator("#id_password");
    this.loginButton = page.getByText("Войти");
    this.role = page.locator("h1.title");
    this.errorPopUp = page.locator(".error")
  };

  async login(username: string, password: string) {
    await this.loginInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.page.locator("[data-confirm='Выйти из системы?']").click();
    await this.page.getByRole("link", {name: "Выход"}).click();
    await this.page.locator("[title='Согласиться']").click();
    expect(this.page.url()).toMatch(/login/)
  }
}
