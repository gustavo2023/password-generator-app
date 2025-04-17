const form = document.getElementById("password-form");
const slider = document.getElementById("char-input");
const sliderColorDisplay = document.querySelector(".range-color-display");
const charLengthSpan = document.getElementById("char-length");

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
