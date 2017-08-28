unction playSound(i) {
                setTimeout(function(){
                    sounds[chosenColor].play();
                },i*1000)
            }


            for (i = 0; i < aiArrary.length; i++) {
                var chosenColor = colors[aiArrary[i]];
                playSound(i);
            }