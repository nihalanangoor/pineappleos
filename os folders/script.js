const canvas=document.querySelector("#canvas");
canvas.width=window.innerWidth-25;
canvas.height=window.innerHeight-75;
const ctx = canvas.getContext("2d");
var drawing = false;
var color = "black";
var palopened = false;
var moretoolsopened = false;
var writing = false;
var pensize = 10;
var candrag = false;
var candraggal=true;
var mode = "pen";
var eraseroptopen = false;
var eraserSize=20;
var ctxvalue;
var fullssreen = false;
var listopen = false;
var canvasMax= true;
var winfocus = "gallery";
var topBeforeMinimized;
var leftBeforeMinimized;
var topBeforeMinimizedgal;
var leftBeforeMinimizedgal;
var preimagedraggable = false;
var imgid=0;
var trash_image_id = 0;
var galimgcount=0;
var trashimgcount = 0;
// undo redo vaiables
var undo_array = [];
var undo_index = -1;
var redo_array = [];
var redo_index = -1;
var osbooted= false;
var galsavedheight;
var galsavedwidth;
var draggingobj;
var batteryboxopened = false;

var bathrs;
var batmins;
var batsts;

var dateboxopen =false;
var syslistopen =false;

hidecontext();
hidebat();

window.addEventListener("click",(e)=>{
    hidecontext();
    if(batteryboxopened && e.target!=document.querySelector(".battery_area") && e.target!=document.querySelector(".batterymain") && e.target!=document.querySelector(".battery_in")){
        hidebat();
    }
    if(dateboxopen && e.target!=document.querySelector(".date") && e.target!=document.querySelector(".hours") && e.target!=document.querySelector(".minutes")){
        hidedatebox();
    }
})

window.oncontextmenu=function(e){
    var icon = document.querySelector(".trssh_icon_home_page");
    var img = document.querySelector("img.trasimgic");
    if(e.target==icon || e.target==img){
        var context = document.querySelector(".clrearRecycleBinContextMenu");
        context.style.transform="scale(1)skew(0deg)";
        context.style.left="90px";
        return false;
    }
    else{
        return false;
    }
}
canvas.addEventListener("mousedown",startDrawing)
canvas.addEventListener("mousemove",movedmouse)
canvas.addEventListener("mouseup",enddrawing)
canvas.addEventListener("mouseout",enddrawing2)
canvas.addEventListener("click",clickedCanvas)
window.addEventListener("keydown",checkkey)
window.addEventListener("keyup",()=>{
    candrag=false;
    candraggal=false;
})
document.querySelector(".container").addEventListener("mousedown",(e)=>{
    var objst = document.querySelector(".container").style.top.replace("px","");
    objst*=1;
    if(e.clientY>objst && e.clientY<objst+50){
        candrag=true;
    }
    winfocus="canvas";
    document.querySelector(".container").style.zIndex=2;
    document.querySelector(".gallery_container").style.zIndex=0;
})
document.querySelector(".gallery_container").addEventListener("mousedown",(e)=>{
    var objstgl = document.querySelector(".gallery_container").style.top.replace("px","");
    objstgl*=1;
    if(e.clientY>objstgl && e.clientY<objstgl+50){
        candraggal=true;
    }
    else{
        candraggal=false
    }
    winfocus="gallery";
    document.querySelector(".gallery_container").style.zIndex=2;
    document.querySelector(".container").style.zIndex=0;
})



ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle="white";
ctx.fillRect(0,0,canvas.width,canvas.height)

// startBlackScreen();

document.querySelector(".container").addEventListener("resize",()=>{
    var el = document.querySelector(".container");
    canvas.style.aspectRatio=el.style.width-5+"/"+el.style.height-70;
    canvas.width-el.style.width-5;
})

function checkkey(e){
    if(e.keyCode==66 && !writing){
        mode="pen";
        paltask();
    }
    else if(e.keyCode==69 && !writing && canvasMax){
        if(e.ctrlKey){
            ClearCanvas();
            return false;
        }
        erafun();
    }
    else if(e.keyCode==89 && canvasMax){
        if(e.ctrlKey){
            redo();
        }
    }
    else if(e.keyCode==90 && canvasMax){
        if(e.ctrlKey){
           undo();
        }
    }
    else if(e.keyCode==32){
        candrag=true;
        candraggal=true
    }
    else if(e.key=="+" && e.ctrlKey && canvasMax && e.shiftKey){
        addToGallery();
        return false;
    }
}


