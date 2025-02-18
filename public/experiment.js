// Experiment Configuration
const concepts = [
  "tree", "justice", "death", "angry", "sad", "safety", "peace", "sick",
  "happy", "banana", "mango", "sandstorm", "peach", "lightning",
];

// BCP-37 Color Set
const colors = [
  "#DC143C", "#FF4500", "#FFD700", "#ADFF2F", "#228B22", "#00CED1", "#0000CD",
  "#800080", "#FF9999", "#FFC299", "#FFFF99", "#DFFF99", "#99FF99", "#99FFFF",
  "#99C2FF", "#C299FF", "#CC6666", "#CC9966", "#CCCC66", "#99CC66", "#66CC66",
  "#66CCCC", "#6699CC", "#9966CC", "#800000", "#804000", "#808000", "#608000",
  "#004D00", "#008080", "#004080", "#400080", "#000000", "#333333", "#666666",
  "#999999", "#FFFFFF"
];

let trialData = [];
let shuffledTrials = [];
let experimentCount = 0;
let currentTrialIndex = 0;
let selectedReward = null;
let experimentEnded = false;

// Pokémon Cards
const pokemonCards = shuffleArray([
  "arcanine", "bulbasaur", "butterfree", "ditto", "dragonite", "eevee", "gengar",
  "mew", "mewtwo", "pikachu", "snorlax", "squirtle", "charizard", "psyduck"
]);

// Pokémon Sizes
const pokemonSizes = {
  "arcanine": 400, "bulbasaur": 250, "butterfree": 300, "ditto": 180,
  "dragonite": 500, "eevee": 230, "gengar": 320, "mew": 210,
  "mewtwo": 450, "pikachu": 230, "snorlax": 500, "squirtle": 250,
  "charizard": 700, "psyduck": 280
};

// Cat Evolution Stages
const catStages = [
  { file: "meow1", height: 130 }, { file: "meow2", height: 170 },
  { file: "meow3", height: 200 }, { file: "meow4", height: 230 },
  { file: "meow5", height: 270 }, { file: "meow6", height: 300 },
  { file: "meow7", height: 330 }, { file: "meow8", height: 360 },
  { file: "meow9", height: 380 }, { file: "meow10", height: 400 }
];
let catStageIndex = 0;

// Shuffle Function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Generate Trials (random concept-color pairs)
function generateTrials() {
  shuffledTrials = shuffleArray(
    concepts.flatMap(concept =>
      shuffleArray(colors).map(color => ({ concept, color }))
    )
  );
}

// Select Reward & Highlight the Choice
function selectReward(rewardType) {
  console.log("Reward selected:", rewardType);
  selectedReward = rewardType;
  // Remove previous selection and add the new one
  document.getElementById("unboxPokemon").classList.remove("selected");
  document.getElementById("viewCat").classList.remove("selected");
  if (rewardType === "pokemon") {
    document.getElementById("unboxPokemon").classList.add("selected");
  } else {
    document.getElementById("viewCat").classList.add("selected");
  }
  // Enable the Start Experiment button
  document.getElementById("startButton").disabled = false;
  console.log("Start button enabled");
}

// Display the Next Trial
function nextTrial() {
  if (currentTrialIndex >= shuffledTrials.length) {
    endExperiment();
    return;
  }
  const { concept, color } = shuffledTrials[currentTrialIndex];
  console.log("Showing trial:", concept, color);
  document.getElementById("concept").textContent = concept.toUpperCase();
  document.getElementById("colorBox").style.backgroundColor = color;
  document.getElementById("ratingSlider").value = 50;
  document.getElementById("trialCountValue").textContent = currentTrialIndex + 1; // Update trial count
}

// Start Experiment: Hide instructions, generate trials, and show first trial
function startExperiment() {
  if (!selectedReward) {
    alert("Please choose a reward first!");
    return;
  }
  console.log("Starting Experiment with reward:", selectedReward);
  document.getElementById("instructions").style.display = "none";
  document.getElementById("experiment").style.display = "block";
  generateTrials();
  nextTrial();
}

// Submit Rating & Proceed to Next Trial
function submitRating() {
  if (currentTrialIndex >= shuffledTrials.length) {
    endExperiment();
    return;
  }
  const rating = document.getElementById("ratingSlider").value;
  const { concept, color } = shuffledTrials[currentTrialIndex];
  trialData.push({ concept, color, rating });
  experimentCount++;
  currentTrialIndex++;
  // Unlock a reward every 20 experiments
  if (experimentCount % 20 === 0) {
    unlockReward();
  }
  nextTrial();
}

