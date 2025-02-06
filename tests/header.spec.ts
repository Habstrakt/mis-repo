import {test, expect} from "@playwright/test";
import { HeaderPage } from "../pages/Header.page";

let headerPage: HeaderPage;

test.beforeEach(async({page}) => {
  headerPage = new HeaderPage(page);
  await page.goto("/", {waitUntil: "domcontentloaded"});
});