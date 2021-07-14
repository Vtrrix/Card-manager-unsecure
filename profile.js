let cardsDisplayArea = document.getElementById("cards");
let navName = document.querySelector("#nav h2");

navName.innerText = `Welcome, ${getCookie("userName")}`;
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
console.log(getCookie("userToken"));

let logoutUser = () => {
  location.replace("index.html");
  var allCookies = document.cookie.split(";");
  for (var i = 0; i < allCookies.length; i++)
    document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
  console.log("cookie cleared", document.cookie);
};
document.getElementById("logout").addEventListener("click", logoutUser);

//get cards request methods------------------------------------------

let GetCards = async () => {
  console.log(document.cookie);

  var myHeaders = new Headers();
  //==================================== secure ==============================================
  // myHeaders.append("Authorization", `jwt ${getCookie("userToken")}`);
  //============================================================================================

  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(
    //==================================== secure ==============================================
    // `https://secure-restapi.herokuapp.com/card/${getCookie("userName")}`,
    //==================================================================================
    //==================================== not secure ==============================================
    `https://sql-injection-restapi.herokuapp.com/card/${getCookie("userName")}`,
    //==================================================================================

    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      result.cards.map((card) => {
        let expdate = new Date(parseInt(card.expiry_date));

        cardsDisplayArea.innerHTML += `
        <div class="card">
          <div class="card__front card__part">
            <p class="card_numer">${
              //======================== secure XSS==============================================
              // CheckInput(card.card_no)
              //   ? " "
              //   : //=================================================================================================
              card.card_no
            }</p>
            <div class="card__space-75">
              <span class="card__label">Card holder</span>
              <p class="card__info">${
                //======================== secure XSS==============================================

                // CheckInput(card.account_holder)
                //   ? " "
                //   : //=================================================================================================
                card.account_holder
              }</p>
            </div>
            <div class="card__space-25">
            <span class="card__label">Expires</span>
            <p class="card__info">${("0" + (expdate.getMonth() + 1)).slice(
              -2
            )}/${expdate.getFullYear().toString().substr(-2)}</p>
          </div>
          </div>

          <div class="card__back card__part">
            <div class="card__black-line"></div>
            <div class="card__back-content">
              <div class="card__secret">
                <p class="card__secret--last">${
                  //======================== secure XSS==============================================
                  // CheckInput(card.cvv)
                  //   ? " "
                  //   : //====================================================================================================
                  card.cvv
                }</p>
              </div>
            </div>
          </div>
        </div>
        `;
      });
    })
    .catch((error) => console.log("error", error));
};

GetCards();

// add card--------------------------------------------------------------

let formVisible = false;
let toggleAddCard = document.getElementById("showAddCard");
let addCardFormDiv = document.getElementById("addCard");
let closeForm = document.getElementById("closeForm");
let AddCardAlertPrompt = document.querySelector(".AddCardAlert");

function toggleForm() {
  if (formVisible) {
    addCardFormDiv.style.display = "none";
  } else {
    addCardFormDiv.style.display = "flex";
  }
  formVisible = !formVisible;
}
closeForm.addEventListener("click", toggleForm);
showAddCard.addEventListener("click", toggleForm);

let AddCard = async (cardType, cardNum, cvvNum, accHolder, expDate) => {
  console.log(getCookie("userToken"));
  //==================================== secure XSS==============================================
  // if (
  //   !CheckInput(cardType) &&
  //   !CheckInput(accHolder) &&
  //   !CheckInput(phoneNum)
  // ) {
  //==============================================================================
  var myHeaders = new Headers();
  //==================================== secure ==============================================
  // myHeaders.append("Authorization", `jwt ${getCookie("userToken")}`);
  //=========================================================================================
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    card_type: cardType,
    card_no: parseInt(cardNum),
    cvv: parseInt(cvvNum),
    account_holder: accHolder,
    phone_number: 0,
    expiry_date: expDate,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    //==================================== secure ==============================================
    // `https://secure-restapi.herokuapp.com/card/${getCookie("userName")}`,
    //==================================================================================
    //==================================== not secure ==============================================
    `https://sql-injection-restapi.herokuapp.com/card/${getCookie("userName")}`,
    //==================================================================================

    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      location.reload();
    })
    .catch((error) => console.log("error", error));
  //==================================== secure XSS==============================================
  // } else {
  //   AddCardAlertPrompt.style.display = "initial";
  // }
  //============================================================================================
};
let cardHolder = document.getElementById("cardHolder");
let cardNum = document.getElementById("cardNum");
let expDate = document.getElementById("expDate");
let cardType = document.getElementById("cardType");
let cvv = document.getElementById("cvv");
let addCardButton = document.getElementById("addCardButton");

function CheckInput(str) {
  var pattern = /<(.*)>/;
  return pattern.test(str);
}

addCardButton.addEventListener("click", () => {
  event.preventDefault();
  expDate = Date.parse(expDate.value);

  AddCard(cardType.value, cardNum.value, cvv.value, cardHolder.value, expDate);
});

//advert=======================================================
let advert = document.getElementById("advert");
let advertButton = document.querySelector("#advert button");
function showAdvert() {
  advert.style.right = "0";
}
setTimeout(showAdvert, 3000);

advertButton.addEventListener("click", () => {
  alert(document.cookie);
  advert.style.right = "-100%";
});
