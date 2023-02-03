//////////////////////////////////////////////////
/*      Graph D3.js ImplementCompleteDashboard  */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      feb-03-2023                             */
/*      main.js                                 */
/*      v_1_3_2                                 */
//////////////////////////////////////////////////

//


//******************************************************************************
// Variables *******************************************************************


var chartOptions = {
  
    windowSettings : {
        windowSection : {},
      
        height : 800,//px // height of the window
        width : 800,//px // width of the window
    },
    
    wallSettings : {
        height : 300,//px // height of the graph
        width : 550,//px // width of the graph
        
        marginTop : 10,//px // margin of the graph compared to the top of the window
        marginLeft : 25,//px // margin of the graph compared to the left of the window
        
        molesSize : 17,//px
        molesColor : "#D6D6D6", // default color of the moles
        
        laserSize : 40,//px
        rightLaserURL : "img/rightLaser.png",
        leftLaserURL : "img/leftLaser.png",
        
        borderSize : 2,//px
        borderColor : "grey",
        
        viewportBoundariesBorderSize : 5,//px
        viewportBoundariesBorderColor : "grey",
        viewportBoundariesBackColor : "#00000000",
    },
    
    graphSettings : {
        height : 300,//px
        width : 300,//px
        
        marginTop : 320,//px
        marginLeft : 25,//px

        valueMax : 2,
        zoom : "auto",

        pointSize : 2,//px
        pointColor : "#0055FF05", 
        borderSize : 2,//px
        borderColor : "grey",
        
        pathColor : "red",
        pathTime : 5000, //Milli seconds
        
        
        leftControllerPicURL : "img/leftController.png",
        rightControllerPicURL : "img/rightController.png",
        controllerHeight : 40,//px
        controllerWidth : 40,//px
        
        directionLookedURL : "img/directionLooked.png",
    },
    
    infosDisplaySettings : {
        height : 700,//px
        width : 260,//px
        
        marginTop : 10,//px
        marginLeft : 580,//px
    },
    
    sliderSettings : {
        height : 60,//px
        width : 450,//px
        
        marginTop : 640,//px
        marginLeft : 175,//px
        
        sBtnHeight : 50,//px
        sBtnWidth : 100,//px
        sBtnMargingTop : 5,//px
        sBtnMargingLeft : 0,
        
        sliderHeight : 50,//px
        sliderWidth : 330,
        sliderMargingTop : 5,//px
        sliderMargingLeft : 10,//px
    },
    
    mouvementSettings : {
        leftController : false,
        rightController : false,
        isStart : false,
        index : 0,
        fps :24,
        timeTot : 0,
    },
    
    mouseButton : 0,
    
    dateMin : {}, // first date into CSV files
    dateMax : {}, // last date into CSV files
    dateDif : {},
    dateRecalibrated : {},
    
    startProgTime : {},
    indexDate : {}, //curent date
    
    indexAed : 0,
    indexAd : 0,
};





  
    
//******************************************************************************    
// Prog ************************************************************************    



start();



//******************************************************************************
// Functions *******************************************************************


// Initialize the local variables of each class
function initialization(){
  
    // Delete svg created by R2D3
    document.getElementById("pageGraph").getElementsByTagName("svg")[0].remove();
    

    // Create a DIV as a background
    chartOptions.windowSettings.windowSection = utils.addElement("div",d3.select("#pageGraph"),
              [
                "width:"+chartOptions.windowSettings.width+"px;"+
                "height:"+chartOptions.windowSettings.height+"px;"+
                "position: relative"
              ]
            );
  
    // Get date min and max
    chartOptions.dateMin = new Date(data.ad[0]['Timestamp']);
    chartOptions.dateMax = new Date(data.ad[data.ad.length-2]['Timestamp']);
    
    chartOptions.mouvementSettings.timeTot = (chartOptions.dateMax.getTime() - chartOptions.dateMin.getTime())

    chartOptions.startProgTime = new Date().getTime();
    
    // Initialize index date
    chartOptions.indexDate = chartOptions.dateMin;
    chartOptions.dateRecalibrated = chartOptions.indexDate;
    
    // Update all variables
    wall.updateLocalVariables(chartOptions.wallSettings);
    
    graphController.updateLocalVariables(chartOptions.graphSettings);
    
    slider.updateLocalVariables(chartOptions.sliderSettings);
    
    infosDisplay.updateLocalVariables(chartOptions.infosDisplaySettings);
   
    for (var i = 0;i < data.activeController.length; i++) {
       
      switch (data.activeController[i]["ControllerName"]) {
           case "Controller (right)":
             chartOptions.mouvementSettings.rightController = true;
             break;
           case "Controller (left)":
             chartOptions.mouvementSettings.leftController = true;
             break;
           
           default:
             break;
      
         }
    }

    
};