function startDrawing(e){
    redo_array=[];
    redo_index=-1;
    if(palopened)closepalette();
    if(eraseroptopen)erafun();
    if(moretoolsopened)hidemoretools();
    if(candrag)return;
    drawing=true;
    candrag=false;
    if(mode=="pen"){
        movedmouse(event)
    }
}

function movedmouse(e){
    if(candrag)return;
    if(!drawing)return;
    var loacalpost = document.querySelector(".container").style.top.replace("px","");
    loacalpost*=1;
    var loacalposl = document.querySelector(".container").style.left.replace("px","");
    loacalposl*=1;
    if(mode=="eraser"){
        ctx.strokeStyle="white";
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.lineWidth=eraserSize;
        ctx.lineTo(e.clientX-canvas.offsetLeft-loacalposl,e.clientY-canvas.offsetTop-loacalpost);
        ctx.stroke();
    }
    else{
        ctx.strokeStyle=color;
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.lineWidth=pensize;
        ctx.lineTo(e.clientX-canvas.offsetLeft-loacalposl,e.clientY-canvas.offsetTop-loacalpost)
        ctx.stroke();
    }
}

function enddrawing(e){
    drawing=false;
    candrag=true;
    undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height))
    undo_index++;
    ctx.beginPath()
}
function enddrawing2(e){
    if(drawing){    
        undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height))
        undo_index++;
    }
    drawing=false;
    candrag=false;
    ctx.beginPath()
}

function clickedCanvas(e){
    var userX = e.clientX;
    var userY = e.clientY;
}
window.addEventListener("resize",windowResized)

function windowResized(){
    undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    undo_index++;
    canvas.width=window.innerWidth-25;
    canvas.height=window.innerHeight-75;
    if(undo_index<0)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.putImageData(undo_array[undo_index],0,0)
    document.querySelector(".container").style.aspectRatio=window.innerWidth+"/"+window.innerHeight;
}
function erafun(){
    if(palopened==true)closepalette();
    if(moretoolsopened==true)hidemoretools();
    if(eraseroptopen){
        eraserclose();
    }
    else{
        eraseropen();
    }
}

function changePenColor(el){
    color=el.style.backgroundColor;
}

function closepalette(){
    var colsel = document.querySelector(".color_panel");
    colsel.style.transform="scale(0)translateX(-100%)skew(25deg)";
    colsel.style.left="-500px";
    colsel.style.top="0px";
    palopened=false;
}
function openpal(){
    var colsel = document.querySelector(".color_panel");
    colsel.style.transform="scale(1)translateX(0%)skew(0deg)";
    colsel.style.left="90px";
    colsel.style.top="80px";
    palopened=true;
    mode="pen"
}


function eraserclose(){
    eraseroptopen=false;
    var erpal= document.querySelector(".eraser_opts").style;
    erpal.transform="translate(-100%,-100%)scale(3)";
    erpal.left="-500px";
}
function eraseropen(){
    mode='eraser';
    eraseroptopen=true;
    var erpal= document.querySelector(".eraser_opts").style;
    erpal.transform="translate(0px,0px)scale(1)";
    erpal.left="90px";
}

function paltask(){
    if(eraseropen)eraserclose();
    if(moretoolsopened)hidemoretools();
    if(!palopened){
        openpal();
    }
    else{
        closepalette();
    }
}

new dragElement(document.querySelector(".container"));
new dragElement(document.querySelector(".gallery_container"));
new dragElement(document.querySelector(".imagePreview"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    var objst = document.querySelector(".container").style.top.replace("px","");
    objst*=1;
    if(e.clientY>objst && e.clientY<objst+50){
        candrag=true;
    }
    e = e || window.event;
    // e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if(winfocus=="canvas"){
        if(candrag==true){
            document.querySelector(".container").style.top = (document.querySelector(".container").offsetTop - pos2) + "px";
            document.querySelector(".container").style.left = (document.querySelector(".container").offsetLeft - pos1) + "px";
        }
    }
    else{
        if(candraggal==true){
            document.querySelector(".gallery_container").style.top = (document.querySelector(".gallery_container").offsetTop - pos2) + "px";
            document.querySelector(".gallery_container").style.left = (document.querySelector(".gallery_container").offsetLeft - pos1) + "px";
        }
    }
  }

  function closeDragElement(e) {
      candrag=false;
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}