// Unlock Rewards based on selected reward path
function unlockReward() {
  if (selectedReward === "pokemon") {
    unlockCard();
  } else if (selectedReward === "cat") {
    evolveCat();
  }
}

// Unlock a Pokémon Card
function unlockCard() {
  if (pokemonCards.length === 0) return;
  const card = pokemonCards.shift();
  document.getElementById("pokemon").style.display = "block";
  showHiddenCard(card);
}

// Show the hidden Pokémon Card (before reveal)
function showHiddenCard(card) {
  const cardImage = document.getElementById("cardImage");
  cardImage.src = `pics/pokemon/card.png`;
  cardImage.style.width = "150px";
  cardImage.style.height = "210px";
  cardImage.style.cursor = "pointer";
  cardImage.onclick = function () {
    revealPokemon(card);
  };
  document.getElementById("blindBox").style.display = "block";
}

// Reveal the actual Pokémon Card
function revealPokemon(card) {
  const cardImage = document.getElementById("cardImage");
  cardImage.src = `pics/pokemon/${card}.png`;
  cardImage.style.height = `${pokemonSizes[card] / 2}px`;
  cardImage.style.width = "auto";
  cardImage.onclick = null;
  addCardToCollection(card);
}

// Add the revealed Pokémon Card to the collection placeholder
function addCardToCollection(card) {
  const cardsContainer = document.getElementById("cardsContainer");
  if (!cardsContainer) return;
  // Check if card is already in the collection
  if (![...cardsContainer.children].some(img => img.alt === card)) {
    const cardImg = document.createElement("img");
    cardImg.src = `pics/pokemon/${card}.png`;
    cardImg.alt = card;
    cardImg.style.height = `${pokemonSizes[card] / 2}px`;
    cardImg.style.width = "auto";
    cardImg.style.margin = "5px";
    cardsContainer.appendChild(cardImg);
  }
  // Display the collected Pokémon section if hidden
  document.getElementById("collectedPokemon").style.display = "block";
}

// Evolve the Cat (append new cat image without clearing previous ones)
function evolveCat() {
  if (catStageIndex >= catStages.length) return;
  const catContainer = document.getElementById("catEvolution");
  // Create a new cat image and scale it down (50% of defined height)
  const catImage = document.createElement("img");
  const scaledHeight = catStages[catStageIndex].height * 0.5;
  catImage.src = `pics/meow/${catStages[catStageIndex].file}.png`;
  catImage.style.height = `${scaledHeight}px`;
  catImage.style.width = "auto";
  catImage.style.marginRight = "5px";
  catContainer.appendChild(catImage);
  catContainer.style.display = "block";
  catStageIndex++;
}

// End Experiment: Hide experiment & reward containers, then show final slide
function endExperiment() {
  if (experimentEnded) return;
  experimentEnded = true;
  document.getElementById("experiment").style.display = "none";
  document.getElementById("pokemon").style.display = "none";
  document.getElementById("blindBox").style.display = "none";
  document.getElementById("collectedPokemon").style.display = "none";
  document.getElementById("catEvolution").style.display = "none";
  
  // Build final slide content based on selected reward
  const finalRewardDisplay = document.getElementById("finalRewardDisplay");
  finalRewardDisplay.innerHTML = ""; // Clear any previous content
  if (selectedReward === "pokemon") {
    // Append the collected Pokémon section (including its header and cards)
    finalRewardDisplay.innerHTML = document.getElementById("collectedPokemon").innerHTML;
  } else if (selectedReward === "cat") {
    // Append the entire cat evolution container (all evolved cats)
    finalRewardDisplay.innerHTML = document.getElementById("catEvolution").innerHTML;
  }
  document.getElementById("finalSlide").style.display = "block";
  submitData();
}

// Submit trial data to the server
async function submitData() {
  try {
    let response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: trialData }),
    });
    if (!response.ok) throw new Error("Submission failed!");
    console.log("Data submitted successfully");
  } catch (error) {
    console.error("Error submitting data:", error);
    alert("There was an error submitting your data. Please try again.");
  }
}

// Attach Event Listeners
document.getElementById("unboxPokemon").addEventListener("click", () => selectReward("pokemon"));
document.getElementById("viewCat").addEventListener("click", () => selectReward("cat"));
document.getElementById("startButton").addEventListener("click", startExperiment);
document.getElementById("nextButton").addEventListener("click", submitRating);
document.getElementById("endButton").addEventListener("click", endExperiment);
document.getElementById("ratingSlider").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submitRating();
  }
});
