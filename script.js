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

// 00 - website test form
function handleWebsiteForm() {
  $('#website_entry').submit(function(e) {
    e.preventDefault();
    let input = $('#js_url').val();
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
    throw new Error (response.statusText);
  })
  .then(desktopJson => createElements(desktopJson.lighthouseResult))
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
    throw new Error (response.statusText);
  })
  .then(mobileJson => createElements(mobileJson.lighthouseResult))
  .catch(err => {
    console.log(`error: ${err.message}`);
  });
};
// 02 - snapshot 
function createSnapshotUrl(uri) {
  const snapshot = `https://image.thum.io/get/${uri}`
  createElements(snapshot);
};
// 03 - display elements
function createElements(desktopJson, mobileJson, snapshot) {
  console.log(desktopJson);
  console.log(mobileJson);
  console.log(snapshot);
};
function displayElements() {
  console.log(`displayElements ran`);
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