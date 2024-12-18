var canvas = document.getElementById("main_canvas");
var context = canvas.getContext('2d');
var MAX_ITERATION = 60;
var duration =50;
let canvas_width = canvas.width;
let canvas_height = canvas.height;
let frames = [];
var isMenuToggled = false;
var rendering = false;
let optionToggle = [];
let minheight = []
const colors = new Array(64);
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
var rad = 360/2/colors.length;
var x=0;
for(var clr = 0; clr<colors.length;clr++){
    x+=rad;
    colors[clr] = hslToHex(x, 100, 50);
}
colors[0] = "#000000";
function changeWidth(){
    let newWidth = document.getElementById("width").value;
    if(!rendering){
        canvas.width = newWidth;
        canvas_width = canvas.width;
    }
    if(canvas.width>700){
        document.body.style.flexDirection = "column";
    }
    else{
        document.body.style.flexDirection = "row";
    }
}
function changeSpeed(){
    let newDuration = document.getElementById("speed").value;
    duration = newDuration;
}
function changeHeight(){
    let newHeight = document.getElementById("height").value;
    if(!rendering){
        canvas.height = newHeight;
        canvas_height = canvas.height;
    }
}
function changeIterations(){
    let Iterations = document.getElementById("iterations").value;
    if(!rendering){
        MAX_ITERATION = Iterations;
    }
}
function loadToggle(){
    var stylesheet = document.getElementById("generated");
    var menu = document.getElementsByClassName('menu')[0];
    var length = menu.children.length;
    for(var i=0;i<length-1;i++){
        optionToggle.push(false);
        menu.children[i].children[0].setAttribute("onclick",`toggleOption(${i})`);
        menu.children[i].classList.add("option");
        menu.children[i].style.borderColor = hslToHex(360+10*i,100,50);
        menu.children[i].children[0].classList.add("option-button");
        menu.children[i].children[1].classList.add("expand");
        minheight.push(menu.children[i].children[1].clientHeight+20);
        menu.children[i].children[1].style.height = "0px";
    }
}
var lightdarkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
function toggleDayNight(){
    let button = document.getElementsByClassName("color-scheme-switch")[0];
    if(!lightdarkmode){
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        button.textContent="Light";
    }else{
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        button.textContent="Dark";
    }
    button.textContent+=" Mode";
    lightdarkmode = !lightdarkmode;
}
function toggleOption(index){
    let option = document.getElementsByClassName('menu')[0].children[index];
    if(!optionToggle[index])
        option.children[1].style.height = minheight[index]+"px";
    else
        option.children[1].style.height = "0px";
    optionToggle[index] = !optionToggle[index];
}
function closeToggle(){
    for(var i=0;i<optionToggle.length;i++){
        let option = document.getElementsByClassName('menu')[0].children[i];
        option.children[1].style.height = "0px"
        optionToggle[i] = false;
    }
}
function toggleMenu(){
    let menu = document.getElementsByClassName('menu')[0];
    if(!isMenuToggled) {
        menu.style.width = "250px";
    }
    else {
        menu.style.width = "0px";
        //closeToggle();
    }
        isMenuToggled = !isMenuToggled;
}
function julia(z, c, power) {
    let i = 0, p, d;
    do {
        // Calculate z^n (complex power)
        let zxPow = Math.pow(z.x * z.x + z.y * z.y, power / 2);
        let angle = Math.atan2(z.y, z.x) * power;

        p = {
            x: zxPow * Math.cos(angle),
            y: zxPow * Math.sin(angle)
        };

        z = {
            x: p.x + c.x,
            y: p.y + c.y
        };

        d = Math.sqrt(z.x * z.x + z.y * z.y);
        i += 1;
    } while (d <= 2 && i < MAX_ITERATION);

    return [i, d <= 2];
}
function mandelbrot(c, modyfikacja) {
    let z = { x: 0.0, y: 0.0 }, i = 0, p, d;
    do {
        let zxPow = Math.pow(z.x * z.x + z.y * z.y, modyfikacja / 2);
        let angle = Math.atan2(z.y, z.x) * modyfikacja;
        
        p = {
            x: zxPow * Math.cos(angle),
            y: zxPow * Math.sin(angle)
        };
        
        z = {
            x: p.x + c.x,
            y: p.y + c.y
        };
        d = Math.sqrt(z.x * z.x + z.y * z.y);
        i += 1;
    } while (d <= 2 && i < MAX_ITERATION);
    
    return [i, d <= 2];
}
var REAL_SET = { start: -2.2, end: 2.2 };
var IMAGINARY_SET = { start: -1.65, end: 1.65 };
function changeRealSet(){
    if(!rendering){
        var newstart = parseFloat(document.getElementById("realstart").value);
        var newend = parseFloat(document.getElementById("realend").value);
        REAL_SET = {start: newstart, end: newend};
    }
}
function resetSets(){
    REAL_SET = { start: -2.2, end: 2.2 };
    IMAGINARY_SET = { start: -1.65, end: 1.65 };
    document.getElementById("realstart").value = REAL_SET.start;
    document.getElementById("realend").value = REAL_SET.end;
    document.getElementById("imstart").value = IMAGINARY_SET.start;
    document.getElementById("imend").value = IMAGINARY_SET.end;
}
function divideSets(){
    changeRealSetDiv();
    changeImaginarySetDiv();
}
function changeRealSetDiv(){
    if(!rendering){
        var newstart = document.getElementById("realstart");
        var newend = document.getElementById("realend");
        var divide = parseFloat(document.getElementById("divide").value);
        var newstart_val = parseFloat(newstart.value);
        var newend_val = parseFloat(newend.value);
        newstart_val = newstart_val/divide;
        newend_val = newend_val/divide;
        newstart.value = newstart_val;
        newend.value = newend_val;
        REAL_SET = {start: newstart_val, end: newend_val};
    }
}
function changeImaginarySetDiv(){
    if(!rendering){
        var newstart = document.getElementById("imstart");
        var newend = document.getElementById("imend");
        var divide = parseFloat(document.getElementById("divide").value);
        var newstart_val = parseFloat(newstart.value);
        var newend_val = parseFloat(newend.value);
        newstart_val = newstart_val/divide;
        newend_val = newend_val/divide;
        newstart.value = newstart_val;
        newend.value = newend_val;
        IMAGINARY_SET = {start: newstart_val, end: newend_val};
    }
}
function changeImaginarySet(){
    if(!rendering){
        var newstart = parseFloat(document.getElementById("imstart").value);
        var newend = parseFloat(document.getElementById("imend").value);
        IMAGINARY_SET = {start: newstart, end: newend};
    }
}
var stala = 1;
function draw() {
    clearFrames();
    stala = parseFloat(document.getElementById("stala").value);
    drawMandelbrot(stala);
    rendering=false;
}
function enableButtons(boolean){
    let buttons = document.getElementsByClassName("disable");
    var i =0;
    while(i<buttons.length){
        buttons[i].disabled = !boolean;i++;
    }
}
async function runAniamteJulia(){
    let j = "julia";
    var animateOn = parseInt(document.getElementById("juliaSelect").value);
    var from = parseFloat(document.getElementById(j+"From").value);
    var to = parseFloat(document.getElementById(j+"To").value);
    var step = parseFloat(document.getElementById(j+"Step").value);
    let power = parseFloat(document.getElementById("power").value); // Polynomial power
    let cx = parseFloat(document.getElementById("cx").value);       // Real part of c
    let cy = parseFloat(document.getElementById("cy").value); 
    enableButtons(false);
    switch(animateOn){
        case 1:
        animateJuliaCx(from,to,step,cy,power);
        break;
        case 2:
        animateJuliaCy(from,to,step,cx,power);    
        break;
        case 3:
        animateJuliaPower(from,to,step,cx,cy);
        break;
    }
    
}
async function runAnimateMandelbrot(){
    let m = "mandelbrot";
    var from = parseFloat(document.getElementById(m+"From").value);
    var to = parseFloat(document.getElementById(m+"To").value);
    var step = parseFloat(document.getElementById(m+"Step").value);
    enableButtons(false);
    animateMandelbrot(from,to,step);
}
async function animateMandelbrot(from,to,step){
    clearFrames();
    let maxvalue= expectedFrames(from,to,step);
    if(validateRange(from,to,step)){
        for(var i=from;i<=to;i+=step){
            drawMandelbrot(i);
            frames.push(canvas.toDataURL());
            updateProgress(frames.length,maxvalue);
            console.log(i);
            await sleep(1);
        }
    }
    playAnimation();
}
function clearCanvas(){
    context.clearRect(0, 0, canvas_width, canvas_height);
}
function clearFrames(){
    stopPlayback();
    animationIndex = 0;
    frames.length = 0;
    rendering = true;
}
function drawMandelbrot(stala){
    for (let i = 0; i < canvas_width; i++) {
        for (let j = 0; j < canvas_height; j++) {
            complex = {
                x: REAL_SET.start + (i / canvas_width) * (REAL_SET.end - REAL_SET.start),
                y: IMAGINARY_SET.start + (j / canvas_height) * (IMAGINARY_SET.end - IMAGINARY_SET.start)
            };
            const [m, isMandelbrotSet] = mandelbrot(complex,stala);
            context.fillStyle = colors[isMandelbrotSet ? 0 : (m % colors.length - 1) + 1];
            context.fillRect(i, j, 1, 1);
        }
    }
}
function drawJuliaData(cx,cy,power){
    context.clearRect(0, 0, canvas_width, canvas_height);

    for (let i = 0; i < canvas_width; i++) {
        for (let j = 0; j < canvas_height; j++) {
            let z = {
                x: REAL_SET.start + (i / canvas_width) * (REAL_SET.end - REAL_SET.start),
                y: IMAGINARY_SET.start + (j / canvas_height) * (IMAGINARY_SET.end - IMAGINARY_SET.start)
            };
            let c = { x: cx, y: cy };
            const [m, isJuliaSet] = julia(z, c, power);
            context.fillStyle = colors[isJuliaSet ? 0 : (m % colors.length - 1) + 1];
            context.fillRect(i, j, 1, 1);
        }
    }
}
function drawJulia() {
    let power = parseFloat(document.getElementById("power").value); // Polynomial power
    let cx = parseFloat(document.getElementById("cx").value);       // Real part of c
    let cy = parseFloat(document.getElementById("cy").value);       // Imaginary part of c
    clearFrames();
    drawJuliaData(cx,cy,power);
    rendering=false;
}
function validateRange(from,to,step){
    return (from<to&&step>0)||(from>to&&step<0)
}
function expectedFrames(from,to,step){
    var expectedFrames = 0;
    if(validateRange(from,to,step)){
        for(var i=from;i<=to;i+=step){
            expectedFrames++;
        }
        return expectedFrames;
    }
    return 0;
}
function updateProgress(value,maxvalue){
    let progress = document.getElementById("progressbar");
    progress.setAttribute("max",maxvalue);
    progress.value = value;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function animateJuliaPower(from,to,step,cx,cy){
    clearFrames();
    let maxvalue= expectedFrames(from,to,step);
    if(validateRange(from,to,step)){
        for(var i=from;i<=to;i+=step){
            drawJuliaData(cx,cy,i);
            frames.push(canvas.toDataURL());
            updateProgress(frames.length,maxvalue);
            await sleep(1);
        }
    }
    playAnimation();
}
async function animateJuliaCx(from,to,step,cy,power){
    clearFrames();
    let maxvalue= expectedFrames(from,to,step);
    if(validateRange(from,to,step)){
        for(var i=from;i<=to;i+=step){
            drawJuliaData(i,cy,power);
            frames.push(canvas.toDataURL());
            updateProgress(frames.length,maxvalue);
            await sleep(1);
        }
    }
    playAnimation();
}
async function animateJuliaCy(from,to,step,cx,power){
    clearFrames();
    let maxvalue= expectedFrames(from,to,step);
    if(validateRange(from,to,step)){
        for(var i=from;i<=to;i+=step){
            drawJuliaData(cx,i,power);
            frames.push(canvas.toDataURL());
            updateProgress(frames.length,maxvalue);
            await sleep(1);
        }
    }
    playAnimation();
}
async function animateJulia(from,to,step,power){
    clearFrames();
    let maxvalue= expectedFrames(from,to,step);
    if(validateRange(from,to,step)){
        for(var i=from;i<=to;i+=step){
            drawJuliaData(i,i,power);
            frames.push(canvas.toDataURL());
            updateProgress(frames.length,maxvalue);
            await sleep(1);
        }
    }
    playAnimation();
}
animationIndex=0;
var timeoutID;
function playAnimation(){
    rendering = false;
    enableButtons(true);
    if(frames.length==0) return;
    let img = new Image();
    img.src = frames[animationIndex];

    img.onload = () => {
        context.clearRect(0, 0, canvas_width, canvas_height);
        context.drawImage(img, 0, 0);

        animationIndex = (animationIndex + 1) % frames.length; // Loop through frames
        timeoutID = setTimeout(playAnimation, duration); // Delay between frames (adjust for speed)
    };
}
function stopPlayback() {
    if (timeoutID !== null) {
        clearTimeout(timeoutID); // Clear the animation timeout
        timeoutID = null; // Reset the timeout ID
    }
}