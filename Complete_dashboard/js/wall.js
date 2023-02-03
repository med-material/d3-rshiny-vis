//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      feb-03-2022                             */
/*      wall.js                                 */
/*      v2_3_2                                  */
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
    
    //indexMole : 0, // Curent lines into moles CSV file
    //indexLaser : 0, // Curent lines into laser CSV file
    //indexViewportBoundaries : 0,
        
       
    
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){

        wall.settings = newSettings;
        
        // Calculation of the extreme values of the wall
        //                     =                       Xmax   +   the size of a mole * 1.5
        wall.xMax = data.wallInfo[1]["x_extrem"] + (data.wallInfo[1]["x_extrem"]/(data.wallInfo[0]["n_col_row"]))*1.5;
        wall.xMin = data.wallInfo[0]["x_extrem"] - (data.wallInfo[1]["x_extrem"]/(data.wallInfo[0]["n_col_row"]))*1.5;
        
        wall.yMax = data.wallInfo[1]["y_extrem"] + (data.wallInfo[1]["y_extrem"]/(data.wallInfo[1]["n_col_row"]))*1.5;
        wall.yMin = data.wallInfo[0]["y_extrem"] - (data.wallInfo[1]["y_extrem"]/(data.wallInfo[1]["n_col_row"]))*1.5;
        
        
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
        var xStep = ((Math.abs(data.wallInfo[0]["x_extrem"])+Math.abs(data.wallInfo[1]["x_extrem"]))/((data.wallInfo[0]["n_col_row"])-1));
        // Average offset between each mole in Y
        var yStep = ((Math.abs(data.wallInfo[0]["y_extrem"])+Math.abs(data.wallInfo[1]["y_extrem"]))/((data.wallInfo[1]["n_col_row"])-1));

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
        //if(new Date(chartOptions.indexDate) >= new Date(data.aed[chartOptions.indexAd]['Timestamp'])){
            //while(new Date(chartOptions.indexDate) >= new Date(data.aed[chartOptions.indexAd]['Timestamp'])){

                // Retrieve the object associated with the mole
                //console.log(chartOptions.indexAed)
                var thisMole = wall.arrays.objMoles[wall.arrays.idMoles.indexOf(parseInt(data.aed[chartOptions.indexAed]['MoleId']))];
                
                // Event playback
                
                var event = data.aed[chartOptions.indexAed]['Event'];
                
                if(event == "Mole Spawned"){
                    // Change the background color of the mole with a time transition
                    wall.reactionTime.spawnTime = new Date(data.aed[chartOptions.indexAed]['Timestamp']);
                    
                    utils.changeFillElement(thisMole,"green",1000);
                    //chartOptions.indexAd++;
                    wall.molesEventCount.moleSpawnCount++;
                }else if((event == "Fake Mole Spawned") || (event == "DistractorLeft Mole Spawned") || (event == "DistractorRight Mole Spawned")){
                    utils.changeFillElement(thisMole,"#FFFB00",1000);
                    //chartOptions.indexAd++;
                    wall.molesEventCount.fakeMoleSpawnCount++;
                }else if(event == "Mole Expired"){
                    utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                    //chartOptions.indexAd++;
                    wall.molesEventCount.moleExpired++;
                }else if((event == "Fake Mole Expired") || (event == "DistractorRight Mole Expired") || (event == "DistractorLeft Mole Expired")){
                    utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                    //chartOptions.indexAd++;
                    wall.molesEventCount.fakeMoleExpired++;
                }else if(event == "Mole Hit"){
                    wall.reactionTime.currentReactionTime = ((new Date(data.aed[chartOptions.indexAed]['Timestamp']).getTime()) - wall.reactionTime.spawnTime.getTime());  
                    utils.changeFillElement(thisMole,"orange",0);
                    utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                    //chartOptions.indexAd++;
                    wall.molesEventCount.moleHitCount++;
                }else if((event == "Fake Mole Hit") || (event == "DistractorRight Mole Hit") || (event == "DistractorLeft Mole Hit")){
                    utils.changeFillElement(thisMole,"red",0);
                    utils.changeFillElement(thisMole, wall.settings.molesColor,1000);
                    //chartOptions.indexAd++;
                    wall.molesEventCount.fakeMoleHitCount++;
                }
                
            //};
        //};
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
            x : wall.scale.xScale(coord.left.x)-wall.settings.laserSize/2,
            y : wall.scale.yScale(coord.left.y)-wall.settings.laserSize/2,
            z : 0,
          },
          right : {
            x : wall.scale.xScale(coord.right.x)-wall.settings.laserSize/2,
            y : wall.scale.yScale(coord.right.y)-wall.settings.laserSize/2,
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
        //if(new Date(chartOptions.indexDate) >= new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
            //while(new Date(chartOptions.indexDate) >= new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
              
              coords = wall.getLaserCoordPx(chartOptions.indexAd);
            
                if(chartOptions.mouvementSettings.rightController)wall.element.objRightLaser.transition()
                    .duration(14)
                    .attr('x', function(d) { return coords.right.x })
                    .attr('y', function(d) { return coords.right.y });
                    
                if(chartOptions.mouvementSettings.leftController)wall.element.objLeftLaser.transition()
                    .duration(14)
                    .attr('x', function(d) { return coords.left.x })
                    .attr('y', function(d) { return coords.left.y });
                
                //chartOptions.indexAd++;

            //};
        //};
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
        //if(new Date(chartOptions.indexDate) >= new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
            //while(new Date(chartOptions.indexDate) >= new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
        
                wall.element.objViewportBoundaries
                    .data([wall.getViewportBoundariesCoordPx(chartOptions.indexAd)])
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
                    
                //chartOptions.indexAd++;
                
            //};
        //};
    },
    

    getViewportBoundariesCoordPx : function(i){
      
        var poly = [
            {"x":wall.scale.xScale(data.ad[i]['ViewportLowerLeftX']), "y":wall.scale.yScale(data.ad[i]['ViewportLowerLeftY'])},
            {"x":wall.scale.xScale(data.ad[i]['ViewportLowerMiddleX']), "y":wall.scale.yScale(data.ad[i]['ViewportLowerMiddleY'])},
            {"x":wall.scale.xScale(data.ad[i]['ViewportLowerRightX']), "y":wall.scale.yScale(data.ad[i]['ViewportLowerRightY'])},
            {"x":wall.scale.xScale(data.ad[i]['ViewportUpperRightX']), "y":wall.scale.yScale(data.ad[i]['ViewportUpperRightY'])},
            {"x":wall.scale.xScale(data.ad[i]['ViewportUpperMiddleX']), "y":wall.scale.yScale(data.ad[i]['ViewportUpperMiddleY'])},
            {"x":wall.scale.xScale(data.ad[i]['ViewportUpperLeftX']), "y":wall.scale.yScale(data.ad[i]['ViewportUpperLeftY'])}
          ];

        return poly;
    },
    
    updateReactionTime : function(){
      
        wall.reactionTime.somme += wall.reactionTime.currentReactionTime;
        wall.reactionTime.nValues++;
        
        wall.reactionTime.Average = (wall.reactionTime.somme / wall.reactionTime.nValues);
    },
    
    updated : function(){
   
         //if(wall.displaySettings.moles)wall.changeMolesState();
         if(wall.displaySettings.viewportBoundaries)wall.changeViewportBoundariesLocation();
         if(wall.displaySettings.laser)wall.changeLaserLocation();
    },
    
    resetAll : function(){
        wall.resetMoles();
        
        wall.molesEventCount = {
          moleSpawnCount : 0,
          moleHitCount : 0,
          moleExpired : 0,
          fakeMoleSpawnCount : 0,
          fakeMoleHitCount : 0,
          fakeMoleExpired : 0,
      
        };
    },
    
};


//******************************************************************************
//******************************************************************************