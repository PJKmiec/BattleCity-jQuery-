$(function() {

	//configuration
	var playerSpeed = 50; // less is faster
	var playerHealth = 3;
	var tankLhealth = 1;
	var tankLspeed = 25;
	var tankMhealth = 3;
	var tankMspeed = 40;
	var tankHhealth = 6;
	var wallHealth = 3;
	var enemySpawnTime = 5; // in seconds
	var maxTanksOnMap = 4; // includes player's tank


	// declare map where 0 = blank, 1 = wall, 2 = steel, 7 = eagle
	var originalMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1, 2, 1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[2, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 2],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0, 1, 7, 1, 0, 0, 0, 0, 0],
];
	var map = originalMap; // make working copy of the default map

	// create map grid
	for(i = 0; i < 13; i++) {
		for(j = 0; j < 13; j++) {

			switch(map[i][j]) {
    case 1:
        var gridClass = "wall";
        break;
    case 2:
        var gridClass = "steel";
        break;
		case 3:
		    var gridClass = "water";
		    break;
		case 7:
		    var gridClass = "eagle";
		    break;
    default:
        var gridClass = "";
			}

	  	$("#map").append('<div class="grid ' + gridClass + '" id="grid-' + i + '-' + j + '"></div>');
			var position = $("#grid-" + i + "-" + j).position();
			// $("#grid-" + i + "-" + j).html('<span>' + Math.floor((position.top)/32) + " " + Math.floor((position.left)/32) + '</span>');
		}
	}

	// generate enemies tray on status bar
	for(k = 0; k < 20; k++) {
		$("#enemies").append('<div class="enemy"></div>');
	}

	// add p1 tank
	$("#map").append('<div class="player tank" id="p1"></div>');

	// keep spawning enemy tanks
	var tankCounter = 1;
	function PopulateMap(){
		var spawnpositions = ["tl", "tc", "tr"];
		if (($(".tank").length) < maxTanksOnMap && tankCounter < 20) {
			SpawnEnemy("m" + tankCounter, spawnpositions[Math.floor(Math.random() * spawnpositions.length)]);
			tankCounter++;
			$("#enemies").children().last().remove();
		}
	}
	setInterval(PopulateMap, enemySpawnTime * 1000);

	// add and move enemy tank
	function SpawnEnemy(id, location) {
		var type = id.substring(0,1);
		$("#map").append('<div class="ai tank tank' + type + '-' + location + '" id="' + id + '"></div>');
		$("#" + id).css('background-image', $("#" + id).css('background-image').replace('.png', '.gif'));
		var mgoing;
		var mheading = "d";
		var mheadings = ["u", "r", "d", "l"];
		var cssgo;
		var bumpCounter = 0;

	function mKeepGoing() {
		var mposition = $("#" + id).position();
		if (bumpCounter < 0) {bumpCounter = 0;}
		// $("#m1").html("<span>" + mposition.top + " " + mposition.left + "</span>");

		if (bumpTest(mposition.top, mposition.left, id, "tank", "tank") == true && bumpCounter == 0) {
			switch(mheading) {
    case "d":
        mheading = "u";
        break;
		case "r":
		    mheading = "l";
        break;
		case "u":
		    mheading = "d";
		    break;
		case "l":
		    mheading = "r";
		    break;
			}
			$("#" + id).css('background-image', 'url("img/tank' + type + '-' + mheading + '.gif")');
			bumpCounter++;
		} else if (checkAhead(mposition.top, mposition.left, mheading) != 0) {
			var newheading = mheading;

			while (newheading == mheading || checkAhead(mposition.top, mposition.left, newheading) != 0) {
				newheading = mheadings[Math.floor(Math.random() * mheadings.length)];
			}

			mheading = newheading;
			$("#" + id).css('background-image', 'url("img/tank' + type + '-' + mheading + '.gif")');
			bumpCounter--;
		} else if (mposition.top % 32 == 0 && mposition.left % 32 == 0) {

			if (coinToss(4) == 4) {
				newheading = mheadings[Math.floor(Math.random() * mheadings.length)];

				if (checkAhead(mposition.top, mposition.left, newheading) == 0) {
					mheading = newheading;
					$("#" + id).css('background-image', 'url("img/tank' + type + '-' + mheading + '.gif")');
				}
			}
		}

		switch(mheading) {
	    case "d":
	        cssgo = {top: "+=2"};
	        break;
	    case "r":
					cssgo = {left: "+=2"};
	        break;
			case "u":
					cssgo = {top: "-=2"};
			    break;
			case "l":
					cssgo = {left: "-=2"};
			    break;
				}
				$("#" + id).css(cssgo);
			}
			mgoing = setInterval(mKeepGoing, tankMspeed);
		}

	// move p1 tank
	var change = {
	  37: {left: "-=4"},
	  38: {top: "-=4"},
	  39: {left: "+=4"},
	  40: {top: "+=4"},
	}

	var cHeading = {
	  37: "l",
	  38: "u",
	  39: "r",
	  40: "d",
	}

	$(document).one("keydown", keyDown);
	var going;

	function keyDown(e) {
	  $(document).one("keyup", keyup)

		if (e.which == 32) {
			fireGun();
		} else if (e.which >= 37 && e.which <= 40) {
	  	var animation = change[e.which];
	  	going = setInterval(keepGoing, playerSpeed);

		  function keepGoing() {
				$("#p1").css('background-image', 'url("img/tank-' + cHeading[e.which] + '.gif")');
				var position = $("#p1").position();
				// bumpTest(position.top, position.left, "p1", "player", "ai");
				$("#p1").html('<span>' + Math.floor(position.top/32) + " " + Math.floor(position.left/32) + '</span>');

				if (checkAhead(position.top, position.left, cHeading[e.which]) == 0 && checkEven(position.top, position.left, cHeading[e.which]) == true) {
						$("#p1").css(animation);
				}
		  }
		}
	}

	function keyup(e) {
		clearInterval(going);
		$('#p1').css('background-image', $('#p1').css('background-image').replace('.gif', '.png'));
		$(document).one("keydown", keyDown)
	}

	// check what we're running into
	function checkAhead(x, y, heading) {

		if (x < 1 && heading == "u" || x > 383 && heading == "d" || y < 1 && heading == "l" || y > 383 && heading == "r") {
			wayAhead = 2;
		} else {
		x = Math.floor((x)/32);
		y = Math.floor((y)/32);
		var wayAhead = 0;

		switch (heading){
    case "u":
				x = x;
        break;
    case "r":
				y = y + 1;
        break;
    case "d":
				x = x + 1;
        break;
    case "l":
				y = y;
      	break;
  	}

			wayAhead = map[x][y];
		}
		// $("#grid-" + x + "-" + y).css('background', 'red url("")');
		return wayAhead;
	}

	// check if we're level with grid
	function checkEven(x, y, heading) {
		gridx = Math.floor(x/32);
		gridy = Math.floor(y/32);
		var gridposition = $("#grid-" + gridx + "-" + gridy).position();

		if (heading == "l" || heading == "r") {
			heading = "h";
		} else if (heading == "u" || heading == "d") {
			heading = "v";
		}
		// shout(x + " " + y + " & " + gridposition.top + " " + gridposition.left)
		if (heading == "h" && gridposition.top == parseInt(x) || heading == "v" && gridposition.left == parseInt(y)) {return true;}
		else {return false;}
	}

	// collision detection
	function bumpTest (topX, topY, thisId, what, target) {
		var bumped = false;
		var dimension = 32;
		if (what == "bullet") {
			var dimension = 8;
		}
		var bottomX = topX + dimension;
		var bottomY = topY + dimension;

		$("." + target).each(function(i, obj) {
			if (this.id != thisId) {
				var thisPos = $(this).position();
				var thisX = thisPos.top;
				var thisY = thisPos.left;

				if (thisX >= topX && thisX <= bottomX && thisY >= topY && thisY <= bottomY) {
						bumped = true;
					}
				}
		});
		return bumped;
	}

	// fire in the hole!
	function fireGun() {
	   shout("Fire!");
	}

	// flip a coin within limit
	function coinToss(limit) {
		return Math.floor(Math.random() * limit) + 1;
	}

	// print to printout window
	function shout(msg) {
		$("#printout").append(msg + '<br />');
		var printout = document.getElementById("printout");
    printout.scrollTop = printout.scrollHeight;
	}
});
