let LoadState = {
    preload: preloadLoadScreen,
    create: createLoadScreen
};

function preloadLoadScreen() {
    game.load.image('Frame1',   'assets/imgs/Loadscreen/Frame1.jpg');
    game.load.image('Frame2',   'assets/imgs/Loadscreen/Frame2.png');
    game.load.image('Frame3',   'assets/imgs/Loadscreen/Frame3.jpg');
    game.load.image('Frame4',   'assets/imgs/Loadscreen/Frame4.jpg');
    game.load.image('skip',     'assets/imgs/skipButton.png');
}

function createLoadScreen() {
    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'Frame1');

    //adds skip on click
    skipScene();

    let frame1text = game.add.text(200, 100, 'My child, it is time to \ncontinue your journey...', { font: "25px Kalam", fill: "#000000" });
    frame1text.anchor.setTo(0.5, 0.5);

    // Set the initial alpha to 0 (completely transparent)
    frame1text.alpha = 0;

    // Create a fade-in tween for the first text
    game.add.tween(frame1text).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)
        .onComplete.add(function () {

            // Create a fade-out tween after the fade-in is complete
            game.add.tween(frame1text).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 2000)
                .onComplete.add(function () {

                    // Add Frame2 and set its initial position above the visible area
                    let frame2 = game.add.sprite(0, -1200, 'Frame2');
                    let frame2text = game.add.text(400, 360, 'The time has come', { font: "25px Kalam", fill: "#000000" });
                    frame2text.anchor.setTo(0.5, 0.5);
                    frame2text.alpha = 0;  // Set the initial alpha to 0

                    // Create a tween to move Frame2 from top to bottom
                    game.add.tween(frame2).to({ y: 0 }, 2000, Phaser.Easing.Linear.None, true)
                        .onComplete.add(function () {

                            // Fade in the text after Frame2 has moved into position
                            game.add.tween(frame2text).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)
                            .onComplete.add(function (){

                                // Fade frame2 text, waiting half second
                                game.add.tween(frame2text).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 500)
                                .onComplete.add(function () {

                                    // Add the new text
                                    let extraText = game.add.text(410, 360, 'for me to assist you...', { font: "25px Kalam", fill: "#000000" });
                                    extraText.anchor.setTo(0.5, 0.5);
                                    extraText.alpha = 0; // Set the initial alpha to 0

                                    // Fade in the new text
                                    game.add.tween(extraText).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)
                                    .onComplete.add(function () {
                                        // Fade out the new text after a short delay
                                        game.add.tween(extraText).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 500)
                                        .onComplete.add(function () {

                                            // Show Frame3 after extraText fades out
                                            let frame3 = game.add.sprite(0, 0, 'Frame3');
                                            frame3.alpha = 0; // Set initial alpha to 0

                                            // Fade in Frame3
                                            game.add.tween(frame3).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)
                                                .onComplete.add(function () {
                                                    // Wait for 1 second
                                                    game.time.events.add(Phaser.Timer.SECOND * 1, function() {
                                                        // Show Frame4 after Frame3
                                                        let frame4 = game.add.sprite(0, 0, 'Frame4');
                                                        frame4.alpha = 0; // Set initial alpha to 0

                                                        // Fade in Frame4
                                                        game.add.tween(frame4).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)
                                                            .onComplete.add(function () {
                                                                // Wait for 1 second
                                                                game.time.events.add(Phaser.Timer.SECOND * 1, function() {
                                                                    // Add 'destroy' text
                                                                    let destroyText = game.add.text(410, 200, 'destroy', { font: "25px Kalam", fill: "#000000" });
                                                                    destroyText.anchor.setTo(0.5, 0.5);
                                                                    destroyText.alpha = 0; // Set initial alpha to 0

                                                                    // Fade in 'destroy' text
                                                                    game.add.tween(destroyText).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)
                                                                        .onComplete.add(function () {

                                                                            // Add 'THEM' text
                                                                            let themText = game.add.text(410, 300, 'THEM', { font: "25px Kalam", fill: "#FF0000" });
                                                                            themText.anchor.setTo(0.5, 0.5);
                                                                            themText.alpha = 0; // Set initial alpha to 0

                                                                            // Fade in 'THEM' text
                                                                            game.add.tween(themText).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)
                                                                                .onComplete.add(function () {
                                                                                    // Wait for 0.5 seconds
                                                                                    game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
                                                                                        // Fade out both texts together
                                                                                        game.add.tween(destroyText).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                                                                                        game.add.tween(themText).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true)
                                                                                            .onComplete.add(function () {
                                                                                                // Start the optional play state
                                                                                                startPlayOptional();
                                                                                            });
                                                                                    });
                                                                                });
                                                                        });
                                                                });
                                                            });
                                                    });
                                                });
                                        });
                                    });
                                });
                            });
                        });
                });
        });
}

function startPlayOptional() {
    difficultyMultiplier = 1;
    game.state.start('playOptional');
}

function skipScene()
{
    //makes all the scene skippable by clicking
    let btnSkip = game.add.button(0, 0, 'skip', skipSound, this);
    btnSkip.width = game.world.width;
    btnSkip.height = game.world.height;
    btnSkip.alpha = 0;
}

function skipSound()
{
    buttonsnd.play();
    startPlayOptional();
}