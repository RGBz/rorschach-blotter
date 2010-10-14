/**
 * Generates a Rorschach image in an HTML5 canvas
 * 
 * @author RGBz
 */

/**
 * Generates a random integer within a range
 *
 * @param min the smallest number the random number can be
 * @param max the largest number the random number can be
 * @returns a random integer between min and max
 */
function randomRange(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}

/**
 * Generates a random integer
 *
 * @param max the maximum integer that can be returned
 * @returns an integer between 0 and max
 */
function randomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Represents an RGB color
 *
 * @param red the red component of the color (0 to 255)
 * @param green the green component of the color (0 to 255)
 * @param blue the blue component of the color (0 to 255)
 */
function Color(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
}

/**
 * Set the red part of the color
 * 
 * @param red the red part of the color between 255 and 0
 */
Color.prototype.setRed = function(red) {
    this.red = (red > 0) ? ((red < 255) ? red : 255) : 0;
}

/**
 * Set the green part of the color
 * 
 * @param green the green part of the color between 255 and 0
 */
Color.prototype.setGreen = function(green) {
    this.green = (green > 0) ? ((green < 255) ? green : 255) : 0;
}

/**
 * Set the blue part of the color
 * 
 * @param blue the blue part of the color between 255 and 0
 */
Color.prototype.setBlue = function(blue) {
    this.blue = (blue > 0) ? ((blue < 255) ? blue : 255) : 0;
}

/**
 * Clones a color
 * 
 * @returns a clone of this color
 */
Color.prototype.clone = function() {
    return new Color(this.red, this.green, this.blue);
}

/**
 * Find the difference (distance between color coordinates)
 * 
 * @param color a color to compare against
 * 
 * @returns an integer representing the non-square-rooted
 * difference between two colors
 */
Color.prototype.diff = function(color) {
    var r = this.red - color.red;
    var g = this.green - color.green;
    var b = this.blue - color.blue;
    
    var nonSquareRootedDistance = (r * r) + (g * g) + (b * b);
        
    return nonSquareRootedDistance;
}

/**
 * Returns a string version of the color
 * 
 * @returns String version of the color
 */
Color.prototype.toString = function() {
    return "rgba(" + this.red + "," + this.green + "," + this.blue + ",0.6666)";
}

/**
 * Represents a brush
 *
 * @param width the width of the brush
 * @param height the height of the brush
 * @param color the color of the brush
 */
function Brush(width, height, color) {
    this.color = color;
    this.width = width;
    this.height = height;
}

/**
 * Represents an painter tool that can be used to create
 * Rorschach ink blot images using an HTML5 canvas element
 */
function RorschachPainter() {
    
    // Default the palette to contain only black
    this.palette = [new Color(0, 0, 0)];
    
    // Default the range of ink blobs to be drawn
    this.inkAmountMin = 1000;
    this.inkAmountMax = 5000;
    
    // Default the maximum blob dimensions
    this.blobWidthMax = 10;
    this.blobHeightMax = 10;
}

/**
 * Sets the palette to be used in the ink blot
 * 
 * @param palette an array of Color objects
 */
RorschachPainter.prototype.setPalette = function(palette) {
    this.palette = palette;
}

/**
 * Set the maximum dimensions for the paint blobs (rectangles)
 * 
 * @param width the maximum blob width
 * @param height the maximum blob height
 */
RorschachPainter.prototype.setMaximumBlobDimensions = function(width, height) {
    this.blobWidthMax = width;
    this.blobHeightMax = height;
}

/**
 * Sets the range of ink to use (number of blobs to draw)
 * 
 * @param min the minimum number of blobs to be drawn
 * @param max the maximum number of blobs to be drawn
 */
RorschachPainter.prototype.setInkAmountRange = function(min, max) {
    this.inkAmountMin = min;
    this.inkAmountMax = max;
}

/**
 * Paints the Rorschach image on the canvas
 * 
 * @param canvasId id for an HTML5 canvas element
 */
RorschachPainter.prototype.paint = function(canvasId) {
    
    // Get the canvas context
    var rorschachCanvas = document.getElementById(canvasId);
    var context = rorschachCanvas.getContext('2d');
    
    // Grab a color from the palette
    var baseColor = this.palette[randomInt(this.palette.length)];
    
    // Generate a random brush
    var brush = new Brush(
        randomRange(1, this.blobWidthMax), // Random blob width
        randomRange(1, this.blobHeightMax), // Random blob height
        baseColor.clone()); // Start with a base color from the palette
    
    // Pick a random point to draw first
    var x = randomInt(rorschachCanvas.width / 2);
    var y = randomInt(rorschachCanvas.height);

    // Maximum range of values a color can stray
    var COLOR_RANGE = Math.pow(8, 2); // Squared since the color distance algorithm does the same 

    // The number of blobs to make
    var inkAmount = randomRange(this.inkAmountMin, this.inkAmountMax);
    
    // Draw a bunch of random blobs
    for(i =0; i < inkAmount; i++) {

        // Draw that blob and mirror it!
        context.fillStyle = brush.color.toString();
        context.fillRect(x, y, brush.width, brush.height);
        context.fillRect(rorschachCanvas.width - x, y, brush.width, brush.height);
        
        // Now it's time to prepare the next random location for the blob!
        
        // Generate a color near to the last one
        brush.color.setRed(brush.color.red - 1 + (randomInt(100) % 3));
        brush.color.setGreen(brush.color.green - 1 + (randomInt(100) % 3));
        brush.color.setBlue(brush.color.blue - 1 + (randomInt(100) % 3));
        
        // Pick a random spot to draw the blob
        x = (x - 4) + (randomInt(100) % 9);
        y = (y - 4) + (randomInt(100) % 9);

        // Pick random blob dimensions
        brush.width = randomRange(1, this.blobWidthMax);
        brush.height = randomRange(1, this.blobHeightMax);
        
        // Make sure the colors are near enough to the base color from the palette
        if(brush.color.diff(baseColor) > COLOR_RANGE) {
            brush.color = this.palette[randomInt(this.palette.length)].clone();
        }

        // Make sure the blob is inside the width of half the canvas
        if(x < 0) {
            x = randomInt(rorschachCanvas.width / 2);

        } else if(x > rorschachCanvas.width / 2) {
            x = randomInt(rorschachCanvas.width / 2);
        }

        // Make sure the blob is inside the height of the canvas
        if(y < 0) {
            y = randomInt(rorschachCanvas.height);

        } else if(y > rorschachCanvas.height) {
            y = randomInt(rorschachCanvas.height);
        }
    }
}
