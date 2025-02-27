import { type Locator, type Page, test} from "@playwright/test";

export class MainPage {
  protected page: Page;
  protected newPage: Page
  readonly settingsItem: Locator;
  readonly internalDirectoriesItem: Locator;
  readonly doctorsLink: Locator;
  readonly workSchedule: Locator;
  startDate: Locator;
  endDate: Locator;
  startTime: Locator;
  endTime: Locator;
  medicalOffice: Locator;
  officeType: Locator;
  specialization: Locator;
  headerText: Locator;
  shift: Locator;
  saveButton: Locator;
  days: Locator;
  createShiftButton: Locator;
  createShiftPackageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settingsItem = page.getByRole("listitem").filter({hasText: "Настройки"});
    this.internalDirectoriesItem = page.getByRole("listitem").filter({hasText: "Справочники внутренние"});
    this.doctorsLink = page.getByRole("link").filter({hasText: "Врачи"});
    this.workSchedule = page.locator("[href='/wo/doc/90/shift/']");
    this.shift = page.locator("[data-model='doc_shift']");

    this.createShiftButton = page.getByRole('button', { name: ' Создать' });
    this.createShiftPackageButton = page.getByRole("button", { name: " Создать пакетом" });


  };

  async navigateToDoctorsSection() {
    await this.settingsItem.click();
    await this.internalDirectoriesItem.click();
    await this.doctorsLink.click();
  };

  async newTab(): Promise<Page> {
    const newPage = await this.page.context().waitForEvent('page');
    await newPage.waitForLoadState("domcontentloaded");
    await newPage.setViewportSize({ width: 1280, height: 720 });

    this.startDate = newPage.locator("#id_sdate");
    this.endDate = newPage.locator("#id_edate");
    this.startTime = newPage.locator("#id_stime");
    this.endTime = newPage.locator("#id_etime");
    this.medicalOffice = newPage.locator("#id_sp");
    this.officeType = newPage.locator("#id_office");
    this.specialization = newPage.locator("#id_doctype_0");
    this.headerText = newPage.locator(".header");
    this.saveButton = newPage.locator("[title='Сохранение графика']");

    this.days = newPage.locator("[name='day']");

    return newPage;
  }

  async fillShiftForm(
    page: Page,
    date: boolean,
    startTime: string,
    endTime: string,
    medicalOffice: string,
    officeType: string,
    specialization: boolean = true,
  ) {

    if(date) {
      await test.step("Установить дату начало смены и окончание смены на следующий день", async() => {
        const nextDay = await this.tomorrowDate();
        await this.startDate.fill(nextDay);
        await this.endDate.fill(nextDay);
      });
    }

    await test.step("Установить время начало смены и окончание смены", async() => {
      await this.startTime.fill(startTime);
      await this.endTime.fill(endTime);
    });

    await test.step("Выбрать медицинский кабинет", async() => {
        await this.medicalOffice.selectOption(medicalOffice);
    });

    await test.step("Выбрать кабинет", async() => {
      await this.officeType.selectOption(officeType);
    });

    if(specialization) {
      await test.step("Выбрать специализацию врача", async() => {
        await this.specialization.check();
      })
    };
  }

  async tomorrowDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const nextDayDate = `${year}-${month}-${day}`;
    return nextDayDate
  };

  async uncheckDaysBeforeCurrent(nextDay: any = 0) {
    const currentDate = new Date();
    const currentDay = String(currentDate.getDate() + nextDay).padStart(2, '0');

    const checkboxes = await this.days.all();

    for(const checkbox of checkboxes) {
      const dayValue = await checkbox.getAttribute("value");
      const dayNumber = parseInt(dayValue || "", 10);

      if(dayNumber < parseInt(currentDay)) {
        if(await checkbox.isChecked()) {
          await checkbox.uncheck();
        }
      }
    }
  }
};