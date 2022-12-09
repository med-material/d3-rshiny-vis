//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-09-2022                             */
/*      wall.js                                 */
/*      v2_2_1                                  */
//////////////////////////////////////////////////
//Contains all the functions necessary for the operation of the wall display.


var wall = {
  
    settings : {
        height : 0, //px // Height of the graph
        width : 0, //px // Width of the graph
        
        marginTop : 0, //px // Margin of the graph compared to the top of the window
        marginLeft : 0, //px // Margin of the graph compared to the left of the window
        
        molesSize : 0, //px
        molesColor : "", // Default color of the moles
        
        laserSize : 0,//px
        laserColor : "", // Default color of the laser
        
        borderSize : 0,//px
        borderColor : "",
        
        viewportBoundariesBorderSize : 0,//px
        viewportBoundariesBorderColor : "",
        viewportBoundariesBackColor : "",
    },
    
    scale : {
        yScale : {}, // Value to pixel for the y conversion obj
        xScale : {}, // Value to pixel for the x conversion obj
    },
    
    element : {
        wallSection : {}, // Section for the wall
        objLaser : {},
        objViewportBoundaries : {},
    },
    
    arrays : {
        idMoles : [], // List of all moles ID
        objMoles : [], // List of all moles obj (points into SVG) 
    },
    
    xMin : -5, // Minimum x value for the graph
    xMax : 5, // Maximum x value for the graph
    
    yMin : -3, // Minimum y value for the graph
    yMax : 3, // Maximum y value for the graph
    
    indexMole : 0, // Curent lines into moles CSV file
    indexLaser : 0, // Curent lines into laser CSV file
    indexViewportBoundaries : 0,
        
        
    
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){

        wall.settings = newSettings;
        
        // Calculation of the extreme values of the wall
        //                     =                       Xmax   +   the size of a mole * 2
        wall.xMax = data.wallInfo[1]["x_extrem"] + (data.wallInfo[1]["x_extrem"]/(data.wallInfo[0]["n_col_row"]))*2;
        wall.xMin = -wall.xMax;
        
        wall.yMax = data.wallInfo[1]["y_extrem"] + (data.wallInfo[1]["y_extrem"]/(data.wallInfo[1]["n_col_row"]))*2;
        wall.yMin = -wall.yMax;
        
        
        // Declaration of the wall domains
        wall.scale.yScale = d3.scaleLinear() 
          .domain([(wall.yMax), (wall.yMin)]) 
          .range([(0), (wall.settings.height)]);
        
        wall.scale.xScale = d3.scaleLinear()
          .domain([(wall.xMin), (wall.xMax)]) 
          .range([(0), (wall.settings.width)]);
    },
    
    createSection : function(back){
      
        // Add SVG for wall display   
        wall.element.wallSection = utils.addElement("svg",back,
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
                wall.arrays.idMoles.push(parseInt((c+1)+"0"+(r+1)));
              }else{
                wall.arrays.idMoles.push(parseInt((c+1)+""+(r+1)));
              };
              
              // Adding moles to the wall
              wall.arrays.objMoles.push(
                    utils.addPointOnSvg(wall.element.wallSection,wall.settings.molesSize,wall.scale.xScale(data.wallInfo[0]["x_extrem"] + xStep*c),wall.scale.yScale(data.wallInfo[0]["y_extrem"] + yStep*r),wall.settings.molesColor)
               );
            };
          };
        };
    },
    
    addWallBorder : function(){
          newWallBorder = function(id,x1,x2,y1,y2){
              wall.element.wallSection.append("line")
                  .attr("id", id)
                  .attr("class", "axis")
                  .attr("x1", x1)   
                  .attr("y1", y1 )     
                  .attr("x2", x2)    
                  .attr("y2", y2 )
                  .style("stroke", wall.settings.borderColor)
                  .style('stroke-width', wall.settings.borderSize+'px')
                  .style("fill", "none");
          };
          
          newWallBorder("bottomWallBorder",0,wall.settings.width,(wall.settings.height-(wall.settings.borderSize/2)),(wall.settings.height-(wall.settings.borderSize/2)));
          newWallBorder("topWallBorder",0,wall.settings.width,(0+(wall.settings.borderSize/2)),(0+(wall.settings.borderSize/2)));
          
          
          newWallBorder("leftWallBorder",(0+(wall.settings.borderSize/2)),(0+(wall.settings.borderSize/2)),(0),(wall.settings.height));
          
          newWallBorder("rightWallBorder",(wall.settings.width-(wall.settings.borderSize/2)),(wall.settings.width-(wall.settings.borderSize/2)),(0),(wall.settings.height));
    },
    
    changeMolesState : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(ChartOptions.indexDate) >= new Date(data.aed[wall.indexMole]['Timestamp'])){
            while(new Date(ChartOptions.indexDate) >= new Date(data.aed[wall.indexMole]['Timestamp'])){

                // Retrieve the object associated with the mole
                var thisMole = wall.arrays.objMoles[wall.arrays.idMoles.indexOf(parseInt(data.aed[wall.indexMole]['MoleId']))];
                
                // Event playback
                switch(data.aed[wall.indexMole]['Event']){
                    
                    case "Mole Spawned":
                        // Change the background color of the mole with a time transition
                        utils.changeFillElement(thisMole,"green",1000);
                        wall.indexMole++;
                        break;
                    
                    case "Fake Mole Spawned":
                        utils.changeFillElement(thisMole,"#FFFB00",1000);
                        wall.indexMole++;
                        break;
                    
                    case "Mole Expired":
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.indexMole++
                        break;
                    
                    case "Fake Mole Expired":
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.indexMole++
                        break;
                    
                    case "Mole Hit":
                        utils.changeFillElement(thisMole,"orange",0);
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.indexMole++
                        break;
                    
                    case "Fake Mole Hit":
                        utils.changeFillElement(thisMole,"red",0);
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.indexMole++
                        break;
                    
                    default:
                        wall.indexMole++
                        break;
                
                };
            };
        };
    },
    
    // Hand over all moles in their original state
    resetMoles : function(){
        wall.arrays.objMoles.forEach((element,index) => { 
            wall.arrays.objMoles[index]
            .attr('fill',  wall.settings.molesColor);
        });
    },
      
    // Add a laser's element on the wall  
    addLaser : function(){
        wall.element.objLaser = utils.addPointOnSvg(wall.element.wallSection, wall.settings.laserSize,-100,-100,wall.settings.laserColor);
    },
    
    // Convert laser's coordinates to pixel values
    getLaserCoordPx : function(i){
        var coord = [0,0];
        
        if(data.ad[i]['RightControllerLaserPosWorldX'] != "NULL")coord[0] =  wall.scale.xScale(data.ad[i]['RightControllerLaserPosWorldX']);
        if(data.ad[i]['RightControllerLaserPosWorldY'] != "NULL")coord[1] =  wall.scale.yScale(data.ad[i]['RightControllerLaserPosWorldY']-1.5);
        
        return coord;
    },
    
    changeLaserLocation : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(ChartOptions.indexDate) >= new Date(data.ad[wall.indexLaser]['Timestamp'])){
            while(new Date(ChartOptions.indexDate) >= new Date(data.ad[wall.indexLaser]['Timestamp'])){
            
                wall.element.objLaser.transition()
                    .duration(14)
                    .attr('cx', function(d) { return wall.getLaserCoordPx(wall.indexLaser )[0]; })
                    .attr('cy', function(d) { return wall.getLaserCoordPx(wall.indexLaser )[1]; });
                    
                wall.indexLaser++;
                
            };
        };
    },
    
    addViewportBoundaries: function(){

      poly = [{"x":0, "y":0}];

      wall.element.objViewportBoundaries = wall.element.wallSection.append('g').selectAll("polygon")
          .data([poly])
        .enter().append("polygon")
          .attr("points",function(d) { 
              return d.map(function(d) {
                  return [wall.scale.xScale(d.x),wall.scale.yScale(d.y)].join(",");
              }).join(" ");
          })
          .attr("stroke",wall.settings.viewportBoundariesBorderColor)
          .attr("stroke-width",wall.settings.viewportBoundariesBorderSize)
          .style("fill", wall.settings.viewportBoundariesBackColor)	

    },
    
    changeViewportBoundariesLocation : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(ChartOptions.indexDate) >= new Date(data.ad[wall.indexViewportBoundaries]['Timestamp'])){
            while(new Date(ChartOptions.indexDate) >= new Date(data.ad[wall.indexViewportBoundaries]['Timestamp'])){
        
                wall.element.objViewportBoundaries
                    .data([wall.getViewportBoundariesCoordPx(wall.indexViewportBoundaries)])
                    .transition()
                    .duration(14)
                    .attr('points', function(d) { 
                                      return d.map(
                                        function(d){
                                          return [d.x,d.y].join(",");
                                        }
                                      ).join(" ");
                                    }
                    );
                    
                wall.indexViewportBoundaries++;
                
            };
        };
    },
    

    getViewportBoundariesCoordPx : function(i){
        var poly = [
            {"x":wall.scale.xScale(data.ad[i]['ViewportLowerLeftX']), "y":wall.scale.yScale(data.ad[i]['ViewportLowerLeftY']-2)},
            {"x":wall.scale.xScale(data.ad[i]['ViewportLowerMiddleX']), "y":wall.scale.yScale(data.ad[i]['ViewportLowerMiddleY']-2)},
            {"x":wall.scale.xScale(data.ad[i]['ViewportLowerRightX']), "y":wall.scale.yScale(data.ad[i]['ViewportLowerRightY']-2)},
            {"x":wall.scale.xScale(data.ad[i]['ViewportUpperRightX']), "y":wall.scale.yScale(data.ad[i]['ViewportUpperRightY']-2)},
            {"x":wall.scale.xScale(data.ad[i]['ViewportUpperMiddleX']), "y":wall.scale.yScale(data.ad[i]['ViewportUpperMiddleY']-2)},
            {"x":wall.scale.xScale(data.ad[i]['ViewportUpperLeftX']), "y":wall.scale.yScale(data.ad[i]['ViewportUpperLeftY']-2)}
          ];

        return poly;
    },
    
};


//******************************************************************************
//******************************************************************************