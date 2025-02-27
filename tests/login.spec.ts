import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import {fakerRU as faker} from "@faker-js/faker";

let loginPage: LoginPage;

test.beforeEach(async({page}) => {
  loginPage = new LoginPage(page);
  await page.goto("/", {waitUntil: "domcontentloaded"});
})

test("Авторизация в МИС с правами 'Оператора КЦ'", async({page}) => {
  await loginPage.login("test3_ttt", "uni_987572*msa");
  await expect(page.url()).toMatch(/wo/);
  await expect(loginPage.role).toHaveText("Рабочее место оператора КЦ");
});

test("Авторизация в МИС с правами 'Врача'", async({page}) => {
  await loginPage.login("dr_gribanov_pa", "qwerty115007");
  await expect(page.url()).toMatch(/wo/);
  await expect(loginPage.role).toHaveText("Рабочее место врача");
});

test("Авторизация в МИС с правами 'Главный врач'", async({page}) => {
  await loginPage.login("admin_doctor", "qwerty115007");
  await expect(page.url()).toMatch(/wo/);
  await expect(loginPage.role).toHaveText("Рабочее место главного врача");
});

test("Ввести не существующий логин и пароль", async() => {
  await loginPage.login(faker.internet.username(), faker.internet.password());
  await expect(loginPage.errorPopUp).toBeVisible();
  await expect(loginPage.errorPopUp).toHaveText("Неверное имя пользователя или пароль");
});

test("Ввести существующий логин и неверный пароль", async() => {
  await loginPage.login("admin_doctor", faker.internet.password());
  await expect(loginPage.errorPopUp).toBeVisible();
  await expect(loginPage.errorPopUp).toHaveText("Неверное имя пользователя или пароль");
});