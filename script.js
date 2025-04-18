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

// Character sets
const LOWERCASE_CHARS = generateCharArrays(97, 122); // a-z
const UPPERCASE_CHARS = generateCharArrays(65, 90); // A-Z
const NUMBER_CHARS = generateCharArrays(48, 57); // 0-9
const SYMBOL_CHARS = generateCharArrays(33, 47).concat(
  generateCharArrays(58, 64),
  generateCharArrays(91, 96),
  generateCharArrays(123, 126)
);

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

// Reads password generation settings from the DOM
const getPasswordConfig = () => {
  return {
    length: parseInt(slider.value, 10),
    includeUppercase: upperCaseCheckbox.checked,
    includeLowercase: lowerCaseCheckbox.checked,
    includeNumbers: numbersCheckbox.checked,
    includeSymbols: symbolsCheckbox.checked,
  };
};

// Generates a password based on the provided configuration
const generatePassword = (config) => {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  } = config;

  let guaranteedChars = [];
  let charPool = [];

  // Build guaranteed characters and character pool based on config
  if (includeUppercase) {
    guaranteedChars.push(
      UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)]
    );
    charPool = charPool.concat(UPPERCASE_CHARS);
  }
  if (includeLowercase) {
    guaranteedChars.push(
      LOWERCASE_CHARS[Math.floor(Math.random() * LOWERCASE_CHARS.length)]
    );
    charPool = charPool.concat(LOWERCASE_CHARS);
  }
  if (includeNumbers) {
    guaranteedChars.push(
      NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)]
    );
    charPool = charPool.concat(NUMBER_CHARS);
  }
  if (includeSymbols) {
    guaranteedChars.push(
      SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)]
    );
    charPool = charPool.concat(SYMBOL_CHARS);
  }

  // If no character types are selected, return empty string
  if (charPool.length === 0) {
    return "";
  }

  // Handle cases where requested length is smaller than the number of guaranteed characters
  if (guaranteedChars.length > length) {
    // Shuffle guaranteed characters and take only the required length
    guaranteedChars = shuffleArray(guaranteedChars).slice(0, length);
    return guaranteedChars.join("");
  }

  const remainingLength = length - guaranteedChars.length;

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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const config = getPasswordConfig();

  // Check if at least one character type option is selected
  const anyCheckboxChecked =
    config.includeUppercase ||
    config.includeLowercase ||
    config.includeNumbers ||
    config.includeSymbols;

  if (!anyCheckboxChecked) {
    alert("Please select at least one character type option.");
    // Clear password field and strength indicator
    passwordInput.value = "";
    updateStrengthIndicators(0);
    copyTextSpan.textContent = ""; // Reset copy text
    return; // Stop execution
  }

  const password = generatePassword(config);
  passwordInput.value = password; // Update the password input field

  // Calculate and display password strength
  const passwordStrength = calculatePasswordStrength(password);
  updateStrengthIndicators(passwordStrength);

  copyTextSpan.textContent = ""; // Reset copy text on new generation
});

copyBtn.addEventListener("click", copyPasswordToClipboard);
