import { type Locator, type Page, test, expect} from "@playwright/test";

export class DoctorSchedule {
  readonly page: Page;
  readonly newPage: Page;
  readonly workSpace: Locator;
  readonly doctorScheduleTab: Locator;
  readonly startDate: Locator;
  readonly endDate: Locator;
  readonly city: Locator;
  readonly doctor: Locator;
  readonly selectButton: Locator;
  readonly orders: Locator;

  constructor(page: Page) {
    this.page = page;
    this.workSpace = page.locator("[href='/wo/desktop/registry/']");
    this.doctorScheduleTab = page.getByText("Расписание врача");

    this.startDate = page.locator("#id_startdate");
    this.endDate = page.locator("#id_enddate");
    this.city = page.locator("#id_city");
    this.doctor = page.locator("#id_doc");
    this.selectButton = page.getByRole('button', { name: ' Выбрать' });
    this.orders = page.locator(".orders");
  }
}