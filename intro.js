let intro = [1];
var swipeUrl = "https:" + "//p5js.org/";//put game.html here

//load fonts+sound
let campton;
let camptonMedium;
  let popSound;

function preload() {
  campton = loadFont ('Campton-ExtraBoldItalic.otf');
  camptonMedium = loadFont ('Campton-Medium.otf');
}


//----start scene----
let timer = 10;
let startingCanvas;

//----PoseNet----
let video;
let poseNet;
leftWristX = 960;
leftWristY = 720;
rightWristX = 0;
rightWristY = 720;

w = 640*1.7;
h = 480*1.7;

function setup() {
  
  background("clear");
  video = createCapture(VIDEO);
  video.size(w, h);
  createCanvas(w, h);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  for (let i = 0; i < 1; i++) {
    let x = width / 2;
    let y = height / 2;
    let r = 50;
    let b = new swipeToStart(x, y, r,swipeUrl);
    intro.push(b);
  }

}

gotPoses = function(poses) {
  console.log(poses);
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

function modelReady() { //event callback tells me when its finished loading model
  console.log('model ready');
}

function draw() {
  push();
  translate(w, 0);
  scale(-1, 1);
  image(video, 0, 0, w, h);
  pop();
d = dist(leftWristX, leftWristY, rightWristX, rightWristY);
   translate(w, 0);
  scale(-1, 1);
    drawSwipeScene();

 //draw wrist detection after 10 seconds
  if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer--;
} if (timer == 0) {
   //flip posenet balls to track left and right as we see them
  push();
  translate(w, 0);
  scale(-1, 1);
  fill(255);
  noStroke();
  ellipse(leftWristX, leftWristY, 10);
  fill(255);
  ellipse(rightWristX, rightWristY, 10);
  pop();
  
  //enable swipe interaction
  intro[1].Swipe(leftWristX, leftWristY);
  intro[1].Swipe(rightWristX, rightWristY);
  //text changes to "swipe to start"
  intro[1].show(); 
  
}
  
  countDown();

}
function countDown(){
  textSize(0.1);
  text(timer, width/2, height/2);
}
//-------DRAWS SPHERE + 
function drawSwipeScene(){
  intro[1].loading();   
}

// ----------------------------------------------------
//                SWIPE INTERACTION CLASS
// ----------------------------------------------------

class swipeToStart {
  constructor(x, y, r,url) {
    this.x = x;
    this.y = y;
    this.r = r
    this.url = url;
    this.alive = true

  }
  Swipe(rx, ry) {
    let alive = true;
    let d = dist(rx, ry, this.x, this.y);
    if (d < this.r) {
      alive = false;
      this.x = 100000;
      this.y = 100000;
      //open link function is called
      openLink(this.url);
    }
  }
  loading() {
    noStroke();
    fill(255,133,0);
    ellipse(this.x, this.y, this.r * 3);
    //flip text back to normal 
    translate(width, 0);
    scale(-1, 1);
    //swipe to start 
   textFont(campton);
    textSize(30);
    noStroke();
    fill("blue");
    textAlign(CENTER);
    text('loading', this.x, this.y+12);
    fill(255);
    text('loading', this.x+2, this.y+9);
    textFont(camptonMedium);
    textSize(18);
    text('please stand 2m from your laptop', this.x, this.y-200);
  }
  
  show(){
    noStroke();
    fill(255,133,0);
      ellipse(this.x, this.y, this.r * 3);
    textFont(campton);
    textSize(60);
    noStroke();
    strokeWeight(1.25);
     fill("blue");
    textAlign(CENTER);
    text('swipe to start', this.x-9, this.y+18);
   fill(255);
    noStroke();
    text('swipe to start', this.x-5, this.y+15);
//swiping hand motion
    //call hand.move() here
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

