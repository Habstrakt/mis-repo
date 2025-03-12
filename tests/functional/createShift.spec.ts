import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { MainPage } from '../../pages/main.page';
import { ShiftPage } from '../../pages/shift.page';

let loginPage: LoginPage;
let mainPage: MainPage;
let shiftPage: ShiftPage;

test.beforeEach(async({page}) => {
  loginPage = new LoginPage(page);
  mainPage = new MainPage(page);
  shiftPage = new ShiftPage(page);

  await page.goto("/", {waitUntil: "domcontentloaded"});
  await test.step("Авторизоваться под аккаунтом с правами 'Главного врача'", async() => {
    await loginPage.login("admin_doctor", "qwerty115007");
    await expect(loginPage.role).toHaveText("Рабочее место главного врача");
  });
  await test.step("В боковом меню 'Настройки' выбрать 'Справочники внутренние' => 'Врачи'", async() => {
    await mainPage.navigateToDoctorsSection();
    expect(page.url()).toMatch(/doc/);
  });
  await test.step("В списке врачей, найти врача 'Ветохина Светлана Ивановна' и кликнуть на значок календаря", async() => {
    await shiftPage.workSchedule.click();
  });
});

test.afterEach(async({page}) => {
  await shiftPage.deleteAllShifts(page);
});

test("Создать смену врачу на текущий день", async({page}) => {
  await test.step("Создать смену врачу на завтра", async() => {
    await shiftPage.createShift();
  });
  await test.step("Проверить, что смена для врача 'Ветохиа Светлана Ивановка' создана", async() => {
    await expect(page.getByText("Запись создана успешно")).toBeVisible();
    await expect(page.getByText("Нет записей подходящих под условия")).not.toBeVisible();
    const locators = await shiftPage.shift.all();
    for(const locator of locators) {
      await expect(locator).toBeVisible();
    };
  });
});

test("Создать смену врачу до конца месяца", async({page}) =>  {
  await test.step("Создать смены для врача на все оставшиеся дни текущего месяца", async() => {
    await shiftPage.createBulkShiftsForRemainingMonth();
  });
  await test.step("Проверить, что смены для врача 'Ветохиа Светлана Ивановка' создана на весь месяц", async() => {
    await expect(page.getByText(`Завершено пакетное создание смен.`)).toBeVisible();
    await expect(page.getByText("Нет записей подходящих под условия")).not.toBeVisible();
    const locators = await shiftPage.shift.all();
    for(const locator of locators) {
      await expect(locator).toBeVisible();
    };
  });
});