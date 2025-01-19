//Joc funcional

// --- Variables generals ---
let screen = "start"; // Pot ser "start", "countdown", "game", "gameOver", "levelComplete", "pause", "ranking".
let countdown = 3;
let countdownTimer = null;
let level = 1;
let points = 0;
let lives = 3;
let timer = 30; // Temps per nivell en segons
let timerInterval = null;
let gameSpeed = 2; // Velocitat inicial dels ingredients
let ingredients = [];
let player = null;
let totalPoints = 0;

// Configuració dels punts per nivell
const POINTS_PER_LEVEL = 1;
const MAX_LEVEL = 5;

// Estat dels missatges i botons
let showLoseLifeMessage = false; // Indica si cal mostrar el missatge
let loseLifeButtonActive = false; // Indica si el botó està actiu
let pauseButtonActive = false;
let sortirButtonActive = false;

// Recursos visuals i sonors
let backgroundImages = [];
let ingredientImages = {
  good: [],
  bad: [],
  specialGood: [],
  specialBad: [],
};
let playerImage = null;
let sounds = {};

// --- Configuració inicial ---
function preload() {
  // Assegurar inicialització d'objectes i arrays
  backgroundImages = [];
  ingredientImages = {
    good: [],
    bad: [],
    specialGood: [],
    specialBad: [],
  };

  // Carregar imatges de fons
  backgroundImages.push(loadImage("assets/fons_joc1.png"));
    backgroundImages.push(loadImage("assets/fons_joc2.png"));
    backgroundImages.push(loadImage("assets/fons_joc3.png"));
    backgroundImages.push(loadImage("assets/fons_joc4.png"));
  backgroundImages.push(loadImage("assets/fons_comptador.png"));
  backgroundImages.push(loadImage("assets/fons_gameover.png"));
  backgroundImages.push(loadImage("assets/fons_resultats.png"));
  backgroundImages.push(loadImage("assets/fonsPortada.png"));
backgroundImages.push(loadImage("assets/fons_pause.png"));
  // Carregar imatges dels ingredients
  ingredientImages.good.push(loadImage("assets/bo1.png"));
  ingredientImages.good.push(loadImage("assets/bo2.png"));
  ingredientImages.good.push(loadImage("assets/bo3.png"));
  ingredientImages.good.push(loadImage("assets/bo4.png"));
  ingredientImages.good.push(loadImage("assets/bo5.png"));

  ingredientImages.bad.push(loadImage("assets/dolent1.png"));
  ingredientImages.bad.push(loadImage("assets/dolent2.png"));
  ingredientImages.bad.push(loadImage("assets/dolent3.png"));
  ingredientImages.bad.push(loadImage("assets/dolent4.png"));
  ingredientImages.bad.push(loadImage("assets/dolent5.png"));

  ingredientImages.specialGood.push(loadImage("assets/boEspecial1.png"));
  ingredientImages.specialGood.push(loadImage("assets/boEspecial2.png"));
  ingredientImages.specialGood.push(loadImage("assets/boEspecial3.png"));
  ingredientImages.specialGood.push(loadImage("assets/boEspecial4.png"));
  ingredientImages.specialGood.push(loadImage("assets/boEspecial5.png"));

  ingredientImages.specialBad.push(loadImage("assets/dolentEspecial1.png"));
  ingredientImages.specialBad.push(loadImage("assets/dolentEspecial2.png"));
  ingredientImages.specialBad.push(loadImage("assets/dolentEspecial3.png"));
  ingredientImages.specialBad.push(loadImage("assets/dolentEspecial4.png"));
  ingredientImages.specialBad.push(loadImage("assets/dolentEspecial5.png"));
  ingredientImages.specialBad.push(loadImage("assets/dolentEspecial6.png"));

  // Carregar imatge del personatge
  playerImage = loadImage("assets/personatge.png");

  // Carregar sons
  sounds = {
    background: loadSound("assets/musica.mp3"),
    good: loadSound("assets/so_colisio_bo.mp3"),
    bad: loadSound("assets/so_colisio_dolent.mp3"),
    specialGood: loadSound("assets/so_colisio_boEspecial.mp3"),
    specialBad: loadSound("assets/so_colisio_dolentEspecial.mp3"),
  };
}

