# Lab8_Starter

Name: Bao Nguyen

## Check your understanding q's (FILL OUT)
1. In your own words: Where would you fit your automated tests in your Bujo project development pipeline? 
   
- Within a Github action that runs whenever code is pushed 

1. Would you use a unit test to test the “message” feature of a messaging application? Why or why not? For this question, assume the “message” feature allows a user to write and send a message to another user.

- No because the message feature is not decomposed enough to be considered an independent software unit. As specified, the message feature is composed of writing and sending the message, both of which may be better candidates for unit testing. If it were to be tested as a unit, changing either of the subfeatures will likely affect its functionality.

2. Would you use a unit test to test the “max message length” feature of a messaging application? Why or why not? For this question, assume the “max message length” feature prevents the user from typing more than 80 characters

- Yes because the the max message length feature is low level and decomposed enough as an independent software unit. As such testing the max length is equivalent to checking whether a message exceeds a certain character threshold or not and this does not affect other app features.

3. What do you expect to happen if we run our puppeteer tests with the field “headless” set to true?

- No browser UI will be shown to showcase the tests visually.

4. What would your beforeAll callback look like if you wanted to start from the settings page before every test case?

- beforeAll(async () => {
 
      await page.goto('http://127.0.0.1:5500/');

      await page.click("header > img");

      await page.waitForTimeout(500);

  });

