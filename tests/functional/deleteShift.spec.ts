import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { MainPage } from '../../pages/main.page';
import { ShiftPage } from "../../pages/shift.page";
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
  await test.step("Создать смену врачу до конца месяца", async() => {
    await shiftPage.createBulkShiftsForRemainingMonth();
  });
});

test("Удалить смены", async({page}) => {
  while (await shiftPage.paginatorShift.isVisible()){
    await test.step("Если отображается локатор пагинации, повторно удалить смены", async() => {
      await shiftPage.deleteAllShifts(page);
    });
  };
  await shiftPage.deleteAllShifts(page);
  await test.step("В списке не отображается созданная/ые смены", async() => {
    await expect(page.getByText("Нет записей подходящих под условия")).toBeVisible();
  });
});