function setup() {
  createCanvas(800, 600);
  player = new Player();
  sounds.background.loop(); // Inicia la música de fons
  screen = "start"; // Inicialitzar pantalla "start"
}

// --- Bucle principal ---
function draw() {
  switch (screen) {
    case "start":
      drawStartScreen();
      break;
    case "game":
      drawGameScreen();
      break;
    case "gameOver":
      drawGameOverScreen();
      break;
    case "levelComplete":
      drawLevelCompleteScreen();
      break;
    case "pause":
      drawPauseScreen();
      break;
    case "ranking":
      drawRankingScreen();
      break;
  }
}

// --- Pantalles ---
function drawStartScreen() {
  // Fons amb imatge de portada
  background(backgroundImages[7]);

  // Text central
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  text(
    "Ayuda a Jorge a preparar la medicina de la abuela",
    width / 2,
    height / 2 - 50
  );

  textSize(25);
  fill(255);
  text(
    "Pulsa el botón para empezar",
    width / 2,
    height / 2 + 20
  );

  // Dibuixar el botó amb text personalitzat i acció
  drawButton("Empezar", width / 2 - 50, height / 2 + 80, 100, 40, () => {
    screen = "game"; // Canviar a la pantalla de joc
     // resetGame();
  });

  // Reiniciar punts totals
  totalPoints = 0;
}


function drawGameScreen() {
  // Fons segons el nivell
  switch (level) {
    case 1:
      background(backgroundImages[0]); // Fons per al nivell 1
      break;
    case 2:
      background(backgroundImages[1]); // Fons per al nivell 2
      break;
    case 3:
      background(backgroundImages[2]); // Fons per al nivell 3
      break;
    case 4:
      background(backgroundImages[3]); // Fons per al nivell 4
      break;
    case 5:
      background(backgroundImages[4]); // Fons per al nivell 5
      break;
    // Afegir més casos si tens més nivells
 
  }

  // Mostrar informació del joc (punts, vides, temps restant)
  drawGameInfo();

  // Mostrar missatge de "Perds una vida" si cal
  if (showLoseLifeMessage) {
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(24);
    text(
      "No has logrado los puntos necesarios, pierdes una vida",
      width / 2,
      height / 2 - 60
    );

    // Dibuixar botó de continuar
    drawButton("Continuar", width / 2 - 75, height / 2, 150, 40, () => {
      resetLevel(); // Reinicia el nivell
      showLoseLifeMessage = false; // Amaga el missatge
      screen = "game"; // Torna al joc
    });

    loseLifeButtonActive = true; // Activa el botó
    return; // No continuar dibuixant el joc mentre es mostra el missatge
  }

  // Dibuixar i moure el jugador
  player.show();
  player.move();

  // Actualitzar i mostrar ingredients
  updateIngredients();

  // Actualitzar el temporitzador
  if (frameCount % 60 === 0 && timer > 0) {
    timer--; // Resta un segon cada 60 frames
  }

  // Comprovar si el temps s'ha acabat
  if (timer <= 0) {
    if (points >= POINTS_PER_LEVEL) {
      screen = "levelComplete"; // Si té prou punts, nivell completat
    } else {
      lives--; // Perds una vida
      if (lives > 0) {
        // Mostra el missatge de pèrdua de vida
        showLoseLifeMessage = true;
        loseLifeButtonActive = false; // El botó encara no està actiu
      } else {
        // Si no hi ha més vides, canvia a Game Over
        screen = "gameOver";
      }
    }
  }
}



function resetLevel() {
  timer = 30; // Reinicia el temporitzador
  points = 0; // Reinicia els punts del nivell
  ingredients = []; // Reinicia la llista
}

function drawGameOverScreen() {
  // Fons de la pantalla de Game Over
  background(backgroundImages[5]); // Fons de Game Over (canvia segons el teu joc)

  // Text de Game Over
  textAlign(CENTER, CENTER);
  textSize(100);
  fill(250);
  text("Game Over", width / 2, height / 2 - 50);

  // Instruccions o missatge addicional
  fill(250);
  textSize(16);
  text("Pulsa el boton para volber al principio", 400, 420);

  // Dibuixar el botó utilitzant la funció drawButton
  drawButton("Continuar", 300, 450, 200, 50, () => {
    resetGame(); // Reinicia el joc completament
    screen = "start"; // Torna a la pantalla d'inici
  });
}

