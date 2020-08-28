class Tile{
    constructor(color, x = 0, y = 0){
        this.color = color;
        this.x = x;
        this.y = y;
        this.glow = false;
        this.sign = false;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y- radius*2, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        if(this.sign)
            ctx.fillStyle = "gray";

        //glowing effect
        if(this.glow)
        {
            ctx.shadowBlur = 50;
            ctx.shadowColor = "gray";
        }
        else //stop glowing effect
        {
            ctx.shadowBlur = 0;
            ctx.shadowColor = "black";
        }
        
        ctx.fill();
        ctx.closePath();
    }
}
class Triangle{
    constructor(tiles = [], color="black", inverted=false, x = 0, y = 0){
        this.color = color;
        this.x = x;
        this.y = y;
        this.inverted = inverted;
        this.glow = false;
        this.sign = false;
        
        this.frame_size = 20;
        this.width = ctx.canvas.width;
        this.width = this.width/ 15.12903225806452;
        this.height = 200;
        this.tiles = tiles;
        this.length = tiles.length;
        this.cube_number = -99;
    }
    draw(){
        let height_parameter = this.height * Math.cos(Math.PI / 6);
        ctx.shadowBlur = 0;
        ctx.shadowColor = "black";
        //glowing effect
        if(this.glow)
        {
            ctx.shadowBlur = 50;
            ctx.shadowColor = "blue";
        }
        
        if (this.inverted) {
            height_parameter *= -1;
            this.y = this.frame_size+ 5;
        }
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x+this.width, this.y);
        ctx.lineTo(this.x+this.width/2, this.y - height_parameter);
        ctx.closePath();

        // the outline
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#666666';
        ctx.stroke();

        // the fill color
        ctx.fillStyle = this.sign ? '#666666':this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "black";
    }
        /* A utility function to calculate area of triangle formed by (x1, y1),  
    (x2, y2) and (x3, y3) */ 
    area(x1, y1, x2, y2, x3, y3) 
    { 
        return Math.floor( Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0)); 
    } 
    
    /* A function to check whether point P(x, y) lies inside the triangle formed  
    by A(x1, y1), B(x2, y2) and C(x3, y3) */ 
    isInside(x, y) 
    {    
        let height_parameter = this.height;

        if (this.inverted) {
            height_parameter *= -1;
            let ty = this.frame_size+ 5;
        }
        
        let x1 = this.x, x3 = this.x+this.width,x2 = this.x+this.width/2;
        let y1 = this.y, y3 = this.y, y2 = this.y - height_parameter;
        /* Calculate area of triangle ABC */
        
        let A = this.area(x1, y1, x2, y2, x3, y3); 
        
        /* Calculate area of triangle PBC */   
        let A1 = this.area(x, y, x2, y2, x3, y3); 
        
        /* Calculate area of triangle PAC */   
        let A2 = this.area(x1, y1, x, y, x3, y3); 
        
        /* Calculate area of triangle PAB */    
        let A3 = this.area(x1, y1, x2, y2, x, y); 

        /* Check if sum of A1, A2 and A3 is same as A */ 
        return ((A + 3 >= A1 + A2 + A3 && A <= A1 + A2 + A3) || (A  <= A1 + A2 + A3 + 3 && A >= A1 + A2 + A3)); 
    } 
}
class Cube{
    constructor(state, seperate_x=0){
        this.state = state;
        this.cubeX = ctx.canvas.width/4 + seperate_x; // for the second cube
        this.cubeY = ctx.canvas.height/2;
        this.cueb_size = 40;
        this.fill_color = "white";
    }
    stageOne(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size/2, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);
        
        ctx.fill();
        ctx.closePath();
    }
    stageTwo(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);
        
        ctx.fill();
        ctx.closePath();
    }
    stageThree(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size/2, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);
   
        ctx.fill();
        ctx.closePath();
    }
    stageFour(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);

        ctx.fill();
        ctx.closePath();
    }
    stageFive(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);
        

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size/2, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);

        ctx.fill();
        ctx.closePath();
    }
    stageSix(){
        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size*0.8, 2, 0, 2 * Math.PI, false);
        

        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.cubeX + this.cueb_size*0.2, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);
        ctx.arc(this.cubeX + this.cueb_size*0.8, this.cubeY + this.cueb_size/2, 2, 0, 2 * Math.PI, false);

        ctx.fill();
        ctx.closePath();
    }
    shuffle(){
        this.state =Math.floor(Math.random() * 6) + 1;
        this.fill_color = "white";
    }
    dark_mode(){
        this.fill_color = "grey";
        this.draw();
    }
    draw(){
        ctx.fillStyle = this.fill_color;
        ctx.fillRect(this.cubeX, this.cubeY, this.cueb_size, this.cueb_size);
        ctx.strokeStyle = "black";
        ctx.lineWidth   = 2;
        ctx.strokeRect(this.cubeX, this.cubeY, this.cueb_size, this.cueb_size);
        ctx.fillStyle = "black";
        switch (this.state) {
            case 1:
                this.stageOne();
                break;
            case 2:
                this.stageTwo();
                break;
            case 3:
                this.stageThree();
                break;
            case 4:
                this.stageFour();
                break;
            case 5:
                this.stageFive();
                break;
            case 6:
                this.stageSix();
                break;
        
            default:
                break;
        }
    }
}
