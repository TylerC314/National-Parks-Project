const apiKey = "3J4EKFOhayou9SZ7q4PDZzJ1NFH4codkcUsTwdZP";
const apiUrl = "https://developer.nps.gov/api/v1/parks";

function formatParameters(parameters) {
    const queryItems = Object.keys(parameters).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`);
    return queryItems.join("&");
}

function getParks(prkCode, maxResults = 10) {
    let prkCodeArr = String(prkCode).replace(/,/g, " ").split(" ");
    console.log("Array: ", prkCodeArr);
    const parameters = {
        stateCode: prkCode,
        api_key: apiKey,
        fields: "addresses",
        limit: maxResults,
        sort: "parkCode",
    }

    const queryString = formatParameters(parameters);
    const url = apiUrl + "?" + queryString;

    console.log(url);

    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            displayResults(responseJson);
        });
}

function displayResults(responseJson) {
    responseJson.data.forEach((park, num) => {
        let parkAddress = "";
        park.addresses.forEach(address => {
            if(address.type === "Physical") {
                parkAddress = address;
            }
        });
        console.log(park.url);
        console.log(parkAddress);
        const parkData = `
            <li>[${num + 1}] Name: ${park.fullName}</li>
            <li>Description: ${park.description}</li>
            <li>Website: ${park.url}</li>
            <li><p>Address: ${parkAddress.city}, ${parkAddress.stateCode} ${parkAddress.postalCode}</p></li>
            `;
        $(".park-list").append(parkData);
    });
}

function parkSearchHandler(){
    $("form").submit(event => {
        event.preventDefault();
        $(".park-list").html("");
        if($("#max-results-input").val().length > 0) {
            getParks($("#park-state-input").val(), $("#max-results-input").val());
        }
        else {
            getParks($("#park-state-input").val(), /*Default 10*/);
        }
    });
}

$(parkSearchHandler());