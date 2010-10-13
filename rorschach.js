
function rand_range(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}

function abs_rand_int(max) {
      return Math.floor(Math.random() * max);
}

function y_mirror(context, x, y, width, max_width, height, red, green, blue) {
	context.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
	context.fillRect(x, y, width, height);
	context.fillRect(max_width - x, y, width, height);
}

function rorschach(rorschach_canvas_id, palette) {

    var rorschach_canvas = document.getElementById(rorschach_canvas_id);
    var context = rorschach_canvas.getContext('2d');
    
    x = abs_rand_int(rorschach_canvas.width);
    y = abs_rand_int(rorschach_canvas.height);

    brush = palette[abs_rand_int(palette.length)];
    
    red = brush[0];
    green = brush[1];
    blue = brush[2];

    width = abs_rand_int(8);
    height = abs_rand_int(4);
    
    COLOR_RANGE = 25;

    dot_count = rand_range(1600, 3200);
    
    for(i =0; i < dot_count; i++) {

	    red = (red - 1) + (abs_rand_int(100) % 3);
	    green = (green - 1) + (abs_rand_int(100) % 3)
	    blue = (blue - 1) + (abs_rand_int(100) % 3)

	    x = (x - 5) + (abs_rand_int(100) % 11);
	    y = (y - 5) + (abs_rand_int(100) % 11);

	    width = abs_rand_int(5);
	    height = abs_rand_int(5);
	
	    if(Math.abs(brush[0] - red) > COLOR_RANGE || Math.abs(brush[1] - green) > COLOR_RANGE || Math.abs(brush[2] - blue) > COLOR_RANGE) {
		    brush = palette[abs_rand_int(palette.length)];
		    red = brush[0];
            green = brush[1];
            blue = brush[2];
		}
	
	    if(x < 0) {
		    x = abs_rand_int(rorschach_canvas.width / 2);
		    
	    } else if(x > rorschach_canvas.width / 2) {
		    x = abs_rand_int(rorschach_canvas.width / 2);
		}
		
		if(y < 0) {
		    y = abs_rand_int(rorschach_canvas.height);
	    } else if(y > rorschach_canvas.height) {
		    y = abs_rand_int(rorschach_canvas.height);
		}

	    y_mirror(context, x, y, width, rorschach_canvas.width, height, red, green, blue);
    }
}
