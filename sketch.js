class Point {
  constructor(x = undefined, y = undefined, relativX = undefined, relativY = undefined) {
    this.x = x;
    this.y = y;
    this.relativX = relativX;
    this.relativY = relativY;
  }
}

let P0 = new Point(50, 350);
let P1 = new Point(100, 50);
let P2 = new Point(300, 50);
let P3 = new Point(350, 350);
let A = new Point();
let B = new Point();
let C = new Point();
let D = new Point();
let E = new Point();
let P = new Point();

let t=0
let pd=20
let bezierPoints = [P0,P1,P2,P3];

function setup() {
  createCanvas(400, 400);
  //console.log(crlPtReduceDeCasteljau(points, 0));
}

function draw() {
  background(220);
  movePoint()
  drawDecasteljau(bezierPoints);
 

  /*
  drawPoints()
  supportLines()
  */

  text("Click & drag the points to change the bézier curve",50,375)
}

function supportLines(){
  line(P0.x,P0.y,P1.x,P1.y);
  line(P1.x,P1.y,P2.x,P2.y);
  line(P2.x,P2.y,P3.x,P3.y);
}

function drawPoints(){
  circle(P0.x,P0.y,pd);
  circle(P1.x,P1.y,pd);
  circle(P2.x,P2.y,pd);
  circle(P3.x,P3.y,pd);
}

function movePoint(){
  for(let i=0; i<bezierPoints.length;i++){
    if(bezierPoints[i].relativX!=undefined){
      bezierPoints[i].x=mouseX+bezierPoints[i].relativX
      bezierPoints[i].y=mouseY+bezierPoints[i].relativY
    }
  } 
}

function mousePressed(){
  for(let i=0; i<bezierPoints.length;i++){
    if(dist(bezierPoints[i].x,bezierPoints[i].y,mouseX,mouseY)<pd/2){
      bezierPoints[i].relativX=bezierPoints[i].x-mouseX
      bezierPoints[i].relativY=bezierPoints[i].y-mouseY
    }
  } 
}

function mouseReleased(){
  for(let i=0; i<bezierPoints.length;i++){
    bezierPoints[i].relativX=undefined
    bezierPoints[i].relativY=undefined
  } 
}


/////////// version til et virkårligt antal punkter
let points = [ [0, 128], [128, 0], [256, 0], [384, 128] ]
function drawDecasteljau(points){
  for(let i = 0; i < 1; i+=0.001){
    let ps = crlPtReduceDeCasteljau (points, i)
    circle(ps[ps.length-1][0][0],ps[ps.length-1][0][1],10)
  }
}

//https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm 
function crlPtReduceDeCasteljau(points, t) {
  var pointsRefactored = [];
  for(i=0;i<points.length;i++){
    pointsRefactored.push([points[i].x, points[i].y]);
  }

  let retArr = [ pointsRefactored.slice () ];
  //console.log(retArr);
	while (pointsRefactored.length > 1) {
    let midpoints = [];
		for (let i = 0; i+1 < pointsRefactored.length; ++i) {
			let ax = pointsRefactored[i][0];
			let ay = pointsRefactored[i][1];
			let bx = pointsRefactored[i+1][0];
			let by = pointsRefactored[i+1][1];
            // a * (1-t) + b * t = a + (b - a) * t
			midpoints.push([
				ax + (bx - ax) * t,
				ay + (by - ay) * t,
			]);
		}
    retArr.push (midpoints)
    pointsRefactored = midpoints;
	}
	return retArr;
}
////////////////
