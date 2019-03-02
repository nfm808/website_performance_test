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
// 09 - Google Charts

// 00 - website test form
function handleWebsiteForm() {
  $('#website_form').submit(function (e) {
    e.preventDefault();
    let input = $('#js_url').val();
    toggleDisplayById('website_form');
    fadeElementById('js_h1', 'fast');
    changeText('js_h1', 'Testing');
    fadeElementById('js_h1');
    handleLoadScreen();
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
function displayTestResultsElements() {
  console.log(DATA);
  let mobileTime = (Math.round(DATA.mobile.timing.total)) * .001;
  let desktopTime = (Math.round(DATA.desktop.timing.total)) * .001;
  let overview = `<div id="overview">
                    <img src="${DATA.siteImg}" alt="tested website screenshot" />
                    <h1>${DATA.desktop.finalUrl}</h1>
                    <section id="results_overview">
                      <div id="mobile_results">
                        <h2>Mobile</h2>
                        <div class="chart_div" id="chart_div_mobile"></div>
                        <p id="js_loadtime">${mobileTime}s</p>
                        <button class="detail_button" id="js_mobile_button" type="button">View Timeline</button>
                      </div>
                      <div id="desktop_results">
                        <h2>Desktop</h2>
                        <div class="chart_div" id="chart_div_desktop"></div>
                        <p id="js_loadtime">${desktopTime}s</p>
                        <button class="detail_button" id="js_desktop_button" type="button">View Timeline</button>
                      </div>
                    </section>
                    <div class="render_timeline" id="render_timeline"></div>
                    <div id="book">
                      <h2>Schedule a free professional review of your site today and learn how to achieve better performance!</h2>
                      <button type="button" id="js_book_button">Book Free Consult</button>
                      <p>Source: Google PageSpeed Insights</p>
                      <p>Chart Visualization: Google Charts</p>
                      <p>Click <a href="https://developers.google.com/speed/pagespeed/insights/?url=${DATA.desktop.requestedUrl}" target="_blank">Here</a> for your detailed report.</p>
                    </div>
                  </div>`
  fadeElementById('js_h1', 'fast');
  fadeElementById('load');
  $('#results').append(overview);
  fadeElementById('results');
  drawChart();
  handleMobileDetail();
  handleDesktopDetail();
  handleBookButton();
};
function handleMobileDetail() {
  $('#js_mobile_button').click(function(e) {
    let style = $('#render_timeline').attr('style');
    console.log(style);
    $('.render_timeline').empty();
    displayMobileRender();  
    if (style == undefined || style == 'display: none;') {
      slideById('render_timeline');
    } else {
      fadeElementById('render_timeline', 'fast');
      $('.render_timeline').empty();
      displayMobileRender();
      fadeElementById('render_timeline', 'fast');
    }
  });
};
function displayMobileRender() {
  let info = DATA.mobile.audits["screenshot-thumbnails"].details.items;
  let src = [];
  let time = [];
  $('.render_timeline').append(`<h2>Here is what your mobile users are seeing on load</h2><div class="render_thumbnails"></div>`);
  for (let i = 0; i < info.length; i++) {
    src = DATA.mobile.audits["screenshot-thumbnails"].details.items[i].data;
    time = DATA.mobile.audits["screenshot-thumbnails"].details.items[i].timing * .001;
    $('.render_thumbnails').append(`<div class="thumb_box"><img src="data:image/jpeg;base64, ${src}" /><p>${time}s</p></div>`);
  };
  $(".render_thumbnails").css({"display":"flex","flex-direction":"row"});
};
function handleDesktopDetail() {
  $('#js_desktop_button').click(function(e) {
    let style = $('#render_timeline').attr('style');
    console.log(style);
    $('.render_timeline').empty();
    displayDesktopRender();  
    if (style == undefined || style == 'display: none;') {
      slideById('render_timeline');
    } else {
      fadeElementById('render_timeline', 'fast');
      $('.render_timeline').empty();
      displayDesktopRender();
      fadeElementById('render_timeline', 'fast');
    }
  });
};
function displayDesktopRender() {
  let info = DATA.desktop.audits["screenshot-thumbnails"].details.items;
  let src = [];
  let time = [];
  $('.render_timeline').append(`<h2>Here is what your desktop users are seeing on load</h2><div class="render_thumbnails"></div>`);
  for (let i = 0; i < info.length; i++) {
    src = DATA.desktop.audits["screenshot-thumbnails"].details.items[i].data;
    time = DATA.desktop.audits["screenshot-thumbnails"].details.items[i].timing * .001;
    $('.render_thumbnails').append(`<div class="thumb_box"><img src="data:image/jpeg;base64, ${src}" /><p>${time}s</p></div>`);
  };
  $(".render_thumbnails").css({"display":"flex","flex-direction":"row"});
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
function handleBookButton() {
  $('#js_book_button').click(function() {
    $('#js_contact').empty();
    fadeElementById('results');
    createContactForm();
  });
};
function createContactForm() {
  console.log(`createContactForm ran`);
  let contact = `<form action="/" method="post" class="contact-form" id="contact-form">
                  <input id="url" value="${DATA.desktop.requestedUrl}" readonly/>
                  <label id="name-label" for="name">Name</label>
                  <input id="name" type="text" placeholder="Your Name" aria-placeholder="Your Name" required aria-required="true">
                  <label id="email-label" for="email">Email</label>
                  <input id="email" type="text" placeholder="Your Email" aria-placeholder="Your Email" required aria-required="true">
                  <label id="message-label" for="message">Let's Talk</label>
                  <textarea id="message" placeholder="Your Message" aria-placeholder="Your Message" required aria-required="true"></textarea>
                  <button id="submit" type="submit">Submit</button>
                </form>
                <button type="button" id="js_results_button">Results</button>`
  $('#js_contact').prepend(contact);
  fadeElementById('js_contact');
  $("#js_contact").css({"display":"flex","flex-direction":"column"});
  handleResultsButton();
  handleSubmitForm();
};
function validateEmail(email) {
  console.log(`validateEmail ran`);
  let re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
};
//validate form submission
function validateForm() {
  let name = $('#name').val();
  let email = $('#email').val();
  let message = $('#message').val();
  if (name === "" || name === "Your Name") {
    $('#name-label').text(`Required`);
    $('#name-label').css({"color": "red"});
    $('#name').focus();
    return false;
  }
  if (name !== "" || name !== "Your Name") {
    $('#name-label').text(`Name`);
    $('#name-label').css({"color": "green"});
  } 
  if (email == "" || email == "Your Email") {
    $('#email-label').text(`Valid Email Required`);
    $('#email-label').css({"color": "red"});
    $('#email').focus();
    return false;
  }
  if (validateEmail(email) === false) {
    $('#email-label').text(`Valid Email Required`);
    $('#email-label').css({"color": "red"});
    $('#email').focus();
    return false;
  }
  if (validateEmail(email) === true) {
    $('#email-label').text(`Email`);
    $('#email-label').css({"color": "green"});
  } 
  if (message === "" || message === "Your Message") {
    $('#message-label').text(`Required`);
    $('#message-label').css({"color": "red"});
    $('#message').focus();
    return false;
  }
  if (message !== "" || message !== "Your Name") {
    $('#message-label').text(`Let's Talk`);
    $('#message-label').css({"color": "green"});
  } 
  return true;
};
function handleSubmitForm() {
  //submit listener
  $('#submit').click(function(e) {
    e.preventDefault();
    
    //validate the submit form
    if (validateForm() === true) {
      console.log(`handleSubmitForm() was a success`)

    } else {
      console.log(`handleSubmitForm() was a fail`)
    };
    
  });
};
function handleResultsButton() {
  $('#js_results_button').click(function() {
    fadeElementById('js_contact');
    fadeElementById('results');
  });
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
function slideById(id) {
 $(`#${id}`).slideToggle();
};
// 08 load Page
function handleLoadScreen() {
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
};
function changeText(id, str) {
  $(`#${id}`).text(`${str}`);
};
// 09 - Google Charts
function loadChart() {
  google.charts.load('current', {'packages':['gauge']});
  google.charts.setOnLoadCallback(drawChart());
};
function drawChart() {

  var dataM = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Score', 0]
  ]);
  var dataD = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Score', 0]
  ]);


  var options = {
    width: 150, height: 120,
    redFrom: 0, redTo: 50,
    yellowFrom: 50, yellowTo: 90,
    greenFrom: 90, greenTo: 100,
    minorTicks: 5
  };
  
  var chart = new google.visualization.Gauge(document.getElementById('chart_div_mobile'));
  var chartD = new google.visualization.Gauge(document.getElementById('chart_div_desktop'));

  chart.draw(dataM, options);
  chartD.draw(dataD, options);

  setInterval(function() {
    dataM = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      [`${determineScoreDisplay(DATA.mobile.categories.performance.score)}`, 0]
    ]);
    dataD = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      [`${determineScoreDisplay(DATA.desktop.categories.performance.score)}`, 0]
    ]);
    dataM.setValue(0, 1, 0 + (DATA.mobile.categories.performance.score * 100));
    dataD.setValue(0, 1, 0 + (DATA.desktop.categories.performance.score * 100))
    chart.draw(dataM, options);
    chartD.draw(dataD, options);
  }, 3000);
};
// 99 - on page load calls
function handleOnPageLoad() {
  handleWebsiteForm();
  loadChart();
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
// 09 - Google Charts