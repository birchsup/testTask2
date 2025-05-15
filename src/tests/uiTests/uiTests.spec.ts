import {baseurl, invalidEmails} from "../../helpers/consts/mainSiteConst";
import {EmailGenerator} from "../../helpers/dataGen/dataGen";
import { test } from '../../../test-fixtures';

test.describe('Tests from test task', ()=>{
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('Lead Capture Form Validation valid email', async ({ app }) => {
      await app.mainPage.checkPage(baseurl)
      await app.mainPage.checkVisibilityOfNewsletterContainer()
      await app.mainPage.fillEmail(EmailGenerator.generateValidEmail())
      await app.mainPage.clickOnTheSubscribeButton()
      await app.thankYouPage.checkPage()
  });
  test('Form should reject invalid emails', async ({ app }) => {
      await app.mainPage.checkPage(baseurl);
      await app.mainPage.checkVisibilityOfNewsletterContainer();
      await app.mainPage.validateInvalidEmails(invalidEmails)
    });

})

