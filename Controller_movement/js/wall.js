//////////////////////////////////////////////////
/*                                              */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-22-2022                             */
/*      wall.js                                 */
/*      v1_0_0                                  */
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
        
        
        xMin : -4,//minimum x value for the graph
        xMax : 4,//maximum x value for the graph
        
        yMin : -1,//minimum y value for the graph
        yMax : 5,//maximum y value for the graph
        
        
        pointSize : 20,//px
        pointColor : "#D6D6D6", // default color of the moles
        
        laserSize : 10,//px
        laserColor : "red", // default color of the laser
        
    },
    
    test : function(){
        return 1;
    },
    
    addGraphMoles : function() {
        data.am.forEach(function(e,i){
          DataArrays.idMoles.push(e.id);
          
          // Adding moles to the wall
          DataArrays.objMoles.push(
                utils.addPointOnSvg(graphWall,wall.wallSettings.pointSize,wall.getMolesCoordPx(i)[0],wall.getMolesCoordPx(i)[1],wall.wallSettings.pointColor)
            );
        });
    },
    
    changeMolesState : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(DataArrays.indexDate) >= new Date(data.aed[DataArrays.indexMole]['Timestamp'])){
            while(new Date(DataArrays.indexDate) >= new Date(data.aed[DataArrays.indexMole]['Timestamp'])){
            
                // Retrieve the object associated with the mole
                var thisMole = DataArrays.objMoles[DataArrays.idMoles.indexOf(parseInt(data.aed[DataArrays.indexMole]['MoleId']))];
                
                // Event playback
                switch(data.aed[DataArrays.indexMole]['Event']){
                    
                    case "Mole Spawned":
                      // Change the background color of the mole with a time transition
                        utils.changeFillElement(thisMole,"green",1000);
                        DataArrays.indexMole++;
                        break;
                    
                    case "Fake Mole Spawned":
                        utils.changeFillElement(thisMole,"#FFFB00",1000);
                        DataArrays.indexMole++;
                        break;
                    
                    case "Mole Expired":
                        utils.changeFillElement(thisMole, wall.wallSettings.pointColor,1000);
                        DataArrays.indexMole++
                        break;
                    
                    case "Fake Mole Expired":
                        utils.changeFillElement(thisMole, wall.wallSettings.pointColor,1000);
                        DataArrays.indexMole++
                        break;
                    
                    case "Mole Hit":
                        utils.changeFillElement(thisMole,"orange",0);
                        utils.changeFillElement(thisMole, wall.wallSettings.pointColor,1000);
                        DataArrays.indexMole++
                        break;
                    
                    case "Fake Mole Hit":
                        utils.changeFillElement(thisMole,"red",0);
                        utils.changeFillElement(thisMole, wall.wallSettings.pointColor,1000);
                        DataArrays.indexMole++
                        break;
                    
                    default:
                        DataArrays.indexMole++
                        break;
                
                }
            }
        }
    },
    
    // Hand over all moles in their original state
    resetMoles : function(){
        DataArrays.objMoles.forEach((element,index) => { 
            DataArrays.objMoles[index]
            .attr('fill',  wall.wallSettings.pointColor);
        });
    },
    
    // Convert mole's coordinates to pixel values
    getMolesCoordPx : function(i){
        var coord = [0,0];
        
        coord[0] =  wall.wallSettings.xScale(data.am[i]['x']);
        coord[1] =  wall.wallSettings.yScale(data.am[i]['y']);
        
        return coord;
    },
    
    // Add a laser's element on the wall  
    addLaser : function(){
        DataArrays.objLaser = utils.addPointOnSvg(graphWall, wall.wallSettings.laserSize,-100,-100,"red");
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
        if(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexLaser]['Timestamp'])){
            while(new Date(DataArrays.indexDate) >= new Date(data.ad[DataArrays.indexLaser]['Timestamp'])){
            
                DataArrays.objLaser.transition()
                    .duration(14)
                    .attr('cx', function(d) { return wall.getLaserCoordPx(DataArrays.indexLaser )[0]; })
                    .attr('cy', function(d) { return wall.getLaserCoordPx(DataArrays.indexLaser )[1]; });
                    
                DataArrays.indexLaser++
                
            }
        }
    }

};