function minimizeWindow(){
    var elem = document.querySelector(".container");
    var icon = document.querySelector(".appicon");
    topBeforeMinimized=elem.style.top.replace("px","");
    leftBeforeMinimized=elem.style.left.replace("px","");
    elem.style.transition="0.5s";
    elem.style.transform="scale(0)skew(75deg)";
    elem.style.top="calc(100vh - 90px)"
    elem.style.left="calc(50px)";
    icon.style.top="calc(100vh - 10px";
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
    canvasMax=false;
    
}
function closewindow(){
    var elem = document.querySelector(".container");
    topBeforeMinimized=elem.style.top.replace("px","");
    leftBeforeMinimized=elem.style.left.replace("px","");
    elem.style.transition="0.5s";
    elem.style.transform="scale(0)skew(75deg)";
    elem.style.top="calc(100vh - 90px)"
    elem.style.left="calc(50px)";
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
    canvasMax=false;
    
}
function maximizeWindow(){
    var elem = document.querySelector(".container");
    elem.style.transition="0.5s";
    var icon = document.querySelector(".appicon");
    elem.style.transform="scale(1)skew(0deg)";
    elem.style.top="10px"
    elem.style.left=leftBeforeMinimized+"px";
    elem.style.top=topBeforeMinimized+"px";
    icon.style.top="calc(100vh + 100px)";
    canvasMax=true;
    document.querySelector(".container").style.zIndex=2;
    document.querySelector(".gallery_container").style.zIndex=0;
    elem.ontransitionend = function(){
        elem.style.transition="none";
        winfocus="canvas";
    }
}

function setFullScreen(){
    var elem =document.documentElement;
    if(!fullssreen){
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
        else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } 
        else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        setTimeout(() => {
                window.addEventListener("fullscreenchange",()=>{
                    window.location.reload();
                })
        }, 50);
        fullssreen = true;
    }
    else{
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        fullssreen = false;
    }
}

//undo redo functions 

function undo(){
    if(undo_index<=0){
        if(undo_index==0){
            redo_array.push(undo_array[0]);
            redo_index++;
        }
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle="#ffffff";
        ctx.fillRect(0,0,canvas.width,canvas.height)
        undo_index=-1;
        undo_array=[];
    }
    else{
        redo_array.push(undo_array[undo_index])
        redo_index++;
        undo_array.pop();
        undo_index--;
        ctx.putImageData(undo_array[undo_index],0,0);
    }
}

function redo(){
    if(redo_index<0){
        redo_array=[];
        redo_index=-1;
    }
    else if(redo_index==0){
        ctx.putImageData(redo_array[redo_index],0,0)
        undo_array.push(redo_array[0])
        undo_index++;
        redo_array=[];
        redo_index=-1;
    }
    else{
        ctx.putImageData(redo_array[redo_index],0,0)
        undo_array.push(redo_array[redo_index])
        undo_index++;
        redo_array.pop()
        redo_index--;     
    }
}


function ClearCanvas(){
    undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    undo_index++;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    undo_array.push(ctx.getImageData(0,0,canvas.width,canvas.height));
    undo_index++;
    Alert("Canvas Cleared!")
}


function showlist(){
    var list = document.querySelector(".applist");
    list.style.height="auto";
    list.style.top=50+"px";
    listopen=true;
}
function hidelist(){
    var list = document.querySelector(".applist");
    list.style.height="auto";
    list.style.top=-100+"px";
    listopen=false;
}

function listtask(){
    if(listopen){
        hidelist();
    }
    else{
        showlist();
    }
}

function showmoretools(){
    var case_box = document.querySelector(".more_tools");
    case_box.style.left="100px";
    case_box.style.transform="scale(1)skew(0deg)";
    moretoolsopened=true;
}
function hidemoretools(){
    var case_box = document.querySelector(".more_tools");
    case_box.style.left="-500px";
    case_box.style.transform="scale(0)skew(45deg)";
    moretoolsopened=false;
}

