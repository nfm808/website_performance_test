'use strict';
// 99 - Call on Page Load
// 00 - Website Test Form
// 01 - Page Insights API
// 02 - Snapshot API
// 03 - Display Elements
// 04 - Contact Form
// 05 - Booking Button
// 06 - Call Listeners For Rendered Elements
// 07 - Animations
// 08 - Load Page

// 00 - website test form
function handleWebsiteForm() {
  $('#website_form').submit(function (e) {
    e.preventDefault();
    let input = $('#js_url').val();
    toggleDisplayById('website_form');
    fadeElementById('js_h1', 'fast');
    changeText('js_h1', 'Testing');
    fadeElementById('js_h1');
    changeSpan();
    fadeElementById('load');
    formatWebsiteString(input);
  });
};
function formatWebsiteString(input) {
  let filter = input.includes('http://');
  let filterS = input.includes('https://');
  if (filter == true || filterS == true) {
    createPageInsightsUrl(`url=${input}`);
    createSnapshotUrl(`${input}`);
  } else {
    createPageInsightsUrl(`url=http://${input}`);
    createSnapshotUrl(`http://${input}`);
  }
};
// 01 - page insights api
function createPageInsightsUrl(uri) {
  const mobile = '&strategy=mobile&'
  const desktop = '&strategy=desktop&'
  const baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?'
  const key = 'key=AIzaSyDL2WF56Nm-A0CcDcQ0BGGmULH8XPu9wjw'
  const option = {
    "Accept": "application/json",
  };
  const pageMobile = baseUrl + uri + mobile + key;
  const pageDesktop = baseUrl + uri + desktop + key;
  getPageInsightsDesktop(pageDesktop, option);
  getPageInsightsMobile(pageMobile, option);
};
function getPageInsightsDesktop(pageDesktop, option) {
  fetch(pageDesktop, option)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(desktopJson => {
      sortElements(desktopJson.lighthouseResult);
    })
    .catch(err => {
      console.log(`error: ${err.message}`);
    });
};
function getPageInsightsMobile(pageMobile, option) {
  fetch(pageMobile, option)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(mobileJson => sortElements(mobileJson.lighthouseResult))
    .catch(err => {
      console.log(`error: ${err.message}`);
    });
};
// 02 - snapshot 
function createSnapshotUrl(uri) {
  const snapshot = `https://image.thum.io/get/${uri}`;
  sortElements(snapshot);
};
// 03 - display elements
function sortElements(data) {
  if (data[0] === 'h') {
    DATA.siteImg = data;
  } else if (data.configSettings.emulatedFormFactor == 'mobile') {
    DATA.mobile = data;
  } else if (data.configSettings.emulatedFormFactor == 'desktop') {
    DATA.desktop = data;
  }
  if (Object.keys(DATA).length == 3) {
    displayTestResultsElements();
  }
};
function changeText(id, str) {
  $(`#${id}`).text(`${str}`);
}
function displayTestResultsElements() {
  console.log(DATA);
  let mobileTime = Math.floor(DATA.mobile.timing.total) * .001;
  let desktopTime = Math.floor(DATA.desktop.timing.total) * .001;
  let screenshot = `<img src="${DATA.siteImg}" alt="tested website screenshot" />`;
  let mobileOverview = `<div id="overview">
                          <div id="mobile_results">
                            <h1>Overall Performance</h1>
                            <h2>Mobile</h2>
                            <h3 id="js_mobile_score">${determineScoreDisplay(DATA.mobile.categories.performance.score)}</h3>
                            <p id="js_loadtime">${mobileTime}s</p>
                          </div>
                          <div id="desktop_results">
                            <h2>Desktop</h2>
                            <h3 id="js_desktop_score">${determineScoreDisplay(DATA.desktop.categories.performance.score)}</h3>
                            <p id="js_loadtime">${desktopTime}s</p>
                          </div>
                          <button id="js_book_button">Book Free Consult</button>
                          <p>source: https://developers.google.com/speed/pagespeed/insights/</p>
                        </div>`
  fadeElementById('js_h1', 'fast');
  fadeElementById('load');
  $('#results').prepend(screenshot);
  $('#results').append(mobileOverview);
  fadeElementById('results');
};
function determineScoreDisplay(x) {
  if (x < .50) {
    return 'Low'
  }
  if (x >= .50 && x < .90) {
    return 'Average'
  }
  if (x >= .9) {
    return 'Good'
  }
};
// 04 - contact form
function createContactForm() {
  console.log(`createContactForm ran`);
};
function validateEmail() {
  console.log(`validateEmail ran`);
};
function handleContactForm() {
  console.log(`handleContactForm ran`);
};
// 05 - booking button
function handleBookButton() {
  console.log(`handleBookButton ran`);
};
// 06 - call listeners
function handleResultsPage() {
  console.log(`handleResultsPage ran`);
};
// 07 - animations
function fadeElementById(id, duration, ease) {
  let defaultSpeed = "slow, ";
  let defaultEase = "linear";
  if (duration == undefined) {
    return $(`#${id}`).fadeToggle(defaultSpeed, ease);
  } else if (ease == undefined) {
    return $(`#${id}`).fadeToggle(duration, defaultEase);
  } else if (duration == undefined && ease == undefined) {
    return $(`#${id}`).fadeToggle(defaultSpeed, defaultEase);
  } else {
    return $(`#${id}`).fadeToggle(duration, ease);
  };
};
function toggleDisplayById(id) {
  $(`#${id}`).toggle();
};
// load Page
function changeSpan() {
  setTimeout(() => {
    fadeElementById('js_seconds');
    fadeElementById('js_percent');
    changeText('js_seconds', '5');
    changeText('js_percent', '90');
    fadeElementById('js_seconds');
    fadeElementById('js_percent');
  }, 4000)
  setTimeout(() => {
    fadeElementById('js_seconds');
    fadeElementById('js_percent');
    changeText('js_seconds', '10');
    changeText('js_percent', '123');
    fadeElementById('js_seconds');
    fadeElementById('js_percent');
  }, 9000)

}
// 99 - on page load calls
function handleOnPageLoad() {
  handleWebsiteForm();
};
$(handleOnPageLoad());

// 99 - Call on Page Load
// 00 - Website Test Form
// 01 - Page Insights API
// 02 - Snapshot API
// 03 - Display Elements
// 04 - Contact Form
// 05 - Booking Button
// 06 - Call Listeners For Rendered Elements
// 07 - Animations
// 08 - Load Page