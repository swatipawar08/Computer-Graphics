"use strict";


// function to resize the size of triangle

var shape ="";
var color = "black";
var thick = 2;

let mousedown = false;
let mouseup = false;
let Rotatefn=false;
let isDrawing=false;
let PolyLine = false;
var dragging = false;
let erasemode =false;
let copyflag =false;
let gridflag = false;
var snapshot;
var reader = new FileReader();
var shapearray=[];
let i = 0;
let translateflag= false;
let dragok=false;
var lastMouseX = 0,
    lastMouseY = 0,
    mouseX = 0,
    mouseY = 0;
var dx,dy;

let scale = 1;
let originx = 0;
let originy = 0;
let zoomIntensity = 0.2;
let wheel = 0;
let box;
  

window.onload = function draw()
{
    var canvas = document.getElementById( "canvas" );
    var ctx = canvas.getContext('2d');
    var BB=canvas.getBoundingClientRect();
    var offsetX=BB.left;
    var offsetY=BB.top;

    canvas.height = window.innerHeight -230;
    canvas.width = window.innerWidth -500;
    let visibleWidth = canvas.width;
    let visibleHeight = canvas.height;

    let lastMouseY, lastMouseX;
    let mouseX, mouseY;
    let width=0;
    let height=0;
    let distance;
    let Tdist;
    let numberOfSides=5;
    let size;
    let copy_array = [];
    let restore_array = [];
    let index = -1;
  


   
function startpos(event){
    
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;

    mousedown = true;
    mouseup= false;
    dragging =true;
   
    for(var i=0;i<shapearray.length;i++){
    var s=shapearray[i];             
      //Check mouse positions are inside shape
    if(s.name == "rectangle" || s.name == "square"){
      if(mouseX>s.x && mouseX<s.x+s.w && mouseY>s.y && mouseY<s.y+s.h){
        dragok=true;
        dragging = false;
        s.translateflag=true;
        copy_array.push({x:s.x,y:s.y,w:s.w,h:s.h,r:s.r,name:s.name,c:s.c,t:s.t,s:s,translateflag:false});
        drawboxes();
      }
    }
      else if(s.name=="circle"){
         dx=s.x-mouseX;
         dy=s.y-mouseY;
        if(dx*dx+dy*dy<s.r*s.r){
          dragok=true;
          s.translateflag=true;
          copy_array.push({x:s.x,y:s.y,w:s.w,h:s.h,r:s.r,name:s.name,c:s.c,t:s.t,s:s,translateflag:false});
          drawboxescircle();
          dragging = false;
        }
      }
      else if(s.name=="ellipse"){
        var cex=s.x+s.w;
        var cey=s.y+s.h;
         dx=cex-mouseX;
         dy=cey-mouseY;
        if(dx*dx+dy*dy<s.w*s.h){
          dragok=true;
          s.translateflag=true;
          copy_array.push({x:s.x,y:s.y,w:s.w,h:s.h,r:s.r,name:s.name,c:s.c,t:s.t,s:s,translateflag:false});
          ctx.strokeRect(cex,cey,4,4);
          ctx.stroke();
          dragging = false;
        }
      }
      else if(s.name=="polygon"){
        dx=s.x-mouseX;
        dy=s.y-mouseY;
       if(dx*dx+dy*dy<s.h*s.h){
         dragok=true;
         s.translateflag=true;
         copy_array.push({x:s.x,y:s.y,w:s.w,h:s.h,r:s.r,name:s.name,c:s.c,t:s.t,s:s,translateflag:false});
         ctx.strokeRect(s.x,s.y,4,4);
         ctx.stroke();
         dragging = false;
       }
     }
     else if(s.name=="triangle"){
     if(mouseX>s.x && mouseX<s.x+s.r && mouseY>s.y && mouseY<s.y+s.r){
       dragok=true;
       s.translateflag=true;
       copy_array.push({x:s.x,y:s.y,w:s.w,h:s.h,r:s.r,name:s.name,c:s.c,t:s.t,s:s,translateflag:false});
       drawboxestriangle();
       dragging = false;
       console.log("yes");
     }
    }
      else if (shape == "pencil"){
        isDrawing=true;
      }
      else if(shape == "polyline")
      {
        PolyLine =true;
      }
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
  
 
 shapearray.push({x:0,y:0,w:0,h:0,r:0,name:"Noshape",c:"black",t:3,s:scale,translateflag:false});
};

    
    
function finishedPosition (e) {
    mousedown = false;
    mouseup = true;
    isDrawing=false;
    erasemode = false;
  
    copyflag = false;
    dragok = false;
     
    mouseX = parseInt(e.pageX - this.offsetLeft);
    mouseY = parseInt(e.pageY - this.offsetTop);
  
    //For Undo Operartion
    if(e.type == 'mouseup'){
    restore_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    index += 1;
    }

    dragging = false;

    
  for(var i=0;i<shapearray.length;i++){
    shapearray[i].translateflag=false;
  }
  
  
};
      


function mousemove (e) {
  
    if (isDrawing == true) {
        mouseX = e.clientX - canvas.offsetLeft;
        mouseY = e.clientY - canvas.offsetTop;
        ctx.beginPath();
        ctx.moveTo(lastMouseX, lastMouseY);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = color;
        ctx.lineWidth = thick;
        ctx.stroke();
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        ctx.closePath();
      }
      else if(PolyLine == true){
        
      mouseX = parseInt(e.pageX - this.offsetLeft);
      mouseY = parseInt(e.pageY - this.offsetTop);
        
      shapearray[shapearray.length-2]={x:lastMouseX,y:lastMouseY,w:mouseX,h:mouseY,r:0,name:"polyline",c:color,t:thick,translateflag:false};
      shapearray[shapearray.length-1]={x:lastMouseX,y:lastMouseY,w:mouseX,h:mouseY,r:5,name:"circle",c:color,t:thick,translateflag:false};
      redraw();
        
      }
    else if(erasemode){
     var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            var radius = 10; 
            var fillColor = 'white';
            ctx.fillCircle(x, y, radius, fillColor);
    }
    
    else if (dragging == true && isDrawing==false && dragok == false ) {
  
       mouseX = parseInt(e.pageX - this.offsetLeft);
       mouseY = parseInt(e.pageY - this.offsetTop);
       width = mouseX-lastMouseX;
       height = mouseY-lastMouseY;
      
      if(shape == "rectangle"){
        shapearray[shapearray.length-1]={x:lastMouseX,y:lastMouseY,w:width,h:height,r:0,name:"rectangle",c:color,t:thick,s:scale,translateflag:false};
        }
        else if (shape == "square"){
         shapearray[shapearray.length-1]={x:lastMouseX,y:lastMouseY,w:width,h:width,r:0,name:"square",c:color,t:thick,translateflag:false};
        }
        else if (shape == "circle"){
          distance =  Math.sqrt(Math.pow( lastMouseX- mouseX, 2) + Math.pow(lastMouseY - mouseY, 2));
          shapearray[shapearray.length-1]={x:lastMouseX,y:lastMouseY,w:0,h:0,r:distance,name:"circle",c:color,t:thick,translateflag:false};
         }    
        else if (shape == "line"){
          shapearray[shapearray.length-1]={x:lastMouseX,y:lastMouseY,w:mouseX,h:mouseY,r:0,name:"line",c:color,t:thick,translateflag:false};
         }
         else if (shape == "polygon"){
          size = mouseX - lastMouseX ;
          shapearray[shapearray.length-1]={x:lastMouseX,y:lastMouseY,w:numberOfSides,h:size,r:0,name:"polygon",c:color,t:thick,translateflag:false};
         }
        else if (shape == "triangle"){
          Tdist = mouseX- lastMouseX;
          shapearray[shapearray.length-1]={x:lastMouseX,y:lastMouseY,w:0,h:distance,r:Tdist,name:"triangle",c:color,t:thick,translateflag:false};
        }
        else if (shape == "ellipse"){
          var radiusX = (mouseX - lastMouseX) * 0.5,   /// radius for x based on input
              radiusY = (mouseY - lastMouseY) * 0.5;
          shapearray[shapearray.length-1]={x:lastMouseX,y:lastMouseY,w:radiusX,h:radiusY,r:0,name:"ellipse",c:color,t:thick,translateflag:false};
        }

        redraw();
    }

    else if (dragok==true){

      e.preventDefault();
      e.stopPropagation();
  
      mouseX=parseInt(e.clientX-offsetX);
      mouseY=parseInt(e.clientY-offsetY);
  
      // calculate the mouse change
      var dx=mouseX-lastMouseX;
      var dy=mouseY-lastMouseY;
  
      //update distance in array
      for(var i=0;i<shapearray.length;i++){
        var s=shapearray[i];
        if(s.translateflag){
          s.x+=dx;
          s.y+=dy;
        }
      }
  
      // redraw all shapes with updated positions
      redraw();
      // reset the starting mouse position for the next mousemove
      lastMouseX=mouseX;
      lastMouseY=mouseY;
  
    };
    
      
};

//Drawing Selection boxes for Rectangle & Square
function drawboxes(){
 box = copy_array[copy_array.length-1];
ctx.beginPath(); 
ctx.strokeRect(box.x-2,box.y-4,4,4);
ctx.strokeRect(box.x+box.w*0.5,box.y+box.h*0.5,4,4);
ctx.strokeRect(box.x-2,box.y+box.h,4,4);
ctx.strokeRect(box.x+box.w,box.y-4,4,4);
ctx.strokeRect(box.x+box.w/2,box.y-4,4,4);
ctx.strokeRect(box.x+box.w/2,box.y+box.h,4,4);
ctx.strokeRect(box.x+box.w,box.y+box.h,4,4);
ctx.strokeStyle= "black";
ctx.lineWidth = 1;
ctx.stroke();
}

//Drawing slection boxes for circle 
function drawboxescircle(){
  box = copy_array[copy_array.length-1];
  ctx.beginPath(); 
  ctx.strokeRect(box.x,box.y,4,4);
  ctx.strokeRect(box.x+box.r*0.5,box.y,4,4);
  ctx.strokeRect(box.x-box.r*0.5,box.y,4,4);
  ctx.strokeRect(box.x,box.y+box.r*0.5,4,4);
  ctx.strokeRect(box.x,box.y-box.r*0.5,4,4);
  ctx.strokeStyle= "black";
  ctx.lineWidth = 1;
  ctx.stroke();
  }

  //Drawing slection boxes for triangle 
function drawboxestriangle(){
  box = copy_array[copy_array.length-1];
  ctx.beginPath(); 
  ctx.strokeRect(box.x-2,box.y-4,4,4);
  ctx.strokeRect(box.x+box.r*0.5,box.y+box.r*0.5,4,4);
  ctx.strokeRect(box.x-2,box.y+box.r,4,4);
  ctx.strokeRect(box.x+box.r,box.y-4,4,4);
  ctx.strokeRect(box.x+box.r/2,box.y-4,4,4);
  ctx.strokeRect(box.x+box.r/2,box.y+box.r,4,4);
  ctx.strokeRect(box.x+box.r,box.y+box.r,4,4);
  ctx.strokeStyle= "black";
  ctx.lineWidth = 1;
  ctx.stroke();
  }

function redraw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(gridflag){
    drawGrid(10,30);
  };
  // redraw each shape in the shapearray[] array
  for(var i=0;i<shapearray.length;i++){  
    if(shapearray[i].name == "rectangle"){
      
      rectangle(shapearray[i].x,shapearray[i].y,shapearray[i].w,shapearray[i].h,shapearray[i].c,shapearray[i].t);
    }
    else if(shapearray[i].name == "square")
    {
      square(shapearray[i].x,shapearray[i].y,shapearray[i].w,shapearray[i].h,shapearray[i].c,shapearray[i].t);
    }
    else if(shapearray[i].name == "circle")
    {
      circle(shapearray[i].x,shapearray[i].y,shapearray[i].r,shapearray[i].c,shapearray[i].t);
    }
    else if(shapearray[i].name == "line")
    {
      line(shapearray[i].x,shapearray[i].y,shapearray[i].w,shapearray[i].h,shapearray[i].c,shapearray[i].t);
    }
    else if(shapearray[i].name == "polygon")
    {
      Polygon(shapearray[i].x,shapearray[i].y,shapearray[i].w,shapearray[i].h,shapearray[i].c,shapearray[i].t);
    }
    else if(shapearray[i].name == "triangle")
    {
      Triangle(shapearray[i].x,shapearray[i].y,shapearray[i].r,shapearray[i].c,shapearray[i].t);
    }
    else if(shapearray[i].name == "ellipse")
    {
      Ellipse(shapearray[i].x,shapearray[i].y,shapearray[i].w,shapearray[i].h,shapearray[i].c,shapearray[i].t);
    }
    else if(shapearray[i].name == "polyline")
    {
      line(shapearray[i].x,shapearray[i].y,shapearray[i].w,shapearray[i].h,shapearray[i].c,shapearray[i].t);
    }
  }

}


//Functions to Draw shapes
    function rectangle(lastMouseX,lastMouseY,width,height,color,thick){
      ctx.beginPath(); 
      ctx.rect(lastMouseX,lastMouseY,width,height);
      ctx.strokeStyle= color;
      ctx.lineWidth = thick;
      ctx.stroke();
    }

    function square(lastMouseX,lastMouseY,width,height,color,thick){
    ctx.beginPath(); 
    ctx.rect(lastMouseX,lastMouseY,width,height);
    ctx.strokeStyle= color;
    ctx.lineWidth = thick;
    ctx.stroke();
    }


    function circle(lastMouseX,lastMouseY,distance,color,thick){
      ctx.beginPath();
      ctx.arc(lastMouseX, lastMouseY, distance/2, 0, 2 * Math.PI, false);
      ctx.lineWidth = thick;
      ctx.strokeStyle= color;
      ctx.stroke();
    }

    function line(lastMouseX,lastMouseY,mouseX,mouseY,color,thick){
      ctx.beginPath();
      ctx.moveTo(lastMouseX, lastMouseY);
      ctx.lineTo(mouseX, mouseY);
      ctx.lineWidth = thick;
      ctx.strokeStyle= color;
      ctx.stroke();
    }
    
    function Triangle(lastMouseX,lastMouseY,Tdist,color,thick){
     ctx.beginPath();
     ctx.moveTo(lastMouseX,lastMouseY);
     ctx.lineTo(lastMouseX,lastMouseY+Tdist);
     ctx.lineTo(lastMouseX+Tdist,lastMouseY+Tdist);
     ctx.closePath(); 
     ctx.lineWidth = thick;
     ctx.strokeStyle= color;
     ctx.stroke();
    }

    function Polygon(mouseX,mouseY,numberOfSides,size,color,thick){
      
      ctx.beginPath();
      ctx.moveTo (mouseX +  size * Math.cos(0), mouseY +  size *  Math.sin(0));          
   
      for (var i = 1; i <= numberOfSides;i += 1) {
      ctx.lineTo (mouseX + size * Math.cos(i * 2 * Math.PI / numberOfSides), mouseY + size * Math.sin(i * 2 * Math.PI / numberOfSides));
       }
       ctx.strokeStyle= color;
       ctx.lineWidth = thick;
       ctx.stroke();
       ctx.closePath();
     }

    function Ellipse(lastMouseX, lastMouseY,radiusX,radiusY,color,thick) {
      
    var EcenterX = lastMouseX + radiusX,    
      EcenterY = lastMouseY + radiusY,
      step = 0.01,                 
      a = step,                    
      pi2 = Math.PI * 2 - step;   
      ctx.beginPath();
      ctx.moveTo(EcenterX + radiusX * Math.cos(0),
             EcenterY + radiusY * Math.sin(0));
   
     for(; a < pi2; a += step) {
      ctx.lineTo(EcenterX + radiusX * Math.cos(a),
                 EcenterY + radiusY * Math.sin(a));
  }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = thick;
      ctx.stroke();
     }
    
    //Clearing Canvas
    function clearcanvas(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shapearray = [];
        scale = 1 ; 
        zoom();
        restore_array = [];
        index=-1;
        gridflag = false;
      
    };
    

    //Rotating shapes       
    function rotu(){
       var op = copy_array[copy_array.length-1];
        var ReccenterX= op.x + op.w / 2;
        var ReccenterY= op.y + op.h / 2;

        var trianglecenX =op.x + op.r*0.5;
        var trianglecenY = op.y + op.r*0.5;
        let angle = 0;
        let objectrotate = window.setInterval(function(){
          
                angle +=45;
                // Rotated rectangle
                if(op.name =="rectangle"){
                ctx.clearRect(op.x-4, op.y-5, op.w+6, op.h+6);
                ctx.translate(ReccenterX, ReccenterY);
                ctx.rotate(45 * Math.PI / 4);
                ctx.translate(-ReccenterX, -ReccenterY);
                rectangle(op.x,op.y,op.w,op.h);
                }
                
                else if(op.name =="square"){
                ctx.clearRect(op.x-4, op.y-5, op.w+7, op.h+7);
                ctx.translate(ReccenterX, ReccenterY);
                ctx.rotate(45 * Math.PI / 4);
                ctx.translate(-ReccenterX, -ReccenterY);
                square(op.x,op.y,op.w,op.h,op.s,op.t);
                }

                else if(op.name == "polygon"){
                ctx.clearRect(op.x-op.h, op.y-op.h, op.h*2,op.h*2);
                ctx.translate(op.x, op.y);
                ctx.rotate(45 * Math.PI / 4);
                ctx.translate(-op.x, -op.y);
                Polygon(op.x,op.y,op.w,op.h);
                }

                else if(op.name =="triangle"){
                ctx.clearRect(op.x-2, op.y+2, op.r+6, op.r+6);
                ctx.translate(trianglecenX, trianglecenY);
                ctx.rotate(45 * Math.PI / 4);
                ctx.translate(-trianglecenX, -trianglecenY);
                Triangle(op.x,op.y,op.r,op.c,op.t);
                }
                //Stoping the rotation  
                if (Rotatefn==false || angle==360)
                {
                  clearInterval(objectrotate);
                  redraw();
                }
                },500);

              };
    //Drawing filled shapes
    function Fill(){
     var fl = copy_array[copy_array.length-1];
        if(fl.name == "rectangle"){
            ctx.fillStyle=color;
            rectangle(fl.x,fl.y,fl.w,fl.h,fl.c); 
            ctx.fill();
            }
        else if(fl.name == "circle"){
            ctx.fillStyle=color;
            circle(fl.x,fl.y,fl.r,fl.c);
            ctx.fill();
            }
          
        else if(fl.name == "triangle"){
            ctx.fillStyle=color;
            Triangle(fl.x,fl.y,fl.r,fl.c);
            ctx.fill();
        }
              
        else if(fl.name == "polygon"){
           ctx.fillStyle=color;
           Polygon(fl.x,fl.y,fl.w,fl.h,fl.c);
           ctx.fill();
        }

        else if(fl.name == "ellipse"){
          ctx.fillStyle=color;
          Ellipse(fl.x,fl.y,fl.w,fl.h,fl.c);
          ctx.fill();
       }
       else if(fl.name == "square"){
        ctx.fillStyle=color;
        square(fl.x,fl.y,fl.w,fl.h,fl.c);
        ctx.fill();
     }
      
    };

    function drawGrid(gap,gap2){
        var x,y=0;
        ctx.beginPath();
        for(x=gap; x<canvas.width; x=x+gap){
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.width);
        }
        for(y=gap; y<canvas.height; y=y+gap){
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        for(x=gap2; x<canvas.width; x=x+gap2){
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.width);
        }
        for(y=gap2; y<canvas.height; y=y+gap2){
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
       }
        ctx.strokeStyle= '#E7E7DA';
        ctx.stroke();
        ctx.closePath();
    }

    function undo(){
        if(index <= 0){
            clearcanvas();
        }
        else{
            index -= 1;
            restore_array.pop();
            ctx.putImageData(restore_array[index],0,0);
            shapearray.pop(shapearray.length-1);
        }

    };

    function saveasjpg(){
        const data = canvas.toDataURL('image/jpg');
        const a = document.createElement('a');
        a.href = data;
        a.download = 'image.jpg';
        a.click();
      }    
      
    function saveasjson(){
        var canvasContents = canvas.toDataURL(); // a data URL of the current canvas image
        var data = { image: canvasContents, date: Date.now() };
        var string = JSON.stringify(data);

        var file = new Blob([string], {
          type: 'application/json'
        });
         
        var a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      
  reader.onload = function () {
      var data = JSON.parse(reader.result);
      var image = new Image();
        image.onload = function () {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0); 
        }
          image.src = data.image;
      };

    //For Eraser
      ctx.fillCircle = function(x, y, radius, fillColor) {
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.fill();
    
  }
    
  
  function zoom(mouseX,mouseY,wheel){
    
    // Compute zoom factor.
    const zoom = Math.exp(wheel * zoomIntensity);
    
    // Translate so the visible origin is at the context's origin.
    ctx.translate(originx, originy);
    originx -= mouseX/(scale*zoom) - mouseX/scale;
    originy -= mouseY/(scale*zoom) - mouseY/scale;
    ctx.scale(zoom, zoom);
    ctx.translate(-originx, -originy);

    // Update scale and others.
    scale *= zoom;
    visibleWidth = canvas.width / scale;
    visibleHeight = canvas.height / scale;
    redraw();
  };
  
  function saveaspdf(){
    var imgData = canvas.toDataURL("image/png",1.0);
    var pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save("download.pdf");
  }