function moretask(){
    if(eraseropen)eraserclose();
    if(palopened)closepalette();
    if(moretoolsopened){
        hidemoretools();
    }
    else{
        showmoretools();
    }
}

function minimizegallery(){
    var elem = document.querySelector(".gallery_container");
    var icon =  document.querySelector(".appicon2");
    topBeforeMinimizedgal=elem.style.top.replace("px","");
    leftBeforeMinimizedgal=elem.style.left.replace("px","");
    elem.style.transition="0.5s";
    elem.style.transform="scale(0)skew(75deg)";
    elem.style.top="calc(100vh - 90px)"
    elem.style.left=`50px`;
    icon.style.top="calc(100vh - 10px";
    galsavedheight=elem.style.height.replace("px","");
    galsavedwidth=elem.style.width.replace("px","");
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
}
function closegallery(){
    var elem = document.querySelector(".gallery_container");
    topBeforeMinimizedgal=elem.style.top.replace("px","");
    leftBeforeMinimizedgal=elem.style.left.replace("px","");
    elem.style.transition="0.5s";
    elem.style.transform="scale(0)skew(75deg)";
    elem.style.top="calc(100vh - 90px)";
    elem.style.left="50px";
    galsavedheight=elem.style.height.replace("px","");
    galsavedwidth=elem.style.width.replace("px","");
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
}
function maximizegallery(){
    var elem = document.querySelector(".gallery_container");
    elem.style.transition="0.5s";
    var icon = document.querySelector(".appicon2");
    elem.style.transform="scale(1)skew(0deg)";
    elem.style.top="10px";
    elem.style.height=galsavedheight+"px";
    elem.style.width=galsavedwidth+"px";
    elem.style.left=leftBeforeMinimizedgal+"px";
    elem.style.top=topBeforeMinimizedgal+"px";
    icon.style.top="calc(100vh + 100px)";
    document.querySelector(".gallery_container").style.zIndex=2;
    document.querySelector(".container").style.zIndex=0;
    elem.ontransitionend = function(){
        elem.style.transition="none";
    }
}

function preimageopen(el){
    var box = document.querySelector(".imagePreview");
    box.style.transition="0.5s";
    var image = document.querySelector(".preimage");
    image.src = el.src;
    box.style.left=50+"%";
    box.style.width="50%";
    box.style.transform="translate(-50%,-50%)skew(0deg)scale(1)";
    setTimeout(() => {
        box.style.transition="none";
    }, 500);
}
function preimageclose(){
    var box = document.querySelector(".imagePreview");
    box.style.transition="0.5s";
    box.style.left=-150+"%";
    box.style.transform="translate(-50%,-50%)skew(80deg)scale(0)";
    setTimeout(() => {
        box.style.transition="none";
    }, 500);
}


function addToGallery(){
    imgid++;
    galimgcount++;
    if(galimgcount==1){
        document.querySelector(".atmes").style.display="none";
    }
    var img_url = canvas.toDataURL("image/png");
    var gal = document.querySelector(".doc_show");
    gal.innerHTML+=` <div draggable="true" ondragstart="imgfiledrag(event)"   class="imagecont" id="img${imgid}holder">
    <img onclick="preimageopen(this)" id='img${imgid}' src="${img_url}" draggable='false' class="disimage" alt="">
    <h1 class="dnldbtnar">
        <svg width="30" height="30" fill="#0b0c15" title="Delete Image" onclick="putToTrash(img${imgid}.id);" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
        <svg onclick='dnld(img${imgid})'  width="30" title="Download Image" height="30" fill="#0b0c15" class='downloadbtn' viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
    </h1>

</div>`;
Alert("Added To Gallery");
}

function imgfiledrag(ev){
    ev.dataTransfer.setData("text",ev.target.id.replace("holder",""));
}
function imgfileallowDrop(ev) {
    ev.preventDefault();
}
function imgfiledrop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    putToTrash(data)
}
function dnld(bt){
    var a = document.createElement("a");
    a.href=document.querySelector("#"+bt.id).src;
    a.download="images.png";
    a.click();
    Alert("Downloading...")
}

