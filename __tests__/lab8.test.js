describe('Basic user flow for SPA ', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5501');
    await page.waitForTimeout(500);
  });

  // test 1 is given
  it('Test1: Initial Home Page - Check for 10 Journal Entries', async () => {
    const numEntries = await page.$$eval('journal-entry', (entries) => {
      return entries.length;
    });
    expect(numEntries).toBe(10);
  });

  // test 2 is given
  it('Test2: Make sure <journal-entry> elements are populated', async () => {
    let allArePopulated = true;
    let data, plainValue;
    const entries = await page.$$('journal-entry');
    for (let i = 0; i < entries.length; i++) {
      data = await entries[i].getProperty('entry');
      plainValue = await data.jsonValue();
      if (plainValue.title.length == 0) { allArePopulated = false; }
      if (plainValue.date.length == 0) { allArePopulated = false; }
      if (plainValue.content.length == 0) { allArePopulated = false; }
    }
    expect(allArePopulated).toBe(true);
  }, 30000);

  it('Test3: Clicking first <journal-entry>, new URL should contain /#entry1', async () => {
    await page.click("journal-entry");
    expect(page.url()).toBe("http://127.0.0.1:5501/#entry1");
  });

  it('Test4: On first Entry page - checking page header title', async () => {
    const headerTitle = await page.$eval("header > h1", h1 => h1.textContent);
    expect(headerTitle).toBe("Entry 1");
  });

  it('Test5: On first Entry page - checking <entry-page> contents', async () => {
    /*
        { 
          title: 'You like jazz?',
          date: '4/25/2021',
          content: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.",
          image: {
            src: 'https://i1.wp.com/www.thepopcornmuncher.com/wp-content/uploads/2016/11/bee-movie.jpg?resize=800%2C455',
            alt: 'bee with sunglasses'
          }
        }
      */
    const testObj =  
    { 
      title: 'You like jazz?',
      date: '4/25/2021',
      content: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.",
      image: {
        src: 'https://i1.wp.com/www.thepopcornmuncher.com/wp-content/uploads/2016/11/bee-movie.jpg?resize=800%2C455',
        alt: 'bee with sunglasses'
      }
    }

    const realObj = await page.$eval("entry-page", entry => entry.entry);
    expect(JSON.stringify(realObj)).toBe(JSON.stringify(testObj));
  });

  it('Test6: On first Entry page - checking <body> element classes', async () => {
    const bodyClass = await page.$eval("body", body => body.className);
    expect(bodyClass).toContain("single-entry");
  });

  it('Test7: Clicking the settings icon, new URL should contain #settings', async () => {
    await page.click("header > img");
    expect(page.url()).toBe("http://127.0.0.1:5501/#settings");
  });

  it('Test8: On Settings page - checking page header title', async () => {
    const headerTitle = await page.$eval("header > h1", h1 => h1.textContent);
    expect(headerTitle).toBe("Settings");
  });

  it('Test9: On Settings page - checking <body> element classes', async () => {
    const bodyClass = await page.$eval("body", body => body.className);
    expect(bodyClass).toContain("settings");
  });

  it('Test10: Clicking the back button, new URL should be /#entry1', async() => {
    await page.goBack();
    expect(page.url()).toBe("http://127.0.0.1:5501/#entry1");
  });

  it('Test11: Clicking the back button once should bring the user back to the home page', async() => {
    await page.goBack();     
    expect(page.url()).toBe("http://127.0.0.1:5501/");
  });

  it('Test12: Header title should be "Journal Entries" when the user is on the homepage', async() => {
    const headerTitle = await page.$eval("header > h1", h1 => h1.textContent);
    expect(headerTitle).toBe("Journal Entries");
  });

  it('Test13: On the home page the <body> element should not have any class attribute', async() => {
    const bodyClass = await page.$eval("body", body => body.className);
    expect(bodyClass).toBe("");
  });

  it('Test14: Verify the url is correct when clicking on the second entry', async() => {
    await page.$$eval("journal-entry", entries => {entries[1].click()});
    expect(page.url()).toBe("http://127.0.0.1:5501/#entry2");
  });

  it('Test15: Verify the title is "Entry 2" when clicking on the second entry', async() => {
    const headerTitle = await page.$eval("header > h1", h1 => h1.textContent);
    expect(headerTitle).toBe("Entry 2");
  });

  it('Test16: Verify the entry page contents is correct when clicking on the second entry', async() => {
    const testObj =  
    { 
      title: "Run, Forrest! Run!",
      date: "4/26/2021",
      content: "Mama always said life was like a box of chocolates. You never know what you're gonna get.",
      image: {
        src: "https://s.abcnews.com/images/Entertainment/HT_forrest_gump_ml_140219_4x3_992.jpg",
        alt: "forrest running"
      }
    }

    const realObj = await page.$eval("entry-page", entry => entry.entry);
    expect(JSON.stringify(realObj)).toBe(JSON.stringify(testObj));
  });

  it('Test17: The user will be transported to the home page if they click the header', async() => {
    await page.$eval("header > h1", title => {title.click()});
    expect(page.url()).toBe("http://127.0.0.1:5501/");
  });

  it('Test18: The user will be able to control the audio of the entry page that have music snippets', async() => {
    await page.$$eval("journal-entry", entries => {entries[3].click()});
    const controlBool1 = await page.$eval("entry-page", page => page.shadowRoot.querySelector(".entry-audio").controls);
    expect(controlBool1).toBe(true);
    await page.goBack();
    await page.$$eval("journal-entry", entries => {entries[9].click()});
    const controlBool2 = await page.$eval("entry-page", page => page.shadowRoot.querySelector(".entry-audio").controls);
    expect(controlBool2).toBe(true);
    await page.$eval("header > h1", title => {title.click()});
  }, 20000);

  it('Test19: If one of the audios is played on the homepage, it will not stop playing even if the user navigates to another page', async() => {
    const audioPaused = await page.$$eval("journal-entry", entries => entries[9].shadowRoot.querySelector(".entry-audio").paused);
    expect(audioPaused).toBe(true);
    await page.$$eval("journal-entry", entries => {entries[9].shadowRoot.querySelector(".entry-audio").play()});
    await page.$$eval("journal-entry", entries => {entries[6].click()});
    const pausedAfterPlay = await page.$$eval("journal-entry", entries => entries[9].shadowRoot.querySelector(".entry-audio").paused);
    expect(pausedAfterPlay).toBe(false);
    await new Promise((resolve, reject) => setTimeout(resolve, 45000));
    const pausedAfterStop = await page.$$eval("journal-entry", entries => entries[9].shadowRoot.querySelector(".entry-audio").paused);
    expect(pausedAfterStop).toBe(true);
  }, 60000);

  it('Test20: If the user is in Settings page and keeps clicking the Settings symbol, they will just stay on that page', async() => {
    await page.click("header > img");
    await page.click("header > img");
    await page.click("header > img");
    await page.click("header > img");
    await page.click("header > img");
    await page.click("header > img");
    expect(page.url()).toBe("http://127.0.0.1:5501/#settings");
  }, 30000);  
});
