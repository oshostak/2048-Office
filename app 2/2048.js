// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global createCanvas, colorMode, HSB, width, height, textAlign,CENTER,RGB,Hammer,
          random, background, fill, color, random, int,textFont, cursor, HAND, ARROW,
          rect, ellipse,keyIsPressed,keyCode,UP_ARROW,DOWN_ARROW, stroke, image, loadImage, 
          collideCircleCircle, text, mouseX, mouseY, LEFT_ARROW, RIGHT_ARROW,strokeWeight, line, mouseIsPressed
          mouseButton,textSize,ctx.fillstyle,windowWidth,windowHeight, RIGHT, noStroke, position, loadSound, soundFormats */

let backgroundColor,
  gameBoardX,
  gameBoardY,
  gameBoardSize,
  bestScore,
  officeMode = false,
  numFree,
  gameOver;
let arrGrid, arrTiles, arrPictures;
let dwightimg,
  pamimg,
  creedimg,
  michaelimg,
  jimimg,
  angelaimg,
  andyimg,
  kevinimg,
  oscarimg,
  phyllisimg,
  stanleyimg,
  wallaceimg;
let song, swoosh;

let score = [],
  scoreIndex = -1;

var msg = "swipe";

//initializing global saturation and global brightness
let globalS, globalB;

function preload() {
  soundFormats("mp3");
  //Dwight
  dwightimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fdwight.png?v=1596039555035"
  );
  //andy
  andyimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fandy.png?v=1596040023208"
  );
  //angela
  angelaimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fangela.png?v=1596034984737"
  );
  //kevin
  kevinimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fkevin.png?v=1596035393006"
  );

  //oscar
  oscarimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Foscar.png?v=1596035607225"
  );

  //pam
  pamimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fpam.png?v=1596036199225"
  );
  //jim
  jimimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fjim.png?v=1596036517705"
  );
  //phyllis
  phyllisimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fphyllis.png?v=1596037473387"
  );
  //creed
  creedimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fcreed.png?v=1596037709530"
  );

  //stanley
  stanleyimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fstanley.png?v=1596038123433"
  );
  //michael
  michaelimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fmichael.png?v=1596038663656"
  );
  //wallace
  wallaceimg = loadImage(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fwallace.png?v=1596039270338"
  );

  song = loadSound(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fsound.mp3?v=1596119196695"
  );
  swoosh = loadSound(
    "https://cdn.glitch.com/3a2287f8-e754-4d24-a60b-4e09e3f43538%2Fswoosh.mp3?v=1596128973820"
  );
}
// 2 = Dwight
// 4 = Andy
// 8 = Angela
// 16 = Kevin
// 32 = Oscar
// 64 = Pam
// 128 = Jim
// 256 = Phyllis
// 512 = Creed
// 1024 = Stanley
// 2048 = Michael
// 4096 = Wallace

function setup() {
  //initializing the colors
  colorMode(HSB, 360, 100, 100);
  globalS = 80;
  globalB = 80;
  noStroke();
  createCanvas(400, 450);
  backgroundColor = color(95);
  gameBoardX = 50;
  gameBoardY = 130;
  gameBoardSize = 295;
  score.push(0);
  scoreIndex++;

  arrGrid = new Array(4);

  //initializing the 2d array
  for (let i = 0; i < arrGrid.length; i++) {
    arrGrid[i] = new Array(4);
  }
  let x = gameBoardX + 10;
  let y = gameBoardY + 10;

  //initializing the array of background tiles
  for (let i = 0; i < arrGrid.length; i++) {
    for (let j = 0; j < arrGrid[0].length; j++) {
      arrGrid[i][j] = new BackgroundTile(x, y);
      y += 70;
    }
    x += 70;
    y = gameBoardY + 10;
    var options = {
      preventDefault: true
    };

    // document.body registers gestures anywhere on the page
    var hammer = new Hammer(document.body, options);
    hammer.get("swipe").set({
      direction: Hammer.DIRECTION_ALL,
      threshold: 50
    });

    hammer.on("swipe", swiped);
  }

  numFree = 16;

  //pushing two random tiles into the array of numbered Tiles
  // arrTiles = [];

  arrTiles = new Array(4);
  for (let i = 0; i < arrTiles.length; i++) {
    arrTiles[i] = new Array(4);
  }

  generateTile();
  updateEmpty();
  generateTile();

  arrPictures = [
    dwightimg,
    andyimg,
    angelaimg,
    kevinimg,
    oscarimg,
    pamimg,
    jimimg,
    phyllisimg,
    creedimg,
    stanleyimg,
    michaelimg,
    wallaceimg
  ];

  gameOver = false;
}