function download(){
    var img= canvas.toDataURL("images/png");
    var a = document.createElement("a");
    a.href=img;
    a.download="images.png";
    a.click();
    Alert("Downloading...")
}

function deleteitem(delitem){
    galimgcount--;
    if(galimgcount<1){
        document.querySelector(".atmes").style.display="flex";
    }
    document.getElementById(delitem.id).remove();
}



function putToTrash(el){
    trash_image_id++;
    trashimgcount++;
    galimgcount--;
    if(trashimgcount>0){
        document.querySelector(".trasimgic").src="./os folders/trash not empty.png";
    }
    if(trashimgcount==1){
        document.querySelector(".atmestrash").style.display="none";
    }
    if(galimgcount<1){
        document.querySelector(".atmes").style.display="flex";
    }
    var image = document.getElementById(el);
    document.querySelector(".trash_show").innerHTML+=`
    <div class="imageconttrsh" id="trash${trash_image_id}holder">
        <img  src="${image.src}"  id="trash${trash_image_id}" class="trashimage" alt="">
        <h1 class="recover">
        <svg width="30" height="30" fill="#0b0c15" title="Delete Image" onclick="deleteper(trash${trash_image_id})" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
            <svg onclick="recover(trash${trash_image_id})" width="30" height="30" fill="black" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                <path fill-rule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
        </h1>

    </div>
    `;
    document.getElementById(`${image.id}holder`).remove();
    Alert("Deleted Successfully")
}

function recover(el){
    var recimg = document.getElementById(el);
    imgid++;
    galimgcount++;
    trashimgcount--;
    if(galimgcount==1){
        document.querySelector(".atmes").style.display="none";
    }
    if(trashimgcount<1){
        document.querySelector(".atmestrash").style.display="flex";
        document.querySelector(".trasimgic").src="./os folders/trash empty.png";
    }
    var img_url = el.src;
    var gal = document.querySelector(".doc_show");
    gal.innerHTML+=` <div draggable="true" ondragstart="imgfiledrag(event)" class="imagecont" id="img${imgid}holder">
    <img onclick="preimageopen(this)" id='img${imgid}' src="${img_url}" draggable='false' class="disimage" alt="">
    <h1 class="dnldbtnar">
        <svg width="30" height="30" fill="#0b0c15" title="Delete Image" onclick="putToTrash(img${imgid}.id)" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
        <svg onclick='dnld(img${imgid})'  width="30" title="Download Image" height="30" fill="#0b0c15" class='downloadbtn' viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
    </h1>

</div>`;
document.getElementById(el.id+"holder").remove();
}

function image_folder_show(){
    document.querySelector(".trash_show").style.display="none";
    document.querySelector(".doc_show").style.display="block";
}

function trash_folder_show(){
    document.querySelector(".trash_show").style.display="block";
    document.querySelector(".doc_show").style.display="none";
}

function deleteper(el){
    Confirm.open({
        title:"Are You Sure?",
        message:"This File Will Be Deleted Permanently!",
        okText:"Ok",
        cancelText:"Cancel",
        onOk:()=>{
            trashimgcount--;
            if(trashimgcount<1){
                document.querySelector(".atmestrash").style.display="flex";
                document.querySelector(".trasimgic").src="./os folders/trash empty.png";
            }
            document.getElementById(el.id+"holder").remove()
            Alert("Deleted Permanently!");
        },
        onCancel:()=>{return false;}
    });
}


function opentrash(){
    trash_folder_show();
    maximizegallery();
}




