const apiKey = "3J4EKFOhayou9SZ7q4PDZzJ1NFH4codkcUsTwdZP";
const apiUrl = "https://developer.nps.gov/api/v1/parks";

function formatParameters(parameters) {
    const queryItems = Object.keys(parameters).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`);
    return queryItems.join("&");
}

function getParks(stateCode, maxResults = 10) {
    let stateCodeArr = String(stateCode).replace(/,/g, " ").replace(/  /g, " ").split(" ");
    console.log("Array: ", stateCodeArr);
    const parameters = {
        api_key: apiKey,
        fields: "addresses",
        limit: maxResults,
        sort: "parkCode",
    }

    let queryString = formatParameters(parameters);
    stateCodeArr.forEach(state => {
        queryString += `&stateCode=${state}`;
    });
    const url = `${apiUrl}?${queryString}`;

    let errMsg = "Something went Wrong!"

    fetch(url)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => {
            if(responseJson.total == 0) {
                errMsg = "Not a valid input try again"
                return Promise.reject();
            }
            displayResults(responseJson);
        })
        .catch(err => {
            alert(errMsg)
        });
}

function displayResults(responseJson) {
    responseJson.data.forEach(park => {
        let parkAddress = "";
        park.addresses.forEach(address => {
            if(address.type === "Physical") {
                parkAddress = address;
            }
        });
        const parkData = `
            <ul class="park-list">
                <li>Name:
                <li>${park.fullName}</li>
                <li>Description:</li>
                <li>${park.description}</li>
                <li>Website:</li>
                <li>${park.url}</li>
                <li>Address:<li>
                <li>${parkAddress.line1} ${parkAddress.line2} ${parkAddress.line3}</li>
                <li>${parkAddress.city}, ${parkAddress.stateCode} ${parkAddress.postalCode}</li>
            <ul>
            `;
        $(".parks-display").append(parkData);
    });
}

function parkSearchHandler(){
    $("form").submit(event => {
        event.preventDefault();
        $(".parks-display").html("");
        if($("#max-results-input").val().length > 0) {
            getParks($("#park-state-input").val(), $("#max-results-input").val());
        }
        else {
            getParks($("#park-state-input").val(), /*Default 10*/);
        }
    });
}

$(parkSearchHandler());