function draw() {
  background(backgroundColor);
  textSize(40);
  fill(275,globalS,globalB);
  text("2048", 100, 60);
  fill(60);
  rect(170, 40, 80, 40, 4);
  rect(260, 40, 80, 40, 4);
  rect(gameBoardX, gameBoardY, gameBoardSize, gameBoardSize, 4);
  fill(175,globalS,globalB);
  rect(203, 90, 142, 30, 4);
  fill(200,globalS,globalB);
  rect(50, 90, 142, 30, 4);
  fill(100);
  textFont("Trebuchet MS", 16);
  text("New Game", 275, 106);
  if (!officeMode) {
    text("Office Mode", 120, 106);
  } else {
    text("Classic", 120, 106);
  }

  scoreKeeper();
  updateEmpty();
  for (let i = 0; i < arrTiles.length; i++) {
    for (let j = 0; j < arrTiles.length; j++) {
      if (arrTiles[i][j] != null) {
        if (arrTiles[i][j].moving != null) {
          arrTiles[i][j].lerp();
        }
        arrTiles[i][j].display();
        arrTiles[i][j].getNumber();
      }
    }
  }
  buttons();

  if (numFree == 0) {
    checkMovesLeft();
  }
  if (gameOver) {
    endScreen();
  }
}

function updateEmpty() {
  numFree = 16;
  for (let i = 0; i < arrGrid.length; i++) {
    for (let j = 0; j < arrGrid[0].length; j++) {
      arrGrid[i][j].display();
      if (arrTiles[i][j] != undefined) {
        numFree--;
      }
    }
  }
}

