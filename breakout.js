window.onload=function()
{

var canvas=document.getElementById("game");

if(!canvas)
{
    alert("L'élement canvas n'a pas été récupéré !!");
}
var context=canvas.getContext('2d');

if(!context)
{
    alert("Le contexte n'est pas recupéré !!");
}

var rayonBall=15;
var x=canvas.width/2;
var y=canvas.height-30;
var dx=3;
var dy=-3;
var pongH=25;
var pongW=100;
var pongX=(canvas.width-pongW)/2;
var rigthKey=false,leftKey=false;
var brick_w=75, brick_h=20,brickPadding=20, brickOffsetTop=30,brickOffsetLeft=30;
var brickRow=5,brickCol=12;

var scoreArea=document.getElementById("result");
var liveArea=document.getElementById("life");

var lifeTime=5;
var score=0;
var bricks=[];

for(let i=0;i<brickCol;i++)
{
    for( let j=0;j<brickRow;j++)
    {
        bricks.push({
            x:(i*(brick_w+brickPadding))+brickOffsetLeft,
            y:(j*(brick_h+brickPadding))+brickOffsetTop,
            status:1
        });
    }

}

//DESSINONS LA BOULE
function drawBall()
{
    context.beginPath();
    context.arc(x,y,rayonBall,0,Math.PI*2);
    context.fillStyle="rgb(255,0,0)";
    context.fill();
    context.closePath();
}

//DESSIN DE LA BARRE DE TYPAGE
function drawPong()
{
    context.beginPath();
    context.rect(pongX,canvas.height-pongH,pongW,pongH);
    context.fillStyle="rgb(0,0,255)";
    context.fill();
    context.closePath();
}

//DESSIN DES BRIQUES
function drawBricks()
{
    bricks.forEach(function(brick)
{
    if(!brick.status) return;

    context.beginPath();
    context.rect(brick.x,brick.y,brick_w,brick_h);
    context.fillStyle="1B5E20";
    context.fill();
    context.closePath();
});
}

/*AFIN DE SAVOIR QUAND LA BALLE VA CASSER UNE BRIQUE,
DEFINISSONS UNE METHODE DETECTION DE COLISION
*/ 
let isChange=0;
function collisionDetection()
{
   var chutes=[];
  

    bricks.forEach(function(b)
    {
        if(!b.status) return; //Si le drique avait été cassé, on ne fait rien, sinon, on berifie s'il ya collision

        /* verifions s'il y a collision;
        Si oui, inversion du sens de la balle sur l'axe des ordonnées
        c'est à dire du haut vers le bas et marquans cette brick comme déjà cassé*/

        var inBrickColumn=x>=b.x && x<=b.x+brick_w;
        var inBickRow=y>=b.y && y<=b.y+brick_h;

        if(inBrickColumn && inBickRow)
        {
            score++;
            dy=-dy;
            b.status=0;
            }
       
      /* else if(b.y+rayonBall>canvas.height)
        {
            lifeTime--;     
        }*/
                         
    });
     

}



function draw()
{
    context.clearRect(0,0,canvas.width,canvas.height);
    drawBricks();
    drawBall();
    drawPong();
    collisionDetection();
   
    if(hitSideWall())
    {
        dx=-dx;
    }

    if(hitSideTop() || hitPong())
    {
        dy=-dy;
    }
   // lifeTime-=isChange;
    //SI L'INSTANCE DU JEU EST FINI, LE JEU SE RECHARGE
    /*if(gameOver())
    {
        //document.location.reload();
        lifeTime--;
        
    }*/


    function hitBottom()
    {
       return (y+dy>=canvas.height-rayonBall)
    }

    if(gameOver())
    { 
        dy*=-1;
        lifeTime--;
       // drawBall();
           
        
    //alert("GAME OVER !! LiveTime : "+lifeTime+"\nScore : "+score)
        //document.location.reload();
    }    


    //PERTE AFFICHAGE DU MESSAGE
    if(lifeTime==0)
    {
        document.location.reload();
        alert("GAME OVER ");
       
    }


    var RIGHT_DIR=39,LEFT_DIR=37;

    function hitPong()
    {
        return hitBottom() && ballOverPong();
    }

    function ballOverPong()
    {
        return (x>pongX && x<pongX+pongW);
    }

    function gameOver()
    {
        return hitBottom() && !ballOverPong()
    }

    //DEPASSEMENT DU BORD

    function hitSideWall()
    {
        return (x+dx>canvas.width-rayonBall || x+dx<rayonBall);
    }

    function hitSideTop()
    {
        return y+dy<rayonBall;
    }

    function xOutOfBounds()
    {
        return (x+dx>canvas.width-rayonBall || x+dx <rayonBall);
    }

    function rightKeyPressed(e)
    {
            return e.keyCode==RIGHT_DIR;
    }

    function leftKeyPressed(e)
    {
            return e.keyCode==LEFT_DIR;
    }

    //FONCTION PERMETTANT DE SAVOIR SI L'UTILISATEUR A APPUYE SUR UNE TOUCHE
    function keyDown(e)
    {
        rigthKey=rightKeyPressed(e);
        leftKey=leftKeyPressed(e);
    }

    function keyUp(e)
    {
        rigthKey=rightKeyPressed(e) ? false : rigthKey;
        leftKey=leftKeyPressed(e) ?  false : leftKey;
    }


    //AJOUTONS UN ECOUTEUR D'EVENEMENT AUX APPUIS SUR CLAVIER    
    document.addEventListener("keydown",keyDown,false);
    document.addEventListener("keyup",keyUp,false);

  

    /*MAINTENANT, DEPLACONS LE PONG (LA BOULE) VERS LA GAUCHE SI LA TOUCHE DE GAUCHE
    SINON, VERS LA DROITE*/

    var maxX=canvas.width-pongW, 
        minX=0, 
        pongDelta=rigthKey ? 7: leftKey ? -7 : 0;
    
    pongX=pongX+pongDelta;
    pongX=Math.min(pongX,maxX);
    pongX=Math.max(pongX,minX);

    x+=dx;
    y+=dy;

    if(score==brickCol*brickRow)
    {
        alert("YOU OWN ! CONGRATULATION");
    }
   
scoreArea.innerHTML="<h3>Score : "+score+"</h3>  <h3>Chance Restant : "+lifeTime+" </h3>";
liveArea.innerHTML="Live : "+lifeTime;
}
 setInterval(draw,10);

}

