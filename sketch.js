// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX = 320; // Initial x position of the circle
let circleY = 240; // Initial y position of the circle
let circleSize = 100; // Diameter of the circle
let isDrawing = false; // Flag to track if we should draw the trajectory
let lastX, lastY; // Variables to store the last position of the finger

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0, 150); // Semi-transparent green
  noStroke();
  ellipse(circleX, circleY, circleSize, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // Check if the thumb (keypoints[4]) is touching the circle
        if (hand.keypoints.length > 4) {
          let thumb = hand.keypoints[4];
          let distanceToCircle = dist(thumb.x, thumb.y, circleX, circleY);

          // If the thumb is touching the circle, move the circle and draw trajectory
          if (distanceToCircle < circleSize / 2) {
            if (isDrawing) {
              // Draw a green line from the last position to the current position
              stroke(0, 255, 0);
              strokeWeight(10); // Set line thickness to 10
              line(lastX, lastY, thumb.x, thumb.y);
            }

            // Update the circle position
            circleX = thumb.x;
            circleY = thumb.y;

            // Update the last position and enable drawing
            lastX = thumb.x;
            lastY = thumb.y;
            isDrawing = true;
          } else {
            // If the thumb is not touching the circle, stop drawing
            isDrawing = false;
          }
        }

        // Check if the index finger (keypoints[8]) is touching the circle
        if (hand.keypoints.length > 8) {
          let indexFinger = hand.keypoints[8];
          let distanceToCircle = dist(indexFinger.x, indexFinger.y, circleX, circleY);

          // If the index finger is touching the circle, move the circle and draw trajectory
          if (distanceToCircle < circleSize / 2) {
            if (isDrawing) {
              // Draw a red line from the last position to the current position
              stroke(255, 0, 0);
              strokeWeight(10); // Set line thickness to 10
              line(lastX, lastY, indexFinger.x, indexFinger.y);
            }

            // Update the circle position
            circleX = indexFinger.x;
            circleY = indexFinger.y;

            // Update the last position and enable drawing
            lastX = indexFinger.x;
            lastY = indexFinger.y;
            isDrawing = true;
          } else {
            // If the index finger is not touching the circle, stop drawing
            isDrawing = false;
          }
        }

        // Draw lines connecting keypoints 0 to 4
        if (hand.keypoints.length > 12) {
          strokeWeight(2);
          if (hand.handedness == "Left") {
            stroke(255, 0, 255); // Left hand color
          } else {
            stroke(255, 255, 0); // Right hand color
          }

          // Connect keypoints 5 to 8
          for (let i = 5; i < 8; i++) {
            let start = hand.keypoints[i];
            let end = hand.keypoints[i + 1];
            line(start.x, start.y, end.x, end.y);
          }

          // Connect keypoints 9 to 12
          for (let i = 9; i < 12; i++) {
            let start = hand.keypoints[i];
            let end = hand.keypoints[i + 1];
            line(start.x, start.y, end.x, end.y);
          }
        }
      }
    }
  }
}
