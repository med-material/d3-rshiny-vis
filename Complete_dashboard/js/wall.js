//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      jan-10-2022                             */
/*      wall.js                                 */
/*      v2_2_3                                  */
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
        rightLaserURL : "img/rightLaser.png",
        leftLaserURL : "img/leftLaser.png",
        
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
        objLeftLaser : {},
        objRightLaser : {},
        objViewportBoundaries : {},
    },
    
    arrays : {
        idMoles : [], // List of all moles ID
        objMoles : [], // List of all moles obj (points into SVG) 
    },
    
    molesEventCount : {
        moleSpawnCount : 0,
        moleHitCount : 0,
        moleExpired : 0,
        fakeMoleSpawnCount : 0,
        fakeMoleHitCount : 0,
        fakeMoleExpired : 0,
    },
    
    lasersPosition : {
        right : {
          x : 0,
          y : 0,
          z : 0,
        },
        left : {
          x : 0,
          y : 0,
          z : 0,
        }
    },
    
    reactionTime : {
      spawnTime : {},
      currentReactionTime : 0.0,
      somme : 0,
      nValues : 0,
      average : 0,
    },
    
    displaySettings : {
      moles : false,
      viewportBoundaries : false,
      laser : false,
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
        
        wall.displaySettings.moles = true;
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
        if(new Date(chartOptions.indexDate) >= new Date(data.aed[wall.indexMole]['Timestamp'])){
            while(new Date(chartOptions.indexDate) >= new Date(data.aed[wall.indexMole]['Timestamp'])){

                // Retrieve the object associated with the mole
                var thisMole = wall.arrays.objMoles[wall.arrays.idMoles.indexOf(parseInt(data.aed[wall.indexMole]['MoleId']))];
                
                // Event playback
                switch(data.aed[wall.indexMole]['Event']){
                    
                    case "Mole Spawned":
                        // Change the background color of the mole with a time transition
                        wall.reactionTime.spawnTime = new Date(data.aed[wall.indexMole]['Timestamp']);
                        
                        utils.changeFillElement(thisMole,"green",1000);
                        wall.indexMole++;
                        wall.molesEventCount.moleSpawnCount++;

                        
                        break;
                    
                    case "Fake Mole Spawned":
                        utils.changeFillElement(thisMole,"#FFFB00",1000);
                        wall.indexMole++;
                        wall.molesEventCount.fakeMoleSpawnCount++;

                        break;
                    
                    case "Mole Expired":
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.indexMole++;
                        wall.molesEventCount.moleExpired++;
                        break;
                    
                    case "Fake Mole Expired":
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.indexMole++;
                        wall.molesEventCount.fakeMoleExpired++;
                        break;
                    
                    case "Mole Hit":
                        wall.reactionTime.currentReactionTime = ((new Date(data.aed[wall.indexMole]['Timestamp']).getTime()) - wall.reactionTime.spawnTime.getTime());
                        //wall.updateReactionTime();
                        
                        utils.changeFillElement(thisMole,"orange",0);
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.indexMole++;
                        wall.molesEventCount.moleHitCount++;
                        //infosDisplay.changeInfos2();
                        //console.log("mh: "+wall.indexMole)
                        break;
                    
                    case "Fake Mole Hit":
                        utils.changeFillElement(thisMole,"red",0);
                        utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                        wall.indexMole++;
                        wall.molesEventCount.fakeMoleHitCount++;
                        //infosDisplay.changeInfos2();
                       // console.log("fmh: "+wall.indexMole)
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
        
         wall.molesEventCount.moleSpawnCount = 0;
         wall.molesEventCount.fakeMoleSpawnCount = 0;
         wall.molesEventCount.moleExpired = 0;
         wall.molesEventCount.moleHitCount = 0;
         wall.molesEventCount.fakeMoleHitCount = 0;
    },
      
    // Add a laser's element on the wall  
    addLaser : function(){
      
      wall.element.objRightLaser = wall.element.wallSection.append("g").append('image')
            .attr('xlink:href', wall.settings.rightLaserURL)
            .attr('width', wall.settings.laserSize)
            .attr('height', wall.settings.laserSize)
            .attr("x", -100)
          	.attr("y", -100)
          	
          	
      wall.element.objLeftLaser = wall.element.wallSection.append("g").append('image')
            .attr('xlink:href', wall.settings.leftLaserURL)
            .attr('width', wall.settings.laserSize)
            .attr('height', wall.settings.laserSize)
            .attr("x", -100)
          	.attr("y", -100)
          	
       // wall.element.objLaser = utils.addPointOnSvg(wall.element.wallSection, wall.settings.laserSize,-100,-100,wall.settings.laserColor);
       
       wall.displaySettings.laser = true;
    },
    
    // Convert laser's coordinates to pixel values
    getLaserCoordPx : function(i){
        var coord = wall.getLaserCoord(i);
        return coordPx = {
          left : {
            x : wall.scale.xScale(coord.left.x),
            y : wall.scale.yScale(coord.left.y-1.5),
            z : 0,
          },
          right : {
            x : wall.scale.xScale(coord.right.x),
            y : wall.scale.yScale(coord.right.y-1.5),
            z : 0,
          }
        };

    },
    
    getLaserCoord : function(i){
        wall.lasersPosition = {
          left : {
            x : (data.ad[i]['LeftControllerLaserPosWorldX']),
            y : (data.ad[i]['LeftControllerLaserPosWorldY']),
            z : 0,
          },
          right : {
            x : (data.ad[i]['RightControllerLaserPosWorldX']),
            y : (data.ad[i]['RightControllerLaserPosWorldY']),
            z : 0,
          }
        };
        return wall.lasersPosition; 

    },
    
    changeLaserLocation : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(chartOptions.indexDate) >= new Date(data.ad[wall.indexLaser]['Timestamp'])){
            while(new Date(chartOptions.indexDate) >= new Date(data.ad[wall.indexLaser]['Timestamp'])){
              
              coords = wall.getLaserCoordPx(wall.indexLaser);
            
                if(chartOptions.mouvementSettings.rightController)wall.element.objRightLaser.transition()
                    .duration(14)
                    .attr('x', function(d) { return coords.right.x })
                    .attr('y', function(d) { return coords.right.y });
                    
                if(chartOptions.mouvementSettings.leftController)wall.element.objLeftLaser.transition()
                    .duration(14)
                    .attr('x', function(d) { return coords.left.x })
                    .attr('y', function(d) { return coords.left.y });
                
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
          .style("fill", wall.settings.viewportBoundariesBackColor);	
          
          
          wall.displaySettings.viewportBoundaries = true;

    },
    
    changeViewportBoundariesLocation : function(){
    
        // If the target date is less than the date in the index of events
        if(new Date(chartOptions.indexDate) >= new Date(data.ad[wall.indexViewportBoundaries]['Timestamp'])){
            while(new Date(chartOptions.indexDate) >= new Date(data.ad[wall.indexViewportBoundaries]['Timestamp'])){
        
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
    
    updateReactionTime : function(){
      
        wall.reactionTime.somme += wall.reactionTime.currentReactionTime;
        wall.reactionTime.nValues++;
        
        wall.reactionTime.Average = (wall.reactionTime.somme / wall.reactionTime.nValues);
    },
    
    updated : function(){
   
         if(wall.displaySettings.moles)wall.changeMolesState();
         if(wall.displaySettings.viewportBoundaries)wall.changeViewportBoundariesLocation();
         if(wall.displaySettings.laser)wall.changeLaserLocation();
    },
    
    resetIndexes : function(){
      
          wall.indexMole = 0;
          wall.indexLaser = 0;
          wall.indexViewportBoundaries = 0;
    },
    
};


//******************************************************************************
//******************************************************************************