const Confirm = {
    open(options){
        options = Object.assign({},{
            title:"",
            message:"",
            okText:"OK",
            cancelText:"Cancel",
            onOk:function() {},
            onCancel: function() {}
        },options);

        const html = `
            <div class="confirm">
            <div class="confirm__window">
                <div class="confirm__titlebar">
                    <span class="confirm__title">${options.title}</span>
                    <svg width="30" height="30" class="confirm__close--btn" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </div>
                <div class="confirm__content">
                    ${options.message}
                </div>
                <div class="confirm__buttons">
                    <button class="confirm__button confirm__button--ok confirm__button--fill">${options.okText}</button>
                    <button class="confirm__button confirm__button--cancel ">${options.cancelText}</button>
                </div>
            </div>
        </div>
        `;
        const template = document.createElement("template");
        template.innerHTML=html;
        const confirmElement = template.content.querySelector(".confirm");
        const btnclose = template.content.querySelector(".confirm__close--btn");
        const btnok = template.content.querySelector(".confirm__button--ok");
        const btncancel = template.content.querySelector(".confirm__button--cancel");

        btnok.addEventListener("click",()=>{
            options.onOk();
            this._close(confirmElement)
        })
        btncancel.addEventListener("click",()=>{
            options.onCancel();
                this._close(confirmElement)
        })
        btnclose.addEventListener("click",()=>{
            options.onCancel();
                this._close(confirmElement)
        })
        document.body.appendChild(template.content);
    },
    _close(confirmElement){
        confirmElement.classList.add("confirm--close");
        confirmElement.addEventListener("animationend",()=>{
            document.body.removeChild(confirmElement);
        });
    }
}


function cleartrash(){
    var trshimg = document.querySelectorAll(".imageconttrsh");
if(trshimg.length<1){
    Alert("Nothing To Clear In Trash")
}
else{
    Confirm.open({
        title:"Are You Sure?",
        message:`These ${trashimgcount} File(s) Will Be Deleted Permanently!`,
        okText:"Ok",
        cancelText:"Cancel",
        onOk:()=>{
            for(var i = 0; i<trshimg.length;i++){
                trshimg[i].remove();
            }
            document.querySelector(".atmestrash").style.display="flex";
            document.querySelector(".trasimgic").src="./os folders/trash empty.png";
            trashimgcount=0;
            Alert("Trash Cleared")
        },
        onCancel:()=>{return false;}
    });
}
}

function hidecontext(){
    var context = document.querySelector(".clrearRecycleBinContextMenu");
    context.style.transform="scale(0)skew(45deg)";
    context.style.left="15px";
}


function syslisttask(){
    if(syslistopen){
        syslistclose();
    }
    else{
        syslistopeni();
    }
}

function syslistopeni(){
    var list = document.querySelector(".syslist");
    list.style.height="auto";
    list.style.top=50+"px";
    syslistopen=true;
}

function syslistclose(){
    var list = document.querySelector(".syslist");
    list.style.height="auto";
    list.style.top=-100+"px";
    listopen=false;
    syslistopen=false;
}

window.addEventListener("load",()=>{
    document.querySelector(".entry").style.display="none";
    var osdt = navigator.appVersion;
    osdt.toString();
    if(osdt.includes("Windows") || osdt.includes("Linux")){
        document.querySelector(".devicetype").style.display="none";
    }
    else{
        document.querySelector(".devicetype").style.display="block";
    }
})


function startBlackScreen(){
setTimeout(() => {
        var els = document.querySelectorAll(".blackscreentitlecharel");
        for(i=0;i<els.length;i++){
            els[i].classList.add("blackscreentitlechar")
        }
        els[0].addEventListener("animationend",()=>{
            setTimeout(() => {
               var els = document.querySelectorAll(".blackscreentitlecharel");
                for(i=0;i<els.length;i++){
                    els[i].style.stroke="#000000";
                }
                document.querySelector(".blackscreen").style.backgroundColor="#ffffff";
                setTimeout(() => {
                    document.querySelector(".blackscreen").classList.add("blackscreen--close");
                    document.querySelector(".blackscreen--close").addEventListener("animationend",()=>{
                        document.querySelector(".blackscreen").style.display="none";
                        document.querySelector(".fullholder").style.display="block";
                    })
                }, 10000);
                
           }, 500);
        });
}, 1500);
}


function powerbtnclicked(el){
    setFullScreen();
    document.querySelector(".power_button").style.fill="#37ff00";
    document.querySelector(".powerTitle").style.display="none";
    setTimeout(() => {
        el.classList.add("power_button--close")
        el.addEventListener("animationend",()=>{
            el.style.display="none";
            startBlackScreen();
        })
}, 5000);
}


