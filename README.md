# Assignment 3 - Team DogDaysAreOver

[Our Website](https://a3-experiment-study.onrender.com/)

## Our Experiment

When you think of the word "sad," what color comes to mind? Some might picture blue, while others envision gray. This connection between words and color has been widely studied, and we found it particularly intriguing in the context of data visualization.

We decided to recreate the experiment of Karen Schloss in [this paper](https://jov.arvojournals.org/article.aspx?articleid=2791880). We explored the relationship between colors and words, giving the user a series of word-color pairs and asking them to use a slider to indicate the correlation between the two.

The experiment featured 37 colors and 13 concepts, ranging from tangible objects like "banana" to abstract emotions such as "angry" for a total of 518 word-color combinations.

## Data Collection

We created a website using vanilla html, css, and javascript. We used a Node.js server and express to easily do routing. Upon the page loading, the user is given instructions and prompted to select a 'reward pathway', either cats or pokemon. To encourage users to spend more time on our application, we rewarded them with cats or pokemon as they did trials.

The user was then presented with a word and a colored square. The user uses a slider to indicate how correlated the word and color are, and then presses a 'next' button. When the user gets bored, they press 'end experiment' and the data is submitted to our mongoDB database.

## Results

To display the data, we created four visualizations, now also visible on [our Website](https://a3-experiment-study.onrender.com/) from the button labeled "See results".

1. **Heatmap** The first visualization is a heatmap. Each row represents (and is labeled with) a word, and each column represents (and is labeled with) a color. The color is also the color of the boxes, so each column has the color it represents. In each box of the heatmap is a number that represents the average score for that combination of word and color. The opacity is tied to this value, allowing a user to easily see the most represented colors in a row or column.

2. **Standard Deviation Scatterplot** Showing error on the other visualizations would have been difficult while still being legible, so we elected to create this visualization. It is a scatterplot with axis of average rating (X) and standard deviation(Y). There are also filters for both color and concept, allowing a user to see specific parts of the data. Finally, the size of the dots is scaled to the number of trials it represents, so smaller dots have fewer trials.

3. **Karen Schloss** This plot was inspired from the work of Karen Schloss. These are bar charts, one for each concept, where the height of the bar is the average rating, and the color of the bar is the color the bar represents. These charts give a very good picture at a glance of what colors people thing a topic represents.

4. **Color Wheel** This is a way to see the concepts represented by a color. While the Karen Schloss visualization showed colors by concept, clicking on a color in the key highlights that color and shows the concept most associated with it.

## Achievements

### Design Achievements

1. **Implemented a reward pathway in experiment:** For a design achievment, we created the reward pathways described above in the data collection section. These rewards were images of cats or pokemon and were not only fun, they also encouraged users to spend more time on our study.

2. **Most resulting visualizations are interactive:** The color wheel and [@Gabe's mean rating vs std var plot] are both interactive.

3. **All the resulting visualizations are organized by saturation level**

4. **Most of the resulting visualizations have mapped the hex codes to the color names:** Both the color wheel and heatmap present the color names instead of the hex codes, on the plots, for an easy read.

### Technical Achievements

1. **Hosting of experiment was not on reVISit:** For our technical achievement, we did not use reVISit. Instead, we created a website and a server using Node.js and express and connected that to a mongoDB database. The website was hosted (and the server ran) on [Render.com](render.com). Because the data was small and the webserver was simple, we were able to use the free tier of both services.

### Sources

- Schloss, K. B., Thompson, C. M., Xue, J., & Peterson, M. A. (2023). Color-Object Semantics Affects Object Detection. Journal of Vision (Charlottesville, Va.), 23(9), 5528-. https://doi.org/10.1167/jov.23.9.5528
- Mukherjee, K., Yin, B., Sherman, B. E., Lessard, L., & Schloss, K. B. (2021). Context Matters: A Theory of Semantic Discriminability for Perceptual Encoding Systems. https://doi.org/10.48550/arxiv.2108.03685
- ChatGPT
- DeepSeek
