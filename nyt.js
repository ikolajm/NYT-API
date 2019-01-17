let key = 'KADfxIuI4u2WiKGfwtL7rC3LXgFTB8lU';
const baseURL = 'https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json';
let url;
let pageNumber = 0;
let displayNav = false;

//SEARCH FORM
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

//RESULTS SECTION
const section = document.querySelector('section');

// DOM MANIPULATION
nav.style.display = 'none';

// EVENT LISTENERS
searchForm.addEventListener('submit', fetchResults); 
nextBtn.addEventListener('click', nextPage); 
previousBtn.addEventListener('click', previousPage);

// FUNCTIONS
function fetchResults(e) {
    // Prevent default button function
    e.preventDefault();
    // Get url of what we are trying to access
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value;

    // Check if date check is filled
    if(startDate.value !== '') {
        console.log(startDate.value)
      url += '&begin_date=' + startDate.value;
    };

    if(endDate.value !== '') {
      url += '&end_date=' + endDate.value;
    };

    // Fetch the url and work with returned object
    fetch(url).then(function(result) {
    return result.json();
    }).then(function(json) {
    displayResults(json);
  });
}

// If there are already articles returned, remove and append new searches
function displayResults(json) {
    while (section.firstChild) {
        section.removeChild(section.firstChild);
    }

    // MAke article variable
    let articles = json.response.docs;

    // IF there are articles, show the nav
    if(articles.length > 1) {
        nav.style.display = 'block';
        // Prevent previous nav button on first page
        if (pageNumber === 0) {
            previousBtn.style.display = 'none';
        } else {
            previousBtn.style.display = 'block';
        }
        // If out of articles, don't display the next button
        if (articles.length < 10) {
            nextBtn.style.display ='none';
        }
    } else {
        nav.style.display = 'none';
    }

    // If there are no articles, don't return anything
    if(articles.length === 0) {
      console.log("No results");
    } else {
      //  If there are aeticles, begin creating elements to use later, the give necessary bootstrap card classes
      for(let i = 0; i < articles.length; i++) {
        // Elements
        let article = document.createElement('article');
        let heading = document.createElement('h2');
        let link = document.createElement('a');
        let img = document.createElement('img');
        let container = document.createElement('div');
        let desc = document.createElement('p');
        let date = document.createElement('p');
        let keywords = document.createElement('p');
        let clearfix = document.createElement('div');
        // Classes
        // Results container (grid format)
        // Article Card

        let current = articles[i];
        console.log("Current:", current); 

        // Set link url
        link.href = current.web_url;
        // Set links text as news headline
        link.textContent = current.headline.main;

        // Add description of story
        desc.textContent =  current.snippet;

        // Add the keywords for the story
        keywords.textContent = 'Keywords: ';

        // Add publish date

        let arr = current.pub_date.split('-');
        let formatSplit = arr[2].split('T');
        arr.push(formatSplit[0]);
        arr.splice(2, 1);
        let dateString = arr[1] + '/' + arr[2] + '/' + arr[0]; 
        

        date.textContent = 'Published: ' + dateString;

        // For each available keyword, add a span tag with the keyword
        for(let j = 0; j < current.keywords.length; j++) {
            let span = document.createElement('span');   
            span.textContent += current.keywords[j].value + ' ';   
            keywords.appendChild(span);
        }

        // If there are pictures, add picture to article return
        if(current.multimedia.length > 0) {
            img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
            img.alt = current.headline.main;
          }

        clearfix.setAttribute('class','clearfix');

        // Append children to corresponding parent elements
        article.appendChild(img);
        container.appendChild(heading);
        heading.appendChild(link);
        article.appendChild(container);
        container.appendChild(desc);
        container.appendChild(keywords);
        container.appendChild(date);
        article.appendChild(clearfix);
        section.appendChild(article);
      }
    }
};

// IF next page is clicked, increment the page number, get the results of the next search query
function nextPage(e) {
    pageNumber++;
    fetchResults(e); 
    console.log("Page number:", pageNumber);
};

// If previous page is clicked, decrement the page number and get the results for the next search query
function previousPage(e) {
    if(pageNumber > 0) {
      pageNumber--;
    } else {
      return;
    }
    fetchResults(e);
    console.log("Page:", pageNumber);
  };