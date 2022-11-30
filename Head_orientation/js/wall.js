//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-24-2022                             */
/*      wall.js                                 */
/*      v2_0_1                                  */
//////////////////////////////////////////////////

//Contains the various global functions for the operation of the program.





var wall = {
  
  
    wallSettings : {
        height : 250,//px // height of the graph
        width : 750,//px // width of the graph
        
        marginTop : 10,//px // margin of the graph compared to the top of the window
        marginLeft : 25,//px // margin of the graph compared to the left of the window
        
        
        yScale : {}, // value to pixel for the y conversion obj
        xScale : {}, // value to pixel for the x conversion obj
        
        
        idMoles : [], // list of all moles ID
        objMoles : [], // list of all moles obj (points into SVG) 
        
        
        xMin : -5,//minimum x value for the graph
        xMax : 5,//maximum x value for the graph
        
        yMin : -3,//minimum y value for the graph
        yMax : 3,//maximum y value for the graph
        
        
        pointSize : 20,//px
        pointColor : "#D6D6D6", // default color of the moles
        
        laserSize : 10,//px
        laserColor : "red", // default color of the laser
        
        indexMole : 0, // curent lines into moles CSV file
        indexLaser : 0, // curent lines into laser CSV file
        indexController : 0, //curent lines into controller CSV file
        
    },
    
    
    
    test : function(){
        return 1;
    },
    
    addGraphMoles : function() {
    
        // Average offset between each mole in X
        var xStep = ((data.wallInfo[1]["x_extrem"]*2)/((data.wallInfo[0]["n_col_row"])-1))
        // Average offset between each mole in Y
        var yStep = ((data.wallInfo[1]["y_extrem"]*2)/((data.wallInfo[1]["n_col_row"])-1))

        for(var c = 0;c < (data.wallInfo[0]["n_col_row"]); c++){//for each columns
          for(var r = 0;r < (data.wallInfo[1]["n_col_row"]); r++){//for each rows

            if(
              ((c == 0) && (r == 0))||// Mole lower left
              ((c == 0) && (r == (data.wallInfo[1]["n_col_row"])-1))|| // Mole lower right
              ((c == (data.wallInfo[0]["n_col_row"]-1)) && (r == 0))|| // mole top left
              ((c == (data.wallInfo[0]["n_col_row"]-1)) && (r == (data.wallInfo[1]["n_col_row"])-1)) // mole top right
            ){
               // If the mole is at an angle
            }else{
              // Tf the mole is not at an angle
              if((r+1) < 10){
                wall.wallSettings.idMoles.push((c+1)+"0"+(r+1));
              }else{
                wall.wallSettings.idMoles.push((c+1)+""+(r+1));
              }
              
              // Adding moles to the wall
              wall.wallSettings.objMoles.push(
                    utils.addPointOnSvg(graphWall,wall.wallSettings.pointSize,wall.wallSettings.xScale(data.wallInfo[0]["x_extrem"] + xStep*c),wall.wallSettings.yScale(data.wallInfo[0]["y_extrem"] + yStep*r),wall.wallSettings.pointColor)
               );
            }
          }
        }
    },
    
    changeMolesState : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(wall.wallSettings.indexDate) >= new Date(data.aed[wall.wallSettings.indexMole]['Timestamp'])){
            while(new Date(wall.wallSettings.indexDate) >= new Date(data.aed[wall.wallSettings.indexMole]['Timestamp'])){
                
                // Retrieve the object associated with the mole
                var thisMole = wall.wallSettings.objMoles[wall.wallSettings.idMoles.indexOf(parseInt(data.aed[wall.wallSettings.indexMole]['MoleId']))];
                
                // Event playback
                switch(data.aed[wall.wallSettings.indexMole]['Event']){
                    
                    case "Mole Spawned":
                        // Change the background color of the mole with a time transition
                        utils.changeFillElement(thisMole,"green",1000);
                        wall.wallSettings.indexMole++;
                        break;
                    
                    case "Fake Mole Spawned":
                        utils.changeFillElement(thisMole,"#FFFB00",1000);
                        wall.wallSettings.indexMole++;
                        break;
                    
                    case "Mole Expired":
                        utils.changeFillElement(thisMole, wall.wallSettings.pointColor,1000);
                        wall.wallSettings.indexMole++
                        break;
                    
                    case "Fake Mole Expired":
                        utils.changeFillElement(thisMole, wall.wallSettings.pointColor,1000);
                        wall.wallSettings.indexMole++
                        break;
                    
                    case "Mole Hit":
                        utils.changeFillElement(thisMole,"orange",0);
                        utils.changeFillElement(thisMole, wall.wallSettings.pointColor,1000);
                        wall.wallSettings.indexMole++
                        break;
                    
                    case "Fake Mole Hit":
                        utils.changeFillElement(thisMole,"red",0);
                        utils.changeFillElement(thisMole, wall.wallSettings.pointColor,1000);
                        wall.wallSettings.indexMole++
                        break;
                    
                    default:
                        wall.wallSettings.indexMole++
                        break;
                
                }
            }
        }
    },
    
    // Hand over all moles in their original state
    resetMoles : function(){
        wall.wallSettings.objMoles.forEach((element,index) => { 
            wall.wallSettings.objMoles[index]
            .attr('fill',  wall.wallSettings.pointColor);
        });
    },
      
    // Add a laser's element on the wall  
    addLaser : function(){
        wall.wallSettings.objLaser = utils.addPointOnSvg(graphWall, wall.wallSettings.laserSize,-100,-100,"red");
    },
    
    // Convert laser's coordinates to pixel values
    getLaserCoordPx : function(i){
        var coord = [0,0];
        
        if(data.ad[i]['RightControllerLaserPosWorldX'] != "NULL")coord[0] =  wall.wallSettings.xScale(data.ad[i]['RightControllerLaserPosWorldX']);
        if(data.ad[i]['RightControllerLaserPosWorldY'] != "NULL")coord[1] =  wall.wallSettings.yScale(data.ad[i]['RightControllerLaserPosWorldY']);
        
        return coord;
    },
    
    changeLaserLocation : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(DataArrays.indexDate) >= new Date(data.ad[wall.wallSettings.indexLaser]['Timestamp'])){
            while(new Date(DataArrays.indexDate) >= new Date(data.ad[wall.wallSettings.indexLaser]['Timestamp'])){
            
                wall.wallSettings.objLaser.transition()
                    .duration(14)
                    .attr('cx', function(d) { return wall.getLaserCoordPx(wall.wallSettings.indexLaser )[0]; })
                    .attr('cy', function(d) { return wall.getLaserCoordPx(wall.wallSettings.indexLaser )[1]; });
                    
                wall.wallSettings.indexLaser++
                
            }
        }
    }

};


