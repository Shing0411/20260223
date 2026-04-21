let shapes = [];
let song;
let amplitude;
let points = [[-3, 5], [5, 6], [8, 0], [4, -5], [-2, -6], [-7, -2]];

function preload() {
  // 建議使用完整的路徑或確保檔案存在
  // 這裡我換成一個範例網址確保你可以直接看到結果，你之後可以換回自己的檔案
  song = loadSound('https://p.party-line.top/music.mp3'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初始化分析
  amplitude = new p5.Amplitude();
  
  // 產生 10 個形狀物件
  for (let i = 0; i < 10; i++) {
    let randMultiplier = random(10, 30);
    
    // 修正：在 map 中正確處理物件
    let morphedPoints = points.map(p => ({
      x: p[0] * randMultiplier,
      y: p[1] * randMultiplier
    }));

    let shapeObj = {
      x: random(windowWidth),
      y: random(windowHeight),
      dx: random(-2, 2),
      dy: random(-2, 2),
      color: color(random(100, 255), random(100, 200), random(200, 255), 150),
      points: morphedPoints
    };
    
    shapes.push(shapeObj);
  }
}

function draw() {
  background('#ffcdb2');
  
  // 取得音量
  let level = amplitude.getLevel(); 
  // 放大縮放範圍，讓視覺效果更明顯 (例如映射到 0.2 到 4 倍)
  let sizeFactor = map(level, 0, 1, 0.5, 5);

  for (let shape of shapes) {
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈
    if (shape.x < 0 || shape.x > windowWidth) shape.dx *= -1;
    if (shape.y < 0 || shape.y > windowHeight) shape.dy *= -1;

    push();
    translate(shape.x, shape.y);
    scale(sizeFactor); 
    
    fill(shape.color);
    noStroke(); // 拿掉外框通常看起來更現代

    beginShape();
    for (let p of shape.points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    pop();
  }

  // 提示文字
  fill(0);
  noStroke();
  textAlign(CENTER);
  text("點擊畫面開始/暫停音樂", width / 2, height - 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // 使用 userStartAudio() 確保瀏覽器音訊權限
  userStartAudio();
  
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();
  }
}