function keyPressed() {
  let valid = false;
  let count = 0;
  if (keyCode === UP_ARROW) {
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < arrTiles.length; i++) {
        for (let j = 1; j < arrTiles.length; j++) {
          if (arrTiles[i][j] === undefined) {
            continue;
          }
          if (k === 0) {
            if (j == 1 && arrTiles[i][j - 1] != undefined) {
              arrTiles[i][j - 1].combined = false;
            }
            arrTiles[i][j].combined = false;
          }
          if (arrTiles[i][j - 1] === undefined) {
            arrTiles[i][j - 1] = new NumberTile(
              arrGrid[i][j].x,
              arrGrid[i][j].y,
              arrTiles[i][j].number,
              false
            );
            arrTiles[i][j - 1].moving = "up";
            arrTiles[i][j] = undefined;
            valid = true;
            if (k == 2 && j == arrTiles.length - 1) {
              count++;
            }
          }
          if (
            k === 2 &&
            arrTiles[i][j] != undefined &&
            arrTiles[i][j - 1] != undefined &&
            arrTiles[i][j - 1].number === arrTiles[i][j].number
          ) {
            if (
              arrTiles[i][j].combined === false &&
              arrTiles[i][j - 1].combined === false
            ) {
              arrTiles[i][j - 1] = new NumberTile(
                arrGrid[i][j - 1].x,
                arrGrid[i][j - 1].y,
                arrTiles[i][j].number * 2,
                false
              );
              arrTiles[i][j] = undefined;
              arrTiles[i][j - 1].combined = true;
              score[scoreIndex] += arrTiles[i][j - 1].number;
              valid = true;
              if (officeMode && arrTiles[i][j - 1].number === 2048) {
                if (song.isLoaded) {
                  song.play();
                }
              }
            }
          }
          if (count > 0) {
            if (
              arrTiles[i][j - 1] != undefined &&
              arrTiles[i][j - 2] &&
              arrTiles[i][j - 1].number === arrTiles[i][j - 2].number
            ) {
              if (
                arrTiles[i][j - 2].combined === false &&
                arrTiles[i][j - 1].combined === false
              ) {
                arrTiles[i][j - 2] = new NumberTile(
                  arrGrid[i][j - 2].x,
                  arrGrid[i][j - 2].y,
                  arrTiles[i][j - 1].number * 2,
                  false
                );
                arrTiles[i][j - 1] = undefined;
                arrTiles[i][j - 2].combined = true;
                score[scoreIndex] += arrTiles[i][j - 2].number;
                valid = true;
                if (officeMode && arrTiles[i][j - 2].number === 2048) {
                  song.play();
                }
              }
            }
          }
        }
      }
    }
  }
  if (keyCode === DOWN_ARROW) {
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < arrTiles.length; i++) {
        for (let j = arrTiles.length - 2; j >= 0; j--) {
          if (arrTiles[i][j] === undefined) {
            continue;
          }
          if (k === 0) {
            if (j == arrTiles.length - 2 && arrTiles[i][j + 1] != undefined) {
              arrTiles[i][j + 1].combined = false;
            }
            arrTiles[i][j].combined = false;
          }
          if (arrTiles[i][j + 1] === undefined) {
            arrTiles[i][j + 1] = new NumberTile(
              arrGrid[i][j].x,
              arrGrid[i][j].y,
              arrTiles[i][j].number,
              false
            );
            arrTiles[i][j + 1].moving = "down";
            arrTiles[i][j] = undefined;
            valid = true;
            if (k == 2 && j == 0) {
              count++;
            }
          }
          if (
            k === 2 &&
            arrTiles[i][j] != undefined &&
            arrTiles[i][j + 1] != undefined &&
            arrTiles[i][j + 1].number === arrTiles[i][j].number
          ) {
            if (
              arrTiles[i][j].combined === false &&
              arrTiles[i][j + 1].combined === false
            ) {
              arrTiles[i][j + 1] = new NumberTile(
                arrGrid[i][j + 1].x,
                arrGrid[i][j + 1].y,
                arrTiles[i][j].number * 2,
                false
              );
              arrTiles[i][j] = undefined;
              arrTiles[i][j + 1].combined = true;
              score[scoreIndex] += arrTiles[i][j + 1].number;
              valid = true;
              if (officeMode && arrTiles[i][j + 1].number === 2048) {
                song.play();
              }
            }
          }
          if (count > 0) {
            if (
              arrTiles[i][j + 1] != undefined &&
              arrTiles[i][j + 2] &&
              arrTiles[i][j + 1].number === arrTiles[i][j + 2].number
            ) {
              if (
                arrTiles[i][j + 2].combined === false &&
                arrTiles[i][j + 1].combined === false
              ) {
                arrTiles[i][j + 2] = new NumberTile(
                  arrGrid[i][j + 2].x,
                  arrGrid[i][j + 2].y,
                  arrTiles[i][j + 1].number * 2,
                  false
                );
                arrTiles[i][j + 1] = undefined;
                arrTiles[i][j + 2].combined = true;
                score[scoreIndex] += arrTiles[i][j + 2].number;
                valid = true;
                if (officeMode && arrTiles[i][j + 2].number === 2048) {
                  song.play();
                }
              }
            }
          }
        }
      }
    }
  }

  if (keyCode === LEFT_ARROW) {
    for (let k = 0; k < 3; k++) {
      for (let i = 1; i < arrTiles.length; i++) {
        for (let j = 0; j < arrTiles.length; j++) {
          if (arrTiles[i][j] === undefined) {
            continue;
          }
          if (k === 0) {
            if (i == 1 && arrTiles[i - 1][j] != undefined) {
              arrTiles[i - 1][j].combined = false;
            }
            arrTiles[i][j].combined = false;
          }
          if (arrTiles[i - 1][j] === undefined) {
            arrTiles[i - 1][j] = new NumberTile(
              arrGrid[i][j].x,
              arrGrid[i][j].y,
              arrTiles[i][j].number,
              false
            );
            arrTiles[i - 1][j].moving = "left";
            arrTiles[i][j] = undefined;
            valid = true;
            if (k == 2 && i == arrTiles.length - 1) {
              count++;
            }
          }
          if (
            k === 2 &&
            arrTiles[i - 1][j] != undefined &&
            arrTiles[i][j] != undefined &&
            arrTiles[i - 1][j].number === arrTiles[i][j].number
          ) {
            if (
              arrTiles[i][j].combined === false &&
              arrTiles[i - 1][j].combined === false
            ) {
              arrTiles[i - 1][j] = new NumberTile(
                arrGrid[i - 1][j].x,
                arrGrid[i - 1][j].y,
                arrTiles[i][j].number * 2,
                false
              );
              arrTiles[i][j] = undefined;
              arrTiles[i - 1][j].combined = true;
              score[scoreIndex] += arrTiles[i - 1][j].number;
              valid = true;
              if (officeMode && arrTiles[i - 1][j].number === 2048) {
                song.play();
              }
            }
          }
          if (count > 0) {
            if (
              arrTiles[i - 1][j] != undefined &&
              arrTiles[i - 2][j] &&
              arrTiles[i - 1][j].number === arrTiles[i - 2][j].number
            ) {
              if (
                arrTiles[i - 2][j].combined === false &&
                arrTiles[i - 1][j].combined === false
              ) {
                arrTiles[i - 2][j] = new NumberTile(
                  arrGrid[i - 2][j].x,
                  arrGrid[i - 2][j].y,
                  arrTiles[i - 1][j].number * 2,
                  false
                );
                arrTiles[i - 1][j] = undefined;
                arrTiles[i - 2][j].combined = true;
                score[scoreIndex] += arrTiles[i - 2][j].number;
                valid = true;
                if (officeMode && arrTiles[i - 2][j].number === 2048) {
                  song.play();
                }
              }
            }
          }
        }
      }
    }
  }

  if (keyCode === RIGHT_ARROW) {
    for (let k = 0; k < 3; k++) {
      for (let i = arrTiles.length - 2; i >= 0; i--) {
        for (let j = 0; j < arrTiles.length; j++) {
          if (arrTiles[i][j] === undefined) {
            continue;
          }
          if (k === 0) {
            if (i == arrTiles.length - 2 && arrTiles[i + 1][j] != undefined) {
              arrTiles[i + 1][j].combined = false;
            }
            arrTiles[i][j].combined = false;
          }
          if (arrTiles[i + 1][j] === undefined) {
            arrTiles[i + 1][j] = new NumberTile(
              arrGrid[i][j].x,
              arrGrid[i][j].y,
              arrTiles[i][j].number,
              false
            );
            arrTiles[i + 1][j].moving = "right";
            arrTiles[i][j] = undefined;
            valid = true;
            if (k == 2 && i == 0) {
              count++;
            }
          }
          if (
            k === 2 &&
            arrTiles[i][j] != undefined &&
            arrTiles[i + 1][j] != undefined &&
            arrTiles[i + 1][j].number === arrTiles[i][j].number
          ) {
            if (
              arrTiles[i][j].combined === false &&
              arrTiles[i + 1][j].combined === false
            ) {
              arrTiles[i + 1][j] = new NumberTile(
                arrGrid[i + 1][j].x,
                arrGrid[i + 1][j].y,
                arrTiles[i][j].number * 2,
                false
              );
              arrTiles[i][j] = undefined;
              arrTiles[i + 1][j].combined = true;
              score[scoreIndex] += arrTiles[i + 1][j].number;
              valid = true;
              if (officeMode && arrTiles[i + 1][j].number === 2048) {
                song.play();
              }
            }
          }
          if (count > 0) {
            if (
              arrTiles[i + 1][j] != undefined &&
              arrTiles[i + 2][j] &&
              arrTiles[i + 1][j].number === arrTiles[i + 2][j].number
            ) {
              if (
                arrTiles[i + 2][j].combined === false &&
                arrTiles[i + 1][j].combined === false
              ) {
                arrTiles[i + 2][j] = new NumberTile(
                  arrGrid[i + 2][j].x,
                  arrGrid[i + 2][j].y,
                  arrTiles[i + 1][j].number * 2,
                  false
                );
                arrTiles[i + 1][j] = undefined;
                arrTiles[i + 2][j].combined = true;
                score[scoreIndex] += arrTiles[i + 2][j].number;
                valid = true;
                if (officeMode && arrTiles[i + 2][j].number === 2048) {
                  song.play();
                }
              }
            }
          }
        }
      }
    }
  }
  if (valid) {
    updateEmpty();
    generateTile();
  }
}

