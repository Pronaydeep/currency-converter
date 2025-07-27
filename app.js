const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Adding all currency options dynamically
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    //Default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Update flag whenever dropdown changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

//  Fetch exchange rate and display
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  //  If empty or invalid, reset to 1
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  //  FIXED URL – only fetch base currency JSON
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch currency data");
    }

    let data = await response.json();

    //  Access the conversion rate
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

    //  Calculate final amount
    let finalAmount = (amtVal * rate).toFixed(2);

    //  Display the result
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;

  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error(error);
  }
};

//Update flag image when currency changes
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

//  When button is clicked, update conversion
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

//Load default conversion on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
