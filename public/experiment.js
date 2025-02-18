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
  if (experimentCount % 20 === 0 && experimentCount <= shuffledTrials.length) {
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

  if (card === "charizard") {
    cardImage.classList.add("glow-effect");
    const charizardSound = document.getElementById("charizardSound");
    const charizardMessage = document.getElementById("charizardMessage");
    charizardMessage.style.display = "block";
    setTimeout(() => {
      charizardMessage.style.display = "none"; // Hide the message after 3 seconds
    }, 3000);
    celebrateCharizard(); // Call the D3 animation function
  }

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

// Create a fireball effect for Charizard
function celebrateCharizard() {
  // Play the sound effect
  const charizardSound = document.getElementById("charizardSound");
  charizardSound.play();

  // Trigger confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Show the congratulatory message
  const charizardMessage = document.getElementById("charizardMessage");
  charizardMessage.style.display = "block";
  setTimeout(() => {
    charizardMessage.style.display = "none";
  }, 3000);

  // Fireball animation
  const colorBox = d3.select("#colorBox");
  const svg = colorBox.append("svg")
    .attr("width", 200)
    .attr("height", 200)
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)");

  const fireballs = [0, 1, 2, 3, 4];
  fireballs.forEach((_, i) => {
    svg.append("circle")
      .attr("cx", 100)
      .attr("cy", 100)
      .attr("r", 10)
      .attr("fill", i % 2 === 0 ? "orange" : "red")
      .attr("opacity", 0.8)
      .transition()
      .delay(i * 200)
      .duration(1000)
      .ease(d3.easeElasticOut)
      .attr("r", 60)
      .style("opacity", 0)
      .on("end", function () {
        d3.select(this).remove();
      });
  });

  svg.append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 0)
    .attr("fill", "yellow")
    .attr("opacity", 0.8)
    .transition()
    .delay(1000)
    .duration(500)
    .attr("r", 80)
    .style("opacity", 0)
    .on("end", function () {
      svg.remove();
    });
}

// Evolve the Cat (append new cat image without clearing previous ones)
function evolveCat() {
  if (catStageIndex >= catStages.length) return;

  // Create a new cat image
  const catContainer = document.getElementById("catEvolution");

  // Make sure to create a new image for each evolution stage
  const catImage = document.createElement("img");
  const scaledHeight = catStages[catStageIndex].height * 0.5; // Scale the height for the image
  catImage.src = `pics/meow/${catStages[catStageIndex].file}.png`;
  catImage.style.height = `${scaledHeight}px`;
  catImage.style.width = "auto";
  catImage.style.marginRight = "5px";

  // Append the image to the container
  catContainer.appendChild(catImage);
  catContainer.style.display = "block"; // Make sure the container is visible

  // Play the meow sound
  playMeow();

  // Increment the cat stage index for the next evolution
  catStageIndex++;
}

// // Function to play meow sound with pitch shifting
// function playMeow() {
//   const catSound = document.getElementById("catSound");

//   if (catSound) {
//     // Create an audio context for manipulating sound
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     // Create a source node from the audio element
//     const source = audioContext.createMediaElementSource(catSound);
//     // Create a gain node for the volume control
//     const gainNode = audioContext.createGain();
//     // Create a pitch shift node (we control pitch by changing playback rate)
//     const pitchShifter = audioContext.createBufferSource();
//     const pitchShift = Math.random() * 0.5 + 0.75; // Random pitch between 0.75x and 1.25x
//     // Apply pitch shift by adjusting the playback rate
//     pitchShifter.playbackRate.value = pitchShift;
//     // Connect the source to the gain node, then to the audio context destination
//     source.connect(gainNode);
//     gainNode.connect(audioContext.destination);
//     // Play the sound
//     catSound.currentTime = 0;
//     catSound.play();
//     // Wait until sound starts, then apply the pitch shift effect
//     pitchShifter.start();
//   }
// }

function playMeow() {
  const catSound = document.getElementById("catSound");
  if (catSound) {
    // Calculate the number of times to play the sound (current stage + 1)
    const playCount = catStageIndex + 1;

    // Function to play the sound once
    const playOnce = () => {
      catSound.currentTime = 0; // Reset the sound to the beginning
      catSound.play()
        .then(() => {
          console.log("Cat sound played successfully.");
        })
        .catch(error => {
          console.error("Error playing cat sound:", error);
        });
    };

    // Play the sound multiple times with a delay between each play
    for (let i = 0; i < playCount; i++) {
      setTimeout(() => {
        playOnce();
      }, i * 1000); // Delay each play by 1 second (1000ms)
    }
  } else {
    console.error("Cat sound element not found.");
  }
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
