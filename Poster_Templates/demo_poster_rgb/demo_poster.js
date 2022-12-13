
// dataFiltered : represents an array of depth data. Only available with setupOSC(true)
// depthW: The horizontal resolution of the dataFiltered aray
// depthH: The vertical resolution of the dataFiltered aray

let metaballShader;
const N_balls = 1000, metaballs = [];
const N_wave_balls = 1, wave_metaballs = [];
let gra;
let kpFrame = 0;
let isConverted = false;
let offset = 0;
let minFrag = 0.9;
let maxFrag = 1.1;
let defaultBallSize = 400;

function preload() {
	metaballShader = getShader(this._renderer);
  font = loadFont('assets/playfair.ttf');
}

function setup() {
  createCanvas(getWindowWidth(), getWindowHeight(), WEBGL); // impartant! Don't modify this line. 
  setupOSC(true, true); // Don't remove this line. 1 argument to turn the depthstream on and off
  pixelDensity(1);
  textFont(font);
	shader(metaballShader);

  for (let i = 0; i < N_balls; i ++) metaballs.push(new Metaball());

  gra = createGraphics(160, 30);
  gra2 = createGraphics(160, 30);
}

function draw() {
  if(frameCount == kpFrame + 20 && kpFrame != 0)for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);
	
	var data = [];
  
	for (const ball of metaballs) {
		ball.update();
		data.push(ball.pos.x, ball.pos.y, ball.radius);
	}

  for (const ball of wave_metaballs) {
		ball.update();
		data.push(ball.pos.x, ball.pos.y, ball.radius);
	}
	
	metaballShader.setUniform("metaballs", data);
	rect(0, 0, getWindowWidth(), getWindowHeight());

  if(mouseX > getWindowWidth()/2){
    if (isConverted == false){
      isConverted = !isConverted;
      destiny();
    }
  } else {
    if (isConverted == true){
      isConverted = !isConverted;
      density();
    }
  }

  ///////////////
  posterTasks(); // do not remove this last line!  
}

function resizeBlob(value) {
		if(value > defaultBallSize){
			value += 10;
		} else if(targetValue > value) {
			value -= 10;
		}
		console.log(value);
		return(value)
}

function destiny(){
	updateGra('DESTINY',gra);
	let targetPos = getBlPxPos(gra);
	setTargetPos(targetPos);
	kpFrame = frameCount;
	for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);
}

function density(){
	updateGra2('DENSITY', gra2);
	let targetPos = getBlPxPos2(gra2);
	setTargetPos2(targetPos);
	kpFrame = frameCount;
	for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);
}


function mouseMoved() {
  if (mouseX > getWindowWidth()/2) {
    offset = map(mouseX, getWindowWidth()/2, getWindowWidth(), 0, 400);
  } 
} 

function mouseMoved() {
	if (mouseY > getWindowHeight()/2) {
		for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(false);
	} 
  } 



function setTargetPos(pos)
{
	for(let i =0; i < metaballs.length; i++)
	{
		if(i < pos.length)metaballs[i].setTarget(pos[i].x,pos[i].y);
		else
		{
			let d;
			if(random() > 0.5)d = random() > 0.5 ? createVector(-metaballs[i].radius*5,random(getWindowHeight())) : createVector(getWindowWidth() + metaballs[i].radius*5,random(getWindowHeight()));
			else d = random() > 0.5 ? createVector(random(getWindowWidth()),-metaballs[i].radius*5) : createVector(random(getWindowWidth()),getWindowHeight() + metaballs[i].radius*5);
			metaballs[i].setTarget(d.x,d.y);
		}
	}
}

function setTargetPos2(pos)
{
	for(let i =0; i < metaballs.length; i++)
	{
		if(i < pos.length)metaballs[i].setTarget(pos[i].x,pos[i].y);
		else
		{
			let d;
			if(random() > 0.5)d = random() > 0.5 ? createVector(-metaballs[i].radius*5,random(getWindowHeight())) : createVector(getWindowWidth() + metaballs[i].radius*5,random(getWindowHeight()));
			else d = random() > 0.5 ? createVector(random(getWindowWidth()),-metaballs[i].radius*5) : createVector(random(getWindowWidth()),getWindowHeight() + metaballs[i].radius*5);
			metaballs[i].setTarget(d.x,d.y);
		}
	}
}




function getBlPxPos(g)
{
	let ratio = 6;
	
	let pos = [];
	for(let x =0 ; x < g.width; x++)
	{
		for(let y =0; y < g.height; y++)
		{
			let col = g.get(x,y);
			if(brightness(col) == 0)pos.push(createVector((x-g.width/2)*ratio + width/2,((g.height-y)-g.height/2)*ratio + height/2));
		}
	}
	return pos;
}

function getBlPxPos2(g)
{
	let ratio = 6;
	
	let pos = [];
	for(let x =0 ; x < g.width; x += 2)
	{
		for(let y =0; y < g.height; y += 2)
		{
			let col = g.get(x,y);
			if(brightness(col) == 0)pos.push(createVector((x-g.width/2)*ratio + width/2,((g.height-y)-g.height/2)*ratio + height/2));
		}
	}
	return pos;
}


function updateGra(str,g,s = g.height)
{
	g.background(255);
	g.fill(0);
	g.textSize(30);
	g.textAlign(CENTER,CENTER);
	g.text(str,g.width/2,g.height/2);
}

function updateGra2(str,g,s = g.height)
{
	g.background(0);
	g.fill(255);
	g.textSize(30);
	g.textAlign(CENTER,CENTER);
	g.text(str,g.width/2,g.height/1.8);
}



// OpenProcessing has a bug where it always creates a scrollbar on Chromium.
function mouseWheel() { // This stops the canvas from scrolling by a few pixels.
	return false;
}






