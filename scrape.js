

module.exports = {
    jobs_table: function() {
      const puppeteer = require('puppeteer');


      let scrape = async () => {
          const browser = await puppeteer.launch({headless: false});
          const page = await browser.newPage();
          var url_to_scrape = 'https://www.themuse.com/jobs?keyword%5B%5D=javascript&job_location%5B%5D=Boulder%2C%20CO&filter=true'

          await page.goto(url_to_scrape);

          const result = await page.evaluate(() => {
              let data = []; // Create an empty array that will store our data
              let elements = document.querySelectorAll('.job-list-individual'); // Select all Products

              for (var element of elements){ // Loop through each proudct
                let job_title = element.querySelector('h2').innerText; // Select the title
                let employer = element.querySelector('.header-text').innerText; // Select the title
                let location = element.querySelector('.location-value').innerText.trim(); // Select the title
                let url = element.querySelector('.job-list-individual__header').href; // Select the title

                data.push({job_title, employer, location, url}); // Push an object with the data onto our array
              }



              return data; // Return our data array
          });

          browser.close();
          return result; // Return the data
      };

}
};
// scrape().then((value) => {
//     console.log(value); // Success!
// });
