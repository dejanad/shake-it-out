// empty array of bubbles 
let bubbles = [];

let timer = 3;
let timer2 = 31;

var swipeUrl = "https:" + "//p5js.org/";//put intro.html file here

let score = 0;

//sound + text file 
let popSound;
let camptonMedium;
let campton;

function preload() {
  popSound = loadSound("popSound.m4a");
  camptonMedium = loadFont('Campton-Medium.otf');
  campton = loadFont('Campton-ExtraBoldItalic.otf');
}

//posenet stuff
let video;
let poseNet;
leftWristX = 0;
leftWristY = 0;
rightWristX = 0;
rightWristY = 0;

w = 640 * 1.7;
h = 480 * 1.7;

function setup() {
  // --------------------------  LOADING POSENET MODEL --------------------
  video = createCapture(VIDEO);
  video.size(w, h);
  createCanvas(w, h);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);

  //how many bubbles are drawn
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(10, 60);
    let col = color(133, 226, 255, 100); //flat blue 
    let b = new Bubble(x, y, r, col);
    bubbles.push(b);
  }
}

// -------------------------- POSE DETECTION --------------------------
gotPoses = function(poses) {
  if (poses.length > 0) {
    lX = poses[0].pose.keypoints[9].position.x;
    lY = poses[0].pose.keypoints[9].position.y;
    rX = poses[0].pose.keypoints[10].position.x;
    rY = poses[0].pose.keypoints[10].position.y;

    leftWristX = lerp(leftWristX, lX, 0.5);
    leftWristY = lerp(leftWristY, lY, 0.5);
    rightWristX = lerp(rightWristX, rX, 0.5);
    rightWristY = lerp(rightWristY, rY, 0.5);
  }
}

modelReady = function() {
  console.log('model ready');
}


function draw() {

  push();
  translate(w, 0);
  scale(-1, 1);

  image(video, 0, 0, w, h);
  pop();

  translate(w, 0);
  scale(-1, 1);

  push();
  //draw all bubbles in array
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].show();
  }
  pop(); //keeps style of bubbles seperate 


  //timer, highscore,popping
  gameBegins();
}
// --------------------------  WRIST TRACKERS --------------------------
function wristTrackers() {
  fill(255);
  noStroke();
  ellipse(leftWristX, leftWristY, 20);

  fill(255);
  ellipse(rightWristX, rightWristY, 20);
}

// -------------------------- BUBBLE CLASS --------------------------
class Bubble {
  constructor(x, y, r, col) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.alive = true;
    this.col = col;
  }

  //bubble disappears and sound plays 
  burst(bx, by) {
    let d = dist(bx, by, this.x, this.y);
    if (d < this.r) {
      this.alive = false;
      this.x = 1000000;
      this.y = 1000000;
      popSound.play();
      score++; //score icrement 
    }
  }

  show() {
    stroke(255);
    strokeWeight(0.25);
    fill(this.col);
    ellipse(this.x, this.y, this.r * 2)
  }
}

// -------------------------- 3 SECOND TIMER --------------------------
function gameBegins() {
  push();
  textFont(camptonMedium);
  textAlign(CENTER);
  translate(video.width, 0);
  scale(-1, 1);
  textSize(0); //make it "invisble"
  fill(100,100,100,255);
  text(timer, width/2, height/2);

  if (frameCount % 30 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer--;
  }
  pop();
  if (timer == 0) { //when initial 3 seconds have passed
    highScore(); // start highscore
    gameCountdown(); //start 30 sec countdown
    for (let i = 0; i < bubbles.length; i++) { //start popping bubbles
      bubbles[i].burst(rightWristX, rightWristY);
      bubbles[i].burst(leftWristX, leftWristY);
    }
  }
}

function gameCountdown() {
  strokeWeight(2);
  ellipse(width / 2, height / 2 + 288, 100, 100);
  textFont(camptonMedium);
  textAlign(CENTER);
  noStroke();
  fill(255);
  textSize(68);
  text(timer2, width / 2, height / 2 + 310);
  if (frameCount % 30 == 0 && timer2 > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer2--;
  }
  if (timer2 == 0) {
    background("clear");
    video.stop(); //freeze frame
    translate(video.width, 0);
    scale(-1, 1);
//orange screen comes up 
    FinalhighScore();
  }
}

// -------------------------- HIGH SCORE COUNTER -------------------
function highScore() {
  translate(video.width, 0);
  scale(-1, 1);
  textAlign(CENTER);
  textSize(0); //makes it "invisible"
  stroke(255);
  noFill();
  text(score, width / 2 - 10, 450);
}

// -------------------------- FINAL HIGH SCORE DISPLAY -------------
function FinalhighScore() {
  translate(video.width, 0);
  scale(-1, 1);
  background(255,133,0);
  textAlign(CENTER);
  noStroke();
  fill(255);
  textSize(40);
  text('your high score:', width / 2, height / 2-50);
  textSize(60);
  text(score, width / 2, height / 2+50);
  strokeWeight(2);
  stroke(255);
  ellipse(width/2,height/2+200,130,130);
   textSize(30);
  fill(255,133,0);
  strokeWeight(0.5);
  stroke("blue");
  text('click to', width/2,height/2+185);
  text('pop', width/2,height/2+211);
  text('again', width/2,height/2+243);
  if((mouseX<=width/2+65)&&(mouseX>=width/2-65)&&(mouseY<=height/2+265)&&(mouseY>=height/2+135)){
  openLink(swipeUrl);
}
}

// adapted from: forum.processing.org/two/discussion/8809/link- function#Comment_33474
function openLink(url, winName, options) {
  if(url) {
    winName && open(url, winName, options) || (location = url);    
  }
  else {
    console.warn("no URL specified");
  }
}