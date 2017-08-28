$(document).ready(function () {
    var colors = {
        1: "redButton",
        2: "blueButton",
        3: "greenButton",
        4: "yellowButton"
    }

    var aiArrary = [];

    var sounds = {
        "redButton": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
        "blueButton": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
        "greenButton": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
        "yellowButton": new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
    }


    $("#start").click(function () {

        //  if ($("#start").hasClass("unstarted")) {
        //  $("#start").toggleClass("unstarted started")

        function addIndex() {
            var colorIndex = Math.floor((Math.random() * 4) + 1);
            aiArrary.push(colorIndex);

            function playSounds(i) {
                setTimeout(function () {
                    console.log(aiArrary.length);
                    var chosenColor = colors[aiArrary[i]];
                    var originalColor = $("#"+chosenColor).css("background-color");
                    $("#"+chosenColor).css("background-color","black");
                    sounds[chosenColor].play();
                    
                }, i * 300);
            }


            for (i = 0; i < aiArrary.length; i++) {
                playSounds(i);
            }

        }

        addIndex();

        // }

    })

    $("#reset").click(function () {
        if ($("#start").hasClass("started")) {
            $("#start").toggleClass("unstarted started")
            aiArrary = [];
        }
    })



    $("#redButton").click(function () {
        var redSound = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
        redSound.play();
    })

})
