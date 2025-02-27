import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { MainPage } from '../../pages/main.page';

let loginPage: LoginPage;
let mainPage: MainPage;


test.beforeEach(async({page}) => {
  loginPage = new LoginPage(page);
  mainPage = new MainPage(page);
  await page.goto("/", {waitUntil: "domcontentloaded"});

  await test.step("Авторизоваться под аккаунтом с правами 'Главного врача'", async() => {
    await loginPage.login("admin_doctor", "qwerty115007");
    await expect(loginPage.role).toHaveText("Рабочее место главного врача");
  });
  await test.step("В боковом меню 'Настройки' выбрать 'Справочники внутренние' => 'Врачи'", async() => {
    await mainPage.navigateToDoctorsSection();
    await expect(page.url()).toMatch(/doc/);
  });

  await test.step("В списке врачей, найти врача 'Ветохина Светлана Ивановна' и кликнуть на значок календаря", async() => {
    await mainPage.workSchedule.click();
  });
});

test.afterEach(async({page}) => {
  await page.locator("[title='Выделить все']").click();
  await page.locator("[title='Удалить смены пакетом']").click();
  await page.getByRole("button", { name: " Да" }).click();
  await expect(page.getByText("Нет записей подходящих под условия")).toBeVisible();
});

test.only("Создать смену врачу на определенный день", async({page}) => {
  await test.step("Нажать на кнопку 'Создать'", async() => {
    await mainPage.createShiftButton.click();
  })

  let newPage: Page;
  newPage = await mainPage.newTab();

  await test.step("В открывшейся вкладки 'Ветохина Светала Ивановна - График работы' кликнуть на кнопку 'Создать'", async() => {
    await expect(mainPage.headerText).toHaveText("Создание смены врача");
  });

  await mainPage.fillShiftForm(newPage, true, "08:00", "17:00", "Владивосток, МК Океанский проспект,90 (В)", "68");

  await test.step("Нажать на кнопку 'Сохранить'", async() => {
    await mainPage.saveButton.click();
  });
  await test.step("Проверить, что смена для врача 'Ветохиа Светлана Ивановка' создана", async() => {
    await expect(page.getByText("Запись создана успешно")).toBeVisible();
    const locators = await mainPage.shift.all();
    for(const locator of locators) {
      await expect(locator).toBeVisible();
    }

  });
});

test.only("Создать смену врачу до конца месяца", async({page}) =>  {

  await test.step("Нажать на кнопку 'Создать пакетом'", async() => {
    await mainPage.createShiftPackageButton.click();
  })

  let newPage: Page;
  newPage = await mainPage.newTab();

  await test.step("В открывшейся вкладки 'Ветохина Светала Ивановна - График работы' кликнуть на кнопку 'Создать'", async() => {
    await expect(mainPage.headerText).toHaveText("Создание смен врача Ветохина Светлана Ивановна");
  });

  await test.step("Заполнить форму", async() => {
    await mainPage.fillShiftForm(newPage, false, "08:00", "17:00", "Владивосток, МК Океанский проспект,90 (В)", "68");
  });

  await test.step("Убрать чекбоксы с дат, которые уже прошли", async() => {
    await mainPage.uncheckDaysBeforeCurrent(1);
  });

  await test.step("Нажать на кнопку 'Сохранить'", async() => {
    await mainPage.saveButton.click();
  });

  await test.step("Проверить, что смены для врача 'Ветохиа Светлана Ивановка' создана на весь месяц", async() => {
    await expect(page.getByText(`Завершено пакетное создание смен.`)).toBeVisible();
    const locators = await mainPage.shift.all();
    for(const locator of locators) {
      await expect(locator).toBeVisible();
    };
  });
});





// не имеет смысла создавать запись задним числом