// Experiment Configuration
const margin = { top: 80, right: 50, bottom: 120, left: 100 },
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight - margin.top - margin.bottom;

// Mapping of hex codes to color names
const colorNames = {
  "#DC143C": "Crimson", "#FF4500": "Orange Red", "#FFD700": "Gold", "#ADFF2F": "Green Yellow", "#228B22": "Forest Green",
  "#00CED1": "Dark Turquoise", "#0000CD": "Medium Blue", "#800080": "Purple", "#FF9999": "Light Pink", "#FFC299": "Peach",
  "#FFFF99": "Pale Yellow", "#DFFF99": "Light Green Yellow", "#99FF99": "Mint Green", "#99FFFF": "Light Cyan", "#99C2FF": "Light Blue",
  "#C299FF": "Lavender Blue", "#CC6666": "Dusky Red", "#CC9966": "Tan", "#CCCC66": "Khaki", "#99CC66": "Light Olive Green",
  "#66CC66": "Pastel Green", "#66CCCC": "Aqua Green", "#6699CC": "Steel Blue", "#9966CC": "Amethyst", "#800000": "Maroon",
  "#804000": "Brown", "#808000": "Olive", "#608000": "Dark Olive", "#004D00": "Dark Green", "#008080": "Teal",
  "#004080": "Navy Blue", "#400080": "Deep Violet", "#000000": "Black", "#333333": "Dark Gray", "#666666": "Gray",
  "#999999": "Light Gray", "#FFFFFF": "White"
};

// Function to calculate the brightness of a color
function getBrightness(color) {
  const rgb = d3.color(color).rgb();
  const R = rgb.r / 255;
  const G = rgb.g / 255;
  const B = rgb.b / 255;

// Calculate brightness using the luminance formula
  const brightness = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return brightness;
}

// Group colors by saturation
const colorGroups = Object.keys(colorNames).reduce((acc, color) => {
    const brightness = getBrightness(color);
    const group = brightness > 0.5 ? 'Light' : 'Dark';  // Light if brightness > 0.5
    if (!acc[group]) acc[group] = [];
    acc[group].push(color);
    return acc;
  }, {});
  
  console.log(colorGroups); // For debugging, check the groups

// Create SVG container
const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Add title
svg.append("text")
  .attr("x", width / 2)
  .attr("y", -30)
  .attr("text-anchor", "middle")
  .style("font-size", "24px")
  .style("font-weight", "bold")
  .text("Concept-Color Heatmap based on Average Ratings");

// Load CSV data
d3.csv("dataCleaned.csv").then(data => {
    // Convert rating to number
    data.forEach(d => {
        d.rating = +d.rating;
    });

    // Extract unique concepts and colors
    const concepts = Array.from(new Set(data.map(d => d.concept)));
    const colors = Array.from(new Set(data.map(d => d.color)));

    // Generate all possible concept-color combinations
    const allCombinations = concepts.flatMap(concept =>
        colors.map(color => ({
            concept,
            color,
            avgRating: 0 // Default to 0
        }))
    );

    // Calculate average rating for each concept-color combination
    const avgData = d3.rollup(data, 
        v => d3.mean(v, d => d.rating), // Calculate average rating
        d => d.concept, // Group by concept
        d => d.color // Group by color
    );

    // Merge all combinations with actual data
    const heatmapData = allCombinations.map(d => {
        const avgRating = avgData.get(d.concept)?.get(d.color) || 0;
        return { ...d, avgRating };
    });

    // Create scales
    const yScale = d3.scaleBand()
        .domain(concepts)
        .range([0, height])
        .padding(0.1);

    // Create xScale based on sorted color groups by saturation
    const groupedColors = Object.keys(colorGroups).reduce((acc, group) => {
      acc.push(...colorGroups[group]);
      return acc;
    }, []);

    const xScale = d3.scaleBand()
        .domain(groupedColors)
        .range([0, width])
        .padding(0.1);

    // Draw heatmap rectangles
    svg.selectAll(".heatmap-rect")
        .data(heatmapData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.color))
        .attr("y", d => yScale(d.concept))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => d.color) // Assigning column color directly
        .attr("opacity", d => d.avgRating / 10) // Adjusting opacity based on rating
        .attr("stroke", "black");

    // Add text labels for ratings
    svg.selectAll(".heatmap-text")
        .data(heatmapData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.color) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.concept) + yScale.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.avgRating.toFixed(1))
        .attr("fill", d => {
            // Set font color based on brightness
            const brightness = getBrightness(d.color);
            return brightness > 0.5 ? "black" : "white"; // Light colors get black font, dark colors get white font
        })
        .style("font-size", "12px")  // Make the font size smaller
        .attr("text-anchor", "middle");

    // Add X-Axis (color names on X-Axis)
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(
            d3.axisBottom(xScale)
            .tickFormat(d => {
                return colorNames[d.trim()] || d;
            })
        )
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-45)")
        .style("font-family", "Poppins, sans-serif")  // Set font style for X-axis;

    // Add Y-Axis (concepts on Y-Axis)
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-family", "Poppins, sans-serif")  // Set font style for Y-axis;
});
