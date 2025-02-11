// Experiment Configuration
const concepts = [
    "tree", "justice", "death", "angry", "sad", "safety", "peace", "sick", 
    "happy", "banana", "mango", "sandstorm", "peach", "lightning"
];

// BCP-37 Color Set (with saturation/lightness levels)
const colors = [
    "#FF0000", "#FF8000", "#FFFF00", "#A6FF00", "#00FF00", "#00FFFF", "#0080FF", "#8000FF", "#FF00FF", // Saturated
    "#FF9999", "#FFC299", "#FFFF99", "#DFFF99", "#99FF99", "#99FFFF", "#99C2FF", "#C299FF", "#FF99FF", // Light
    "#CC6666", "#CC9966", "#CCCC66", "#B8CC66", "#66CC66", "#66CCCC", "#6699CC", "#9966CC", "#CC66CC", // Muted
    "#800000", "#804000", "#808000", "#608000", "#008000", "#008080", "#004080", "#400080", "#800080", // Dark
    "#000000", "#333333", "#666666", "#999999", "#FFFFFF" // Achromatic colors (Black, Gray, White)
];

let trialData = [];
let shuffledTrials = [];

// Shuffle an array using Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateTrials() {
    shuffledTrials = shuffleArray(concepts.flatMap(concept => 
        shuffleArray(colors).map(color => ({ concept, color }))
    ));
}

let currentTrialIndex = 0;

// Initialize Experiment
function startExperiment() {
    document.getElementById("instructions").style.display = "none";
    document.getElementById("experiment").style.display = "block"; // Show experiment
    generateTrials();
    nextTrial();
}

function nextTrial() {
    if (currentTrialIndex >= shuffledTrials.length) {
        endExperiment();
        return;
    }
    
    const { concept, color } = shuffledTrials[currentTrialIndex];
    document.getElementById("concept").textContent = concept.toUpperCase();
    document.getElementById("colorBox").style.backgroundColor = color;
    document.getElementById("ratingSlider").value = 50;
}

function submitRating() {
    const rating = document.getElementById("ratingSlider").value;
    const { concept, color } = shuffledTrials[currentTrialIndex];
    trialData.push({ concept, color, rating });
    
    currentTrialIndex++;
    nextTrial();
}

function endExperiment() {
    console.log("End Experiment button clicked"); // Debugging
    document.getElementById("experiment").style.display = "none";
    document.getElementById("results").style.display = "block";
    generateCSV();
}

function generateCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Concept,Color,Rating\n";
    trialData.forEach(row => {
        csvContent += `${row.concept},${row.color},${row.rating}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "experiment_results.csv");
    link.textContent = "Download Results";
    document.getElementById("downloadLink").appendChild(link);
}

// Attach Event Listeners
document.getElementById("startButton").addEventListener("click", startExperiment);
document.getElementById("nextButton").addEventListener("click", submitRating);
document.getElementById("endButton").addEventListener("click", endExperiment);