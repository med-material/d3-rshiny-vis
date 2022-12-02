//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-01-2022                             */
/*      wall.js                                 */
/*      v2_1_0                                  */
//////////////////////////////////////////////////
//Contains the various global functions for the operation of the program.


var wall = {
  
    settings : {
        WallSection : {}, // Section for the wall
        
        height : 0, //px // Height of the graph
        width : 0, //px // Width of the graph
        
        marginTop : 0, //px // Margin of the graph compared to the top of the window
        marginLeft : 0, //px // Margin of the graph compared to the left of the window
        
        
        yScale : {}, // Value to pixel for the y conversion obj
        xScale : {}, // Value to pixel for the x conversion obj
        
        
        idMoles : [], // List of all moles ID
        objMoles : [], // List of all moles obj (points into SVG) 
        
        
        xMin : -5, // Minimum x value for the graph
        xMax : 5, // Maximum x value for the graph
        
        yMin : -3, // Minimum y value for the graph
        yMax : 3, // Maximum y value for the graph
        
        
        molesSize : 0, //px
        molesColor : "", // Default color of the moles
        
        laserSize : 0,//px
        laserColor : "", // Default color of the laser
        objLaser : {},
        
        indexMole : 0, // Curent lines into moles CSV file
        indexLaser : 0, // Curent lines into laser CSV file
    },
    
    
    
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){

        wall.settings.height = newSettings.height;
        wall.settings.width = newSettings.width;
        
        wall.settings.marginTop = newSettings.marginTop;
        wall.settings.marginLeft = newSettings.marginLeft;
        
        wall.settings.molesSize = newSettings.molesSize;
        wall.settings.molesColor = newSettings.molesColor;
        
        wall.settings.laserSize = newSettings.laserSize;
        wall.settings.laserColor = newSettings.laserColor;
        
        // Calculation of the extreme values of the wall
        //                     =                       Xmax   +   the size of a mole * 2
        wall.settings.xMax = data.wallInfo[1]["x_extrem"] + (data.wallInfo[1]["x_extrem"]/(data.wallInfo[0]["n_col_row"]))*2;
        wall.settings.xMin = -wall.settings.xMax;
        
        wall.settings.yMax = data.wallInfo[1]["y_extrem"] + (data.wallInfo[1]["y_extrem"]/(data.wallInfo[1]["n_col_row"]))*2;
        wall.settings.yMin = -wall.settings.yMax;
        
        
        // Declaration of the wall domains
        wall.settings.yScale = d3.scaleLinear() 
          .domain([(wall.settings.yMax), (wall.settings.yMin)]) 
          .range([(0), (wall.settings.height)]);
        
        wall.settings.xScale = d3.scaleLinear()
          .domain([(wall.settings.xMin), (wall.settings.xMax)]) 
          .range([(0), (wall.settings.width)]);
    },
    
    createSection : function(back){
      
        // Add SVG for wall display   
        wall.settings.WallSection = utils.addElement("svg",back,
                  [
                    "width:"+ wall.settings.width+"px;"+
                    "height:"+ wall.settings.height+"px;"+
                    "position:absolute;"+
                    "margin-left:"+( wall.settings.marginLeft)+"px;"+
                    "margin-top:"+ wall.settings.marginTop+"px"
                  ]
              ).append("g"); 
        
    },
    
    addMolesToWall : function() {
    
        // Average offset between each mole in X
        var xStep = ((data.wallInfo[1]["x_extrem"]*2)/((data.wallInfo[0]["n_col_row"])-1));
        // Average offset between each mole in Y
        var yStep = ((data.wallInfo[1]["y_extrem"]*2)/((data.wallInfo[1]["n_col_row"])-1));

        for(var c = 0;c < (data.wallInfo[0]["n_col_row"]); c++){ //For each columns
          for(var r = 0;r < (data.wallInfo[1]["n_col_row"]); r++){ //For each rows

            if(
              ((c == 0) && (r == 0))||// Mole lower left
              ((c == 0) && (r == (data.wallInfo[1]["n_col_row"])-1))|| // Mole lower right
              ((c == (data.wallInfo[0]["n_col_row"]-1)) && (r == 0))|| // Mole top left
              ((c == (data.wallInfo[0]["n_col_row"]-1)) && (r == (data.wallInfo[1]["n_col_row"])-1)) // Mole top right
            ){
              // If the mole is at an angle
            }else{
              // If the mole is not at an angle
              if((r+1) < 10){
                wall.settings.idMoles.push(parseInt((c+1)+"0"+(r+1)));
              }else{
                wall.settings.idMoles.push(parseInt((c+1)+""+(r+1)));
              };
              
              // Adding moles to the wall
              wall.settings.objMoles.push(
                    utils.addPointOnSvg(wall.settings.WallSection,wall.settings.molesSize,wall.settings.xScale(data.wallInfo[0]["x_extrem"] + xStep*c),wall.settings.yScale(data.wallInfo[0]["y_extrem"] + yStep*r),wall.settings.molesColor)
               );
            };
          };
        };
    },
    
    changeMolesState : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(ChartOptions.DataArrays.indexDate) >= new Date(data.aed[wall.settings.indexMole]['Timestamp'])){
            while(new Date(ChartOptions.DataArrays.indexDate) >= new Date(data.aed[wall.settings.indexMole]['Timestamp'])){

                // Retrieve the object associated with the mole
                var thisMole = wall.settings.objMoles[wall.settings.idMoles.indexOf(parseInt(data.aed[wall.settings.indexMole]['MoleId']))];
                
                // Event playback
                switch(data.aed[wall.settings.indexMole]['Event']){
                    
                    case "Mole Spawned":
                        // Change the background color of the mole with a time transition
                        utils.changeFillElement(thisMole,"green",1000);
                        wall.settings.indexMole++;
                        break;
                    
                    case "Fake Mole Spawned":
                        utils.changeFillElement(thisMole,"#FFFB00",1000);
                        wall.settings.indexMole++;
                        break;
                    
                    case "Mole Expired":
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.settings.indexMole++
                        break;
                    
                    case "Fake Mole Expired":
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.settings.indexMole++
                        break;
                    
                    case "Mole Hit":
                        utils.changeFillElement(thisMole,"orange",0);
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.settings.indexMole++
                        break;
                    
                    case "Fake Mole Hit":
                        utils.changeFillElement(thisMole,"red",0);
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.settings.indexMole++
                        break;
                    
                    default:
                        wall.settings.indexMole++
                        break;
                
                };
            };
        };
    },
    
    // Hand over all moles in their original state
    resetMoles : function(){
        wall.settings.objMoles.forEach((element,index) => { 
            wall.settings.objMoles[index]
            .attr('fill',  wall.settings.molesColor);
        });
    },
      
    // Add a laser's element on the wall  
    addLaser : function(){
        wall.settings.objLaser = utils.addPointOnSvg(wall.settings.WallSection, wall.settings.laserSize,-100,-100,"red");
    },
    
    // Convert laser's coordinates to pixel values
    getLaserCoordPx : function(i){
        var coord = [0,0];
        
        if(data.ad[i]['RightControllerLaserPosWorldX'] != "NULL")coord[0] =  wall.settings.xScale(data.ad[i]['RightControllerLaserPosWorldX']);
        if(data.ad[i]['RightControllerLaserPosWorldY'] != "NULL")coord[1] =  wall.settings.yScale(data.ad[i]['RightControllerLaserPosWorldY']-1.5);
        
        return coord;
    },
    
    changeLaserLocation : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(ChartOptions.DataArrays.indexDate) >= new Date(data.ad[wall.settings.indexLaser]['Timestamp'])){
            while(new Date(ChartOptions.DataArrays.indexDate) >= new Date(data.ad[wall.settings.indexLaser]['Timestamp'])){
            
                wall.settings.objLaser.transition()
                    .duration(14)
                    .attr('cx', function(d) { return wall.getLaserCoordPx(wall.settings.indexLaser )[0]; })
                    .attr('cy', function(d) { return wall.getLaserCoordPx(wall.settings.indexLaser )[1]; });
                    
                wall.settings.indexLaser++;
                
            };
        };
    },
};


//******************************************************************************
//******************************************************************************