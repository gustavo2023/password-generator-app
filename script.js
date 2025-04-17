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

slider.addEventListener("input", updateSliderFill);

updateSliderFill();

const generateCharArrays = (begin, end) => {
  const charArray = [];

  for (let i = begin; i <= end; i++) {
    charArray.push(String.fromCharCode(i));
  }

  return charArray;
};

const createCharPool = () => {
  let charPool = [];

  if (upperCaseCheckbox.checked) charPool = charPool.concat(UPPERCASE_CHARS);
  if (lowerCaseCheckbox.checked) charPool = charPool.concat(LOWERCASE_CHARS);
  if (numbersCheckbox.checked) charPool = charPool.concat(NUMBER_CHARS);
  if (symbolsCheckbox.checked) charPool = charPool.concat(SYMBOL_CHARS);

  return charPool;
};

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

const generatePassword = () => {
  const charArray = shuffleArray(createCharPool());
  const passwordLength = parseInt(slider.value, 10);
  const passwordArray = [];

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * charArray.length);
    passwordArray.push(charArray[randomIndex]);
  }

  return passwordArray.join("");
};

const copyPasswordToClipboard = async () => {
  if (passwordInput.value) {
    try {
      await navigator.clipboard.writeText(passwordInput.value);
      copyTextSpan.textContent = "COPIED";
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy password. Please try again.");
    }
  } else {
    alert("Please generate a password first.");
  }
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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  passwordInput.value = generatePassword();
});

copyBtn.addEventListener("click", copyPasswordToClipboard);
