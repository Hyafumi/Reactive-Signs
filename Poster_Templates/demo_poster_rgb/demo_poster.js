
// dataFiltered : represents an array of depth data. Only available with setupOSC(true)
// depthW: The horizontal resolution of the dataFiltered aray
// depthH: The vertical resolution of the dataFiltered aray

let metaballShader;
const N_balls = 500, metaballs = [];
const N_wave_balls = 1, wave_metaballs = [];
let gra;
let kpFrame = 0;
let isConverted = false;
let offset = 0;

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

  for (let i = 0; i < N_wave_balls; i ++) wave_metaballs.push(new Metaball());
	for (let i = 0; i < N_balls; i ++) metaballs.push(new Metaball());

	gra = createGraphics(150, 30);
  gra2 = createGraphics(300, 10);
}

function draw() {
  if(frameCount == kpFrame + 20 && kpFrame != 0)for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);
  if(frameCount == kpFrame + 20 && kpFrame != 0)for(let i = 0; i < wave_metaballs.length; i++)wave_metaballs[i].changeState(true);
	
	var data = [];
  
	for (const ball of metaballs) {
		ball.update();
		data.push(ball.pos.x, ball.pos.y+offset, ball.radius);
	}

  for (const ball of wave_metaballs) {
		ball.update();
		data.push(ball.pos.x, ball.pos.y, ball.radius);
	}
	
	metaballShader.setUniform("metaballs", data);
  metaballShader.setUniform("wave_metaballs", data);
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

function destiny(){
	updateGra('DESTINY',gra);
	let targetPos = getBlPxPos(gra);
	setTargetPos(targetPos);
	kpFrame = frameCount;
	for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);
}

function density(){
	updateGra('DENSITY',gra);
	let targetPos = getBlPxPos(gra);
	setTargetPos(targetPos);
	kpFrame = frameCount;
	for(let i = 0; i < metaballs.length; i++)metaballs[i].changeState(true);
}

function test(){
	updateGra('_____',gra2);
	let targetPos = getBlPxPos(gra2);
	waveSetTargetPos(targetPos);
	kpFrame = frameCount;
	for(let i = 0; i < wave_metaballs.length; i++)wave_metaballs[i].changeState(true);
}

function mouseMoved() {
  if (mouseX > getWindowWidth()/2) {
    offset = map(mouseX, getWindowWidth()/2, getWindowWidth(), 0, 400);
  } 
} 


function setTargetPos(pos)
{
	for(let i =0; i < metaballs.length; i++)
	{
		if(i < pos.length)metaballs[i].setTarget(pos[i].x,pos[i].y-300);
		else
		{
			let d;
			if(random() > 0.5)d = random() > 0.5 ? createVector(-metaballs[i].radius*5,random(getWindowHeight())) : createVector(getWindowWidth() + metaballs[i].radius*5,random(getWindowHeight()));
			else d = random() > 0.5 ? createVector(random(getWindowWidth()),-metaballs[i].radius*5) : createVector(random(getWindowWidth()),getWindowHeight() + metaballs[i].radius*5);
			metaballs[i].setTarget(d.x,d.y);
		}
	}
}

function waveSetTargetPos(pos)
{
	for(let i =0; i < wave_metaballs.length; i++)
	{
		if(i < pos.length)wave_metaballs[i].setTarget(pos[i].x,pos[i].y);
		else
		{
			let d;
			if(random() > 0.5)d = random() > 0.5 ? createVector(-wave_metaballs[i].radius*5,random(getWindowHeight())) : createVector(getWindowWidth() + wave_metaballs[i].radius*5,random(getWindowHeight()));
			else d = random() > 0.5 ? createVector(random(getWindowWidth()),-wave_metaballs[i].radius*5) : createVector(random(getWindowWidth()),getWindowHeight() + wave_metaballs[i].radius*5);
			wave_metaballs[i].setTarget(d.x,d.y);
		}
	}
}


function getBlPxPos(g)
{
	let ratio = 10;
	
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


function updateGra(str,g,s = g.height)
{
	g.background(255);
	g.fill(0);
	g.textSize(30);
	g.textAlign(CENTER,CENTER);
	g.text(str,g.width/2,g.height/2);
}

// OpenProcessing has a bug where it always creates a scrollbar on Chromium.
function mouseWheel() { // This stops the canvas from scrolling by a few pixels.
	return false;
}






