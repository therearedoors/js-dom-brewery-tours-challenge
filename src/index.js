const breweriesList = document.getElementById("breweries-list")

const selectStateForm = document.getElementById("select-state-form")
selectStateForm.addEventListener("submit", event => searchEventHandler
(event))

const filterByTypeForm = document.getElementById("filter-by-type-form")
filterByTypeForm.addEventListener("input", event => filterEventHandler(event))

const searchBreweriesForm = document.getElementById("search-breweries-form")
searchBreweriesForm.addEventListener("input", event => searchByName(event))

const filtersSection = document.querySelector(".filters-section")

let myState
let filteredState
let pageSortedState
let currentPage = 1
let validTypes = ["micro", "brewpub","regional"]

const clearAllBtn = document.querySelector(".clear-all-btn")
clearAllBtn.addEventListener("click", clearAll)

function clearAll(){
    document.getElementById("filter-by-city-form")?.reset()
    render(myState)
}

function searchEventHandler(event){
    event.preventDefault()
    filterByTypeForm.reset()
    const input = document.getElementById("select-state")
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${input.value}&page=1&per_page=50`)
    .then(res => res.json())
    .then(breweries => {
        myState = breweries.filter(brewery => validTypes.includes(brewery.brewery_type))
        filteredState = myState
        render(myState)
    })
}

function filterEventHandler(event){
    const input = event.target.value
    if (input === "all") render(myState)
    else {
    filteredState = myState.filter(brewery => brewery.brewery_type === input)
    render(filteredState)
    }
}

function pageSortState(state){
    pageSortedState = state.reduce((pageSort,brewery)=>{
        const nextPage = pageSort[pageSort.length-1]
        nextPage.push(brewery)
        if (nextPage.length == 10) pageSort.push([])
        return pageSort
    },[[]])
}

function searchByName(event){
    const input = event.target.value
    const regex = new RegExp(input,"i")
    const filtering = myState.filter(brewery => regex.test(brewery.name))
    render(filtering)
}

function render(breweries){
    pageSortState(breweries)
    currentPage = 1
    renderBreweryList()
    renderCitiesFilter()
    renderPaginationButtons()
}

function renderBreweryList(){
    breweriesList.innerHTML = ""
    pageSortedState[currentPage-1].forEach(brewery => {
        const li = generateBreweryLi(brewery)
        breweriesList.appendChild(li)
    })
}

function subRender(filtering){
    pageSortState(filtering)
    currentPage = 1
    renderBreweryList()
    renderPaginationButtons()
}

function renderCitiesFilter(){
    document.getElementById("filter-by-city-form")?.remove()
    const form = document.createElement("form")
    form.setAttribute("id","filter-by-city-form")
    form.addEventListener("input", function() {
        const checks = Array.from(form.childNodes).filter(node => node.checked).map(node => node.value)
        const filtering = filteredState.filter(brewery => checks.includes(brewery.city.toLowerCase()))
        if (checks.length == 0) subRender(filteredState)
        else subRender(filtering)
    })
    cities = filteredState.reduce((set,brewery) => {
    set.add(brewery.city)
    return set
    }, new Set())
    cities.forEach(city => {
        form.append(
            generateCheckbox(city),
            generateLabel(city)
            )
    })
    filtersSection.append(form)
}

function renderPaginationButtons() {
    const subtractButton = document.createElement("button");
    const pageNumber = document.createElement("span");
    const addButton = document.createElement("button");
    
    const maxPages = pageSortedState.length

    subtractButton.innerText = "-"
    subtractButton.className = ("pagination-btn")
    pageNumber.innerText = `Page ${currentPage} of ${maxPages}`
    addButton.innerText = "+"
    addButton.className = ("pagination-btn")
    pageNumber.className = "pagination"

    subtractButton.addEventListener("click", () => previousPage(maxPages))
    addButton.addEventListener("click", () => nextPage(maxPages))

    breweriesList.prepend(subtractButton,pageNumber,addButton)
}

function previousPage(max) {
    if (currentPage > 1){
    currentPage--
    renderBreweryList()
    renderPaginationButtons()
    }
}

function nextPage(max) {
    if (currentPage < max){
    currentPage++
    renderBreweryList()
    renderPaginationButtons()
    }
}

function generateBreweryLi(brewery){
    const li = document.createElement("li")
    const h2 = generateHeader(2,brewery.name)
    const div = generateTypeDiv(brewery.brewery_type)
    const addSection = generateAddressSection(brewery)
    const phoneSection = generatePhoneSection(brewery.phone)
    const linkSection = generateLinkSection(brewery.website_url)
    li.append(
        h2,
        div,
        addSection,
        phoneSection,
        linkSection
        )
return li
}

function generateHeader(headerNum, breweryName){
    const header = document.createElement(`h${headerNum}`)
    header.innerText = breweryName
    return header
}

function generateTypeDiv(type){
    const div = document.createElement("div")
    div.className = "type"
    div.innerText = type
    return div
}

function generateAddressSection(brewery){
    const section = document.createElement("section")
    section.className = "address"
    const h3 = generateHeader(3,"Address:")
    const p1 = document.createElement("p")
    p1.innerText = brewery.street
    const p2 = document.createElement("p")
    const strong = document.createElement("strong")
    strong.innerText = `${brewery.city}, ${brewery.postal_code}`
    p2.append(strong)
    section.append(h3,p1,p2)
    return section
}

function generatePhoneSection(phoneNum){
    const section = document.createElement("section")
    section.className = "phone"
    const h3 = generateHeader(3,"Phone:")
    const p = document.createElement('p')
    p.innerText = phoneNum
    section.append(h3,p)
    return section
}

function generateLinkSection(url){
    const section = document.createElement("section")
    section.className = "link"
    const a = document.createElement("a")
    a.setAttribute('href', url)
    a.setAttribute('target', "_blank")
    a.innerText = "VISIT WEBSITE"
    section.append(a)
    return section
}

function generateCheckbox(city){
    const cityToLowerCase = city.toLowerCase()
    const input = document.createElement("input")
    input.setAttribute("type", "checkbox")
    input.setAttribute("name", cityToLowerCase)
    input.setAttribute("value", cityToLowerCase)
    return input
}
function generateLabel(city){
    const label = document.createElement("label")
    label.setAttribute("for", city.toLowerCase())
    label.innerText = city
    return label
}