//sift through the array of number tiles to find 2 that can be combined
function checkMovesLeft() {
  let movesLeft = 0;
  for (let i = 0; i < arrTiles.length; i++) {
    for (let j = 0; j < arrTiles.length; j++) {
      if (i == 1 || i == 2) {
        if (j == 0) {
          if (
            arrTiles[i][j].number == arrTiles[i - 1][j].number ||
            arrTiles[i][j].number == arrTiles[i + 1][j].number ||
            arrTiles[i][j].number == arrTiles[i][j + 1].number
          ) {
            movesLeft++;
          }
        } else if (j == 3) {
          if (
            arrTiles[i][j].number == arrTiles[i - 1][j].number ||
            arrTiles[i][j].number == arrTiles[i + 1][j].number ||
            arrTiles[i][j].number == arrTiles[i][j - 1].number
          ) {
            movesLeft++;
          }
        } else {
          if (
            arrTiles[i][j].number == arrTiles[i - 1][j].number ||
            arrTiles[i][j].number == arrTiles[i + 1][j].number ||
            arrTiles[i][j].number == arrTiles[i][j + 1].number ||
            arrTiles[i][j].number == arrTiles[i][j - 1].number
          ) {
            movesLeft++;
          }
        }
      } else if (j == 1 || j == 2) {
        if (i == 0) {
          if (
            arrTiles[i][j].number == arrTiles[i + 1][j].number ||
            arrTiles[i][j].number == arrTiles[i][j + 1].number ||
            arrTiles[i][j].number == arrTiles[i][j - 1].number
          ) {
            movesLeft++;
          }
        } else if (i == 3) {
          if (
            arrTiles[i][j].number == arrTiles[i - 1][j].number ||
            arrTiles[i][j].number == arrTiles[i][j + 1].number ||
            arrTiles[i][j].number == arrTiles[i][j - 1].number
          ) {
            movesLeft++;
          }
        }
      }
    }
  }
  if (movesLeft == 0) {
    gameOver = true;
  }
}

