// 'goni.js' it is my freameWork (:
// loSt_s and loSt_g they shoetcut for localStorage function [g => getItems] [s => setItems] 
import {loSt_s, loSt_g, activeClassHandling} from "./goni.js";

// ===============================[functions section]=================================
// function to send request to 'restcountries.com' API and return responses
function getRestcountriesResponses(url) {
    return $.ajax({
    url: url,
    headers: {'Access-Control-Allow-Origin': '*'},
    dataType: 'json',
    withCredentials: true,
    cache: false,
    success: (data) => {
        return data;
    },
    error: (err) => {
        return err;
    }
});}

function getCountry(countryName) {
    return getRestcountriesResponses(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
}

function getCountryByCode(theCode) {
    return getRestcountriesResponses(`https://restcountries.com/v3.1/alpha/${theCode}`);
}

function addCountryToContentSection(imgURL, countryName, aPopulation, theRegion, theCapital) {
    let card = document.createElement("div");
    let img = document.createElement("img");
    let infoDiv = document.createElement("div");
    let name = document.createElement("h3");
    let population = document.createElement("p");
    let region = document.createElement("p");
    let capital = document.createElement("p");

    card.classList.add("aCountry", "bxSh");
    img.classList.add("flag", "bxSh");
    img.style.cursor = 'pointer';
    img.addEventListener(("click"), () => {
        getCountry(img.parentElement.querySelector("h3").textContent).then((countryData) => {
            displayCountry(countryData);
        }, () => {
            notFoundTheCountry("there is unexpected error");
        })
    })

    infoDiv.className = "information";
    name.className = "name";
    population.className = "population";
    region.className = "region";
    capital.className = "capital";

    img.src = imgURL;
    name.textContent = countryName;
    population.textContent = `Population: ${aPopulation}`;
    region.textContent = `Region: ${theRegion}`;
    capital.textContent = `Capital: ${theCapital}`;

    infoDiv.appendChild(name);
    infoDiv.appendChild(population);
    infoDiv.appendChild(region);
    infoDiv.appendChild(capital);
    card.appendChild(img);
    card.appendChild(infoDiv);

    document.querySelector(".displayContent").appendChild(card);
}

// send request and get data of countries from
function displayCountries() {
    let filter = loSt_g("filteringBy");
    let url = `https://restcountries.com/v3.1/region/${filter}`;
    if (filter == "All World") {
        url = `https://restcountries.com/v3.1/all`;
    }
    // let Regions = ["Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"];
    // send request and get data of countries from 'restcountries.com' API
    getRestcountriesResponses(url).then((data) => {
        for (let i = 0; i < data.length; i++) {
                addCountryToContentSection(
                    data[i].flags.png, 
                    data[i].name.common,
                    data[i].population,
                    data[i].region,
                    data[i].capital? data[i].capital: "No Capital");
        }
    });
}

function displayCountry(theCountry) {
    theCountry[0] = theCountry[1] || theCountry[0];
    window.scrollTo(0, 0);
    let aCountry = theCountry[0];
    document.querySelector(".displayContent").style.display = "none";

    let basicInfo = {
        "native Name": aCountry.name.nativeName[Object.keys(aCountry.name.nativeName)[0]].common,
        "Population": aCountry.population,
        "Region": aCountry.region,
        "Sub Region": aCountry.subregion,
        "Capital": aCountry.capital
    }
    
    let languages = [];
    for (let kye in aCountry.languages) {
        languages.push(aCountry.languages[kye]);
    }
    let additionalInfo = {
        "Top Level Domain": aCountry.tld[0],
        "Currencies": aCountry.currencies[Object.keys(aCountry.currencies)[0]].name,
        "Languages": languages.join(", ")
    }
    
    createCountryPage(
            aCountry.flags.png,
            aCountry.name.common,
            basicInfo,
            additionalInfo,
            aCountry.borders
    );
}

function createCountryPage(imgURL, coutryName, basicInfo, additionalInfo, BorderCountries) {
    // contain all text information
    let info = document.createElement("div");
    info.className = "info";
    

    let basic = document.createElement("div");
    basic.className = "basic";
    let countryName = document.createElement("h2");
    countryName.textContent = coutryName;
    basic.appendChild(countryName);
    for (const k in basicInfo) {
        let p = document.createElement("p");
        p. textContent =`${k}: ${basicInfo[k]}`;
        basic.appendChild(p);
    }
    info.appendChild(basic);
    
    
    let additional = document.createElement("div");
    additional.className = "additional";
    for (const k in additionalInfo) {
        let p = document.createElement("p");
        p.textContent = `${k}: ${additionalInfo[k]}`;
        additional.appendChild(p);
    }
    info.appendChild(additional);
    
    
    let borders = document.createElement("div");
    borders.className = "borders";
    let bordersContener = document.createElement("p");
    bordersContener.textContent = "Border Countries: ";
    if (BorderCountries) {
        BorderCountries.forEach((border) => {
            getCountryByCode(border).then((country) => {
                let span = document.createElement("span");
                span.classList.add("bxSh");
                span.textContent = country[0].name.common;
                span.addEventListener(("click"), () => {
                    getCountry(span.textContent).then((countryData) => {
                        displayCountry(countryData);
                    })
                })
                bordersContener.appendChild(span);
            })
        });
    }
    else {
        bordersContener.textContent += "No Borders";
    }
    borders.appendChild(bordersContener);

    
    // contain img and all text information
    let infoContener = document.createElement("div");
    infoContener.className = "infoContener";
    infoContener.appendChild(info);
    infoContener.appendChild(borders);


    let imgCountry = document.createElement("img");
    imgCountry.classList.add("bxSh");
    imgCountry.src = imgURL;
    imgCountry.alt = "flag";

    // div that contains all data of country
    let theCountry = document.createElement("div");
    theCountry.className = "theCountry";
    theCountry.appendChild(imgCountry);
    theCountry.appendChild(infoContener);


    let backButton = document.createElement("button");
    backButton.textContent = "back";
    backButton.classList.add("back", "bxSh");
    backButton.addEventListener("click", () => {
        backButton.parentElement.remove();
        if(!document.querySelector(".countryInfo")) {
            document.querySelector(".displayContent").style.display = "grid";
        }
    });

    // page contener
    let countryInfo = document.createElement("div");
    countryInfo.className = "countryInfo";
    countryInfo.appendChild(backButton);
    countryInfo.appendChild(theCountry);


    document.querySelector(".content").appendChild(countryInfo);
}

function setThemeColors(theme, subTheme, textColor, type) {
    document.documentElement.style.setProperty("--theme", theme);
    document.documentElement.style.setProperty("--subTheme", subTheme);
    document.documentElement.style.setProperty("--textColor", textColor);
    let themeColor = {
        type: type,
        theme: theme,
        subTheme: subTheme,
        textColor: textColor
    };
    loSt_s("theme", JSON.stringify(themeColor));
}

function notFoundTheCountry(massege) {
    let msg = document.createElement("p");
    msg.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--subTheme);
    padding: 25px 35px;
    color: red;
    border-radius: 5px;
    transition: .5s;
    `;

    msg.classList.add("bxSh");
    msg.textContent = massege;
    
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.remove();
    }, 4000);
}

// ===============================[header => switch mode or theme]=================================
// switch bwtween light and darck mode
if (!loSt_g("theme")) {
    setThemeColors("#000b2e", "#171d31", "white", "dark");
}
else {
    let themeColor = JSON.parse(loSt_g("theme"));
    setThemeColors(themeColor["theme"], themeColor["subTheme"], themeColor["textColor"], themeColor["type"]);
}
let switchTHeme = document.querySelector("header .switchTheme");
switchTHeme.onclick = () => {
    if (JSON.parse(loSt_g("theme"))["type"] == "dark") {
        setThemeColors("white", "white", "black", "light");
        switchTHeme.textContent = "Dark Mode";
    }
    else {
        setThemeColors("#000b2e", "#171d31", "white", "dark");
        switchTHeme.textContent = "Light Mode";
    }
}

let dropMenu = document.querySelector(".filter .dropMenu");
let filters = document.querySelector(".filters");
dropMenu.onclick = () => {
    filters.classList.toggle("open");
}

// ===============================[options section => Search field and the filter]=================================
// filter the display by Regions
if (!loSt_g("filteringBy")) {
    loSt_s("filteringBy", "All World");
}

// switch between regions how is the active
let options = Array.from(filters.children);
options.forEach((op) => {
    op.onclick = () => {
        activeClassHandling(options, "filteringBy", op);
        document.querySelector(".filter > .currently span").textContent = op.value;
        loSt_s("filteringBy", op.value);
    }
});

// assigne the active region in filter
options.forEach(op => {
    if (op.value === loSt_g("filteringBy")) {
        activeClassHandling(options, "filteringBy", op);
        document.querySelector(".filter > .currently span").textContent = op.value;
    }
});

// get country name and display it
let searchField = document.getElementById("searchField");
let searchForm = document.querySelector(".search");
searchForm.onsubmit = () => {
    getCountry(searchField.value).then((countryData) => {
        displayCountry(countryData);
    }, () => {
        notFoundTheCountry("Not Found The Country");
    })
    searchField.value = "";
    return false;
}


// ===============================[ display countreis section ]=================================
displayCountries();

