//////////////////////////////////////////////////
/*                                              */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-24-2022                             */
/*      wall_v2_0_0.js                          */
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
        
        
        xMin : -5,//minimum x value for the graph
        xMax : 5,//maximum x value for the graph
        
        yMin : -3,//minimum y value for the graph
        yMax : 3,//maximum y value for the graph
        
        
        pointSize : 20,//px
        pointColor : "#D6D6D6", // default color of the moles
        
        laserSize : 10,//px
        laserColor : "red", // default color of the laser
        
    },
    
    test : function(){
        return 1;
    },
    
    addGraphMoles : function() {
    
        var xStep = ((data.wallInfo[1]["x_extrem"]*2)/((data.wallInfo[0]["n_col_row"])-1))
        var yStep = ((data.wallInfo[1]["y_extrem"]*2)/((data.wallInfo[1]["n_col_row"])-1))

        for(var c = 0;c < (data.wallInfo[0]["n_col_row"]); c++){//for each columns
          for(var r = 0;r < (data.wallInfo[1]["n_col_row"]); r++){//for each rows

            if(
              ((c == 0) && (r == 0))||
              ((c == 0) && (r == (data.wallInfo[1]["n_col_row"])-1))||
              ((c == (data.wallInfo[0]["n_col_row"]-1)) && (r == 0))||
              ((c == (data.wallInfo[0]["n_col_row"]-1)) && (r == (data.wallInfo[1]["n_col_row"])-1))
            ){
               //if the mole is at an angle
            }else{
              //if the mole is not at an angle
              if((r+1) < 10){
                DataArrays.idMoles.push((c+1)+"0"+(r+1));
              }else{
                DataArrays.idMoles.push((c+1)+""+(r+1));
              }
              
              DataArrays.objMoles.push(//creation of the mole
                    utils.addPointOnSvg(graphWall,wall.wallSettings.pointSize,wall.wallSettings.xScale(data.wallInfo[0]["x_extrem"] + xStep*c),wall.wallSettings.yScale(data.wallInfo[0]["y_extrem"] + yStep*r),wall.wallSettings.pointColor)
               );
            }
          }
        }
    },
    
    changeMolesState : function(){
    
        if(new Date(DataArrays.indexDate) >= new Date(data.aed[DataArrays.indexMole]['Timestamp'])){
            while(new Date(DataArrays.indexDate) >= new Date(data.aed[DataArrays.indexMole]['Timestamp'])){
            
                var thisMole = DataArrays.objMoles[DataArrays.idMoles.indexOf(parseInt(data.aed[DataArrays.indexMole]['MoleId']))];
                
                switch(data.aed[DataArrays.indexMole]['Event']){
                    
                    case "Mole Spawned":
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
    
    
    resetMoles : function(){
        DataArrays.objMoles.forEach((element,index) => { 
            DataArrays.objMoles[index]
            .attr('fill',  wall.wallSettings.pointColor);
        });
    },
        
    addLaser : function(){
        DataArrays.objLaser = utils.addPointOnSvg(graphWall, wall.wallSettings.laserSize,-100,-100,"red");
    },
    
    getLaserCoordPx : function(i){
        var coord = [0,0];
        
        if(data.ad[i]['RightControllerLaserPosWorldX'] != "NULL")coord[0] =  wall.wallSettings.xScale(data.ad[i]['RightControllerLaserPosWorldX']);
        if(data.ad[i]['RightControllerLaserPosWorldY'] != "NULL")coord[1] =  wall.wallSettings.yScale(data.ad[i]['RightControllerLaserPosWorldY']);
        
        return coord;
    },
    
    changeLaserLocation : function(){
    
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