//BackgroundTile class -- for grey background tiles
class BackgroundTile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 65;
    this.number;
  }

  display() {
    fill(80);
    rect(this.x, this.y, this.size, this.size, 4);
  }
}

// NumberTile class -- for tiles with numbers
class NumberTile {
  constructor(x, y, number, isnew) {
    this.number = number;
    this.x = x;
    this.y = y;
    this.width = 65;
    this.height = 65;
    this.speed = 1;
    this.board_x;
    this.board_y;
    this.combined = false;
    this.count = 0;
    this.new = isnew;
    this.moving;
    this.moveCount = 0;
  }

  getNumber() {
    for (let i = 0; i < arrGrid.length; i++) {
      for (let j = 0; j < arrGrid.length; j++) {
        if (this.x == arrGrid[i][j].x && this.y == arrGrid[i][j].y) {
          this.board_x = i;
          this.board_y = j;
        }
      }
    }
  }

  lerp() {
    if (this.moving == "right") {
      this.moveCount++;
      this.x += 10;
    } else if (this.moving == "left") {
      this.moveCount++;
      this.x -= 10;
    } else if (this.moving == "up") {
      this.moveCount++;
      this.y -= 10;
    } else if (this.moving == "down") {
      this.moveCount++;
      this.y += 10;
    }
    if (this.moveCount * 10 == 70) {
      this.moving = null;
      this.moveCount = 0;
    }
  }

