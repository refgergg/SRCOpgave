class Point {
  constructor(x = undefined, y = undefined, relativX = undefined, relativY = undefined) {
    this.x = x;
    this.y = y;
    this.relativX = relativX;
    this.relativY = relativY;
  }
}

class Curve {
  constructor(points = [], startPoint = new Point(), endPoint = new Point()) {
    this.points = points;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }
}

let t=0
let pd=20

let bezierPoints = [];
let curves = [];

function setup() {
  createCanvas(400, 400);
  //console.log(crlPtReduceDeCasteljau(points, 0));
}

function draw() {
  background(220);
  //movePoint();

  //Draw curve we are currently creating
  drawDecasteljau(bezierPoints);

  //Draw curves we have previously created
  for(let i=0;i<curves.length;i++) {
    drawDecasteljau(curves[i].points);
    //console.log(curves[i]);
  }

  //Supporting stuff
  drawPoints();
  supportLines();

  //UI stuff
  let button = createButton('Finish Curve');
  button.position(500, 300);
  button.mousePressed(finishCurve);
  text("Click & drag the points to change the bézier curve",50,375)
}

function finishCurve(){
  curves.push(new Curve(bezierPoints, bezierPoints[0], bezierPoints[bezierPoints.length-1]));
  bezierPoints = [];
  console.log(curves);
}

function createPoints(x, y){
  bezierPoints.push(new Point(x, y));
}

function supportLines(){
  for(let i=0;i<bezierPoints.length;i++) {
    if(bezierPoints[i+1] == null) {
      return;
    }
    line(bezierPoints[i].x,bezierPoints[i].y,bezierPoints[i+1].x,bezierPoints[i+1].y);
  }
}

function drawPoints(){
  for(let i=0;i<bezierPoints.length;i++) {
    circle(bezierPoints[i].x, bezierPoints[i].y, pd);
  }
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
  /*
  for(let i=0; i<bezierPoints.length;i++){
    if(dist(bezierPoints[i].x,bezierPoints[i].y,mouseX,mouseY)<pd/2){
      bezierPoints[i].relativX=bezierPoints[i].x-mouseX
      bezierPoints[i].relativY=bezierPoints[i].y-mouseY
    }
  } 
  */
  if(mouseX < width && mouseY < height) {
    
    closestPointAndDist = [0,0];
    //check if our placement of point is close to another point. If so, snap to it
    //this code is disgusting. Unfortunately i dont care
    for(let i=0;i<curves.length;i++){
      for(let j=0;j<curves[i].points.length;j++){
        //Find current curve point dist
        pointDist = dist(mouseX, mouseY, curves[i].points[j].x, curves[i].points[j].y);
        if(closestPointAndDist[1] == 0) {
          closestPointAndDist = [curves[i].points[j], pointDist];
          continue;
        } else {
          //If current curve point dist is closer than closest so far, replace
          if(closestPointAndDist[1] > pointDist) {
            closestPointAndDist = [curves[i].points[j], pointDist];
          }
        }
      }
    }

    if(closestPointAndDist[1] < 25 && closestPointAndDist[1] > 0) {
      createPoints(closestPointAndDist[0].x, closestPointAndDist[0].y);
    } else {
      createPoints(mouseX, mouseY)
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
  if(points <= 1){return;}
  for(let i = 0; i < 1; i+=0.001){
    let ps = crlPtReduceDeCasteljau (points, i)
    circle(ps[ps.length-1][0][0],ps[ps.length-1][0][1],10)
  }
}

//https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm 
function crlPtReduceDeCasteljau(points, t) {
  var pointsRefactored = [];
  for(let i=0;i<points.length;i++){
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
