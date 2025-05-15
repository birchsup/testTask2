import {expect, Page} from "@playwright/test";
import {siteTextConst} from "../helpers/consts/textMessagesConsts";

export class ThankYouPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    elements = {
        mainContainer:()=> this.page.locator('div[class*="platform-thankyou"]'),
        title: () =>
            this.elements.mainContainer().locator('h1'),

        paragraph: () =>
            this.elements.mainContainer().locator('p'),

        viewDocsButton: () =>
            this.elements.mainContainer().locator('a#cta-hero-docs'),

        communityButton: () =>
            this.elements.mainContainer().locator('a#cta-hero-answers'),

    };

    async checkPage(){
        await this.page.waitForURL(/\/thanks-for-signing-up/);
        await expect(this.elements.mainContainer()).toBeVisible()
        await expect(this.elements.title()).toHaveText(siteTextConst.thankYouPageMsg.h1Msg);
        await expect(this.elements.paragraph()).toHaveText(siteTextConst.thankYouPageMsg.paragraphMsg);
        await expect(this.elements.viewDocsButton()).toBeVisible();
        await expect(this.elements.communityButton()).toBeVisible();
    }



}

export const thankYouPage = (page: Page) => new ThankYouPage(page);