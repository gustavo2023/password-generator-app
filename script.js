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
const strengthIndicatorSpan = document.querySelector(".strength-span");
const strengthBars = document.querySelectorAll(".strength-bar");

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

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

const generatePassword = () => {
  const passwordLength = parseInt(slider.value, 10);
  let guaranteedChars = [];
  let charPool = [];

  // Check selected options and build initial password parts + full pool
  if (upperCaseCheckbox.checked) {
    guaranteedChars.push(UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)]);
    charPool = charPool.concat(UPPERCASE_CHARS);
  }
  if (lowerCaseCheckbox.checked) {
    guaranteedChars.push(LOWERCASE_CHARS[Math.floor(Math.random() * LOWERCASE_CHARS.length)]);
    charPool = charPool.concat(LOWERCASE_CHARS);
  }
  if (numbersCheckbox.checked) {
    guaranteedChars.push(NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)]);
    charPool = charPool.concat(NUMBER_CHARS);
  }
  if (symbolsCheckbox.checked) {
    guaranteedChars.push(SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)]);
    charPool = charPool.concat(SYMBOL_CHARS);
  }

  // If no options selected, return empty or handle error
  if (charPool.length === 0) {
    return "";
  }

  const remainingLength = passwordLength - guaranteedChars.length;

  // Fill the rest of the password length with random chars from the pool
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    guaranteedChars.push(charPool[randomIndex]);
  }

  // Shuffle the final array to mix guaranteed and random chars
  const finalPasswordArray = shuffleArray(guaranteedChars);

  return finalPasswordArray.join("");
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

const calculatePasswordStrength = (password) => {
  let score = 0;
  const length = password.length;

  if (length >= 16) score += 4;
  else if (length >= 12) score += 3;
  else if (length >= 8) score += 2;
  else if (length >= 4) score += 1;

  let typesCount = 0;
  const typesRegexArray = [
    /[a-z]/, // lowercase
    /[A-Z]/, // uppercase
    /[0-9]/, // numbers
    /[!@#$%^&*(),.?":{}|<>]/, // symbols
  ];

  typesRegexArray.forEach((regex) => {
    if (regex.test(password)) typesCount++;
  });

  if (typesCount >= 3 && length >= 8) {
    score += typesCount;
  } else if (typesCount >= 2 && length >= 12) {
    score += typesCount;
  }

  if (score >= 8) return 4;
  if (score >= 6) return 3;
  if (score >= 4) return 2;
  return 1;
};

const updateStrengthIndicators = (strengthLevel) => {
  const strengthLevelsInfo = {
    0: { text: "", className: "" }, // Base case for reset/no strength
    1: { text: "TOO WEAK", className: "too-weak" },
    2: { text: "WEAK", className: "weak" },
    3: { text: "MEDIUM", className: "medium" },
    4: { text: "STRONG", className: "strong" },
  };

  const currentStrength =
    strengthLevelsInfo[strengthLevel] || strengthLevelsInfo[0];
  const { text, className } = currentStrength;

  strengthIndicatorSpan.textContent = text;

  // Get all possible non-empty class names for removal
  const allClassesToRemove = Object.values(strengthLevelsInfo)
    .map((info) => info.className)
    .filter(Boolean); // Filter out empty string

  // Iterate through each strength bar
  strengthBars.forEach((bar, index) => {
    bar.classList.remove(...allClassesToRemove);

    if (index < strengthLevel && className) {
      bar.classList.add(className);
    }
  });
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

  // Check if at least one checkbox is selected
  const anyCheckboxChecked = upperCaseCheckbox.checked || lowerCaseCheckbox.checked || numbersCheckbox.checked || symbolsCheckbox.checked;

  if (!anyCheckboxChecked) {
    alert("Please select at least one character type option.");
    // Optionally clear password field and strength indicator
    passwordInput.value = "";
    updateStrengthIndicators(0);
    copyTextSpan.textContent = ""; // Reset copy text if needed
    return; // Stop execution
  }

  const password = generatePassword();
  passwordInput.value = password;
  const passwordStrength = calculatePasswordStrength(password);
  updateStrengthIndicators(passwordStrength);
  copyTextSpan.textContent = ""; // Reset copy text on new generation
});

copyBtn.addEventListener("click", copyPasswordToClipboard);