function start(){
  
    // Program initialization
    initialization();
    
    
    // Create the wall section
    wall.createSection(chartOptions.windowSettings.windowSection);
    
    wall.addWallBorder();
    
    // Add moles to the wall      
    wall.addMolesToWall();
    

    wall.addViewportBoundaries();
    
    // Add laser to the wall
    wall.addLaser();
    
    
    // Create a section for the controller graph
    graphController.createSection(chartOptions.windowSettings.windowSection);

    // Add graph border
    graphController.addGraphBorder();

    // Add axis to the graph
    //graphController.addAxis();
    
    // Add controller Path
    graphController.addControllerPath();
    
    graphController.addDirectionLooked();
    
    // Add head point to the graph
    graphController.addHeadPoint();
    
    
    graphController.addNearControllerPath();
    
    // Add controller to the graph
    graphController.addControllers();
    
    
    infosDisplay.createSection(chartOptions.windowSettings.windowSection);
    
    infosDisplay.addInfos();
    
    
    // Create a section for the scrollbar
    slider.createSection(chartOptions.windowSettings.windowSection);
    
    // Add a button start/stop
    slider.addButton();
    
    // Add scrollbar
    slider.addSlider();
    
    // Start clock
    clock();
}


function clock(){
  
         
    // If is start
    if(chartOptions.mouvementSettings.isStart && (Math.round(chartOptions.mouvementSettings.index) < (chartOptions.mouvementSettings.timeTot))){
      
      if(new Date(chartOptions.indexDate) >= new Date(data.aed[chartOptions.indexAed]['Timestamp'])){
            while(new Date(chartOptions.indexDate) >= new Date(data.aed[chartOptions.indexAed]['Timestamp'])){
             
              if(chartOptions.indexAed<(data.aed.length-2)){
                chartOptions.indexAed++;
                infosDisplay.changeScrollingList();
                wall.changeMolesState();
              }else{
                resetAll();
                break;
              }
              
            }
      }

      
      if(new Date(chartOptions.indexDate) >= new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
            while(new Date(chartOptions.indexDate) >= new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
              
              if(chartOptions.indexAd<(data.ad.length-2)){
                chartOptions.indexAd++;
                
              }else{
                //console.log("reset")
                resetAll();
                break;
                
              }
            }
      }


        wall.updated();
        
        graphController.updated();
        
        infosDisplay.updated();
        

        chartOptions.mouvementSettings.index = chartOptions.mouvementSettings.index *1 + (1000 / chartOptions.mouvementSettings.fps)*1;
    
        // Get new curent index date
        chartOptions.indexDate = new Date(  chartOptions.dateMin.getTime()*1 + chartOptions.mouvementSettings.index*1 );
       
        chartOptions.dateDif = new Date(chartOptions.indexDate-chartOptions.dateMin);
        
        // change slider value
        slider.element.objSlider.value = chartOptions.mouvementSettings.index;
       
        d3.select("#sliderTimeText")
        .text(chartOptions.dateDif.getMinutes()+":"+chartOptions.dateDif.getSeconds()+"."+chartOptions.dateDif.getMilliseconds());
    };
    
 
    setTimeout(clock, (1000 / chartOptions.mouvementSettings.fps));
};



function resetAll(){
    // Reset all indexes
    /*chartOptions.indexAd = 0;
    chartOptions.indexAed = 0;
    
    // reset index date
    chartOptions.indexDate = chartOptions.dateMin;
    chartOptions.dateRecalibrated = chartOptions.indexDate;
    
    
    chartOptions.mouvementSettings.index = 0;
    
    slider.element.objSlider.value = 0;
    
    startButtonOnclick();
    
    //Reset All
    
    wall.resetAll();
    
    infosDisplay.resetAll();*/

};

window.addEventListener('mousemove', (event) => {chartOptions.mouseButton = event.buttons});

window.startButtonOnclick = function(){
  chartOptions.startProgTime = new Date().getTime();
  chartOptions.dateRecalibrated = chartOptions.indexDate;
    chartOptions.mouvementSettings.isStart = !chartOptions.mouvementSettings.isStart;
    
    //console.log(new Date(chartOptions.dateRecalibrated).getTime())
    slider.changeStartButtonValues();
};



window.sliderChange = function(){
    
    if(chartOptions.mouseButton == 1){
      
      if(slider.element.objSlider.value != chartOptions.mouvementSettings.index){
        
          // Reset moles
          wall.resetMoles();
    
          chartOptions.mouvementSettings.index = slider.element.objSlider.value;
          
          
          
          if(chartOptions.mouvementSettings.index <= chartOptions.mouvementSettings.timeTot){
              chartOptions.indexDate = new Date(  chartOptions.dateMin.getTime()*1 + chartOptions.mouvementSettings.index*1 );
              chartOptions.dateRecalibrated = chartOptions.indexDate;

              // Reset all indexes
              chartOptions.indexAd = 0;
              chartOptions.indexAed = 0;
    
              if(chartOptions.mouvementSettings.isStart == false){
                // To make a smooth transition        
                chartOptions.mouvementSettings.isStart = true;
                setTimeout(function(){chartOptions.mouvementSettings.isStart = false;},100);
              }
              
          }else{
            resetAll();
          };
          
          
      
        };
    };
};





r2d3.onResize(function(width, height) {
    return(0);
});


//******************************************************************************
//******************************************************************************