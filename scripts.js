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
        "ready": new Audio("sounds/FFVII -Ready.mp3"),
        "redButton": new Audio("sounds/1.mp3"),
        "blueButton": new Audio("sounds/2.mp3"),
        "greenButton": new Audio("sounds/3.mp3"),
        "yellowButton": new Audio("sounds/5.mp3"),
        "errorSound": new Audio("sounds/FFVII_Error.mp3"), //error sound
        "unstrictWin": new Audio("sounds/FFVII-Success.mp3"),
        "strictWin": new Audio("sounds/FFVII-Mega-Success.mp3"),
        "gameOver": new Audio("sounds/Game_Over.mp3"),
        "strictButton": new Audio("sounds/FFVIII - CursorMove.mp3")
    }
    var aiArray = []; //array to store the computer's sequence
    var humanArray = []; //array to store human players sequence (to compare to ai)
    var round = 0; // counter for game round display
    var slow = 1000;
    var medium = 850;
    var fast = 700;
    var speed = slow;
    var timingSounds;
    var q = 0;
    var winValue = Number($("#winValue").html()); //value for number of rounds to win the game

    if (document.body.clientWidth < 550) { // adjusting game size for smaller screens

        $("#game").css({ "width": "400px", "height": "400px" })
        $("#rules, li").css({ "font-size": "0.9em" });
        $("#rulesFooter").css("font-size", "0.8em");

        $("#closeRulse").css({ "font-size": "0.8em", "margin-top": "0" });
        $("#settingsInfo").css("font-size", "0.8em");
        $("#closeSettings").css("margin-top", "0");

    }

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
                speed = fast;
                break;
            case 9:
                speed = medium;
                break;
            case 14:
                speed = fast;
                break;
        }
        playSounds();//start playing current ai sequence
    };

    //function to play sounds
    function playSounds() {
        if ($("#start").hasClass("unstarted")) {//if game has been reset, stops ai sequence and resets game
            clearTimeout(timingSounds);//??? needed?
            reset();
            return;
        } else if (q == aiArray.length && aiArray.length > 0) { //if sequence has reached last element in array - clearTimeout and stops function
            clearTimeout(timingSounds);//??? needed?
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
            $("#start").css("filter", "brightness(100%");
            $("#settings").css({ "z-index": "-1", "opacity": "0" });//hide the panel showings settings and rules
            $("#openRules").css({ "z-index": "-1", "opacity": "0" });//hide the panel showings settings and rules
            $("#start").toggleClass("unstarted started") //alternates the class of the button  to started to prevent the button being clicked more than once in a game
            round++;
            $("#counter").html(("0" + round).slice(-2));//counter will always display as two digits
            $("#counter").css("color", "lime");//counter will always display as two digits
            addIndex(); //initiates add Index function to play the first ai round
        }
    })
    //user controls to copy sequence
    $(".gameButton").mousedown(function () {
        var clickedButton = this;
        if ($("#game").hasClass("human")) { //checks that it is human player's turn - to prevent clicking and playback during ai sequence
            $(clickedButton).css("filter", "brightness(100%)");// increased brightness to highlight selected button
            setTimeout(function () {
                $(clickedButton).css("filter", "brightness(80%)");//decreases brightness back to orignal levels after 1000ms delay
            }, (speed / 1.6));
            var humanChosenColor = $(clickedButton).attr("id"); //retrieves the id of the clicked button
            humanArray.push(colors.indexOf(humanChosenColor)); //pushes the array index from colors array of the clicked button
            if (humanArray[clicks] == aiArray[clicks]) { //checks if the clicked button matches the ai button at the same point in thee sequence - based on current click count
                //sounds[humanChosenColor].loop = true; //used to loop sounds until mouseclick ends - doesn't work with sounds that aren't continuous tones with no fades
                sounds[humanChosenColor].play(); //plays the corresponding sound for the clicked button
                if (humanArray.length < aiArray.length && aiArray[clicks] == aiArray[clicks + 1]) {
                    $("#game").removeClass("human")
                    setTimeout(function () {
                        $("#game").addClass("human");
                    }, 650);
                }
                // if decided to implement a looping audio track, then the below shouldn't start until mouseup - see *** for end of block. will also need to add stop audio line.
                if (humanArray.length === aiArray.length) {
                    //determines whether the human player has completed the end of the ai sequence
                    if (humanArray.length == winValue) {//if length = 20 then player has won
                        if ($("#game").hasClass("unstrict")) { //plays unstrict mode music
                            sounds["unstrictWin"].play();
                            $("#win").css({ "z-index": "4", "opacity": "0.9" });
                            setTimeout(function () {
                                $("#win").css({ "z-index": "-1", "opacity": "0" });
                            }, 4000);
                            reset();
                            return;
                        } else if ($("#game").hasClass("strict")) { //plays win sound for strict mode
                            sounds["strictWin"].play();
                            $("#win").css({ "z-index": "4", "opacity": "0.9" });
                            setTimeout(function () {
                                $("#win").css({ "z-index": "-1", "opacity": "0" });
                            }, 4000);
                            reset();
                            return;
                        }
                    }
                    $("#game").toggleClass("ai human");//alternates game class if last sound in this loop has been played
                    setTimeout(function () {
                        if ($("#start").hasClass("started")) {//checks the game is in progress and hasn't been reset before increasing counter
                            round++; // counter for game round display
                            $("#counter").html(("0" + round).slice(-2));
                        };
                    }, speed / 2.5);
                    setTimeout(function () {
                        humanArray = []; //resets humanArray for next turn
                        clicks = 0; //resets clicks for next turn;
                        addIndex(); //initiates next ai turn
                    }, (speed * 1.7));
                }
                //***

            } else { //if human player doesn't match ai sequence
                $("#counter").html("!!").css("color", "red");
                if ($("#game").hasClass("unstrict")) {
                    sounds["errorSound"].play(); //plays the corresponding sound for the clicked button
                    $("#game").toggleClass("ai human");
                    setTimeout(function () {
                        $("#counter").html(("0" + round).slice(-2));
                        $("#counter").css("color", "lime");//counter will always display as two digits
                        //repeat previous sound sequence
                        playSounds();
                        humanArray = []; //resets humanArray for next turn
                        clicks = 0; //resets clicks for next turn;
                    }, 2800);
                } else if ($("#game").hasClass("strict")) {
                    sounds["gameOver"].play(); //plays the corresponding sound for the clicked button
                    $("#lose").css({ "z-index": "4", "opacity": "0.9" });
                    setTimeout(function () {
                        $("#lose").css({ "z-index": "-1", "opacity": "0" });
                    }, 4000);
                    setTimeout(function () {
                        reset();
                    }, 2800);
                }
            }
            clicks += 1; //increases click count - used to compare current element in each ai and human array

        }
    });

    //opens the rules panel
    $("#openRules").click(function () {
        if (!($("#settingsPanel").hasClass("open"))) {
            $("#rules").addClass("open");
            $("#rules").css({ "z-index": "4", "opacity": "0.9" });
        }

    });
    //closes the rules panel
    $("#closeRules").click(function () {
        $("#rules").removeClass("open");
        $("#rules").css("z-index", "-1");
    });
    //opens the settings panel
    $("#settings").click(function () {
        if (!($("#rules").hasClass("open"))) {
            $("#settingsPanel").addClass("open");
            $("#settingsPanel").css({ "z-index": "4", "opacity": "0.9" });
        }

    })

    //closes the settings panel
    $("#closeSettings").click(function () {

        $("#settingsPanel").removeClass("open");
        $("#settingsPanel").css("z-index", "-1");
    });
    //increases number of rounds required to win game
    $("#plus").click(function () {
        if (Number($("#winValue").html()) < 40) {
            var increase = 5;
            var roundValue = Number($("#winValue").html());
            $("#winValue").html(roundValue + increase);
            winValue = Number($("#winValue").html());
            $("#roundTotal").html(winValue);
        }
    })
    //decreases number of rounds required to win game
    $("#minus").click(function () {
        if (Number($("#winValue").html()) > 10) {
            var increase = 5;
            var roundValue = Number($("#winValue").html());
            $("#winValue").html(roundValue - increase);
            winValue = Number($("#winValue").html());

            $("#roundTotal").html(winValue);
        }
    })


    //toggles strict mode - game resets on mistake
    $("#strictButton").click(function () {
        if ($("#start").hasClass("unstarted")) {
            sounds["strictButton"].play();
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
            $("#counter").css("color", "#def");//counter will always display as two digits
            $("#settings").css({ "z-index": "1", "opacity": "1" });//show the button showings settings and rules
            $("#openRules").css({ "z-index": "1", "opacity": "1" });//show the button showings settings and rules

            $("#start").css("filter", "brightness(80%");
        }
    }

    $("#reset").click(function () {
        if ($("#start").hasClass("started")) {
            sounds["ready"].play();
            reset()
        }
    });
})
