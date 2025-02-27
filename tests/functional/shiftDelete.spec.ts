import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { MainPage } from '../../pages/main.page';

let loginPage: LoginPage;
let mainPage: MainPage;


// test.beforeEach(async({page}) => {
//   loginPage = new LoginPage(page);
//   mainPage = new MainPage(page);
//   await page.goto("/", {waitUntil: "domcontentloaded"});

//   await test.step("Авторизоваться под аккаунтом с правами 'Главного врача'", async() => {
//     await loginPage.login("admin_doctor", "qwerty115007");
//     await expect(loginPage.role).toHaveText("Рабочее место главного врача");
//   });
//   await test.step("В боковом меню 'Настройки' выбрать 'Справочники внутренние' => 'Врачи'", async() => {
//     await mainPage.navigateToDoctorsSection();
//     await expect(page.url()).toMatch(/doc/);
//   });

//   await test.step("В списке врачей, найти врача 'Ветохина Светлана Ивановна' и кликнуть на значок календаря", async() => {
//     await mainPage.workSchedule.click();
//   });
// });

