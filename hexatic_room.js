   /*

    This script calculates the optimum arrangment of humans in a room
    with constrains indicated by the user 
    
    Copyright (C) 2020 Cesar Lopez Pastrana

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
  
*/

// Global variables
var room_selected = 0;
var room0 = [0,0];
var roomf = [0,0]

var n_restraints = 0;
var restraints0 = [];
var restraintsf = [];

var scale_selected = 0;
var scale_pix;
var scale_m;

var canvas = new fabric.Canvas('plane_canvas', { selection: true });
var rect, is_down, x0, y0;



///////////////////////////////////////////////////////////////////////////
// 0. Canvas drawing functions                                           //
///////////////////////////////////////////////////////////////////////////

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

canvas.on('mouse:down', function(o){


    is_down = true;
    var pointer = canvas.getPointer(o.e);
    x0 = pointer.x;
    y0 = pointer.y;
    
    if (document.getElementById("room_sq").checked == true) {
        rect = new fabric.Rect({
            left: x0,
            top: y0,
            originX: 'left',
            originY: 'top',
            width: pointer.x-x0,
            height: pointer.y-y0,
            angle: 0,
            fill: 'rgba(0,0,0,0.0)',
            stroke: 'rgba(0,0,150,1)', 
            strokeWidth: 3, 
            //transparentCorners: false,
            selectable: false
        });
        canvas.add(rect);
        room_selected = 1;
        room0[0] = x0;
        room0[1] = y0;
        
    } else if (document.getElementById("restraints").checked == true) {
        rect = new fabric.Rect({
            left: x0,
            top: y0,
            originX: 'left',
            originY: 'top',
            width: pointer.x-x0,
            height: pointer.y-y0,
            angle: 0,
            fill: 'rgba(200,0,0,0.1)',
            stroke: 'rgba(150,0,0, 1)', 
            strokeWidth: 3, 
            //transparentCorners: false,
            selectable: false
            
        });
        canvas.add(rect);
    
        restraints0.push(x0);
        restraints0.push(y0);
        
    } else if (document.getElementById("scale").checked == true) {
        rect = new fabric.Line([x0, y0, pointer.x, y0],{
            stroke: 'rgba(200,200,0,1)', 
            strokeWidth: 3, 
            selectable: false
        });
        canvas.add(rect);
    }
    
});


canvas.on('mouse:move', function(o){

    if (!is_down) return;
    
    var pointer = canvas.getPointer(o.e);
    
    if(x0>pointer.x){
        rect.set({ left: Math.abs(pointer.x) });
    } 
    if(y0>pointer.y){
        rect.set({ top: Math.abs(pointer.y) });
    }
    
    if(document.getElementById("scale").checked == true) {
        rect.set({ width: Math.abs(x0 - pointer.x) });
        rect.set({ height: 0 });
    } else {
        rect.set({ width: Math.abs(x0 - pointer.x) });
        rect.set({ height: Math.abs(y0 - pointer.y) });
    }

    canvas.renderAll();
     
});

canvas.on('mouse:up', function(o){
  
  is_down = false;
  var pointer = canvas.getPointer(o.e);

  if (document.getElementById("room_sq").checked == true) {
     roomf[0] = pointer.x;
     roomf[1] = pointer.y;
     
     // Exchange to have the largest values first
     if(roomf[0] < room0[0]) {
        roomf[0] = roomf[0] + room0[0];
        room0[0] = roomf[0] - room0[0];
        roomf[0] = roomf[0] - room0[0];
     }
     
    if(roomf[1] < room0[1]) {
        roomf[1] = roomf[1] + room0[1];
        room0[1] = roomf[1] - room0[1];
        roomf[1] = roomf[1] - room0[1];
     }
     
    
  } else if (document.getElementById("restraints").checked == true) {
   
        restraintsf.push(pointer.x);
        restraintsf.push(pointer.y);
        n_restraints++;
        
        // Exchange to have the largest values first
        if(restraintsf[2*n_restraints] < restraints0[2*n_restraints]) {
            restraintsf[2*n_restraints] = restraintsf[2*n_restraints] + restraints0[2*n_restraints];
            restraints0[2*n_restraints] = restraintsf[2*n_restraints] - restraints0[2*n_restraints];
            restraintsf[2*n_restraints] = restraintsf[2*n_restraints] - restraints0[2*n_restraints];
        }
        
        if(restraintsf[2*n_restraints+1] < restraints0[2*n_restraints+1]) {
            restraintsf[2*n_restraints+1] = restraintsf[2*n_restraints+1] + restraints0[2*n_restraints+1];
            restraints0[2*n_restraints+1] = restraintsf[2*n_restraints+1] - restraints0[2*n_restraints+1];
            restraintsf[2*n_restraints+1] = restraintsf[2*n_restraints+1] - restraints0[2*n_restraints+1];
        }
        
  } else if (document.getElementById("scale").checked == true) {
        scale_pix =  Math.abs(x0 - pointer.x); // Scale in pixels
        scale_selected = 1;
  }
   
}); 

