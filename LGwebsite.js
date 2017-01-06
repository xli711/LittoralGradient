var dinLight;
var dinMedium;

var table;
var lMap;
var iconPlus;
var iconPlusColor;
var imgHeight;
var imgWidth;

var x0;
var y0;
var y1;
var x1;
var w1;
var x2;
var w2;
var d2;
var sqDist;
var sqSize;
var luRadius;
var yOffset;

var oW = 3300;
var oH = 2550;

var timer;
var labelHeight;
var easing = .25;
var imgEasing = .05;

var sites = [];
var marker = [];
var num = [];
var minYear = 1978;
var maxYear = 2030;
var crtYear = 2017;

var sortMethod;
var reSort = false;
var scroll = false;

function preload(){
  table = loadTable("data/data.csv", "csv", "header");
  dinLight = loadFont('assets/fonts/DINNextLTPro-Light.otf');
  dinReg = loadFont('assets/fonts/DINNextLTPro-Regular.otf');
  dinMedium = loadFont('assets/fonts/DINNextLTPro-Medium.otf');
}

function setup() {
  y0 = 80;
  y1 = 50;
  imgHeight = 74;
  imgWidth = oW*imgHeight/oH;
  print(imgHeight);
  createCanvas(windowWidth, imgHeight*table.getRowCount()+imgHeight*5+y0+y1);
  
  x0 = windowWidth/4+10;
  luRadius = 6;
  w2 = 200;
  x1 = x0+imgWidth+w2;
  w1 = width-30-x1;
  x2 = x0+imgWidth;
  d2 = 15;
  sqDist = 100;
  sqSize = 8;
  yOffset = 0;
  labelHeight = 18;
  
  //DRAW TITLE
  var titleDiv = createDiv('THE LITTORAL GRADIENT ATLAS');
  titleDiv.id('title');
  var subTitleDiv = createDiv('THE SAMUEL TAK LEE MIT REAL ESTATE ENTREPRENEURSHIP LAB<br>THE LEVENTHAL CENTER FOR ADVANCED URBANISM');
  subTitleDiv.id('subtitle');
  var desDiv = createDiv('Coastal land reclamation has been a major source of development land in China in recent years. This project looks into the range of land reclamation projects in China and their change over time.');
  desDiv.id('description');
  var bgDiv = createDiv('');
  bgDiv.id('panelBg');
  var divLine = createDiv('');
  divLine.id('divLine');
  
  print(table.getRowCount() + " total rows in table");
  print(table.getColumnCount() + " total columns in table");
  print(table.getColumn('Name'));
  
  //BASEMAP
  lMap = L.map('mapid', {
    center:[36.2532661, 115.9405198],
    zoom: 4.4,
    zoomControl: false,
    zoomSnap: 0.1
  });
  L.tileLayer('https://api.mapbox.com/styles/v1/qiuwaishan/ciuaotk5q002u2ipiqdxmpcen/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicWl1d2Fpc2hhbiIsImEiOiJjaWVsb3BicnYwMDJ6NHFrbnU2cHVncm56In0.XNz-KrnFme0pU8MdGtYShQ', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    detectRetina: true,
  }).addTo(lMap);
  L.control.zoom({position:'bottomleft'}).addTo(lMap);
  
  //PROJECT MARKERS
  iconPlus = L.icon({
    iconUrl: 'assets/plus.png',
    iconRetinaUrl: 'assets/plus@2x.png',
    iconSize: [12, 12]
  });
  
  iconPlusColor = L.icon({
    iconUrl: 'assets/plusColor.png',
    iconRetinaUrl: 'assets/plusColor@2x.png',
    iconSize: [12, 12]
  });
  
  for (var i=0; i<table.getRowCount(); i++){
    //CREATE DATA
    num[i] = table.getString(i, 'Number');
    
    var dataPoint = {};
    dataPoint.id = num[i];
    dataPoint.figure = createImg('assets/figures/'+num[i]+'.png');
    dataPoint.div = createDiv('');
    dataPoint.name = table.getString(i, 'Name');
    dataPoint.province = table.getString(i, 'Province');
    dataPoint.city = table.getString(i, 'City');
    dataPoint.area = table.getString(i, 'AreaSqkm');
    dataPoint.cost = table.getString(i, 'CostBillion');
    dataPoint.waterbody = table.getString(i, 'Waterbody');
    dataPoint.population = table.getString(i, 'Population');
    dataPoint.use = table.getString(i, 'Use');
    dataPoint.startYear = table.getString(i, 'StartYear');
    dataPoint.compYear = table.getString(i, 'CompleteYear');
    dataPoint.status = table.getString(i, 'Status');
    dataPoint.xCoord = table.getString(i, 'Xcoord');
    dataPoint.yCoord = table.getString(i, 'Ycoord');
    dataPoint.aYear1 = table.getString(i, 'AY1');
    dataPoint.aYear2 = table.getString(i, 'AY2');
    dataPoint.aYear3 = table.getString(i, 'AY3');
    
    dataPoint.residential = table.getString(i, 'Residential');
    dataPoint.institutional = table.getString(i, 'Institutional');
    dataPoint.commercial = table.getString(i, 'Commercial');
    dataPoint.office = table.getString(i, 'Office');
    dataPoint.industrial = table.getString(i, 'Industrial');
    dataPoint.logistics = table.getString(i, 'Logistics');
    dataPoint.recreational = table.getString(i, 'Recreational');
    dataPoint.ecological = table.getString(i, 'Ecological');
    dataPoint.agricultural = table.getString(i, 'Agricultural');
    
    sites[i] = dataPoint;
    
    sites[i].div.id('sites');
    
    sites[i].aerial1 = createImg('assets/aerials/'+num[i]+'_'+sites[i].aYear1+'.jpg');
    sites[i].aerial2 = createImg('assets/aerials/'+num[i]+'_'+sites[i].aYear2+'.jpg');
    sites[i].aerial3 = createImg('assets/aerials/'+num[i]+'_'+sites[i].aYear3+'.jpg');
    
    sites[i].aerial1.hide();
    sites[i].aerial2.hide();
    sites[i].aerial3.hide();
    
    sites[i].aOp1 = 0;
    sites[i].aOp2 = 0;
    sites[i].aOp3 = 0;
    sites[i].targetAOp1 = 0;
    sites[i].targetAOp2 = 0;
    sites[i].targetAOp3 = 0;
  }
  sortMethod = location1;
  sites.sort(sortMethod);
  
  for (var i in sites){
    if (num[i]==1){
      sites[i].figure.highlighted = true;
      sites[i].figure.popup = true;
      sites[i].figure.currentHeight = imgHeight*5;
      sites[i].figure.targetHeight = imgHeight*5;
      sites[i].figure.currentOpacity = 1;
      sites[i].figure.targetOpacity = 1;
    } else{
      sites[i].figure.highlighted = false;
      sites[i].figure.popup = false;
      sites[i].figure.currentHeight = 0;
      sites[i].figure.targetHeight = 0;
      sites[i].figure.currentOpacity = 0;
      sites[i].figure.targetOpacity = 0;
    }
    
    //ADD MARKERS
    marker[i] = L.marker([sites[i].xCoord, sites[i].yCoord], {icon: iconPlus});
    marker[i].addTo(lMap);
    
    sites[i].figure.marker = marker[i];
    
    //CREAT POPUP
    
    sites[i].div.mouseClicked(function() {
      for (var j in sites){
        if (sites[j].div == this){
          showPopup(sites[j].figure);
        }
      }
    });
    
    marker[i].on('click', function(e){
      for (var j in sites) {
        if (sites[j].figure.marker == this) {
          showPopup(sites[j].figure);
        }
      }
    });
    
    //SET MARKER COLOR
    sites[i].div.mouseOver(function(){
     hltSite(this);
    });
    sites[i].div.mouseOut(function(){
      deHltSite(this);
    });
    
    //YEAR ANIMATION
    sites[i].xAY1 = map(sites[i].aYear1, minYear, maxYear, x1, x1+w1);
    sites[i].xAY2 = map(sites[i].aYear2, minYear, maxYear, x1, x1+w1);
    sites[i].xAY3 = map(sites[i].aYear3, minYear, maxYear, x1, x1+w1);
  }
  
  
  
}