function shutdown(){
    var screen = document.querySelector(".shutdownscreen");
    var els = document.querySelectorAll(".shutdownscreentitlechar");
    screen.style.display="block";
    setTimeout(() => {
setTimeout(() => {
            screen.style.opacity="100%";
            for(i=0;i<els.length;i++){
                els[i].classList.add("shutdownscreentitlecharend")
            }
            els[0].addEventListener("animationend",()=>{
                screen.innerHTML="";
            })
            setTimeout(() => {
                setFullScreen();
            }, 8000);
}, 500);
    }, 1000);
}





function batteryupdate(){
    var batteryel = document.querySelector(".battery_in")
    navigator.getBattery().then(function(battery) {
        batteryel.style.width=`calc(${battery.level*100+"%"} - 4px)`;
        document.querySelector(".batteryperc").textContent=Math.round(battery.level*100)+"%";
        document.querySelector(".battery_det_perc").textContent=Math.round(battery.level*100)+"%";
        if(battery.charging){
            batsts="Charging";
            bathrs = Math.floor(battery.chargingTime / 60/60);
            batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
            if(bathrs!=Infinity){
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
            }
            else{
                document.querySelector(".batrem_det").innerHTML=`${batsts}(${Math.round(battery.level*100)}%&nbsp;Available)`;
            }
        }
        else{
            document.querySelector(".batrem_det").innerHTML=`${batsts}(${Math.round(battery.level*100)}%&nbsp;Available)`;
            if(bathrs!=Infinity){
                batsts="Discharging";
                bathrs = Math.floor(battery.dischargingTime / 60/60);
                batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
            }
        }
        if(!battery.charging){
            if(battery.dischargingTime!=Infinity){
                bathrs = Math.floor(battery.dischargingTime / 60/60);
                batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
            }
            else{
                document.querySelector(".batrem_det").innerHTML=`${batsts}(${Math.round(battery.level*100)}%&nbsp;Available)`;
            }
        }
        else{
            if(battery.chargingTime!=Infinity){
                bathrs = Math.floor(battery.chargingTime / 60/60);
                batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
            }
            else{
                document.querySelector(".batrem_det").innerHTML=`${batsts}(${Math.round(battery.level*100)}%&nbsp;Available)`;
            }
        }
        if(battery.charging){
            document.querySelector(".charging_battery").style.display="block";
        }
        else{
            document.querySelector(".charging_battery").style.display="none";
        }
        // ... and any subsequent updates.
        battery.onlevelchange = function() {
            batteryel.style.width=`calc(${battery.level*100+"%"} - 4px)`;
            document.querySelector(".batteryperc").textContent=Math.round(battery.level*100)+"%";
            document.querySelector(".battery_det_perc").textContent=Math.round(battery.level*100)+"%";
            if(!battery.charging){
                if(battery.dischargingTime!=Infinity){
                    bathrs = Math.floor(battery.dischargingTime / 60/60);
                    batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
                    document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
                }
                else{
                    document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
                }
            }
            else{
                if(battery.chargingTime!=Infinity){
                    bathrs = Math.floor(battery.chargingTime / 60/60);
                    batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
                    document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)&nbsp;Remaining`;
                }
                else{
                    document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
                }
            }
        };
        battery.onchargingchange = function () {
            if(battery.charging){
                document.querySelector(".charging_battery").style.display="block";
                batsts="Charging";
                bathrs = Math.floor(battery.chargingTime / 60/60);
                batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
                battery.onchargingchange = function(){
                    batsts="Charging";
                    bathrs = Math.floor(battery.chargingTime / 60/60);
                    batmins = Math.floor(((battery.chargingTime/60)-bathrs*60))
                    document.querySelector(".batrem_det").innerHTML=`${batsts}(${battery.level*100}%&nbsp;Available)`;
                }
          }
          else{
              document.querySelector(".charging_battery").style.display="none";
              batsts="Discharging";
              bathrs = Math.floor(battery.dischargingTime / 60/60);
              batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
              document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;(${battery.level*100}%&nbsp;Available)`;
              battery.ondischargingtimechange=function(){
                batsts="Discharging";
                bathrs = Math.floor(battery.dischargingTime / 60/60);
                batmins = Math.floor(((battery.dischargingTime/60)-bathrs*60))
                document.querySelector(".batrem_det").innerHTML=`${batsts}:&nbsp;${bathrs}&nbsp;Hour(s)&nbsp;${batmins}&nbsp;Minute(s)`;
              }
          }
        }
      });
}
batteryupdate();
up_date();

