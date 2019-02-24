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
    createSnapshotUrl(`url=${input}`);
  } else {
    createPageInsightsUrl(`url=http://${input}`);
    createSnapshotUrl(`url=http://${input}`);
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
function getPageInsightsDesktop(url, option) {
  fetch(url, option)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error (response.statusText);
  })
  .then(desktopJson => console.log(desktopJson))
  .catch(err => {
    console.log(`error: ${err.message}`);
  });
};
function getPageInsightsMobile(url, option) {
  fetch(url, option)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error (response.statusText);
  })
  .then(mobileJson => console.log(mobileJson))
  .catch(err => {
    console.log(`error: ${err.message}`);
  });
};
function createPageInsightsElements() {
  console.log(`createPageInsightsElements ran`);
};
// 02 - snapshot api
function createSnapshotUrl(uri) {
  console.log(`createSnapshotUrl(${uri}) ran`);
};
function getSnapshot() {
  console.log(`getSnapshot ran`);
};
function createSnapshotElements() {
  console.log(`createSnapshotElements ran`);
};
// 03 - display elements
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