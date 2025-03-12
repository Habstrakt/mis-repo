import { type Locator, type Page, test, expect} from "@playwright/test";

export class ShiftPage {
   readonly page: Page;
   readonly newPage: Page;

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
   paginatorShift: Locator;



   constructor(page: Page) {
		this.page = page;
    this.workSchedule = page.locator("[href='/wo/doc/90/shift/']");
    this.shift = page.locator("[data-model='doc_shift']");
    this.createShiftButton = page.getByRole('button', { name: ' Создать' });
    this.createShiftPackageButton = page.getByRole("button", { name: " Создать пакетом" });
    this.paginatorShift = page.locator(".pagination");
   }

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

	async createShift() {
		await test.step("Нажать на кнопку 'Создать'", async() => {
				await this.createShiftButton.click();
		})

			let newPage: Page;
			newPage = await this.newTab();

		await test.step("В открывшейся вкладки 'Ветохина Светала Ивановна - График работы' кликнуть на кнопку 'Создать'", async() => {
			await expect(this.headerText).toHaveText("Создание смены врача");
		});
		await test.step("Заполнить форму", async() => {
			await this.fillShiftForm(newPage, true, false, "Владивосток, МК Океанский проспект,90 (В)", "68");
		});
		await test.step("Нажать на кнопку 'Сохранить'", async() => {
			await this.saveButton.click();
		});
	};

	async createBulkShiftsForRemainingMonth() {
		await test.step("Нажать на кнопку 'Создать пакетом'", async() => {
			await this.createShiftPackageButton.click();
		})

		let newPage: Page;
		newPage = await this.newTab();

		await test.step("В открывшейся вкладки 'Ветохина Светала Ивановна - График работы' кликнуть на кнопку 'Создать'", async() => {
			await expect(this.headerText).toHaveText("Создание смен врача Ветохина Светлана Ивановна");
		});
		await test.step("Заполнить форму", async() => {
			await this.fillShiftForm(newPage, false, false, "Владивосток, МК Океанский проспект,90 (В)", "68");
		});
		await test.step("Убрать чекбоксы с дат, которые уже прошли", async() => {
			await this.uncheckDaysBeforeCurrent(1);
		});
		await test.step("Нажать на кнопку 'Сохранить'", async() => {
			await this.saveButton.click();
		});
	};

  async fillShiftForm(
    page: Page,
    date: boolean,
    prevDate: boolean,
    medicalOffice: string,
    officeType: string,
    specialization: boolean = true,
  ) {
    const { startTime, endTime } = await this.calculateShiftTimes();

    if(date) {
      await test.step("Установить дату начало смены и окончание смены на следующий день", async() => {
        const nextDay = await this.tomorrowDate();
        await this.startDate.fill(nextDay);
        await this.endDate.fill(nextDay);
      });
    };

    if(prevDate) {
      await test.step("Установить прошлый месяц начало смены и окончение смены", async() => {
        const prevMonth = await this.prevDate();
        await this.startDate.fill(prevMonth);
        await this.endDate.fill(prevMonth);
      });
    };

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
    await test.step("Выбрать специализацию врача", async() => {
      await this.specialization.check();
    });
  };

  async calculateShiftTimes() {
    const currentDate = new Date();
    let startHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    if (currentMinutes > 0) {
      startHour += 1;
    }
    const startTime = `${String(startHour).padStart(2, '0')}:00`;
    const endHour = (startHour + 6) % 24;
    const endTime = `${String(endHour).padStart(2, '0')}:00`;
    return { startTime, endTime };
  }

  async tomorrowDate() {
    const currentDate = new Date();
    //currentDate.setDate(currentDate.getDate() + 1);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const nextDayDate = `${year}-${month}-${day}`;
    return nextDayDate
  };

  async prevDate() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const prevDayDate = `${year}-${month}-${day}`;
    return prevDayDate
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
        };
      };
    };
  };

  async deleteAllShifts(page: Page) {
    await test.step("Кликнуть на чекбокс, чтобы выделить все созданные смены", async() => {
      await page.locator("[title='Выделить все']").click();
    });
    await test.step("Кликнуть на кнопку 'Удалить'", async() => {
      await page.locator("[title='Удалить смены пакетом']").click();
    });
    await test.step("Кликнуть на кнопку 'Да'", async() => {
      await page.getByRole("button", { name: " Да" }).click();
    });
  };
};