/*----------------------------------------------------------------------*/

///////////////////////////////////////////////////////////////////////////
// Load image (plane)                                                    // 
///////////////////////////////////////////////////////////////////////////

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


document.getElementById("file_input").addEventListener("change", function(e) {
   
   var file = e.target.files[0];
   var reader = new FileReader();
   var bgi;
   var mw;
   reader.onload = function(f) {
      var data = f.target.result;
      fabric.Image.fromURL(data, function(img) {    
         canvas.setDimensions({width:img.width, height: img.height});
         // add background image
         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          
            //scaleX: img.width,
            //scaleY: img.height
            
            //scaleX: canvas.width / img.width,
            //scaleY: canvas.height / img.height
         });
      });
      
        
   };
   reader.readAsDataURL(file);
   
});

/*----------------------------------------------------------------------*/



///////////////////////////////////////////////////////////////////////////
// Download image                                                        // 
///////////////////////////////////////////////////////////////////////////

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

// Nice method by Bematobu stackoverflow
// https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl
// Convert canvas to image
document.getElementById('download').addEventListener("click", function(e) {
    var canvas = document.getElementById("plane_canvas");
    var dataURL = canvas.toDataURL("image/jpeg", 1.0);
    download_image(dataURL, 'hexatic_room.jpeg');
});