function drawLevelCompleteScreen() {
  // Fons de la pantalla
  background(backgroundImages[4]);

  // Mostrar missatge de nivell completat
  textAlign(CENTER, CENTER);
  textSize(50);
  fill(250);
  text("Nivel Completado!", width / 2, height / 2 - 100);
textSize(32);
  fill(0);
  // Mostrar punts aconseguits
  textSize(24);
  text(`Puntos logrados: ${points}`, width / 2, height / 2 - 50);

  // Afegir els punts del nivell a totalPoints
  totalPoints += points; // ACTUALITZACIÓ

  // Si el següent nivell és 5, mostrar text de fi del joc
  if (level === 4) {
    text("Fin del juego!", width / 2, height / 2);
    textSize(20);
    text("Ver los puntos totales", width / 2, height / 2 + 50);

    // Dibuixar el botó "Veure Ranking"
    rectMode(CENTER);
    fill(50); // Color del botó
    rect(width / 2, height / 2 + 100, 200, 50, 10); // Coordenades i mida del botó
    fill(255); // Color del text
    textSize(20);
    text("Continuar", width / 2, height / 2 + 100);

    // Detectar clic dins del botó per veure el Ranking
    if (
      mouseIsPressed &&
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 75 &&
      mouseY < height / 2 + 125
    ) {
      screen = "ranking"; // Passar a la pantalla de Ranking
    
    }
  } else {
    // Mostrar el següent nivell
    text(`Siguiente nivel: ${level + 1}`, width / 2, height / 2);

    // Dibuixar el botó "Començar"
    rectMode(CENTER);
    fill(50); // Color del botó
    rect(width / 2, height / 2 + 100, 200, 50, 10); // Coordenades i mida del botó
    fill(255); // Color del text
    textSize(20);
    text("Empezar", width / 2, height / 2 + 100);

    // Detectar clic dins del botó
    if (
      mouseIsPressed &&
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 75 &&
      mouseY < height / 2 + 125
    ) {
      level++; // Incrementar el nivell
      timer = 30; // Reiniciar el temporitzador per al següent nivell
      points = 0; // Reiniciar els punts
      screen = "game"; // Passar a la pantalla de joc
    }
  }
}

function drawGameInfo() {
  // Fons del marcador
  fill(30, 30, 30, 220);
  noStroke();
  rect(0, 0, width, 70); // Fons del marcador

  // Configuració de separació i estil
  const margin = 10;
  const spacing = 100; // Reduït per fer lloc als botons
  const boxWidth = 80; // Amplada més petita
  const boxHeight = 40; // Alçada més petita

  // Configurar textSize i textAlign explícitament cada vegada
  textSize(14);
  textAlign(CENTER, CENTER);

  // Dibuixa cada element amb un quadrat de fons
  drawInfoBox(`Puntos: ${points}`, margin, 15, boxWidth, boxHeight);
  drawInfoBox(`Vidas: ${lives}`, margin + spacing, 15, boxWidth, boxHeight);
  drawInfoBox(`Tiempo: ${timer}s`, margin + spacing * 2, 15, boxWidth, boxHeight);
  drawInfoBox(`Nivel: ${level}`, margin + spacing * 3, 15, boxWidth, boxHeight);
  drawInfoBox(`Total: ${totalPoints}`, margin + spacing * 4, 15, boxWidth, boxHeight);

  // Dibuixar botons rodons
  infoButton("⏸", width - 140, 35, 20, () => {
    screen = "pause";
    // Lògica per pausar el joc
  });

  infoButton("⏏", width - 70, 35, 20, () => {
    screen = "start";
    // Lògica per sortir del joc
  });
}


