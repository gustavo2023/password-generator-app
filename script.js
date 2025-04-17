// DOM elements
const form = document.getElementById("password-form");
const slider = document.getElementById("char-input");
const sliderColorDisplay = document.querySelector(".range-color-display");
const charLengthSpan = document.getElementById("char-length");
const passwordInput = document.getElementById("password");
const copyTextSpan = document.getElementById("copy-span");
const copyBtn = document.getElementById("copy-btn");
const upperCaseCheckbox = document.getElementById("uppercase-option");
const lowerCaseCheckbox = document.getElementById("lowercase-option");
const numbersCheckbox = document.getElementById("numbers-option");
const symbolsCheckbox = document.getElementById("symbols-option");

const generateCharArrays = (begin, end) => {
  const charArray = [];

  for (let i = begin; i <= end; i++) {
    charArray.push(String.fromCharCode(i));
  }

  return charArray;
};

// Character sets
const LOWERCASE_CHARS = generateCharArrays(97, 122); // a-z
const UPPERCASE_CHARS = generateCharArrays(65, 90); // A-Z
const NUMBER_CHARS = generateCharArrays(48, 57); // 0-9
const SYMBOL_CHARS = generateCharArrays(33, 47).concat(
  generateCharArrays(58, 64),
  generateCharArrays(91, 96),
  generateCharArrays(123, 126)
);

const updateSliderFill = () => {
  const min = slider.min ? parseFloat(slider.min) : 0;
  const max = slider.max ? parseFloat(slider.max) : 100;
  const value = parseFloat(slider.value);

  // Calculate the percentage
  const percentage = ((value - min) / (max - min)) * 100;

  // Apply the percentage width to the display div
  sliderColorDisplay.style.width = percentage + "%";

  // Update the character length text display
  if (charLengthSpan) {
    charLengthSpan.textContent = value;
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

slider.addEventListener("input", updateSliderFill);

updateSliderFill();
