'use strict';
// 99 - Call on Page Load
// 11 - Website Test Form
// 02 - API 
// 03 - Results Page
// 04 - Contact Form
// 05 - Animations
// 06 - Load Page
// 07 - Google Charts

// 11 - Website Test Form
function handleWebsiteForm() {
  $('#website_form').submit(function (e) {
    e.preventDefault();
    let input = $('#js_url').val();
    DATA.url = input;
    if (input == "") {
      return handleErrorDisplay('false');
    } else {
      fadeElementById('js_website_test', 'fast');
      handleLoadScreen();
      fadeElementById('load');
      $("#load").css({ "display": "flex" });
      formatWebsiteString(input);
    };
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
// 02 - API 
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
      console.log('Error with your request');
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
      handleErrorDisplay(DATA.url);
    });
};
function handleErrorDisplay(errorMessage) {
  $('.errorMessage').empty();
  $('#js_url').focus();
  if (errorMessage == 'false') {
    return $('.errorMessage').append(`<p>Something wasn't quite right.</p><p>Make sure you entered in the address correctly and try again</p>`);
  } else {
    fadeElementById('load');
    $("#load").removeAttr('style');
    $('#js_url').focus();
    $('.errorMessage').append(`<p>Something wasn't quite right.</p><p>Make sure you entered in the address correctly and try again</p><p>You entered: <span class="js_span">${errorMessage}</span></p>`);
    fadeElementById('js_website_test', 'fast');
  };
};
function createSnapshotUrl(uri) {
  const snapshot = `https://image.thum.io/get/${uri}`;
  sortElements(snapshot);
};
// 03 - Results Page
function sortElements(data) {
  if (data[0] === 'h') {
    DATA.siteImg = data;
  } else if (data.configSettings.emulatedFormFactor == 'mobile') {
    DATA.mobile = data;
  } else if (data.configSettings.emulatedFormFactor == 'desktop') {
    DATA.desktop = data;
  }
  if (Object.keys(DATA).length == 3) {
    createResultsTemplate();
  }
};
function createResultsTemplate() {
  let mobileTime = (Math.round(DATA.mobile.timing.total)) * .001;
  let desktopTime = (Math.round(DATA.desktop.timing.total)) * .001;
  let overview = `<div id="overview">
                    <div class="screenshot_container">
                      <img class="screenshot_img" src="${DATA.siteImg}" alt="tested website screenshot" />
                    </div>
                    <h1 class="header">${DATA.desktop.finalUrl}</h1>
                    <section id="score_overview">
                      <div id="mobile_results">
                        <h2 class="sub_header">Mobile</h2>
                        <div class="chart_div" id="chart_div_mobile"></div>
                        <p id="js_loadtime">${mobileTime}s</p>
                      </div>
                      <div id="desktop_results">
                        <h2 class="sub_header">Desktop</h2>
                        <div class="chart_div" id="chart_div_desktop"></div>
                        <p id="js_loadtime">${desktopTime}s</p>
                      </div>
                    </section>
                    <div class="timeline_container" >
                      <h2 class="timeline_header sub_header">Here is what your <span class="js_device js_span"></span> users are seeing on load</h2>
                      <div class="timeline_button_container">
                        <button class="detail_button" id="js_mobile_button" type="button">View <br>Timeline</button>
                        <button class="detail_button" id="js_desktop_button" type="button">View <br>Timeline</button>
                      </div>
                    </div>
                    <div class="render_timeline" id="render_timeline"></div>
                    <div id="book">
                      <h2 class="sub_header">Schedule a free professional review of your site today and learn how to achieve better performance!</h2>
                      <button type="button" id="js_book_button">Book Free<br>Consult</button>
                      <p id="js_source">Sources</p>
                      <div id="source">
                        <p>Test: <a href="https://developers.google.com/speed/pagespeed/insights/?url=${DATA.desktop.requestedUrl}" target="_blank">Google PageSpeed Insights</a></p>
                        <p>Chart Visualization: Google Charts</p>
                      </div>
                    </div>
                  </div>`
  displayResultsPage(overview);
};
function displayResultsPage(overview) {
  fadeElementById('js_h1', 'fast');
  fadeElementById('load');
  $('#results').append(overview);
  fadeElementById('results');
  $("#results").css({ "display": "flex" });
  drawChart();
  handleMobileDetailButton();
  handleDesktopDetailButton();
  handleBookButton();
  handleSourceClick();
};
function handleMobileDetailButton() {
  $('#js_mobile_button').click(function (e) {
    let style = $('#render_timeline').attr('style');
    $('.render_timeline').empty();
    displayMobileRender();
    $('.render_timeline').css("background", "#041230");
    $(".thumb_box p").css("color", "#fff");
    if (style == undefined || style == 'display: none;') {
      $('.js_device').text('mobile');
      slideById('render_timeline');
    } else {
      fadeElementById('render_timeline', 'fast');
      $('.render_timeline').empty();
      displayMobileRender();
      $(".thumb_box p").css("color", "#fff");
      fadeElementById('render_timeline', 'slow');
      $('.js_device').fadeToggle();
      $('.js_device').text('mobile');
      $('.js_device').fadeToggle();
    }
  });
};
function displayMobileRender() {
  let info = DATA.mobile.audits["screenshot-thumbnails"].details.items;
  let src = [];
  let time = [];
  $('.render_timeline').append(`<h4 class="close_div close_mobile"><a href="#">X</a></h4><div class="render_thumbnails"></div>`);
  closeTimelineDiv();
  for (let i = 0; i < info.length; i++) {
    src = DATA.mobile.audits["screenshot-thumbnails"].details.items[i].data;
    time = DATA.mobile.audits["screenshot-thumbnails"].details.items[i].timing * .001;
    $('.render_thumbnails').append(`<div class="thumb_box"><img class="thumbnail"src="data:image/jpeg;base64, ${src}" /><p>${time}s</p></div>`);
  };
};
function handleDesktopDetailButton() {
  $('#js_desktop_button').click(function (e) {
    let style = $('#render_timeline').attr('style');
    $('.render_timeline').empty();
    $('.render_timeline').css("background", "#fff");
    displayDesktopRender();
    $(".thumb_box>p").css("color", "#041230");
    if (style == undefined || style == 'display: none;') {
      $('.js_device').text('desktop');
      slideById('render_timeline');
    } else {
      fadeElementById('render_timeline', 'fast');
      $('.render_timeline').empty();
      displayDesktopRender();
      $(".thumb_box>p").css("color", "#041230");
      fadeElementById('render_timeline', 'slow');
      $('.js_device').fadeToggle();
      $('.js_device').text('desktop');
      $('.js_device').fadeToggle();
    }
  });
};
function displayDesktopRender() {
  let info = DATA.desktop.audits["screenshot-thumbnails"].details.items;
  let src = [];
  let time = [];
  $('.render_timeline').append(`<h4 class="close_div"><a href="#">X</a></h4><div class="render_thumbnails"></div>`);
  closeTimelineDiv();
  for (let i = 0; i < info.length; i++) {
    src = DATA.desktop.audits["screenshot-thumbnails"].details.items[i].data;
    time = DATA.desktop.audits["screenshot-thumbnails"].details.items[i].timing * .001;
    $('.render_thumbnails').append(`<div class="thumb_box"><img class="thumbnail" src="data:image/jpeg;base64, ${src}" /><p>${time}s</p></div>`);
  };
};
function closeTimelineDiv() {
  $('.close_div').click(function (e) {
    e.preventDefault();
    slideById('render_timeline');
    setTimeout(function() {
      $('.render_timeline').removeAttr("style");
    }, 1000);
    console.log($('.render_timeline').attr('style'));
  });
};
function handleSourceClick() {
  $('#js_source').click(function () {
    slideById('source');
  });
};
function handleBookButton() {
  $('#js_book_button').click(function () {
    $('#js_contact').empty();
    fadeElementById('results', 'fast');
    createContactForm();
  });
};
// 04 - contact page
function createContactForm() {
  let copy = `<div class="contact_copy"><h1 class="header">Contact Us</h1><h2 class="sub_header">Fill out and submit the form below to schedule your free consultation for <span class="js_span">${DATA.desktop.requestedUrl}</span>.</h2></div>`;
  let contact = `<form action="/" method="post" class="contact-form" id="contact-form">
                  <label id="name-label" for="name">Name</label>
                  <input id="name" type="text" placeholder="Your Name" aria-placeholder="Your Name" required aria-required="true">
                  <label id="email-label" for="email">Email</label>
                  <input id="email" type="text" placeholder="Your Email" aria-placeholder="Your Email" required aria-required="true">
                  <label id="message-label" for="message">Let's Talk</label>
                  <textarea id="message" placeholder="Your Message" aria-placeholder="Your Message" required aria-required="true"></textarea>
                  <input id="url" value="${DATA.desktop.requestedUrl}" readonly/>
                  <button id="submit" type="submit">Submit</button>
                  <button type="button" id="js_results_button">Results</button>
                </form>`
  fadeElementById('js_contact', 'slow');
  $('#js_contact').prepend(copy);
  $('#js_contact').append(contact);
  $("#js_contact").css({ "display": "flex", "flex-direction": "column" });
  handleResultsButton();
  handleSubmitForm();
};
function validateEmail(email) {
  console.log(`validateEmail ran`);
  let re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
};
function validateForm() {
  let name = $('#name').val();
  let email = $('#email').val();
  let message = $('#message').val();
  if (name === "" || name === "Your Name") {
    $('#name-label').text(`Required`);
    $('#name-label').css({ "color": "red" });
    $('#name').focus();
    return false;
  }
  if (name !== "" || name !== "Your Name") {
    $('#name-label').text(`Name`);
    $('#name-label').css({ "color": "#041230" });
  }
  if (email == "" || email == "Your Email") {
    $('#email-label').text(`Valid Email Required`);
    $('#email-label').css({ "color": "red" });
    $('#email').focus();
    return false;
  }
  if (validateEmail(email) === false) {
    $('#email-label').text(`Valid Email Required`);
    $('#email-label').css({ "color": "red" });
    $('#email').focus();
    return false;
  }
  if (validateEmail(email) === true) {
    $('#email-label').text(`Email`);
    $('#email-label').css({ "color": "#041230" });
  }
  if (message === "" || message === "Your Message") {
    $('#message-label').text(`Required`);
    $('#message-label').css({ "color": "red" });
    $('#message').focus();
    return false;
  }
  if (message !== "" || message !== "Your Name") {
    $('#message-label').text(`Let's Talk`);
    $('#message-label').css({ "color": "#041230" });
  }
  return true;
};
function handleSubmitForm() {
  $('#submit').click(function (e) {
    e.preventDefault();
    $('.error_response').remove();
    if (validateForm() === true) {
      console.log(`handleSubmitForm() was a success`)
      $('#js_contact').append(`<h3 class="error_response">Thank you and we will be in contact soon.</h3>`)
    } else {
      console.log(`handleSubmitForm() was a fail`)
      $('#js_contact').append(`<h3 class="error_response">Please check form and try again.</h3>`)
    };
  });
};
function handleResultsButton() {
  $('#js_results_button').click(function () {
    fadeElementById('js_contact', 'fast');
    fadeElementById('results', 'slow');
  });
};
// 05 - animations
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
// 06 load Page
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
// 07 - Google Charts
function loadChart() {
  google.charts.load('current', { 'packages': ['gauge'] });
};
function drawChart() {

  var dataM = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    [`${determineScoreDisplay(DATA.mobile.categories.performance.score)}`, 0]
  ]);
  var dataD = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    [`${determineScoreDisplay(DATA.desktop.categories.performance.score)}`, 0]
  ]);


  var options = {
    // width: 150, height: 150,
    redFrom: 0, redTo: 50,
    yellowFrom: 50, yellowTo: 90,
    greenFrom: 90, greenTo: 100,
    minorTicks: 5,
    animation: {
      duration: 9000,
      easing: 'inAndOut'
    }
  };

  var chart = new google.visualization.Gauge(document.getElementById('chart_div_mobile'));
  var chartD = new google.visualization.Gauge(document.getElementById('chart_div_desktop'));

  chart.draw(dataM, options);
  chartD.draw(dataD, options);

  setTimeout(function () {
    dataM.setValue(0, 1, 0 + (DATA.mobile.categories.performance.score * 100));
    dataD.setValue(0, 1, 0 + (DATA.desktop.categories.performance.score * 100))
    chart.draw(dataM, options);
    chartD.draw(dataD, options);
  }, 200);

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
// 99 - on page load calls
function handleOnPageLoad() {
  handleWebsiteForm();
  loadChart();
};
$(handleOnPageLoad());

// 99 - Call on Page Load
// 11 - Website Test Form
// 02 - API 
// 03 - Results Page
// 04 - Contact Form
// 05 - Animations
// 06 - Load Page
// 07 - Google Charts