  display() {
    fill(getColor(this.number), globalS, globalB);
    if (this.new && (this.number == 2 || this.number == 4)) {
      this.width = 45;
      this.height = 45;
      this.x -= 10;
      this.y -= 10;
      this.new = false;
    }

    if (this.combined == false && this.width < 65) {
      this.width += 2.5;
      this.height += 2.5;
      this.x += 1.25;
      this.y += 1.25;
    }

    if (this.combined && this.count == 0) {
      this.count++;
      this.width = 75;
      this.height = 75;
      this.x -= 5;
      this.y -= 5;
    }
    if (this.combined && this.width > 65) {
      this.width -= 2;
      this.height -= 2;
      this.x++;
      this.y++;
    }

    rect(this.x, this.y, this.width, this.height, 4);

    if (!officeMode) {
      fill(0);
      if (this.number >= 512) {
        fill(100);
      }
      textAlign(CENTER, CENTER);
      let s = "" + this.number;
      let len = s.length - 1;
      let sizes = [32, 32, 26, 20];
      textSize(sizes[len]);
      text(this.number, this.x + this.width / 2, this.y + this.width / 2);
    } else {
      image(
        officePicture(this.number),
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
}

// checking the score
function scoreKeeper() {
  fill(80);
  textSize(10);
  text("SCORE", 210, 50);
  text("BEST", 300, 50);

  textSize(15);
  fill(100);
  strokeWeight(2);
  text(`${score[scoreIndex]}`, 210, 65);

  text(Math.max(...score), 300, 65);
}

function endScreen() {
  colorMode(RGB);
  let fillColor = color(125, 125, 125, 220);
  fill(fillColor);
  rect(gameBoardX, gameBoardY, gameBoardSize, gameBoardSize, 4);
  textSize(40);
  fill(255);
  text(
    "Game over!",
    gameBoardX + gameBoardSize / 2,
    gameBoardY + gameBoardSize / 2
  );
  colorMode(HSB);
}

//function that checks the tile's number and assigns a fill color accordingly
function getColor(number) {
  return (25 * Math.log2(number)) % 360;
}

//getting either a 2 or a 4
function getRandomTiles() {
  let a = Math.random();
  if (a > 0.1) {
    return 2;
  } else {
    return 4;
  }
}

function generateTile() {
  let x = int(random(4));
  let y = int(random(4));
  while (arrTiles[x][y] != undefined) {
    x = int(random(4));
    y = int(random(4));
  }
  arrTiles[x][y] = new NumberTile(
    arrGrid[x][y].x,
    arrGrid[x][y].y,
    getRandomTiles(),
    true
  );
  swoosh.play();
}

function buttons() {
  if (
    (mouseX > 203 && mouseX < 345 && mouseY > 90 && mouseY < 120) ||
    (mouseX > 50 && mouseX < 192 && mouseY > 90 && mouseY < 120)
  ) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function mouseClicked() {
  if (mouseX > 203 && mouseX < 345 && mouseY > 90 && mouseY < 120) {
    setup();
  }

  if (mouseX > 50 && mouseX < 192 && mouseY > 90 && mouseY < 120) {
    officeMode = !officeMode;
  }
}

function officePicture(number) {
  if (officeMode) {
    return arrPictures[Math.log2(number) - 1];
  }
}

function swiped(event) {
  let valid = false;
  let count = 0;
  if (event.direction == 8) {
    console.log("swiped up");
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < arrTiles.length; i++) {
        for (let j = 1; j < arrTiles.length; j++) {
          if (arrTiles[i][j] === undefined) {
            continue;
          }
          if (k === 0) {
            if (j == 1 && arrTiles[i][j - 1] != undefined) {
              arrTiles[i][j - 1].combined = false;
            }
            arrTiles[i][j].combined = false;
          }
          if (arrTiles[i][j - 1] === undefined) {
            arrTiles[i][j - 1] = new NumberTile(
              arrGrid[i][j].x,
              arrGrid[i][j].y,
              arrTiles[i][j].number,
              false
            );
            arrTiles[i][j - 1].moving = "up";
            arrTiles[i][j] = undefined;
            valid = true;
            if (k == 2 && j == arrTiles.length - 1) {
              count++;
            }
          }
          if (
            k === 2 &&
            arrTiles[i][j] != undefined &&
            arrTiles[i][j - 1] != undefined &&
            arrTiles[i][j - 1].number === arrTiles[i][j].number
          ) {
            if (
              arrTiles[i][j].combined === false &&
              arrTiles[i][j - 1].combined === false
            ) {
              arrTiles[i][j - 1] = new NumberTile(
                arrGrid[i][j - 1].x,
                arrGrid[i][j - 1].y,
                arrTiles[i][j].number * 2,
                false
              );
              arrTiles[i][j] = undefined;
              arrTiles[i][j - 1].combined = true;
              score[scoreIndex] += arrTiles[i][j - 1].number;
              valid = true;
            }
          }
          if (count > 0) {
            if (
              arrTiles[i][j - 1] != undefined &&
              arrTiles[i][j - 2] &&
              arrTiles[i][j - 1].number === arrTiles[i][j - 2].number
            ) {
              if (
                arrTiles[i][j - 2].combined === false &&
                arrTiles[i][j - 1].combined === false
              ) {
                arrTiles[i][j - 2] = new NumberTile(
                  arrGrid[i][j - 2].x,
                  arrGrid[i][j - 2].y,
                  arrTiles[i][j - 1].number * 2,
                  false
                );
                arrTiles[i][j - 1] = undefined;
                arrTiles[i][j - 2].combined = true;
                score[scoreIndex] += arrTiles[i][j - 2].number;
                valid = true;
              }
            }
          }
        }
      }
    }
  }
  if (event.direction == 16) {
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < arrTiles.length; i++) {
        for (let j = arrTiles.length - 2; j >= 0; j--) {
          if (arrTiles[i][j] === undefined) {
            continue;
          }
          if (k === 0) {
            if (j == arrTiles.length - 2 && arrTiles[i][j + 1] != undefined) {
              arrTiles[i][j + 1].combined = false;
            }
            arrTiles[i][j].combined = false;
          }
          if (arrTiles[i][j + 1] === undefined) {
            arrTiles[i][j + 1] = new NumberTile(
              arrGrid[i][j].x,
              arrGrid[i][j].y,
              arrTiles[i][j].number,
              false
            );
            arrTiles[i][j + 1].moving = "down";
            arrTiles[i][j] = undefined;
            valid = true;
            if (k == 2 && j == 0) {
              count++;
            }
          }
          if (
            k === 2 &&
            arrTiles[i][j] != undefined &&
            arrTiles[i][j + 1] != undefined &&
            arrTiles[i][j + 1].number === arrTiles[i][j].number
          ) {
            if (
              arrTiles[i][j].combined === false &&
              arrTiles[i][j + 1].combined === false
            ) {
              arrTiles[i][j + 1] = new NumberTile(
                arrGrid[i][j + 1].x,
                arrGrid[i][j + 1].y,
                arrTiles[i][j].number * 2,
                false
              );
              arrTiles[i][j] = undefined;
              arrTiles[i][j + 1].combined = true;
              score[scoreIndex] += arrTiles[i][j + 1].number;
              valid = true;
            }
          }
          if (count > 0) {
            if (
              arrTiles[i][j + 1] != undefined &&
              arrTiles[i][j + 2] &&
              arrTiles[i][j + 1].number === arrTiles[i][j + 2].number
            ) {
              if (
                arrTiles[i][j + 2].combined === false &&
                arrTiles[i][j + 1].combined === false
              ) {
                arrTiles[i][j + 2] = new NumberTile(
                  arrGrid[i][j + 2].x,
                  arrGrid[i][j + 2].y,
                  arrTiles[i][j + 1].number * 2,
                  false
                );
                arrTiles[i][j + 1] = undefined;
                arrTiles[i][j + 2].combined = true;
                score[scoreIndex] += arrTiles[i][j + 2].number;
                valid = true;
              }
            }
          }
        }
      }
    }
  }

