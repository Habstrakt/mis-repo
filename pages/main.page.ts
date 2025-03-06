import { type Locator, type Page, test} from "@playwright/test";

export class MainPage {
  protected page: Page;
  protected newPage: Page
  readonly settingsItem: Locator;
  readonly internalDirectoriesItem: Locator;
  readonly doctorsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settingsItem = page.getByRole("listitem").filter({hasText: "Настройки"});
    this.internalDirectoriesItem = page.getByRole("listitem").filter({hasText: "Справочники внутренние"});
    this.doctorsLink = page.getByRole("link").filter({hasText: "Врачи"});
  };

  async navigateToDoctorsSection() {
    await this.settingsItem.click();
    await this.internalDirectoriesItem.click();
    await this.doctorsLink.click();
  };
};