//potentially have audio elements attached to buttons in html and then have them called in a similar way to below
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
        "greenButton": new Audio("https://s3-eu-west-1.amazonaws.com/jjmax/audio/simon/shot.mp3"),
        "yellowButton": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
    }

    var aiArrary = []; //array to store the computer's sequence
    var humanArray = []; //array to store human players sequence (to compare to ai)
    var clicks = 0; //counter 
    // function for ai to generate a random number, add to it's sequence array and then step through the sequence, playing the audio file and highlighting the button
    function addIndex() {
        var colorIndex = Math.floor((Math.random() * 3) + 1); //generating random number to select color
        aiArrary.push(colorIndex); //pushing color to array
        //function to play sounds
        function playSounds(i) {
            setTimeout(function () {
                var AIchosenColor = colors[aiArrary[i]]; //getting the id of the each chosen colour in the array
                $("#" + AIchosenColor).css("filter", "brightness(100%)"); // increased brightness to highlight selected button
                setTimeout(function () {
                    $("#" + AIchosenColor).css("filter", "brightness(80%)"); //decreases brightness back to orignal levels after 650ms delay
                }, 650);
                sounds[AIchosenColor].play();//play the associated sound by accessing the file in the sound object
                if (i == aiArrary.length - 1) { //if the last element in the array has been reached
                    $("#game").toggleClass("ai human");//toggles game class if last sound in this loop has been played so human player can respond
                }
            }, i * 700); //timeout function to include delay between each audio file being played
        }
        //loop to invoke playSounds function for each element in the aiArray
        for (var i = 0; i < aiArrary.length; i++) {
            playSounds(i);
        }
        console.log("AI Array : " + aiArrary);
    };
    //starts the ai sequence by clicking the start buttons
    $("#start").click(function () {
        if ($("#start").hasClass("unstarted")) {//checks to see if the start button has unstarted class
            $("#start").toggleClass("unstarted started") //toggles the class of the button  to started to prevent the button being clicked more than once in a game
            addIndex(); //invokes addIndex function to play the first ai round
        }

    })
    //user controls to copy sequence
    $(".gameButton").click(function () {
        var clickedButton = this;
        if ($("#game").hasClass("human")) { //checks that it is human player's turn - to prevent clicking and playback during ai sequence

            $(clickedButton).css("filter", "brightness(100%)");// increased brightness to highlight selected button
            setTimeout(function () {
                $(clickedButton).css("filter", "brightness(80%)");//decreases brightness back to orignal levels after 650ms delay
            }, 650);
            var humanChosenColor = $(clickedButton).attr("id"); //retrieves the id of the clicked button
            sounds[humanChosenColor].play(); //plays the corresponding sound for the clicked button
            humanArray.push(colors.indexOf(humanChosenColor)); //pushes the array index from colors array of the clicked button

            if (humanArray[clicks] == aiArrary[clicks]) { //checks if the clicked button matches the ai button at the same point in thee sequence - based on current click count
                console.log("true");
                if (humanArray.length === aiArrary.length) { //determines whether the human player has completed the end of the ai sequence
                    setTimeout(function () {
                        $("#game").toggleClass("ai human");//toggles game class if last sound in this loop has been played
                        humanArray = []; //resets humanArray for next turn
                        clicks = 0; //resets clicks for next turn;
                        addIndex(); //initiats next ai turn
                    }, 1000);

                }
            } else { //if human player doesn't match ai sequence
                $("#game").toggleClass("ai human");
                console.log("You Lose!"); //??? replace with message log for losing the game (resets the current sequence or restarts the game depending on level)
            }
            console.log("Human Array : " + humanArray);
            clicks += 1; //increases click count - used to compare current element in each ai and human array

        }
    })
    //resets to initial conditions
    $("#reset").click(function () {
        if ($("#start").hasClass("started")) {
            $("#start").toggleClass("unstarted started")
            aiArrary = [];
            humanArray = []; //resets humanArray for next turn
            clicks = 0; //resets clicks for next turn;
            $("#game").attr("class", "ai");
        }
    })

})