  if (event.direction == 2) {
    for (let k = 0; k < 3; k++) {
      for (let i = 1; i < arrTiles.length; i++) {
        for (let j = 0; j < arrTiles.length; j++) {
          if (arrTiles[i][j] === undefined) {
            continue;
          }
          if (k === 0) {
            if (i == 1 && arrTiles[i - 1][j] != undefined) {
              arrTiles[i - 1][j].combined = false;
            }
            arrTiles[i][j].combined = false;
          }
          if (arrTiles[i - 1][j] === undefined) {
            arrTiles[i - 1][j] = new NumberTile(
              arrGrid[i][j].x,
              arrGrid[i][j].y,
              arrTiles[i][j].number,
              false
            );
            arrTiles[i - 1][j].moving = "left";
            arrTiles[i][j] = undefined;
            valid = true;
            if (k == 2 && i == arrTiles.length - 1) {
              count++;
            }
          }
          if (
            k === 2 &&
            arrTiles[i - 1][j] != undefined &&
            arrTiles[i][j] != undefined &&
            arrTiles[i - 1][j].number === arrTiles[i][j].number
          ) {
            if (
              arrTiles[i][j].combined === false &&
              arrTiles[i - 1][j].combined === false
            ) {
              arrTiles[i - 1][j] = new NumberTile(
                arrGrid[i - 1][j].x,
                arrGrid[i - 1][j].y,
                arrTiles[i][j].number * 2,
                false
              );
              arrTiles[i][j] = undefined;
              arrTiles[i - 1][j].combined = true;
              score[scoreIndex] += arrTiles[i - 1][j].number;
              valid = true;
            }
          }
          if (count > 0) {
            if (
              arrTiles[i - 1][j] != undefined &&
              arrTiles[i - 2][j] &&
              arrTiles[i - 1][j].number === arrTiles[i - 2][j].number
            ) {
              if (
                arrTiles[i - 2][j].combined === false &&
                arrTiles[i - 1][j].combined === false
              ) {
                arrTiles[i - 2][j] = new NumberTile(
                  arrGrid[i - 2][j].x,
                  arrGrid[i - 2][j].y,
                  arrTiles[i - 1][j].number * 2,
                  false
                );
                arrTiles[i - 1][j] = undefined;
                arrTiles[i - 2][j].combined = true;
                score[scoreIndex] += arrTiles[i - 2][j].number;
                valid = true;
              }
            }
          }
        }
      }
    }
  }