function drawInfoBox(textContent, x, y, boxWidth, boxHeight) {
  // Configuració explícita per garantir consistència
  rectMode(CORNER); // Garantir que els rectangles es dibuixin des de la cantonada superior esquerra
  textSize(14); // Mida fixa del text
  textAlign(CENTER, CENTER); // Text centrat dins del rectangle

  fill(255); // Color blanc per al fons del quadrat
  noStroke();
  rect(x, y, boxWidth, boxHeight, 8); // Dibuixa el quadrat amb cantonades arrodonides

  fill(0); // Text negre
  text(textContent, x + boxWidth / 2, y + boxHeight / 2); // Text centrat dins del quadrat
}

function infoButton(buttonText, centerX, centerY, radius, onClick) {
  // Detectar si el ratolí està sobre el botó circular
  let distance = dist(mouseX, mouseY, centerX, centerY);
  let isHovering = distance < radius;

  // Dibuixar el botó circular
  noStroke();

  if (mouseIsPressed && isHovering) {
    // Estat quan el botó és clicat
    fill(200); // Color gris fosc
    ellipse(centerX, centerY + 3, radius * 2); // Ombra desplaçada més marcada
  } else if (isHovering) {
    // Estat quan el ratolí està sobre el botó
    fill(220); // Color gris clar
    ellipse(centerX, centerY + 2, radius * 2); // Ombra desplaçada
  } else {
    // Estat normal
    fill(240); // Color blanc
    ellipse(centerX, centerY + 5, radius * 2); // Ombra suau
  }

  // Ombra gris
  fill(180); // Ombra subtil
  ellipse(centerX, centerY + 5, radius * 2); // Ombra sota el botó

  // Cercle superior del botó
  fill(255); // Color blanc
  ellipse(centerX, centerY, radius * 2); // Cercle principal

  // Text dins del botó
  fill(0); // Text negre
  textAlign(CENTER, CENTER);
  textSize(16);
  text(buttonText, centerX, centerY);

  // Acció quan es fa clic
  if (mouseIsPressed && isHovering) {
    onClick();
  }
}


function resetGame() {
  lives = 3; // Reinicia les vides a 3
  level = 1; // Reinicia el nivell a 1
  points = 0; // Reinicia els punts a 0
  timer = 30; // Reinicia el temporitzador (o el valor
  totalPoints = 0;
  screen = "start"; // Canvia a la pantalla inicial
}

function drawPauseScreen() {
   background(backgroundImages[8]);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Pausa", width / 2, height / 2);
  // Dibuixar el botó utilitzant la funció drawButton
  drawButton("Continuar", width / 2 - 100, height / 2 + 75, 200, 50, () => {
    screen = "game"; // Torna a la pantalla d'inici
  });
}

function drawRankingScreen() {
 background(backgroundImages[2]);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Has completado el Juego!", width / 2, height / 2 - 50);

  // Mostrar la suma total dels punts
  textSize(24);
  text(`Punts totals: ${totalPoints}`, width / 2, height / 2 + 50);

  // Botó per tornar a la pantalla "Start"
  rectMode(CENTER);
  fill(50); // Color del botó
  rect(width / 2, height / 2 + 150, 200, 50, 10); // Coordenades i mida del botó
  fill(255); // Color del text
  textSize(20);
  text("Volver al inicio", width / 2, height / 2 + 150);

  // Detectar clic dins del botó per tornar a la pantalla d'inici
  if (
    mouseIsPressed &&
    mouseX > width / 2 - 100 &&
    mouseX < width / 2 + 100 &&
    mouseY > height / 2 + 125 &&
    mouseY < height / 2 + 175
  ) {
    screen = "start"; // Passar a la pantalla d'inici
    level = 1; // Reiniciar el nivell
    totalPoints = 0; // Reiniciar els punts totals
    points = 0; // Reiniciar els punts del nivell actual
    timer = 30;
  }
}

// --- Classe Player ---
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 90;
    this.width = 80;
    this.height = 100;
    this.speed = 5;
  }

  show() {
    image(playerImage, this.x, this.y, this.width, this.height);
  }

  move() {
    if (keyIsDown(LEFT_ARROW) || mouseX < this.x) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) || mouseX > this.x) {
      this.x += this.speed;
    }
    this.x = constrain(this.x, 0, width - this.width); // Manté el jugador dins de la pantalla
  }
}

