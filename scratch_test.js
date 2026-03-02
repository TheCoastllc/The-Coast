// simple test script to ensure math works
const vh = 1000;
const midHeight = vh * 0.8; // 800
const midTop = (vh - midHeight) / 2; // 100
const targetTop = 2000;
const targetHeight = 100;

const currentS = targetTop - midTop; // 1900
// At t=1, target is at 2000. It scrolled 1900.
// Visual position = 2000 - 1900 = 100.
// This means the text meets the video at 100px from top (10% of screen).
console.log("Current visual meeting Y:", targetTop - currentS);

const newS = targetTop - vh / 2 + targetHeight / 2; // 2000 - 500 + 50 = 1550
// At t=1, target is at 2000. It scrolled 1550.
// Visual position = 2000 - 1550 = 450.
// Top of video is at 450. Center of video is at 450 + 100/2 = 500. Which is center of screen!
console.log("New visual meeting Y:", targetTop - newS);