  if (event.direction == 4) {
    for (let k = 0; k < 3; k++) {
      for (let i = arrTiles.length - 2; i >= 0; i--) {
        for (let j = 0; j < arrTiles.length; j++) {
          if (arrTiles[i][j] === undefined) {
            continue;
          }
          if (k === 0) {
            if (i == arrTiles.length - 2 && arrTiles[i + 1][j] != undefined) {
              arrTiles[i + 1][j].combined = false;
            }
            arrTiles[i][j].combined = false;
          }
          if (arrTiles[i + 1][j] === undefined) {
            arrTiles[i + 1][j] = new NumberTile(
              arrGrid[i][j].x,
              arrGrid[i][j].y,
              arrTiles[i][j].number,
              false
            );
            arrTiles[i + 1][j].moving = "right";
            arrTiles[i][j] = undefined;
            valid = true;
            if (k == 2 && i == 0) {
              count++;
            }
          }
          if (
            k === 2 &&
            arrTiles[i][j] != undefined &&
            arrTiles[i + 1][j] != undefined &&
            arrTiles[i + 1][j].number === arrTiles[i][j].number
          ) {
            if (
              arrTiles[i][j].combined === false &&
              arrTiles[i + 1][j].combined === false
            ) {
              arrTiles[i + 1][j] = new NumberTile(
                arrGrid[i + 1][j].x,
                arrGrid[i + 1][j].y,
                arrTiles[i][j].number * 2,
                false
              );
              arrTiles[i][j] = undefined;
              arrTiles[i + 1][j].combined = true;
              score[scoreIndex] += arrTiles[i + 1][j].number;
              valid = true;
            }
          }
          if (count > 0) {
            if (
              arrTiles[i + 1][j] != undefined &&
              arrTiles[i + 2][j] &&
              arrTiles[i + 1][j].number === arrTiles[i + 2][j].number
            ) {
              if (
                arrTiles[i + 2][j].combined === false &&
                arrTiles[i + 1][j].combined === false
              ) {
                arrTiles[i + 2][j] = new NumberTile(
                  arrGrid[i + 2][j].x,
                  arrGrid[i + 2][j].y,
                  arrTiles[i + 1][j].number * 2,
                  false
                );
                arrTiles[i + 1][j] = undefined;
                arrTiles[i + 2][j].combined = true;
                score[scoreIndex] += arrTiles[i + 2][j].number;
                valid = true;
              }
            }
          }
        }
      }
    }
  }
  if (valid) {
    updateEmpty();
    generateTile();
  }
}
