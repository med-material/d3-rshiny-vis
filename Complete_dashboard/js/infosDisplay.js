//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      jan-12-2023                             */
/*      infosDisplay.js                         */
/*      v1_1_0                                  */
//////////////////////////////////////////////////
//


var infosDisplay = {
  
  settings : {
        height : 0,//px
        width : 0,//px
        
        marginTop : 0,//px
        marginLeft : 0,//px
    },

    // Definition of all the sections necessary for the display
    element : { 
        infosDisplayDiv : {},
        infosDisplayListDiv : {},
        infosDisplayGameStatsSVG : {},
        infosDisplayCoordinateSVG : {},
        
        infosMotorSpaceLSVG : {},
        infosMotorSpaceRSVG : {},
        
        objControllerLeft : {},
        objControllerRight : {},
    },
    
    scale : {
        MotorSpaceXScale : {},
        MotorSpaceYScale : {},
    },

    //indexScrollingList : 0,
    //indexMotorSpace : 0,
    
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){
      
        infosDisplay.settings = newSettings;
        //console.log(data.motorSpace[chartOptions.indexAd]["MotorSpaceCenterPositionX"]+(data.motorSpace[chartOptions.indexAd]["MotorSpaceWidth"]))
        // Declaration of the graph domains
        infosDisplay.scale.MotorSpaceXScale = d3.scaleLinear()
                      .domain([
                        (
                          data.motorSpace[chartOptions.indexAd]["MotorSpaceCenterPositionX"]*1.0-(data.motorSpace[chartOptions.indexAd]["MotorSpaceWidth"])*5.0
                        ), 
                        (
                          data.motorSpace[chartOptions.indexAd]["MotorSpaceCenterPositionX"]*1.0+(data.motorSpace[chartOptions.indexAd]["MotorSpaceWidth"])*5.0
                        )
                        ])
                      .range([(0), (240)]);

            
            
        infosDisplay.scale.MotorSpaceYScale = d3.scaleLinear()
            .domain([
              (
                data.motorSpace[0]["MotorSpaceCenterPositionY"]*1.0-(data.motorSpace[0]["MotorSpaceHeight"])*5.0
              ), 
              (
                data.motorSpace[0]["MotorSpaceCenterPositionY"]*1.0+(data.motorSpace[0]["MotorSpaceHeight"])*5.0
              ) 
            ])
            .range([(0), (180)]);
    },
    
    createSection : function(back){
      
        infosDisplay.element.infosDisplayDiv = utils.addElement("div",back,
              [
                "width:" +infosDisplay.settings.width+"px;"+
                "height:" +infosDisplay.settings.height+"px;"+
                "position:absolute;"+
                "margin-left:"+(infosDisplay.settings.marginLeft)+"px;"+
                "margin-top:"+infosDisplay.settings.marginTop+"px;"
              ]
        );
        
        // Creating a section for the drop-down list
        infosDisplay.element.infosDisplayListDiv = utils.addElement("ul",infosDisplay.element.infosDisplayDiv,
              [
                "width:" +infosDisplay.settings.width+"px;"+
                "height:" +150+"px;"+
                "position:absolute;"+
                "margin-left:"+(15)+"px;"+
                "margin-top:"+(0)+"px;"+
                "padding: 0;"+
                "border-width: 3px;"+
                "border-style: solid;" +
                "overflow: auto;"+
                "overflow-x: hidden;"+
                "overflow-y: hidden"
                
              ]
        ).attr("id","eventList");
        
        // Create a section for statistics
        infosDisplay.element.infosDisplayGameStatsSVG = utils.addElement("svg",infosDisplay.element.infosDisplayDiv,
              [
                "width:" +infosDisplay.settings.width+"px;"+
                "height:" +infosDisplay.settings.height+"px;"+
                "position:absolute;"+
                "background-color:'red'"
              ]
        );
        
        // Create a section to display the position of elements in graph
        infosDisplay.element.infosDisplayCoordinateSVG = utils.addElement("svg",back,
              [
                "width:" +800+"px;"+
                "height:" +800+"px;"+
                "position:absolute;"
              ]
        );
        
        // Create a section to display the left Motor Space
        infosDisplay.element.infosMotorSpaceLSVG = utils.addElement("svg",back,
              [
                "width:" +240+"px;"+
                "height:" +180+"px;"+
                "margin-left:"+(340)+"px;"+
                "margin-top:"+(320)+"px;"+
                "position:absolute;"
              ]
        );
        
        // Add frame around motor space graph
        utils.addElement("rect",infosDisplay.element.infosMotorSpaceLSVG,
              [
                "x:"+3+";"+
                "y:"+3+";"+
                "rx:"+20+";"+
                "ry:"+20+";"+
                "width:" +(240-6)+"px;"+
                "height:" +(180-6)+"px;"+
                "fill: #00000000;"+
                "stroke-width:"+3+"px;"+
                "stroke:#2874A6"
              ]
        );
        
        
        // Create a section to display the right Motor Space
        infosDisplay.element.infosMotorSpaceRSVG = utils.addElement("svg",back,
              [
                "width:" +(240)+"px;"+
                "height:" +(180)+"px;"+
                "margin-left:"+(340+240+3)+"px;"+
                "margin-top:"+(320)+"px;"+
                "position:absolute;"
              ]
        );
        
        // Add frame around motor space graph
        utils.addElement("rect",infosDisplay.element.infosMotorSpaceRSVG,
              [
                "x:"+(3)+";"+
                "y:"+(3)+";"+
                "rx:"+20+";"+
                "ry:"+20+";"+
                "width:" +(240-6)+"px;"+
                "height:" +(180-6)+"px;"+
                "fill: #00000000;"+
                "stroke-width:"+3+"px;"+
                "stroke:#2874A6"
              ]
        );
    },
    
    addInfos : function(){
      
      var thisDate = {};
      
        // create the list of events
        for(var i = 0;i<data.aed.length;i++){
        
          if(data.aed[i]["Event"]=="Mole Hit"||data.aed[i]["Event"]=="Fake Mole Hit"){
              
              thisDate = new Date(new Date(data.aed[i]["Timestamp"]).getTime()-chartOptions.dateMin.getTime());
              
              // create the box that contains the event information
              var elementListe = infosDisplay.element.infosDisplayListDiv.append("li").attr("id", "r"+(i)).attr("style","display : inline-block;list-style-type : none;");
              // add date
              var textBox = elementListe.append("svg")
                  .attr("width", infosDisplay.settings.width-20)
                  .attr("height", 20);
              textBox.append("g").append("text")
                	.text(thisDate.getMinutes() + ":" + thisDate.getSeconds() + "." + (Math.round(thisDate.getMilliseconds() * 100) / 100))
                	.attr("x", 5)
                	.attr("y", 15)
                	.style("font-size", "15px");
               
              // add event box
              var eventBox = textBox.append("g");
              
              eventBox.append("rect")
                  .attr("style",
                       "height:20;"+
                       "width:"+(infosDisplay.settings.width-100)+";"+
                       "fill:#00000000;"+
                       "stroke:#000000;"+
                       "stroke-width: 1px;"+
                       "x:80;"+
                       "y:0"
                  );
                       
              eventBox.append("text")
              	  .text(data.aed[i]["Event"])
                	.attr("x", 90)
                	.attr("y", 15)
                	.style("font-size", "15px");
                  
                  
          }else{
              // add empty box
              infosDisplay.element.infosDisplayListDiv.append("div")
                  .attr("width", 0)
                  .attr("height", 0)
                  .attr("id", "r"+i);

          }
      }
      
      // Add an empty box to allow adjustment on the last event
      for(var i = 0; i < 10; i++){
        var elementListe = infosDisplay.element.infosDisplayListDiv.append("li").attr("id", "r2"+(i)).attr("style","display : inline-block;list-style-type : none;");
              // add date
        elementListe.append("svg")
                  .attr("width", infosDisplay.settings.width-20)
                  .attr("height", 20);
      }
      
      
      
      
      utils.addElement("div",infosDisplay.element.infosDisplayDiv,
              [
                "width:" +infosDisplay.settings.width+"px;"+
                "height:" +(150-20-2)+"px;"+
                "margin-left:"+(15)+"px;"+
                "margin-top:"+(0+20+2)+"px;"+
                "position:absolute;"+
                "background-color:#C8C8C855;"+
                "border-width: 3px;"+
                "border-style: solid;"
              ]
        );
        
        
      // add arrow which points to the current event  
      infosDisplay.element.infosDisplayCoordinateSVG.append("g").append('image')
            .attr('xlink:href', 'img/arrow01.png')
            .attr('width', 20)
            .attr('height', 20)
            .attr("x", infosDisplay.settings.marginLeft-5)
          	.attr("y", infosDisplay.settings.marginTop+2);

        
        // add Moles Infos Section
        var gameStatsSection = {};

        // add moles spawned infos
        gameStatsSection = infosDisplay.element.infosDisplayGameStatsSVG.append("g");
        
        utils.addPointOnSvg(gameStatsSection,17,35,170,"green");
        
        gameStatsSection.append("text")
          	.text("0 / "+data.ms[0]["moleSpawned"]+ " mole spawned")
          	.attr("x", 35+25)
          	.attr("y", 170)
          	.style("font-size", "17px")
          	.attr("id", "infosDisplayMoleSpawnedText");
          	
          	
          	
        // add missed moles infos 	
        gameStatsSection = infosDisplay.element.infosDisplayGameStatsSVG.append("g");
      
        gameStatsSection.append("text")
          	.text("0 mole hit, 0 missed")
          	.attr("x", 35+25)
          	.attr("y", 190)
          	.style("font-size", "17px")
          	.attr("id", "infosDisplayMoleHitText");
          	
        
        
        // add distractors moles infos  	
        gameStatsSection = infosDisplay.element.infosDisplayGameStatsSVG.append("g");
        
        utils.addPointOnSvg(gameStatsSection,17,35,220,"#FFFB00");
        
        gameStatsSection.append("text")
          	.text("0 / "+data.ms[0]["fakeMoleSpawned"]+ " distractors spawned")
          	.attr("x", 35+25)
          	.attr("y", 220)
          	.style("font-size", "17px")
          	.attr("id", "infosDisplayFakeMoleSpawnedText");

        
        // add distractor hit info	
        gameStatsSection = infosDisplay.element.infosDisplayGameStatsSVG.append("g");
        
        gameStatsSection.append("text")
          	.text("0 distractor hit")
          	.attr("x", 35+25)
          	.attr("y", 240)
          	.style("font-size", "17px")
          	.attr("id", "infosDisplayFakeMoleHitText");
          	
          	
        // add Reaction Time info  	
        gameStatsSection = infosDisplay.element.infosDisplayGameStatsSVG.append("g");
        
        gameStatsSection.append('image')
            .attr('xlink:href', 'img/controller02.png')
            .attr('width', 50)
            .attr('height', 50)
            .attr("x", 35-25)
          	.attr("y", 270-25);
    
        gameStatsSection.append("text")
          	.text("Current Reaction Time")
          	.attr("x", 35+25)
          	.attr("y", 270)
          	.style("font-size", "17px")
          	.attr("id", "infosDisplayReactionTimeTitle");


        gameStatsSection = infosDisplay.element.infosDisplayGameStatsSVG.append("g");
        
        gameStatsSection.append("text")
          	.text("0.0 Seconds")
          	.attr("x", 35+25)
          	.attr("y", 290)
          	.style("font-size", "17px")
          	.attr("id", "infosDisplayReactionTimeText");

 	
 	
 	
 	
 	      //add right controller infos
 	
        gameStatsSection = infosDisplay.element.infosDisplayCoordinateSVG.append("g");
        
        gameStatsSection.append('image')
          .attr('xlink:href', 'img/rect01.png')
          .attr('width', 40)
          .attr('height', 40)
          .attr("x", (graphController.settings.marginLeft + graphController.settings.width*2 -40 - 5))
        	.attr("y", graphController.settings.marginTop +210 -25);
        	
        gameStatsSection.append("text")
        	.text(Math.round((data.motorSpace[chartOptions.indexAd]["MotorSpaceWidth"])*100) + " x " + Math.round((data.motorSpace[chartOptions.indexAd]["MotorSpaceHeight"])*100) + " cm") 	
        	.attr("x", (graphController.settings.marginLeft + graphController.settings.width*2 ))
        	.attr("y", graphController.settings.marginTop +210)
        	.style("font-size", "17px")
        	.attr("id", "infosMotorSpaceRightText");

        	
        gameStatsSection = infosDisplay.element.infosDisplayCoordinateSVG.append("g");
        
        gameStatsSection.append('image')
          .attr('xlink:href', graphController.settings.rightControllerPicURL)
          .attr('width', 40)
          .attr('height', 40)
          .attr("x", (graphController.settings.marginLeft + graphController.settings.width*2 -40 -5))
        	.attr("y", graphController.settings.marginTop +250 -25);
        	
        gameStatsSection.append("text")
        	.text("x 0.00  y 0.00 z 0.00") 
        	.attr("x", (graphController.settings.marginLeft + graphController.settings.width*2))
        	.attr("y", graphController.settings.marginTop +250)
        	.style("font-size", "17px")
        	.attr("id", "rightControllerInfosText");
        	
        	
        gameStatsSection = infosDisplay.element.infosDisplayCoordinateSVG.append("g");
        
        gameStatsSection.append('image')
          .attr('xlink:href', wall.settings.rightLaserURL)
          .attr('width', 40)
          .attr('height', 40)
          .attr("x", (graphController.settings.marginLeft + graphController.settings.width*2 -40 -5))
        	.attr("y", graphController.settings.marginTop +290 -25);
        	
        gameStatsSection.append("text")
        	.text("x 0.00 y 0.00 z 0.00")
        	.attr("x", (graphController.settings.marginLeft + graphController.settings.width*2))
        	.attr("y", graphController.settings.marginTop +290)
        	.style("font-size", "17px")
        	.attr("id", "rightLaserInfosText");
        	
        	
        	
        if(chartOptions.mouvementSettings.rightController)data.ad.forEach((element,index) => {
            
              utils.addPointOnSvg(infosDisplay.element.infosMotorSpaceRSVG,graphController.settings.pointSize,infosDisplay.getControllersCoordPx(index).right.x,infosDisplay.getControllersCoordPx(index).right.y,"#00000000").attr("id",("graphMotorSpaceRightPath"+index))
            
        });
        
        
        
        
        
        
         //add left controller infos
 	
        gameStatsSection = infosDisplay.element.infosDisplayCoordinateSVG.append("g");
        
        gameStatsSection.append('image')
          .attr('xlink:href', 'img/rect01.png')
          .attr('width', 40)
          .attr('height', 40)
          .attr("x", (graphController.settings.marginLeft + graphController.settings.width +30 -20))
        	.attr("y", graphController.settings.marginTop +210 -25);
        	
        gameStatsSection.append("text")
        	.text(Math.round((data.motorSpace[chartOptions.indexAd]["MotorSpaceWidth"])*100) + " x " + Math.round((data.motorSpace[chartOptions.indexAd]["MotorSpaceHeight"])*100) + " cm") 	
        	.attr("x", (graphController.settings.marginLeft + graphController.settings.width +30 +25))
        	.attr("y", graphController.settings.marginTop +210)
        	.style("font-size", "17px")
        	.attr("id", "infosMotorSpaceLeftText");

        	
        gameStatsSection = infosDisplay.element.infosDisplayCoordinateSVG.append("g");
        
        gameStatsSection.append('image')
          .attr('xlink:href', graphController.settings.leftControllerPicURL)
          .attr('width', 40)
          .attr('height', 40)
          .attr("x", (graphController.settings.marginLeft + graphController.settings.width +30 -20))
        	.attr("y", graphController.settings.marginTop +250 -25);
        	
        gameStatsSection.append("text")
        	.text("x 0.00  y 0.00 z 0.00") 
        	.attr("x", (graphController.settings.marginLeft + graphController.settings.width +30 +25))
        	.attr("y", graphController.settings.marginTop +250)
        	.style("font-size", "17px")
        	.attr("id", "leftControllerInfosText");
        	
        	
        gameStatsSection = infosDisplay.element.infosDisplayCoordinateSVG.append("g");
        
        gameStatsSection.append('image')
          .attr('xlink:href', wall.settings.leftLaserURL)
          .attr('width', 40)
          .attr('height', 40)
          .attr("x", (graphController.settings.marginLeft + graphController.settings.width +30 -20))
        	.attr("y", graphController.settings.marginTop +290 -25);
        	
        gameStatsSection.append("text")
        	.text("x 0.00 y 0.00 z 0.00")
        	.attr("x", (graphController.settings.marginLeft + graphController.settings.width +30 +25))
        	.attr("y", graphController.settings.marginTop +290)
        	.style("font-size", "17px")
        	.attr("id", "leftLaserInfosText");
        	
        	
        	
        if(chartOptions.mouvementSettings.leftController)data.ad.forEach((element,index) => {
            
              utils.addPointOnSvg(infosDisplay.element.infosMotorSpaceLSVG,graphController.settings.pointSize,infosDisplay.getControllersCoordPx(index).left.x,infosDisplay.getControllersCoordPx(index).left.y,"#00000000").attr("id",("graphMotorSpaceLeftPath"+index))
            
        });
        
        infosDisplay.addControllers();
        	

    },
    
    addControllers : function(){
      
        // Create an image with a background controller image
        infosDisplay.element.objControllerLeft = infosDisplay.element.infosMotorSpaceLSVG.append("g").append('image')
            .attr('xlink:href', graphController.settings.leftControllerPicURL)
            .attr('width', graphController.settings.controllerWidth)
            .attr('height', graphController.settings.controllerHeight)
            .attr("x", 90)
          	.attr("y", 120)
          	
        infosDisplay.element.objControllerRight = infosDisplay.element.infosMotorSpaceRSVG.append("g").append('image')
            .attr('xlink:href', graphController.settings.rightControllerPicURL)
            .attr('width', graphController.settings.controllerWidth)
            .attr('height', graphController.settings.controllerHeight)
            .attr("x", 90)
          	.attr("y", 120)
    
    },
    
    // Convert controller's coordinates to pixel values
    getControllersCoordPx : function(i){

        return coord = {
          right : {
            x : infosDisplay.scale.MotorSpaceXScale((data.ad[i]['RightControllerPosWorldX'])),
            y : infosDisplay.scale.MotorSpaceYScale((data.ad[i]['RightControllerPosWorldY'])),
            z : 0,
          },
          left : {
            x : infosDisplay.scale.MotorSpaceXScale((data.ad[i]['LeftControllerPosWorldX'])),
            y : infosDisplay.scale.MotorSpaceYScale((data.ad[i]['LeftControllerPosWorldY'])),
            z : 0,
          }
        };
    },
    
    changeScrollingList : function(){
      
      //if(new Date(chartOptions.indexDate) >= new Date(data.aed[chartOptions.indexAed]['Timestamp'])){
            //while(new Date(chartOptions.indexDate) >= new Date(data.aed[chartOptions.indexAed]['Timestamp'])){
            
                var srcolling = false;
            
                switch (data.aed[chartOptions.indexAed]['Event']){
                    case "Mole Hit":
                      srcolling = true;
                      break;
                    case "Fake Mole Hit":
                      srcolling = true;
                      break;
                      
                    default:
                
                }
            
                if(srcolling){
                  
                    // scroll down the list of events to the current event
                    var list = document.getElementById("eventList");
                    var targetLi = document.getElementById("r"+(chartOptions.indexAed));
        
                    list.scrollTop = (targetLi.offsetTop);
                }
        
                //chartOptions.indexAed++;
                
            //};
        //};
    },
    
    changeControlersLocation : function(){
      //console.log(infosDisplay.getControllersCoordPx(chartOptions.indexAd).right.x + " : "+infosDisplay.getControllersCoordPx(chartOptions.indexAd).right.y)
      if(chartOptions.mouvementSettings.rightController)infosDisplay.element.objControllerRight.transition()
                    .duration(14)
                    .attr('x', function(d) { return infosDisplay.getControllersCoordPx(chartOptions.indexAd).right.x; })
                    .attr('y', function(d) { return infosDisplay.getControllersCoordPx(chartOptions.indexAd).right.y; })
                    
      if(chartOptions.mouvementSettings.leftController)infosDisplay.element.objControllerLeft.transition()
                    .duration(14)
                    .attr('x', function(d) { return infosDisplay.getControllersCoordPx(chartOptions.indexAd).left.x; })
                    .attr('y', function(d) { return infosDisplay.getControllersCoordPx(chartOptions.indexAd).left.y; })

    },
    
    changeMotorSpaceInfo : function(){
      
          //if(new Date(chartOptions.indexDate) >= new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
            //while(new Date(chartOptions.indexDate) >= new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
              
                  var thisMole = {};
                  
                  if(chartOptions.mouvementSettings.rightController){
                      thisMole = d3.selectAll("#graphMotorSpaceRightPath"+chartOptions.indexAd);
                      utils.changeFillElement(thisMole,graphController.settings.pathColor,0);
                      utils.changeFillElement(thisMole, "#00000000",graphController.settings.pathTime);
                  }
                  
                  if(chartOptions.mouvementSettings.leftController){
                      thisMole = d3.selectAll("#graphMotorSpaceLeftPath"+chartOptions.indexAd);
                      utils.changeFillElement(thisMole,graphController.settings.pathColor,0);
                      utils.changeFillElement(thisMole, "#00000000",graphController.settings.pathTime);
                  }
        
                  //chartOptions.indexAd ++;
                
            //}
          //}

    },

    updated : function(){
      
        // change text values
        
        // Displays the number of spawned moles
        d3.select("#infosDisplayMoleSpawnedText")
        .text(wall.molesEventCount.moleSpawnCount+" / "+data.ms[0]["moleSpawned"]+ " mole spawned");
        
        // Displays the number of hit moles 
        d3.select("#infosDisplayMoleHitText")
        .text(wall.molesEventCount.moleHitCount+" mole hit, "+(wall.molesEventCount.moleSpawnCount - wall.molesEventCount.moleHitCount)+" missed");
        
        // Displays the number of moles hit
        d3.select("#infosDisplayFakeMoleSpawnedText")
        .text(wall.molesEventCount.fakeMoleSpawnCount+" / "+data.ms[0]["fakeMoleSpawned"]+ " distractors spawned");
        
        // Displays the number of fake moles hit
        d3.select("#infosDisplayFakeMoleHitText")
        .text(wall.molesEventCount.fakeMoleHitCount+" distractor hit");
        
        // Displays the reaction time value
        d3.select("#infosDisplayReactionTimeText")
        .text((Math.round((wall.reactionTime.currentReactionTime/1000) * 10) / 10) +" Seconds");
        
        
        if(chartOptions.mouvementSettings.rightController){
          
            // Displays the controller position
            d3.select("#rightControllerInfosText")
            .text("x " + (graphController.controllersPosition.right.x).toFixed(2) +  "  y " + (graphController.controllersPosition.right.y).toFixed(2)+  "  z " + (graphController.controllersPosition.right.z).toFixed(2));
            
            // Displays the laser position
            d3.select("#rightLaserInfosText")
            .text("x " +(wall.lasersPosition.right.x*1.0).toFixed(2) + " y "+( wall.lasersPosition.right.y*1.0).toFixed(2)+ " z "+ (wall.lasersPosition.right.z*1.0).toFixed(2));
        }
        
        if(chartOptions.mouvementSettings.leftController){
          
            // Displays the controller position
            d3.select("#leftControllerInfosText")
            .text("x " + (graphController.controllersPosition.left.x).toFixed(2) +  "  y " + (graphController.controllersPosition.left.y).toFixed(2)+  "  z " + (graphController.controllersPosition.left.z).toFixed(2));
            
            // Displays the laser position
            d3.select("#leftLaserInfosText")
            .text("x " +(wall.lasersPosition.left.x*1.0).toFixed(2) + " y "+(wall.lasersPosition.left.y*1.0).toFixed(2)+ " z "+ (wall.lasersPosition.left.z*1.0).toFixed(2));
        }
        
        
        infosDisplay.changeControlersLocation();
        //infosDisplay.changeScrollingList();
        infosDisplay.changeMotorSpaceInfo();
        
    },
    
    resetAll : function(){
        // change text values
        
        // reset the number of spawned moles
        d3.select("#infosDisplayMoleSpawnedText")
        .text("0 / "+data.ms[0]["moleSpawned"]+ " mole spawned");
        
        // reset the number of hit moles 
        d3.select("#infosDisplayMoleHitText")
        .text("0 mole hit, 0 missed");
        
        // reset the number of moles hit
        d3.select("#infosDisplayFakeMoleSpawnedText")
        .text("0 / "+data.ms[0]["fakeMoleSpawned"]+ " distractors spawned");
        
        // reset the number of fake moles hit
        d3.select("#infosDisplayFakeMoleHitText")
        .text("0 distractor hit");
        
        // reset the reaction time value
        d3.select("#infosDisplayReactionTimeText")
        .text("0.00 Seconds");
        
        // scroll down the list of events to the 1st event
        var list = document.getElementById("eventList");
        var targetLi = document.getElementById("r0");

        list.scrollTop = (targetLi.offsetTop);
    },

}