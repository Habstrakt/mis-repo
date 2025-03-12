import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { MainPage } from '../../pages/main.page';
import { ShiftPage } from '../../pages/shift.page';
import { DoctorSchedule } from '../../pages/doctorSchedule.page';

let loginPage: LoginPage;
let mainPage: MainPage;
let shiftPage: ShiftPage;
let doctorSchedule: DoctorSchedule;

test.beforeEach(async({page}) => {
  loginPage = new LoginPage(page);
  mainPage = new MainPage(page);
  shiftPage = new ShiftPage(page);
  doctorSchedule = new DoctorSchedule(page);

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
  await test.step("Создать смену для врача", async() => {
    await shiftPage.createShift();
  });
});

test.afterEach(async({page}) => {
  page.goto("/wo/doc/90/shift/", {waitUntil: "domcontentloaded"});
  await shiftPage.deleteAllShifts(page);
})

test("Проверить отображение созданной записи по 'Расписанию врача'", async({page}) => {
  await test.step("В боковом меню кликнуть 'Рабочий стол'", async() => {
    await doctorSchedule.workSpace.click();
    expect(page.url()).toMatch(/registry/);
  });
  await test.step("Кликнуть на вкладку 'Расписание врача'", async() => {
    await doctorSchedule.doctorScheduleTab.click();
  });
  await test.step("Установить начало периода текущую дату", async() => {
    await doctorSchedule.startDate.fill(await shiftPage.tomorrowDate());
  });
  await test.step("Установить окончание периода текущую дату", async() => {
    await doctorSchedule.endDate.fill(await shiftPage.tomorrowDate());
  })
  await test.step("Выбрать город 'Владивосток'", async() => {
    await doctorSchedule.city.selectOption("Владивосток");
  })
  await test.step("Выбрать врача 'Ветохина Светлата Ивановна'", async() => {
    await doctorSchedule.doctor.selectOption("Ветохина Светлана Ивановна");
  })
  await test.step("Кликнуть на кнопку 'Выбрать'", async() => {
    await doctorSchedule.selectButton.click();
  })
  await test.step("Дождаться загрузки селектора orders", async() => {
    await page.waitForSelector(".orders");
  })
  await test.step("Временные слота отображаются на текущий день", async() => {
    expect(await doctorSchedule.orders.count()).toBeGreaterThan(0);
  });
});

// title="Создать запись на приём"