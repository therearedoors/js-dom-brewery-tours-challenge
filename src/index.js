const breweriesList = document.getElementById("breweries-list")
const selectStateForm = document.getElementById("select-state-form")
selectStateForm.addEventListener("submit", event => searchEventHandler
(event))
const filterByTypeForm = document.getElementById("filter-by-type-form")
filterByTypeForm.addEventListener("input", event => filterEventHandler(event))
let state

function searchEventHandler(event){
    event.preventDefault()
    const input = document.getElementById("select-state")
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${input.value}`)
    .then(res => res.json())
    //.then(res => state.push(res))
    .then(list => {
        state = list
        renderBreweryList(state)
    })
}

function filterEventHandler(event){
    const input = event.target.value
    if (input === "regional") renderBreweryList(state)
    else {
    const filtering = state.filter(brewery => brewery.brewery_type === input)
    renderBreweryList(filtering)
    }
}

function renderBreweryList(breweries){
    breweriesList.innerHTML = ""
    breweries.forEach(brewery => {
        const li = generateBreweryLi(brewery)
        breweriesList.appendChild(li)
    })
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
    section.append(a)
    return section
}