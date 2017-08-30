$(document).ready(function () {
    "use strict";
    //array of coloured button ids
    var colors = [
        "redButton",
        "blueButton",
        "greenButton",
        "yellowButton"]
    //object of links to sounds for each coloured buttons
    var sounds = {
        "redButton": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
        "blueButton": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
        "greenButton": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
        "yellowButton": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
        "errorSound": new Audio("https://s3-eu-west-1.amazonaws.com/jjmax/audio/simon/shot.mp3") //error sound
    }
    var aiArray = []; //array to store the computer's sequence
    var humanArray = []; //array to store human players sequence (to compare to ai)
    var round = 0; // counter for game round display
    var slow = 1000;
    var medium = 750;
    var fast = 500;
    var speed = slow;
    var timingSounds;
    var q = 0;
    $("#counter").html("0" + round);
    var clicks = 0; //counter 
    // function for ai to generate a random number, add to it's sequence array and then step through the sequence, playing the audio file and highlighting the button
    function addIndex() {
        var colorIndex = Math.floor((Math.random() * 4) + 0); //generating random number to select color
        if ($("#start").hasClass("started")) { //checks if game is in progress or has been reset - addIndex may be called after reset due to timeout, so this prevents pushing to aiArray after reset
            aiArray.push(colorIndex); //pushing color to array
        }
        switch (round) {
            case 1:
                speed = slow;
                break;
            case 9:
                speed = medium;
                break;
            case 14:
                speed = fast;
                break;
        }
        playSounds();//start playing current ai sequence
        // console.log("AI Array : " + aiArray);
    };

    //function to play sounds
    function playSounds() {
        if ($("#start").hasClass("unstarted")) {//if game has been reset, stops ai sequence and resets game
            clearTimeout(timingSounds);
            reset();
            return;
        } else if (q == aiArray.length && aiArray.length > 0) { //if sequence has reached last element in array - clearTimeout and stops function
            clearTimeout(timingSounds);
            q = 0;
            $("#game").toggleClass("ai human");//alternates game class if last sound in this loop has been played so human player can respond
            return;
        } else if ($("#start").hasClass("started")) {
            var AIchosenColor = colors[aiArray[q]]; //getting the id of the each chosen colour in the array
            $("#" + AIchosenColor).css("filter", "brightness(100%)"); // increased brightness to highlight selected button
            setTimeout(function () {
                $("#" + AIchosenColor).css("filter", "brightness(70%)"); //decreases brightness back to orignal levels after 1000ms delay
            }, (speed / 1.6));
            sounds[AIchosenColor].play();//play the associated sound by accessing the file in the sound object
            q++;
            timingSounds = setTimeout(function () { playSounds(); }, (speed + 50))
        }
    }
    //starts the ai sequence by clicking the start buttons
    $("#start").click(function () {
        if ($("#start").hasClass("unstarted")) {//checks to see if the start button has unstarted class
            $("#start").toggleClass("unstarted started") //alternates the class of the button  to started to prevent the button being clicked more than once in a game
            round++;
            $("#counter").html(("0" + round).slice(-2));//counter will always display as two digits
            addIndex(); //initiates add Index function to play the first ai round
        }
    })
    //user controls to copy sequence
    $(".gameButton").click(function () {
        var clickedButton = this;
        if ($("#game").hasClass("human")) { //checks that it is human player's turn - to prevent clicking and playback during ai sequence
            $(clickedButton).css("filter", "brightness(100%)");// increased brightness to highlight selected button
            setTimeout(function () {
                $(clickedButton).css("filter", "brightness(80%)");//decreases brightness back to orignal levels after 1000ms delay
            }, (speed / 1.6));
            var humanChosenColor = $(clickedButton).attr("id"); //retrieves the id of the clicked button
            humanArray.push(colors.indexOf(humanChosenColor)); //pushes the array index from colors array of the clicked button
            if (humanArray[clicks] == aiArray[clicks]) { //checks if the clicked button matches the ai button at the same point in thee sequence - based on current click count
                sounds[humanChosenColor].play(); //plays the corresponding sound for the clicked button
                if (humanArray.length === aiArray.length) { //determines whether the human player has completed the end of the ai sequence
                    $("#game").toggleClass("ai human");//alternates game class if last sound in this loop has been played
                    setTimeout(function () {
                        round++; // counter for game round display
                        $("#counter").html(("0" + round).slice(-2));
                    }, speed);
                    setTimeout(function () {
                        humanArray = []; //resets humanArray for next turn
                        clicks = 0; //resets clicks for next turn;
                        addIndex(); //initiates next ai turn
                    }, (speed * 1.7));
                }
            } else { //if human player doesn't match ai sequence
                $("#counter").html("!!");
                sounds["errorSound"].play(); //plays the corresponding sound for the clicked button
                if ($("#game").hasClass("unstrict")) {
                    $("#game").toggleClass("ai human");
                    setTimeout(function () {
                        $("#counter").html(("0" + round).slice(-2));
                        //repeat previous sound sequence
                        playSounds();
                        humanArray = []; //resets humanArray for next turn
                        clicks = 0; //resets clicks for next turn;
                    }, 2800);
                } else if ($("#game").hasClass("strict")) {
                    setTimeout(function () {
                        reset();
                    }, 2800);
                }
                //console.log("You Lose!"); //??? replace with message log for losing the game (resets the current sequence or restarts the game depending on level)
            }
            // console.log("Human Array : " + humanArray);
            clicks += 1; //increases click count - used to compare current element in each ai and human array

        }
    })

    //toggles strict mode - game resets on mistake
    $("#strictButton").click(function () {
        if ($("#start").hasClass("unstarted")) {
            if ($("#strictButton").hasClass("strictOff")) {
                $("#strictLight").css("filter", "brightness(100%)");
                $("#strictButton").toggleClass("strictOff strictOn");
                $("#game").toggleClass("unstrict strict");
            } else if ($("#strictButton").hasClass("strictOn")) {
                $("#strictLight").css("filter", "brightness(50%)");
                $("#strictButton").toggleClass("strictOff strictOn");
                $("#game").toggleClass("unstrict strict");
            }
        }

        //if ($("#start").hasClass("unstarted")) {} //possible have warning that says you can't change mode in the middle of a game - either bring it up over console (shouldn't disrupt game - have some transparency)

    })
    //resets to initial conditions
    function reset() {
        if ($("#start").hasClass("started")) {

            $("#start").toggleClass("unstarted started")
            aiArray = [];
            humanArray = []; //resets humanArray for next turn
            clicks = 0; //resets clicks for next turn;
            $("#game").addClass("ai").removeClass("human");
            round = 0; // counter for game round display
            $("#counter").html(("0" + round).slice(-2));
            speed = slow;
            q = 0;
        }
    }
    $("#reset").click(reset);
})