function up_date(){
    var minarea = document.querySelector(".minutes")
    var hrarea = document.querySelector(".hours")
    // var secarea = document.querySelector(".seconds")
    var date = new Date();
    var minutes = date.getMinutes().toString();
    var hours=date.getHours().toString();
    if(minutes.length==1){
        minarea.textContent="0"+date.getMinutes();
    }
    else{
        minarea.textContent=date.getMinutes();
    }
    if(hours.length==1){
        hrarea.textContent="0"+date.getHours();
    }
    else{
        hrarea.textContent=date.getHours();
    }

    setTimeout(up_date,1)
}


function hidebat(){
    var batel = document.querySelector(".batter_date_details");
    batel.style.transform="translateX(-100%)skew(45deg)scale(0)";
    batel.style.top=-50+"px";
    batteryboxopened=false;
}
function showbat(){
    var batel = document.querySelector(".batter_date_details");
    batel.style.transform="translateX(-100%)skew(0deg)scale(1)";
    batel.style.top=50+"px";
    batteryboxopened=true;
}
function batboxtask(){
    if(batteryboxopened){
        hidebat();
    }
    else{
        showbat();
    }
}


datetime();
function datetime(){
    var time = new Date();
    var timearea = document.querySelector(".time");
    var dateaea = document.querySelector(".datedet");
    var dayarea= document.querySelector(".daywhich");
    var daytype = time.getDay();
    var hours = time.getHours().toString();
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var datem = time.getDate();
    var month = time.getMonth();
    var year = time.getFullYear()
    switch(daytype){
        case 1:
            daytype="Monday";
            break;
        case 2:
            daytype="Tuesday";
            break;
        case 3:
            daytype="Wednessday";
            break;
        case 4:
            daytype="Thusday";
            break;
        case 5:
            daytype="Friday";
            break;
        case 6:
            daytype="Saturday";
            break;
        case 7:
            daytype="Sunday";
            break;
        default:
            daytype="Funday";
            break;
    }
    switch(month){
        case 0:
            month="January";
            break;
        case 1:
            month="February";
            break;
        case 2:
            month="March";
            break;
        case 3:
            month="April";
            break;
        case 4:
            month="May";
            break;
        case 5:
            month="June";
            break;
        case 6:
            month="July";
            break;
        case 7:
            month="August";
            break;
        case 8:
            month="Spetember";
            break;
        case 9:
            month="October";
            break;
        case 10:
            month="November";
            break;
        case 11:
            month="December";
            break;
        default:
            month="Erron";
            break;
    }
    if(hours.length==1){
        hours="0"+time.getHours().toString()
    }
    if(minutes.length==1){
        minutes="0"+time.getMinutes().toString()
    }
    if(seconds.length==1){
        seconds="0"+time.getSeconds().toString()
    }
    timearea.innerHTML=`${hours}:${minutes}:${seconds}`;
    dateaea.innerHTML=`${datem}&nbsp;${month}&nbsp;${year}`;
    dayarea.innerHTML=daytype;
    setTimeout(datetime,1)
}

hidedatebox();

function hidedatebox(){
    var datebox= document.querySelector(".date_area");
    dateboxopen=false;
    datebox.style.transform="translateX(0%)scale(0)skew(45deg)";
    datebox.style.top=-100+"px";
}
function showdatebox(){
    var datebox= document.querySelector(".date_area");
    dateboxopen=true;
    datebox.style.transform="translateX(-100%)scale(1)skew(0deg)";
    datebox.style.top=50+"px";
}
function dateboxtask(){
    if(dateboxopen){
        hidedatebox();
    }
    else{
        showdatebox();
    }
}


function Alert(mess){
    var bt = document.createElement("div");
    bt.classList.add("botmes");
    bt.textContent=mess;
    bt.addEventListener("animationend",()=>{
        bt.remove();
    })
    document.body.appendChild(bt);
}
maximizeWindow();
maximizegallery();
closewindow();
closegallery();
