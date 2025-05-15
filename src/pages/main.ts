import {expect, Page} from '@playwright/test';


export class MainPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    elements = {
        mainPageHeaders: ()=> this.page.locator('h1'),
        newsletterFormContainer: ()=> this.page.locator('section[class*="newsletter-form"]'),
        newsletterEmailInput: () => this.page.locator('input[id*="email"]'),
        subscribeButton: ()=> this.page.getByRole('button', { name: 'Subscribe' }),
    };

    async checkPage(url:string){
        await expect(this.page).toHaveURL(url)
        const count = await this.elements.mainPageHeaders().count();
        expect(count).toBeGreaterThan(0);
    }

    async checkVisibilityOfNewsletterContainer(){
        await expect(this.elements.newsletterFormContainer()).toBeVisible()
        await expect(this.elements.newsletterEmailInput()).toBeVisible()
    }

    async fillEmail(email:string){
        await expect(this.elements.newsletterEmailInput()).toBeVisible()
        await this.elements.newsletterEmailInput().fill(email)
        await expect(this.elements.newsletterEmailInput()).toHaveValue(email)
    }

    async clickOnTheSubscribeButton(){
        await expect(this.elements.subscribeButton()).toBeVisible()
        await this.elements.subscribeButton().click()
    }

    async validateInvalidEmails(emails: string[]) {
        for (const email of emails) {
            await this.fillEmail(email);
            await this.clickOnTheSubscribeButton();
            await expect(this.page).not.toHaveURL(/\/thanks-for-signing-up/);
            await expect(this.elements.newsletterFormContainer()).toBeVisible();
        }
    }
}

export const mainPage = (page: Page) => new MainPage(page);