function draw() {
  timer = second();
  yOffset = 0;
  
  if (reSort){
    sites.sort(sortMethod);
    for (var i in sites){
      sites[i].aerial1.hide();
      sites[i].aerial2.hide();
      sites[i].aerial3.hide();
      if (num[i]==1){
        sites[i].figure.highlighted = true;
        sites[i].figure.popup = true;
        sites[i].figure.currentHeight = imgHeight*5;
        sites[i].figure.targetHeight = imgHeight*5;
        sites[i].figure.currentOpacity = 1;
        sites[i].figure.targetOpacity = 1;
      } else{
        sites[i].figure.highlighted = false;
        sites[i].figure.popup = false;
        sites[i].figure.currentHeight = 0;
        sites[i].figure.targetHeight = 0;
        sites[i].figure.currentOpacity = 0;
        sites[i].figure.targetOpacity = 0;
      }
    }
    reSort = false;
  }
  background(255);
  
  if (dist(mouseX, mouseY, x0+10+sqDist, 35)<=25 || dist(mouseX, mouseY, x0+10+sqDist, 63)<=25 || dist(mouseX, mouseY, x0+10+sqDist*2, 35)<=25 || dist(mouseX, mouseY, x0+10+sqDist*2, 63)<=25 || dist(mouseX, mouseY, x0+10+sqDist*3, 35)<=25 || dist(mouseX, mouseY, x0+10+sqDist*3, 63)<=25) {
    cursor(HAND);
  } else {
    cursor(NORMAL);
  }
  noFill();
  stroke(150);
  strokeWeight(0.5);
  line(x0, y0, width, y0);
  
  //SORTING
  noStroke();
  fill(50);
  textFont(dinMedium);
  textSize(15);
  textAlign(LEFT, CENTER);
  text('SORT BY:', x0, 12);
  textFont(dinReg);
  textSize(12);
  textAlign(CENTER, CENTER);
  text('LOCATION', x0+10+sqDist, 12);
  text('SIZE', x0+10+sqDist*2, 12);
  text('START YEAR', x0+10+sqDist*3, 12);
  
  ellipseMode(CENTER);
  fill(230);
  ellipse(x0+10+sqDist, 35, 25);
  ellipse(x0+10+sqDist, 63, 25);
  ellipse(x0+10+sqDist*2, 35, 25);
  ellipse(x0+10+sqDist*2, 63, 25);
  ellipse(x0+10+sqDist*3, 35, 25);
  ellipse(x0+10+sqDist*3, 63, 25);
  
  if (sortMethod == location1){
    fill('#ff7200');
  } else {
    fill(150);
  }
  triangle(x0+10+sqDist, 28, x0+4+sqDist, 39, x0+16+sqDist, 39);
  
  if (sortMethod == location2){
    fill('#ff7200');
  } else {
    fill(150);
  }
  triangle(x0+10+sqDist, 70, x0+4+sqDist, 59, x0+16+sqDist, 59);
  
  if (sortMethod == size1){
    fill('#ff7200');
  } else {
    fill(150);
  }
  triangle(x0+10+sqDist*2, 28, x0+4+sqDist*2, 39, x0+16+sqDist*2, 39);
  
  if (sortMethod == size2){
    fill('#ff7200');
  } else {
    fill(150);
  }
  triangle(x0+10+sqDist*2, 70, x0+4+sqDist*2, 59, x0+16+sqDist*2, 59);
  
  if (sortMethod == start1){
    fill('#ff7200');
  } else {
    fill(150);
  }
  triangle(x0+10+sqDist*3, 28, x0+4+sqDist*3, 39, x0+16+sqDist*3, 39);
  
  if (sortMethod == start2){
    fill('#ff7200');
  } else {
    fill(150);
  }
  triangle(x0+10+sqDist*3, 70, x0+4+sqDist*3, 59, x0+16+sqDist*3, 59);
  
  for (var i in sites){
    sites[i].figure.currentHeight += easing*(sites[i].figure.targetHeight - sites[i].figure.currentHeight);
    sites[i].figure.currentOpacity += easing*(sites[i].figure.targetOpacity - sites[i].figure.currentOpacity);
    //DISPLAY FIGURES
    sites[i].figure.position(x0, y0+imgHeight*i + yOffset);
    sites[i].figure.size(imgWidth, imgHeight);
    
    sites[i].div.position(x0, y0+imgHeight*i+yOffset);
    sites[i].div.size(width-x0, imgHeight);
    
    //PROJECT NAMES
    noStroke();
    textSize(12);
    textAlign(LEFT, BOTTOM);
    textFont(dinMedium);
    
    if (sites[i].figure.highlighted == true || sites[i].figure.popup == true){
      fill(245);
      rect(x0, y0+imgHeight*i + yOffset, windowWidth-x0, imgHeight);
      fill('#ff7200');
      text(sites[i].name, x2, y0+imgHeight*i + yOffset, 200, 40);
      sites[i].figure.marker.setIcon(iconPlusColor);
    } else {
      fill(0);
      text(sites[i].name, x2, y0+imgHeight*i + yOffset, 200, 40);
      sites[i].figure.marker.setIcon(iconPlus);
    }
    
    //fill(100);
    //textSize(8);
    //textFont(dinLight);
    //text(sites[i].province+', '+sites[i].city, x0+imgWidth, y0+imgHeight*i+imgHeight*0.25);
    
    //START & COMPLETE YEARS
    noFill();
    stroke(200);
    strokeWeight(0.5);
    line(x1, y0+imgHeight*i+imgHeight/2 + yOffset, width, y0+imgHeight*i+imgHeight/2 + yOffset);
    
    var xStart = map(sites[i].startYear, minYear, maxYear, x1, x1+w1);
    var xComp = map(sites[i].compYear, minYear, maxYear, x1, x1+w1);
    
    ellipseMode(CENTER);
    if (sites[i].status == 'In Progress'){
      stroke(150);
      strokeWeight(3);
      line(xStart, y0+imgHeight*i+imgHeight/2 + yOffset, xComp, y0+imgHeight*i+imgHeight/2 + yOffset);
      strokeWeight(1.5);
      fill(255);
      ellipse(xComp, y0+imgHeight*i+imgHeight/2 + yOffset, 6);
      fill(150);
      ellipse(xStart, y0+imgHeight*i+imgHeight/2 + yOffset, 6);
    } else if (sites[i].status == 'Failed'){
      stroke(150);
      strokeWeight(3);
      line(xStart, y0+imgHeight*i+imgHeight/2 + yOffset, xComp, y0+imgHeight*i+imgHeight/2 + yOffset);
      strokeWeight(2);
      line(xComp-3, y0+imgHeight*i+imgHeight/2+3 + yOffset, xComp+3, y0+imgHeight*i+imgHeight/2-3 + yOffset);
      line(xComp-3, y0+imgHeight*i+imgHeight/2-3 + yOffset, xComp+3, y0+imgHeight*i+imgHeight/2+3 + yOffset);
      fill(150);
      ellipse(xStart, y0+imgHeight*i+imgHeight/2 + yOffset, 6);
    } else {
      stroke(0);
      strokeWeight(3);
      line(xStart, y0+imgHeight*i+imgHeight/2 + yOffset, xComp, y0+imgHeight*i+imgHeight/2 + yOffset);
      strokeWeight(1.5);
      fill(0);
      ellipse(xComp, y0+imgHeight*i+imgHeight/2 + yOffset, 6);
      ellipse(xStart, y0+imgHeight*i+imgHeight/2 + yOffset, 6);
    }
    
    noStroke();
    fill(100);
    textSize(8);
    textAlign(CENTER, BOTTOM);
    if (sites[i].figure.popup == false){
      text(sites[i].startYear, xStart, y0+imgHeight*i+imgHeight/2-5 + yOffset);
      text(sites[i].compYear, xComp, y0+imgHeight*i+imgHeight/2-5 + yOffset);
    }
    
    //LAND USES
    noStroke();
    rectMode(CORNER);
    if (sites[i].residential == 'TRUE'){
      fill('#ffc000');
    } else {
      fill(230);
    }
      rect(x2, y0+imgHeight*i+imgHeight*0.62 + yOffset, luRadius, luRadius);
    
    if (sites[i].institutional == 'TRUE'){
      fill('#fd5cff');
    } else {
      fill(230);
    }
      rect(x2+d2, y0+imgHeight*i+imgHeight*0.62 + yOffset, luRadius, luRadius);
    
    if (sites[i].commercial == 'TRUE'){
      fill('#ea5757');
    } else {
      fill(230);
    }
      rect(x2+d2*2, y0+imgHeight*i+imgHeight*0.62 + yOffset, luRadius, luRadius);
    
    if (sites[i].office == 'TRUE'){
      fill('#ff9239');
    } else {
      fill(230);
    }
      rect(x2+d2*3, y0+imgHeight*i+imgHeight*0.62 + yOffset, luRadius, luRadius);
    
    if (sites[i].industrial == 'TRUE'){
      fill('#666666');
    } else {
      fill(230);
    }
      rect(x2+d2*4, y0+imgHeight*i+imgHeight*0.62 + yOffset, luRadius, luRadius);
    
    if (sites[i].logistics == 'TRUE'){
      fill('#39a9ff');
    } else {
      fill(230);
    }
      rect(x2+d2*5, y0+imgHeight*i+imgHeight*0.62 + yOffset, luRadius, luRadius);
    
    if (sites[i].recreational == 'TRUE'){
      fill('#c8e620');
    } else {
      fill(230);
    }
      rect(x2+d2*6, y0+imgHeight*i+imgHeight*0.62 + yOffset, luRadius, luRadius);
    
    if (sites[i].ecological == 'TRUE'){
      fill('#68e2ea');
    } else {
      fill(230);
    }
      rect(x2+d2*7, y0+imgHeight*i+imgHeight*0.62 + yOffset, luRadius, luRadius);
    
    if (sites[i].agricultural == 'TRUE'){
      fill('#0e8521');
    } else {
      fill(230);
    }
      rect(x2+d2*8, y0+imgHeight*i+imgHeight*0.62 + yOffset, luRadius, luRadius);
      
       yOffset += sites[i].figure.currentHeight;

  }
  
  //LAND USE CODES
  fill(50);
  textSize(12);
  textFont(dinReg);
  textAlign(LEFT, CENTER);
  text('URBAN', width-sqDist*3-sqSize/2-10, 12);
  text('INDUSTRIAL', width-sqDist*2-sqSize/2-10, 12);
  text('ENVIRONMENTAL', width-sqDist-sqSize/2-10, 12);
  rectMode(CENTER);
  fill('#ffc000');
  rect(width-sqDist*3-10, 28, sqSize, sqSize);
  fill('#fd5cff');
  rect(width-sqDist*3-10, 42, sqSize, sqSize);
  fill('#ea5757');
  rect(width-sqDist*3-10, 56, sqSize, sqSize);
  fill('#ff9239');
  rect(width-sqDist*3-10, 70, sqSize, sqSize);
  fill('#666666');
  rect(width-sqDist*2-10, 28, sqSize, sqSize);
  fill('#39a9ff');
  rect(width-sqDist*2-10, 42, sqSize, sqSize);
  fill('#c8e620');
  rect(width-sqDist-10, 28, sqSize, sqSize);
  fill('#68e2ea');
  rect(width-sqDist-10, 42, sqSize, sqSize);
  fill('#0e8521');
  rect(width-sqDist-10, 56, sqSize, sqSize);
  fill(50);
  textSize(10);
  textAlign(LEFT, CENTER);
  text('residential', width-sqDist*3+sqSize-10, 28);
  text('institutional', width-sqDist*3+sqSize-10, 42);
  text('commercial', width-sqDist*3+sqSize-10, 56);
  text('office', width-sqDist*3+sqSize-10, 70);
  text('manufacturing', width-sqDist*2+sqSize-10, 28);
  text('logistics', width-sqDist*2+sqSize-10, 42);
  text('recreational', width-sqDist+sqSize-10, 28);
  text('ecological', width-sqDist+sqSize-10, 42);
  text('agricultural', width-sqDist+sqSize-10, 56);
  
  rectMode(CORNER);
  
  //YEAR GRIDS
  var gridYear = [1978, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025, 2030];
  for (var y in gridYear){
    noFill();
    stroke(230);
    strokeWeight(0.2);
    var d = map(gridYear[y], minYear, maxYear, 0, w1);
    line(x1+d, y0, x1+d, height-y1);
    
    //text(gridYear[y], x1+d, y0);
  }
  //CURRENT YEAR
  stroke('#ff7200');
  var dCrtYear = map(crtYear, minYear, maxYear, 0, w1);
  line(x1+dCrtYear, y0, x1+dCrtYear, height-y1);
  
  
  for (var i in sites){

    sites[i].figure.currentHeight += easing*(sites[i].figure.targetHeight - sites[i].figure.currentHeight);
    sites[i].figure.currentOpacity += easing*(sites[i].figure.targetOpacity - sites[i].figure.currentOpacity);
    sites[i].aOp1 += imgEasing*(sites[i].targetAOp1 - sites[i].aOp1);
    sites[i].aOp2 += imgEasing*(sites[i].targetAOp2 - sites[i].aOp2);
    sites[i].aOp3 += imgEasing*(sites[i].targetAOp3 - sites[i].aOp3);
    
    fill(245);
    noStroke();
    rect(x0, y0+imgHeight*i+imgHeight, windowWidth-x0, sites[i].figure.currentHeight);
    //sites[i].targetAOp1 = 0;
    //sites[i].targetAOp2 = 0;
    //sites[i].targetAOp3 = 0;
    
    //DRAW POPUP
    if (sites[i].figure.popup == true){
      if(scroll){
        scrollTo(sites[i].div);
        scroll = false;
      }
      
      sites[i].aerial1.show();
      sites[i].aerial2.show();
      sites[i].aerial3.show();
      
      sites[i].aerial1.style('opacity', sites[i].aOp1);
      sites[i].aerial2.style('opacity', sites[i].aOp2);
      sites[i].aerial3.style('opacity', sites[i].aOp3);
      yOffset += imgHeight*5;
      fill(245);
      noStroke();
      //rect(x0, y0+imgHeight*i+imgHeight, windowWidth-x0, imgHeight*5);
      
      fill(50, sites[i].figure.currentOpacity*255);
      textAlign(LEFT, TOP);
      textFont(dinMedium);
      textSize(12);
      text('Location:', x0+700, y0+imgHeight*i+imgHeight, w1, 40);
      text('Water Body:', x0+700, y0+imgHeight*i+imgHeight+labelHeight*2, w1, 40);
      text('Area:', x0+700, y0+imgHeight*i+imgHeight+labelHeight*4, w1, 40);
      text('Investment:', x0+700, y0+imgHeight*i+imgHeight+labelHeight*6, w1, 40);
      text('Planned Population:', x0+700, y0+imgHeight*i+imgHeight+labelHeight*8, w1, 40);
      text('Land Uses:', x0+700, y0+imgHeight*i+imgHeight+labelHeight*10, windowWidth-x2-650, 40);
      textFont(dinLight);
      text(sites[i].city+', '+sites[i].province, x0+700, y0+imgHeight*i+imgHeight+labelHeight-2, w1, 40);
      text(sites[i].waterbody, x0+700, y0+imgHeight*i+imgHeight+labelHeight*3-2, w1, 40);
      text(sites[i].area+' sqkm', x0+700, y0+imgHeight*i+imgHeight+labelHeight*5-2, w1, 40);
      text(sites[i].cost+' billion Yuan', x0+700, y0+imgHeight*i+imgHeight+labelHeight*7-2, w1, 40);
      text(sites[i].population, x0+700, y0+imgHeight*i+imgHeight+labelHeight*9-2, w1, 40);
      text(sites[i].use, x0+700, y0+imgHeight*i+imgHeight+labelHeight*11-2, windowWidth-x2-650, 40);
      
      textFont(dinMedium);
      if(timer%6 == 0 ||timer%6 == 1){
        sites[i].targetAOp1 = 1;
        sites[i].targetAOp2 = 0;
        sites[i].targetAOp3 = 0;
        sites[i].aerial1.position(x0+20, y0+imgHeight*i+imgHeight);
        sites[i].aerial1.size(650, 362.6);
        fill('#ff7200');
        ellipse(sites[i].xAY1, y0+imgHeight*i+imgHeight/2, 8);
        fill(100);
        textAlign(CENTER, BOTTOM);
        text(sites[i].aYear1, sites[i].xAY1, y0+imgHeight*i+imgHeight/2-5);
      } else if (timer%6 == 2 ||timer%6 == 3){
        sites[i].targetAOp2 = 1;
        sites[i].targetAOp1 = 0;
        sites[i].targetAOp3 = 0;
        sites[i].aerial2.position(x0+20, y0+imgHeight*i+imgHeight);
        sites[i].aerial2.size(650, 362.6);
        fill('#ff7200');
        ellipse(sites[i].xAY2, y0+imgHeight*i+imgHeight/2, 8);
        fill(100);
        textAlign(CENTER, BOTTOM);
        text(sites[i].aYear2, sites[i].xAY2, y0+imgHeight*i+imgHeight/2-5);
      } else if (timer%6 == 4 ||timer%6 == 5){
        sites[i].aerial3.position(x0+20, y0+imgHeight*i+imgHeight);
        sites[i].aerial3.size(650, 362.6);
        sites[i].targetAOp3 = 1;
        sites[i].targetAOp1 = 0;
        sites[i].targetAOp2 = 0;
        fill('#ff7200');
        ellipse(sites[i].xAY3, y0+imgHeight*i+imgHeight/2, 8);
        fill(100);
        textAlign(CENTER, BOTTOM);
        text(sites[i].aYear3, sites[i].xAY3, y0+imgHeight*i+imgHeight/2-5);
      }
      
      
    }
    
  }
  
  
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function hltSite(m){
  for (var i in sites) {
    if (sites[i].div == m) {
      sites[i].figure.marker.setIcon(iconPlusColor);
      sites[i].figure.highlighted = true;
    }
  }
}

function deHltSite(m){
  for (var i in sites) {
    if (sites[i].div == m) {
      sites[i].figure.marker.setIcon(iconPlus);
      sites[i].figure.highlighted = false;
    }
  }
}

function showPopup(m) {
   m.popup = !m.popup;
   scroll = true;
  for (var i in sites) {
    if (sites[i].figure != m || !m.popup) {
      sites[i].figure.popup = false;
      sites[i].figure.targetHeight = 0;
      sites[i].figure.targetOpacity = 0;
      sites[i].targetAOp1 = 0;
      sites[i].targetAOp2 = 0;
      sites[i].targetAOp3 = 0;
      sites[i].aerial1.hide();
      sites[i].aerial2.hide();
      sites[i].aerial3.hide();
      sites[i].figure.marker.setIcon(iconPlus);
    }
    else if (m.popup) {
      sites[i].figure.targetHeight = imgHeight*5;
      sites[i].figure.targetOpacity = 1;
      sites[i].figure.marker.setIcon(iconPlusColor);
    }
  }
}

function scrollTo(n){
  var body = document.body;
  for (var i in sites) {
    if(sites[i].div == n){
      body.scrollTop = imgHeight*i-40;
    }
  }
}


function start1(a, b){
   if (a.startYear > b.startYear) {
    return -1;
  }
  if (a.startYear < b.startYear) {
    return 1;
  }
  return 0;
}

function start2(a, b){
   if (a.startYear < b.startYear) {
    return -1;
  }
  if (a.startYear > b.startYear) {
    return 1;
  }
  return 0;
}

function size1(a, b){
  if (float(a.area) > float(b.area)) {
    return -1;
  }
  if (float(a.area) < float(b.area)) {
    return 1;
  }
  return 0;
}

function size2(a, b){
  if (float(a.area) < float(b.area)) {
    return -1;
  }
  if (float(a.area) > float(b.area)) {
    return 1;
  }
  return 0;
}

function location1(a, b){
  if (float(a.xCoord) > float(b.xCoord)) {
    return -1;
  }
  if (float(a.xCoord) < float(b.xCoord)) {
    return 1;
  }
  return 0;
}

function location2(a, b){
  if (float(a.xCoord) < float(b.xCoord)) {
    return -1;
  }
  if (float(a.xCoord) > float(b.xCoord)) {
    return 1;
  }
  return 0;
}

function mouseClicked() {
  if (dist(mouseX, mouseY, x0+10+sqDist, 35)<=25) {
    sortMethod = location1;
    reSort = true;
  }
  if (dist(mouseX, mouseY, x0+10+sqDist, 63)<=25) {
    sortMethod = location2;
    reSort = true;
  }
  if (dist(mouseX, mouseY, x0+10+sqDist*2, 35)<=25) {
    sortMethod = size1;
    reSort = true;
  }
  if (dist(mouseX, mouseY, x0+10+sqDist*2, 63)<=25) {
    sortMethod = size2;
    reSort = true;
  }
  if (dist(mouseX, mouseY, x0+10+sqDist*3, 35)<=25) {
    sortMethod = start1;
    reSort = true;
  }
  if (dist(mouseX, mouseY, x0+10+sqDist*3, 63)<=25) {
    sortMethod = start2;
    reSort = true;
  }
}