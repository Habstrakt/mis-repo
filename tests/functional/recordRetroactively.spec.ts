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
    await expect(page.url()).toMatch(/doc/);
  });

  await test.step("В списке врачей, найти врача 'Ветохина Светлана Ивановна' и кликнуть на значок календаря", async() => {
    await shiftPage.workSchedule.click();
  });
});

test("Проверка отображения текста при создании смену врачу задним числом", async() => {
    await test.step("Нажать на кнопку 'Создать'", async() => {
      await shiftPage.createShiftButton.click();
    })

    let newPage: Page;
    newPage = await shiftPage.newTab();

    await test.step("В открывшейся вкладки 'Ветохина Светала Ивановна - График работы' кликнуть на кнопку 'Создать'", async() => {
      await expect(shiftPage.headerText).toHaveText("Создание смены врача");
    });

    await shiftPage.fillShiftForm(newPage, false, true, "08:00", "17:00", "Владивосток, МК Океанский проспект,90 (В)", "68");

    await test.step("Нажать на кнопку 'Сохранить'", async() => {
      await shiftPage.saveButton.click();
    });

		await test.step("Проверить, что текст отображается", async() => {
			await expect(newPage.getByText('Не имеет смысла создавать запись задним числом')).toBeVisible();
		});
});