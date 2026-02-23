// 全域變數定義
let shapes = [];
let song;
let amplitude;
// 外部定義的二維陣列，做為多邊形頂點的基礎座標
let points = [[-3, 5], [5, 6], [8, 0], [4, -5], [-2, -6], [-7, -2]];

function preload() {
  // 1. 在程式開始前預載入音檔
  // 請確保該路徑下有此音樂檔案，或替換為有效的 URL
  song = loadSound('sunset-beach-259654.mp3');
}

function setup() {
  // 2. 初始化畫布與音樂
  createCanvas(windowWidth, windowHeight);
  
  // 初始化振幅分析物件
  amplitude = new p5.Amplitude();
  
  // 設定音樂循環播放
  if (song.isLoaded()) {
    song.loop();
  }

  // 3. 產生 10 個形狀物件並存入陣列
  for (let i = 0; i < 10; i++) {
    // 隨機生成頂點倍率 (10 到 30 之間)
    let randMultiplier = random(10, 30);
    
    // 根據基礎 points 產生變形後的頂點
    let morphedPoints = points.map(p => ({
      x: p[0] * randMultiplier,
      y: p[1] * randMultiplier
    }));

    let shapeObj = {
      x: random(windowWidth),
      y: random(windowHeight),
      dx: random(-3, 3),
      dy: random(-3, 3),
      scaleFactor: random(1, 10), // 初始縮放比例
      color: color(random(255), random(255), random(255)),
      points: morphedPoints
    };
    
    shapes.push(shapeObj);
  }
}

function draw() {
  // 4. 背景與全域樣式設定
  background('#ffcdb2');
  strokeWeight(2);

  // 5. 抓取音量並計算縮放倍率
  let level = amplitude.getLevel(); // 取得 0 到 1 的數值
  // 將 level 從 (0, 1) 映射到 (0.5, 2)
  let sizeFactor = map(level, 0, 1, 0.5, 2);

  // 6. 走訪並繪製每個形狀
  for (let shape of shapes) {
    // 位置更新
    shape.x += shape.dx;
    shape.y += shape.dy;

    // 邊緣反彈檢查
    if (shape.x < 0 || shape.x > windowWidth) {
      shape.dx *= -1;
    }
    if (shape.y < 0 || shape.y > windowHeight) {
      shape.dy *= -1;
    }

    // 設定外觀顏色
    fill(shape.color);
    stroke(shape.color);

    // 座標轉換與繪製
    push();
    translate(shape.x, shape.y);
    scale(sizeFactor); // 依照音樂音量即時縮放

    beginShape();
    for (let p of shape.points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    pop();
  }
}

// 視窗大小改變時自動調整畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 點擊畫布以確保音樂播放（瀏覽器通常禁止自動播放音訊）
function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}