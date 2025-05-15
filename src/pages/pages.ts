import {Page} from "@playwright/test";
import {MainPage} from "./main";
import {ThankYouPage} from "./thankYouPage";

export class Pages {
    readonly mainPage: MainPage;
    readonly thankYouPage: ThankYouPage


    constructor(page: Page) {
        this.mainPage = new MainPage(page);
        this.thankYouPage = new ThankYouPage(page)

    }
}
export const pages = (page: Page) => new Pages(page);