// Save | Download image
function download_image(data, filename = 'hexatic_room.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}

/*----------------------------------------------------------------------*/


///////////////////////////////////////////////////////////////////////////
// Clear ALL canvas                                                      // 
///////////////////////////////////////////////////////////////////////////

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

document.getElementById('clear_all').addEventListener("click", function(e) {
    //var canvas = document.getElementById("plane_canvas");
    canvas.remove(...canvas.getObjects());
    //canvas.renderAll();
    
    room_selected = 0;
    room0 = [0,0];
    roomf = [0,0]

    n_restraints = 0;
    restraints0 = [];
    restraintsf = [];
    scale_selected = 0;
    
   // console.log("Clear");
});

/*----------------------------------------------------------------------*/



///////////////////////////////////////////////////////////////////////////
// Clear POINTS In canvas                                                // 
///////////////////////////////////////////////////////////////////////////

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

document.getElementById('clear_points').addEventListener("click", function(e) {
    
    var cross_lines = canvas.getObjects('line');
    var i0;
    
    if(scale_selected==0) i0=0;
    else i0=1;
    
    for(let i=i0; i<cross_lines.length; i++)
        canvas.remove(cross_lines[i]);        
    
    canvas.renderAll();
    
    //RenderCanvas();
});

/*----------------------------------------------------------------------*/


///////////////////////////////////////////////////////////////////////////
// MAIN FUNCTION: Monte Carlo minimisation                               // 
///////////////////////////////////////////////////////////////////////////

/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

//https://stackoverflow.com/questions/20927807/is-it-possible-to-make-global-variable-in-javascript
//get reference to button
var btn_analysis = document.getElementById('analyze');
btn_analysis.addEventListener('click', function(event) {
    mc_analysis(room0, roomf, restraints0, restraintsf, n_restraints, canvas);
});



function mc_analysis(room0, roomf, restraints0, restraintsf, n_restraints, canvasid)
{
    if(room_selected==0) {
        window.alert("Please, draw a main room area");
        document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + "Main room not drawn<br>>> "
        return 1;
    }
    
    
    scale_m = Number(document.getElementById("scale_value").value)/scale_pix; // Scale in meter/pixel

    var N_INDIVIDUALS = Number(document.getElementById("individuals").value);
    var rx = [];    // Final coordinates of the particles x coordinate
    var ry = [];    // Final coordinates of the particles y coordinate
    
    // 1. Initial placement of particles
    var tx, ty;
    var tni=0;
    
    do{
         tx = Math.floor((Math.random()*(roomf[0] - room0[0]) ) + room0[0]);
         ty = Math.floor((Math.random()*(roomf[1] - room0[1]) ) + room0[1]);
         
         if(is_coord_suited(tx, ty, room0, roomf, restraints0, restraintsf, n_restraints) == 1) {
            rx.push(tx);
            ry.push(ty);
            tni++;
         }
    } while(tni<N_INDIVIDUALS);
 	

 	 
 	 // 2. Total (effective) area and parameter distance
 	 var S_room = (roomf[0]-room0[0])*(roomf[1]-room0[1]);

 	 for(i=0;i<n_restraints;i++) 
        S_room -= (restraintsf[0]-restraints0[0])*(restraintsf[1]-restraints0[1]);
 	 
    // 3. Energy initial configuration
    const L0sq =  2*S_room/( Math.sqrt(3)*N_INDIVIDUALS );
    const L0_THR = 2;       // Threshold meters for the separation between persons
 	 
   
    if(scale_selected==0)
        document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + "Scale not selected."
    else {
        var l0 = Math.sqrt(L0sq)*scale_m;
        document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + "Expected average separation: "
        
        if(l0<L0_THR)
            document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + "<b style=\"color:red\">" + l0.toFixed(2) + " meters</b>, "
        else
            document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + l0.toFixed(2) + " meters,"
            
        let max_N = 2*S_room*scale_m*scale_m/(L0_THR*L0_THR*Math.sqrt(3));
        document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + "<br>&nbsp;&nbsp;&nbsp;Maximum number of persons for the area given with 2 meters separation: ~" + Math.round(max_N) + " persons."
    }
 	 
    document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + "<br>&nbsp;&nbsp;&nbsp;Analyzing... "
 	 
 	 var L06 = L0sq*L0sq*L0sq;
 	 var L012 = L06*L06;
 	 var L_CUT = 4*4*L0sq;
 	 var E=0;
     E = energy(rx,ry,N_INDIVIDUALS, L012, L_CUT);

 	   
 	 // 4. Monte Carlo minimisation
 	 const MC_STEPS = 70000;
 	 const mcs = 20;
 	 const BETA = 1;
 	
     var tx,ty;
 	 var tE;
 	 var query;
 	    
 	 for(let m=0; m<MC_STEPS; m++) {
        for(let n=0; n<N_INDIVIDUALS; n++) {
           
            // Trial step
            tx = rx[n]; 
            ty = ry[n];
            rx[n] += mcs*(Math.random() - 0.5);
            ry[n] += mcs*(Math.random() - 0.5);
            
            // Configuration suitable?
            query = is_coord_suited(rx[n], ry[n], room0, roomf, restraints0, restraintsf, n_restraints);
            
            if( query == 1) {
                tE =  energy(rx,ry,N_INDIVIDUALS, L012, L_CUT);
                if( Math.random() < Math.exp( -(tE-E)/BETA) )
                    E = tE;
                else {
                    rx[n] = tx;
                    ry[n] = ty;
                }
                
            } else {
                rx[n] = tx;
                ry[n] = ty;
            }
            
            
        }
 	 }
 	 
 	 
    // Draw final configuration
    for(i=0;i<N_INDIVIDUALS; i++) 
        draw_cross(canvasid, rx[i], ry[i]);   
 	 
    // Obtain final statistics
    document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + "Done! " 
    dists = calcd(rx,ry,N_INDIVIDUALS);
    if(scale_selected==1) {
        let ave_mds = mean(dists)*scale_m;
        let std_mds = std(dists)*scale_m;
        let m_mds = min(dists)*scale_m;
        document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + "Average minimum distances found: " + ave_mds.toFixed(2) + " +/- " + std_mds.toFixed(2) + " meters (minimum distance " 
        if(m_mds<L0_THR)
            document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML  + "<b style=\"color:red\">" + m_mds.toFixed(2) + "</b> meters)."
        else
             document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML  + m_mds.toFixed(2) + " meters)."
    }
    document.getElementById("log_console_id").innerHTML = document.getElementById("log_console_id").innerHTML + "<br>>> " 
    
}


/*******************************************************************************/
/*                              is_coord_suited                                */
/* Checks if the coordinates are located inside the room and not inside a      */
/* regions restrained                                                          */
/*******************************************************************************/
function is_coord_suited(x, y, room0, roomf, restraints0, restraintsf, n_restraints)
{ 
    let ics=1;
    
    // Is inside the room?
    if(x<room0[0])
        ics=0;
    if(x>roomf[0])
        ics=0;
    if(y<room0[1])
        ics=0;
    if(y>roomf[1])
        ics=0;
    
    // Is outside the restrains?
    let xr0, yr0;
    let xrf, yrf;
     
    for(let r=0; r<n_restraints; r++) {
        xr0 = restraints0[2*r];
        yr0 = restraints0[2*r+1];
        xrf = restraintsf[2*r];
        yrf = restraintsf[2*r+1];
        
        if(x>xr0 && x<xrf) {
            if(y>yr0 && y<yrf) {
                ics = 0;
                break;
            }
        }
    }
    
    return ics;
}



/*******************************************************************************/
/*                                energy                                       */
/* Energy function for the current configuration of particles                  */
/*******************************************************************************/
function energy(rx,ry,np, L0, L_CUT) 
{
    let E=0;
    let d2,d6,d12;
    let rxi,rxy;
    
    for(let i=0;i<np; i++) {
        rxi = rx[i];
        ryi = ry[i];
        for(let j=i+1; j<np; j++) {
            d2 = (rxi-rx[j])*(rxi-rx[j])  + (ryi-ry[j])*(ryi-ry[j]);
            if(d2 < L_CUT){
                d6 = d2*d2*d2;
                d12 = d6*d6;
                E += L0/d12;
            }
        }
    }
    return E;
}



/*******************************************************************************/
/*                                draw_cross                                   */
/* This function draws a cross at the specified coordinates                    */
/*******************************************************************************/
function draw_cross(canvasid,x,y)
{
    var w = 5;
    lv = new fabric.Line([x-w, y, x+w+1, y],{
            stroke: 'rgba(150,0,0,1)', 
            strokeWidth: 2, 
            //transparentCorners: false,
            selectable: false
        });
    canvas.add(lv);
    
    lh = new fabric.Line([x, y-w, x, y+w+1],{
            stroke: 'rgba(150,0,0,1)', 
            strokeWidth: 2, 
            //transparentCorners: false,
            selectable: false
        });
    canvas.add(lh);
}


/*******************************************************************************/
/*                                     calcd                                   */
/* Extracyt the minimium distance beween every particle with all thehe rest    */
/*******************************************************************************/
function calcd(rx,ry,np)
{

    var dists = new Array(np);
    
    for(let i=0; i<np; i++)
        dists[i] = 9999999999999;
    
    for(let d=0; d<np; d++) {
        for(let i=0;i<np; i++) {
            if(d!=i) {
                let td = Math.sqrt( (rx[d]-rx[i])*(rx[d]-rx[i]) +  (ry[d]-ry[i])*(ry[d]-ry[i])  );
                if(td < dists[d])
                    dists[d] = td;
            }
        }
    }
    
    return dists;
    
}

/*******************************************************************************/
/*                                   mean                                      */
/* Calcuates the mean of array v                                               */
/*******************************************************************************/
function mean(v)
{   
    let ave=0;
    let elements = v.length;
    for(let i=0;i<elements;i++)
        ave += v[i];
    return ave/elements;
}

/*******************************************************************************/
/*                                   std                                       */
/* Calcuates the standard deviation of array v                                 */
/*******************************************************************************/
function std(v)
{
    let ave = mean(v);
    let elements = v.length;
    let std=0;
    for(let i=0;i<elements;i++)
        std += (v[i]-ave)*(v[i]-ave);
    return Math.sqrt(std/(elements-1));
}

/*******************************************************************************/
/*                                   min                                       */
/* Calcuates the minimum value is array v                                      */
/*******************************************************************************/
function min(v)
{
    let elements=v.length;
    m = v[0];
    for(let i=1; i<elements;i++){
        if(v[i]<m)
            m=v[i];
    }
    
    return m;
}

/*----------------------------------------------------------------------*/
 