// --- Funció per iniciar el joc ---
function startGame() {
  level = 1;
  points = 0;
  lives = 3;
  timer = 30;
  ingredients = [];
  player = new Player();
  gameSpeed = 2; // Inicialitza la velocitat dels ingredients
  screen = "game";
  sounds.background.loop(); // Reprodueix la música de fons
}

function drawButton(buttonText, x, y, width, height, onClick) {
  // Configuració explícita per garantir consistència
  rectMode(CORNER); // Els rectangles es dibuixen des de la cantonada superior esquerra
  textAlign(CENTER, CENTER); // El text es centra dins del rectangle
  textSize(18); // Mida consistent del text

  // Detecta si el ratolí està sobre el botó
  let isHovering =
    mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height;

  // Dibuixar el botó
  noStroke();
  fill(isHovering ? 50 : 0, isHovering ? 200 : 180, 100); // Color segons l'estat
  rect(x, y, width, height, 10); // Rectangle del botó

  // Ombra al passar el ratolí
  if (isHovering) {
    fill(0, 150, 70, 100); // Ombra translúcida
    rect(x, y + 5, width, height, 10); // Ombra lleugerament desplaçada
  }

  // Text del botó
  fill(255); // Text blanc
  text(buttonText, x + width / 2, y + height / 2); // Centrat al botó

  // Acció quan es fa clic
  if (mouseIsPressed && isHovering) {
    onClick();
  }
}


function updateIngredients() {
  // Classe Ingredient dins de la funció updateIngredients
  class Ingredient {
    constructor(type, special = false) {
      this.type = type; // Tipus: bo, dolent, bo especial, dolent especial
      this.special = special; // Si és especial o no
      this.x = random(50, width - 50);
      this.y = 70; // Inici a la part superior de la pantalla
      this.size = 40;
      this.speed = gameSpeed;
      this.image = this.getImage();
    }

    // Selecciona la imatge en funció del tipus i si és especial
    getImage() {
      if (this.special) {
        return this.type === "good"
          ? random(ingredientImages.specialGood)
          : random(ingredientImages.specialBad);
      } else {
        return this.type === "good"
          ? random(ingredientImages.good)
          : random(ingredientImages.bad);
      }
    }

    update() {
      this.y += this.speed; // Moviment cap avall
      if (this.y > height) {
        this.y = 70; // Reiniciar la posició quan arriba a la part inferior
        this.x = random(50, width - 50); // Posició aleatòria
      }
    }

    show() {
      image(this.image, this.x, this.y, this.size, this.size);
    }

    // Comprova si l'ingredient ha col·lisionat amb el jugador
    checkCollision(player) {
      return (
        this.x < player.x + player.width &&
        this.x + this.size > player.x &&
        this.y < player.y + player.height &&
        this.y + this.size > player.y
      );
    }
  }

  // Generar nous ingredients en funció del nivell i la velocitat
  if (frameCount % 60 === 0) {
    // Aproximadament un nou ingredient cada segon
    let type = random(["good", "bad"]);
    let special = random() < 0.1; // 10% de probabilitat que sigui especial
    ingredients.push(new Ingredient(type, special));
  }

  // Actualitzar i mostrar els ingredients
  for (let i = ingredients.length - 1; i >= 0; i--) {
    let ingredient = ingredients[i];
    ingredient.update();
    ingredient.show();

    // Comprovar si hi ha col·lisió amb el jugador
    if (ingredient.checkCollision(player)) {
      // Gestionar puntuació segons el tipus d'ingredient
      if (ingredient.special) {
        if (ingredient.type === "good") {
          points += 10; // Punts per ingredient bo especial
          sounds.specialGood.play();
        } else {
          points -= 10; // Penalització per ingredient dolent especial
          sounds.specialBad.play();
        }
      } else {
        if (ingredient.type === "good") {
          points += 1; // Punts per ingredient bo normal
          sounds.good.play();
        } else {
          points -= 1; // Penalització per ingredient dolent normal
          sounds.bad.play();
        }
      }

      // Eliminem l'ingredient de la pantalla després de la col·lisió
      ingredients.splice(i, 1);
    }
  }
}
