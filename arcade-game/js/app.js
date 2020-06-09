// Enemies our player must avoid
var allEnemies = [], allDrewno = [], drewnoCoords = [[3*83, 101], [3*83, 202], [3*83, 303],    [3*83, 505], [3*83, 606], [3*83, 707],
[2*83, 101], [2*83, 202],    [2*83, 505], [2*83, 606],
[1*83, 101], [1*83, 303], [1*83, 505], [1*83, 707], [1*83, 909]];
var wins=0, loses=0, hs=0;
var rows=12, columns=10;
var lastwin=0, lastlose=0;
var startTime=0, wlratio=0;

var wstatus = function() {
    if (wins>hs)
        hs=wins;
    if (wins>=100)
        return " ALIEN";
    if (wins>=50)
        return " CHAMPION";
    if (wins>=25)
        return " MASTER";
    if (wins>=20)
        return " EXPERT";
    if (wins>=10)
        return " EXCELLENT";
    if (wins>=5)
        return " GOOD";
    if (wins>2)
        return " NICE";
    if (wins>0)
        return "  OK";
    return " BAD";
};
//game-ending function
var finish = function() {
    ctx.font = "25pt impact";
    ctx.fillStyle = "white";
    if (wins===5)
    {
        wins--;
        ctx.fillText("WINS: "+wins, 0, 35);
        wins++;
    }
    else
    {
        loses--;
        ctx.fillText("LOSES: "+loses-1, 200, 35);
        loses++;
    }
    ctx.fillStyle = "black";
    ctx.fillText("WINS: "+wins, 0, 35);
    ctx.fillText("LOSES: "+loses, 200, 35);
    ctx.fillStyle = "red";
    if (new Date().getTime()-lastwin<3000)
            ctx.fillText("WYGRAŁEŚ", 750, 35);
    if (new Date().getTime()-lastlose<3000)
        ctx.fillText("PRZEGRAŁEŚ", 750, 35);

    var napis;
    if (wins>=5)
        napis="YOU WON";
    else
        napis="YOU LOST";
    ctx.fillStyle = "red";
    ctx.lineWidth = 3;
    ctx.font = "50pt impact";
    ctx.textAlign = "center";
    ctx.fillText(napis, 505, 6*83);
    ctx.strokeText(napis, 505, 6*83);
};
//function teleporting player to the start point
var tpa = function() {
    player.x=columns/2*101;
    player.y=(rows-2)*83+50;
    startTime=new Date().getTime();
    wlratio=wins-loses;
};

var win = function() {
    wins++;
    tpa();
    lastwin = new Date().getTime();
    lastlose=0;
};

var lose = function() {
    loses++;
    tpa();
    lastlose = new Date().getTime();
    lastwin=0;
};
//function generating random numbers
var losujy = function() {
    return Math.floor(Math.random() * 6 + 3) * 83 + 50;
};

var losujspeed = function() {
    return Math.floor(Math.random() * 5 + 1) * 50 + 150 + 40 * wlratio;
};
//function counting time left
var getTimeLeft = function() {
    var timeL = new Date().getTime();
    timeL=startTime - timeL;
    timeL/=1000;
    timeL+=15-2*wlratio;
    return timeL;
};
//function that makes the character return to the start point and win
var meta = function() {
    if (player.y<50)
    {
        win();
    }
    if (player.y<50+3*83)
    {
        var czy=0;
        for (var drewno in allDrewno)
        {
            if (allDrewno[drewno].y-83 === player.y && allDrewno[drewno].x === player.x)
                czy=1;
        }
        if (czy===0)
        {
            lose();
        }
    }
};

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.przypisz();
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.przypisz = function() {
    this.x=0;
    this.y=losujy();
    this.speed=losujspeed();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x+=this.speed*dt;
    if (this.x>columns*101)
    {
        this.przypisz();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x=columns/2*101;
    this.y=(rows-2)*83+50;
    this.sprite = 'images/char-boy.png';
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
Player.prototype.update = function(last, nowy) {
    var change=0;
    if (this.y<3*83+50)
    {
        if (Math.floor(last/500)<Math.floor(nowy/500))
        change=1;
        if (this.y === 1*83+50)
        {
            this.x-=101*change;
            if (this.x<0)
                this.x+=101;
        }
        else
        {
            this.x+=101*change;
            if (this.x>=1010)
                this.x-=101;
        }
    }
};

Player.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(klawisz) {
    if (klawisz=='down' && this.y<(rows-2)*83)
        this.y+=83;
    if (klawisz=='right' && this.x<(columns-1)*101)
        this.x+=101;
    if (klawisz=='up' && this.y>0)
        this.y-=83;
    if (klawisz=='left' && this.x>0)
        this.x-=101;
};
//This objects will allow the character to cross the water
var Wood = function(x, y) {
    this.x=y;
    this.y=x+50;
    this.sprite = 'images/drewno.png';
};

Wood.prototype.update = function(last, nowy) {
    var change=0;
    if (Math.floor(last/500)<Math.floor(nowy/500))
        change=1;
    if (this.y === 2*83+50)
    {
        this.x-=101*change;
        if (this.x<0)
            this.x=909;
    }
    else
    {
        this.x+=101*change;
        if (this.x>=1010)
            this.x=0;
    }
};

Wood.prototype.render = function() {
    //console.log(Resources.load(this.sprite));
    Resources.load(this.sprite);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});



var player = new Player();
tpa();
for (var i=0; i<8; i++)
{
    allEnemies.push(new Enemy());
}
for (var i=0; i<15; i++)
{
    allDrewno.push(new Wood(drewnoCoords[i][0], drewnoCoords[i][1]));
}

var checkCollisions = function() {
    for (var i=0; i<allEnemies.length; i++)
    {
        var onen = allEnemies[i];
        if (player.y === onen.y && player.x - onen.x > -50 && player.x - onen.x < 50)
            lose();
    }
};
//console.log(Resources.get(player.sprite));