//canvas.onwheel = function (event){
    document.getElementById("ZoomIn").addEventListener("click", function (event){
       mouseX = event.clientX - canvas.offsetLeft;
       mouseY = event.clientY - canvas.offsetTop;
       wheel = 1
       zoom(mouseX,mouseY,wheel);
    });

    document.getElementById("ZoomOut").addEventListener("click", function (event){
      mouseX = event.clientX - canvas.offsetLeft;
      mouseY = event.clientY - canvas.offsetTop;
      wheel = -1
      zoom(mouseX,mouseY,wheel);
    });

    document.getElementById("Shapes").onchange = function(event) {
    shape= event.target.value;
    Rotatefn=false;
    PolyLine =false;
    restore_array = [];
    };

    document.getElementById("thick").onchange = function(event) {
      thick =  event.target.value;
    }; 
   
    document.getElementById("numside").onchange = function(event) {
    numberOfSides =  event.target.value;
    }; 

        
    document.getElementById("Rotate").addEventListener("click", function (){
    Rotatefn= true;   
    rotu();          
    });

    document.getElementById("Fill").addEventListener("click", function (){
    Fill();         
    });

    document.getElementById("Clear").addEventListener("click", function(){    
    Rotatefn= false;
    clearcanvas();
    });

    document.getElementById("Undo").addEventListener("click", function(){    
    undo();
    });

    document.getElementById("Savepdf").addEventListener("click", function(){   
      saveaspdf();
    });
  
    //Keyboad key handler 
    document.addEventListener('keydown', function(event) {
      if (event.ctrlKey && event.key === 'z') {
        undo();
      }
      if (event.ctrlKey && event.key === 'c') {
        copyflag = true;
      var op= copy_array.pop(copy_array.length-1);
      shapearray.push({x:op.x+30,y:op.y+30,w:op.w,h:op.h,r:op.r,name:op.name,t:op.t,c:op.c,s:op.s,translateflag:op.translateflag});
      }
      if (event.ctrlKey && event.key === 'v') {
        if(copy_array){
          redraw();
          }
      }

    });

    document.getElementById("Save").addEventListener("click", function(){    
      saveasjpg();
    });

    document.getElementById("Savejson").addEventListener("click", function(){    
      saveasjson();
    });

    document.getElementById('Load').addEventListener('change', function () {
      if (this.files[0]) {
        reader.readAsText(this.files[0]);
      }
    });

    document.getElementById('Grid').addEventListener('click', function () {
      gridflag = true;
     drawGrid(10,30);
    });

    document.getElementById('Eraser').addEventListener('click', function () {
       erasemode =true;
     });
    

    document.getElementById('copy').addEventListener('click', function () {
      copyflag = true;
      var op= copy_array.pop(copy_array.length-1);
      shapearray.push({x:op.x+30,y:op.y+30,w:op.w,h:op.h,r:op.r,name:op.name,t:op.t,c:op.c,s:op.s,translateflag:op.translateflag});
    });
    
    document.getElementById('paste').addEventListener('click', function () {  
      if(copy_array){
      redraw();
      }
    });

    document.getElementById("picker").onchange = function(event) {
       color = event.target.value;
    };

    canvas.addEventListener('dblclick', function (e) {
      PolyLine =false;
    });


//Mouse event listeners   
    canvas.addEventListener("mousedown",startpos,false);
    canvas.addEventListener("mouseup",finishedPosition,false);
    canvas.addEventListener("mousemove",mousemove,false);
    canvas.addEventListener("touchstart",startpos,false);
    canvas.addEventListener("touchmove",mousemove,false);
    canvas.addEventListener("touchend",finishedPosition,false);
    
};