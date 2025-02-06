import {type Page, type Locator} from "@playwright/test";

export class HeaderPage {
  protected page: Page

  constructor(page: Page) {
    this.page = page;
  }
}