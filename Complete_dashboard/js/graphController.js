//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      jan-16-2022                             */
/*      GraphController.js                      */
/*      v1_1_4                                  */
//////////////////////////////////////////////////
//Contains all the functions necessary for the operation of the graph display.


var graphController = {
  
  settings : {
        height : 0,//px
        width : 0,//px
        
        marginTop : 0,//px
        marginLeft : 0,//px

        valueMax : 0,
        zoom : 0,

        pointSize : 0,//px
        pointColor : "#0055FF11", 
        
        borderSize : 0,//px
        borderColor : "",
        
        pathColor : "orange",
        pathTime : 2000,
        
        leftControllerPicURL : "img/leftController.png",
        rightControllerPicURL : "img/rightController.png",
        controllerHeight : 0,//px
        controllerWidth : 0,//px
        
        directionLookedURL : "img/directionLooked.png",
    },
    
    scale : {
        zScale : {}, // value to pixel for the z conversion obj
        xScale : {}, // value to pixel for the x conversion obj
    },
    
    element : {
        graphControllerDiv : {},
        graphControllerSvg : {},
        objRightController : {},
        objLeftController : {},
        objDirectionLooked : {},
    },
    
    controllersPosition : {
        right : {
          x : 0,
          y : 0,
          z : 0,
          rotX : 0,
        },
        left : {
          x : 0,
          y : 0,
          z : 0,
          rotX : 0,
        }
    },
    
    displaySettings : {
      controller : false,
      nearControllerPath : false,
      directionLooked : false,
    },
    
    //indexController : 0,
    

    
  
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){
      
        graphController.settings = newSettings;
        
        
        if(newSettings.zoom == "auto"){
          graphController.settings.zoom = (1/(Math.max( (Math.abs(data.ControllerInfos[0]["x_extrem"]) , Math.abs(data.ControllerInfos[1]["x_extrem"])) )*1.1));
        }
        
        // Declaration of the graph domains
        graphController.scale.zScale = d3.scaleLinear()
            .domain([(graphController.settings.valueMax/graphController.settings.zoom), (-graphController.settings.valueMax/graphController.settings.zoom)]) 
            .range([(0), (graphController.settings.height)]);
        		
        graphController.scale.xScale = d3.scaleLinear()
            .domain([(-graphController.settings.valueMax/graphController.settings.zoom), (graphController.settings.valueMax/graphController.settings.zoom)]) 
            .range([(0), (graphController.settings.width)]);
       
    },
    
    createSection : function(back){
      
        graphController.element.graphControllerDiv = utils.addElement("div",back,
              [
                "width:" +graphController.settings.width+"px;"+
                "height:" +graphController.settings.height+"px;"+
                "position:absolute;"+
                "margin-left:"+(graphController.settings.marginLeft)+"px;"+
                "margin-top:"+graphController.settings.marginTop+"px;"
              ]
        );
  
         // Create an SVG for graph
         graphController.element.graphControllerSvg = utils.addElement("svg",graphController.element.graphControllerDiv,
              [
                "width:"+graphController.settings.width+"px;"+
                "height:"+graphController.settings.height+"px;"+
                "position:absolute;"
              ]
         );   
    },
    
    addControllers : function(){
      
        // Create a DIV with a background controller image
        graphController.element.objRightController = utils.addElement("div",graphController.element.graphControllerDiv,
            [
                "left:"+(graphController.settings.width/4)+"px;"+
                "top:"+((graphController.settings.height/4)*3)+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 00);"+
                "width:"+(graphController.settings.controllerWidth)+"px;"+
                "height:"+(graphController.settings.controllerHeight)+"px;"+
                "justify-content: center;"+
                "align-items: flex-top;"+
                "background-image: url("+graphController.settings.rightControllerPicURL+");"+
                "background-repeat: no-repeat;"+
                "background-position: center;"+
                "background-size: 100% 100%;"
            ]
        );
        
        graphController.element.objLeftController = utils.addElement("div",graphController.element.graphControllerDiv,
            [
                "left:"+((graphController.settings.width/4)-graphController.settings.controllerWidth)+"px;"+
                "top:"+((graphController.settings.height/4)*3)+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 00);"+
                "width:"+(graphController.settings.controllerWidth)+"px;"+
                "height:"+(graphController.settings.controllerHeight)+"px;"+
                "justify-content: center;"+
                "align-items: flex-top;"+
                "background-image: url("+graphController.settings.leftControllerPicURL+");"+
                "background-repeat: no-repeat;"+
                "background-position: center;"+
                "background-size: 100% 100%;"
            ]
        );
        
        graphController.displaySettings.controller = true;
    
    },
    
    addControllerPath : function(){
        
        // Add controller path on graph
        if(chartOptions.mouvementSettings.rightController)graphController.element.graphControllerSvg
            .selectAll("dot")
            .data(data.ad)
            .enter()
            .append("circle")
            .attr("cx", (d,i) => graphController.getControllerCoordPx(i).right.x )
            .attr("cy", (d,i) => graphController.getControllerCoordPx(i).right.z )
            .attr("id",(d,i) => ("pathRight"+i))
            .attr("r", graphController.settings.pointSize)
            .attr("fill", graphController.settings.pointColor);
            
        if(chartOptions.mouvementSettings.leftController)graphController.element.graphControllerSvg
            .selectAll("dot")
            .data(data.ad)
            .enter()
            .append("circle")
            .attr("cx", (d,i) => graphController.getControllerCoordPx(i).left.x )
            .attr("cy", (d,i) => graphController.getControllerCoordPx(i).left.z )
            .attr("id",(d,i) => ("pathLeft"+i))
            .attr("r", graphController.settings.pointSize)
            .attr("fill", graphController.settings.pointColor);
        
    },
    
    // Convert controller's coordinates to pixel values
    getControllerCoordPx : function(i){
        var coord = graphController.getControllerCoord(i);
        return coordPx = {
          right : {
            x : graphController.scale.xScale((coord.right.x)*graphController.settings.zoom),
            y : 0,
            z : graphController.scale.zScale((coord.right.z)*graphController.settings.zoom),
            rotX : coord.right.rotX,
          },
          left : {
            x : graphController.scale.xScale((coord.left.x)*graphController.settings.zoom),
            y : 0,
            z : graphController.scale.zScale((coord.left.z)*graphController.settings.zoom),
            rotX : coord.left.rotX,
          }
        };

    },
    
    getControllerCoord : function(i){
        graphController.controllersPosition = {
            right : {
              x : (data.ad[i]['RightControllerPosWorldX']-data.ad[i]['HeadCameraPosWorldX']),
              y : 0,
              z : (data.ad[i]['RightControllerPosWorldZ']-data.ad[i]['HeadCameraPosWorldZ']),
              rotX : data.ad[i]['RightControllerRotEulerX'],
            },
            left : {
              x : (data.ad[i]['LeftControllerPosWorldX']-data.ad[i]['HeadCameraPosWorldX']),
              y : 0,
              z : (data.ad[i]['LeftControllerPosWorldZ']-data.ad[i]['HeadCameraPosWorldZ']),
              rotX : data.ad[i]['LeftControllerRotEulerX'],
            }
        };
        return graphController.controllersPosition; 

    },
    
    changeControllerLocation : function(){
      
        // If the target date is less than the date in the index of events
        //if(new Date(chartOptions.indexDate) >= new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
            //while(new Date(chartOptions.indexDate) >=new Date(data.ad[chartOptions.indexAd]['Timestamp'])){
              
                var coords = graphController.getControllerCoordPx(chartOptions.indexAd);

                
                if(chartOptions.mouvementSettings.rightController)graphController.element.objRightController.transition()
                .duration(14).attr('style', 
                    "left:"+(coords.right.x)+"px;"+
                    "top:"+(coords.right.z)+"px;"+
                    "display: flex;"+
                    "position:absolute;"+
                    "background: rgb(50, 50, 50, 00);"+
                    "width:"+(graphController.settings.controllerWidth)+"px;"+
                    "height:"+(graphController.settings.controllerHeight)+"px;"+
                    "justify-content: center;"+
                    "align-items: flex-top;"+
                    "background-image: url("+graphController.settings.rightControllerPicURL+");"+
                    "background-repeat: no-repeat;"+
                    "background-position: center;"+
                    "background-size: 100% 100%;"+
                    "transform: rotate("+(coords.right.rotX)+"deg)"
                );
                
                if(chartOptions.mouvementSettings.leftController)graphController.element.objLeftController.transition()
                .duration(14).attr('style', 
                    "left:"+(coords.left.x)+"px;"+
                    "top:"+(coords.left.z)+"px;"+
                    "display: flex;"+
                    "position:absolute;"+
                    "background: rgb(50, 50, 50, 00);"+
                    "width:"+(graphController.settings.controllerWidth)+"px;"+
                    "height:"+(graphController.settings.controllerHeight)+"px;"+
                    "justify-content: center;"+
                    "align-items: flex-top;"+
                    "background-image: url("+graphController.settings.leftControllerPicURL+");"+
                    "background-repeat: no-repeat;"+
                    "background-position: center;"+
                    "background-size: 100% 100%;"+
                    "transform: rotate("+(coords.left.rotX)+"deg)"
                );
                
                //chartOptions.indexAd++
            
            //}
        //}
    },
    
    addHeadPoint : function(){
        
        // Add point as a head
        utils.addElement("div",graphController.element.graphControllerDiv,
            [
                "left:"+((graphController.settings.width/2)-((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))/2)+"px;"+
                "top:"+((graphController.settings.height/2)-((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))/2)+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 1);"+
                "width:"+((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))+"px;"+
                "height:"+((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))+"px;"+
                "border-radius:"+(((0.2*graphController.settings.width)/((graphController.settings.valueMax/graphController.settings.zoom)*2))/2)+"px"
            ]
        );
    },
    
    addAxis : function(){
      
        newAxis = function(id,x1,x2,y1,y2){
            graphController.element.graphControllerSvg.append("line")
                .attr("id", id)
                .attr("class", "axis")
                .attr("x1", x1)   
                .attr("y1", y1 )     
                .attr("x2", x2)    
                .attr("y2", y2 )
                .style("stroke", "#b3b3b3")
                .style('stroke-width', '2px')
                .style("stroke-dasharray", ("8,8"))
                .style("fill", "none");
        };
    
        // Add x axis
        newAxis("abscisseAxis",0,graphController.settings.width,(graphController.settings.height/2),(graphController.settings.height/2));
        
        // Add y axis
        newAxis("ordinateAxis",(graphController.settings.width/2),(graphController.settings.width/2),(0),(graphController.settings.height));

        
        
        // Add vertical axis
        newAxis("RightAxis",(graphController.scale.xScale(1)),(graphController.scale.xScale(1)),(0),(graphController.settings.height));
        
        newAxis("LeftAxis",(graphController.scale.xScale(-1)),(graphController.scale.xScale(-1)),(0),(graphController.settings.height));

        
        
        // Add horizontal axis
        newAxis("topAxis",(0),(graphController.settings.width),graphController.scale.zScale(1),(graphController.scale.zScale(1)));
        
        newAxis("bottomAxis",(0),(graphController.settings.width),(graphController.scale.zScale(-1)),(graphController.scale.zScale(-1)));

        
    },
    
    addGraphBorder : function(){
      
        newGraphBorder = function(id,x1,x2,y1,y2){
              graphController.element.graphControllerSvg.append("line")
                  .attr("id", id)
                  .attr("class", "axis")
                  .attr("x1", x1)   
                  .attr("y1", y1 )     
                  .attr("x2", x2)    
                  .attr("y2", y2 )
                  .style("stroke", graphController.settings.borderColor)
                  .style('stroke-width', graphController.settings.borderSize + "px")
                  .style("fill", "none");
          };
          
          newGraphBorder("bottomBorder",0,graphController.settings.width,(graphController.settings.height-(graphController.settings.borderSize/2)),(graphController.settings.height-(graphController.settings.borderSize/2)));
          newGraphBorder("topBorder",0,graphController.settings.width,(0+(graphController.settings.borderSize/2)),(0+(graphController.settings.borderSize/2)));
          
          
          newGraphBorder("leftBorder",(0+(graphController.settings.borderSize/2)),(0+(graphController.settings.borderSize/2)),(0),(graphController.settings.height));
          
          newGraphBorder("rightBorder",(graphController.settings.width-(graphController.settings.borderSize/2)),(graphController.settings.width-(graphController.settings.borderSize/2)),(0),(graphController.settings.height));
    },
    
    addDirectionLooked : function(){

        graphController.element.objDirectionLooked = utils.addElement("div",graphController.element.graphControllerDiv,
            [
                "left:"+0+"px;"+
                "top:"+0+"px;"+
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 00);"+
                "width:"+(graphController.settings.width)+"px;"+
                "height:"+(graphController.settings.height)+"px;"+
                "justify-content: center;"+
                "align-items: flex-top;"+
                "background-image: url("+graphController.settings.directionLookedURL+");"+
                "background-repeat: no-repeat;"+
                "background-position: center;"+
                "background-size: 100% 100%;"
            ]
        );
        
        graphController.displaySettings.directionLooked = true;
    },
    
    addNearControllerPath : function(){
      
       data.ad.forEach((element,index) => {
            if(chartOptions.mouvementSettings.rightController){
                utils.addPointOnSvg(graphController.element.graphControllerSvg,graphController.settings.pointSize,graphController.getControllerCoordPx(index).right.x,graphController.getControllerCoordPx(index).right.z,"#00000000").attr("id",("graphControllerNearControllerPathRight"+index))
            }
            if(chartOptions.mouvementSettings.leftController){
                utils.addPointOnSvg(graphController.element.graphControllerSvg,graphController.settings.pointSize,graphController.getControllerCoordPx(index).left.x,graphController.getControllerCoordPx(index).left.z,"#00000000").attr("id",("graphControllerNearControllerPathLeft"+index))
            }
        });
          
        graphController.displaySettings.nearControllerPath = true;
    },
    
    changeDirectionLooked : function(){
      
       graphController.element.objDirectionLooked.transition()
        .duration(14).attr('style', 
            "left:"+0+"px;"+
            "top:"+0+"px;"+
            "display: flex;"+
            "position:absolute;"+
            "background: rgb(50, 50, 50, 00);"+
            "width:"+(graphController.settings.width)+"px;"+
            "height:"+(graphController.settings.height)+"px;"+
            "justify-content: center;"+
            "align-items: flex-top;"+
            "background-image: url("+graphController.settings.directionLookedURL+");"+
            "background-repeat: no-repeat;"+
            "background-position: center;"+
            "background-size: 100% 100%;"+
            "transform: rotate("+data.ad[chartOptions.indexAd]['HeadCameraRotEulerY']+"deg)"
        );
    },
    
    changeNearControllerPath : function(){
      
        if(chartOptions.mouvementSettings.rightController){
          var thisMole = d3.selectAll("#graphControllerNearControllerPathRight"+chartOptions.indexAd);
          
          utils.changeFillElement(thisMole,graphController.settings.pathColor,0);
          utils.changeFillElement(thisMole, "#00000000",graphController.settings.pathTime);
        } 
        if(chartOptions.mouvementSettings.leftController){  
          var thisMole = d3.selectAll("#graphControllerNearControllerPathLeft"+chartOptions.indexAd);
          
          utils.changeFillElement(thisMole,graphController.settings.pathColor,0);
          utils.changeFillElement(thisMole, "#00000000",graphController.settings.pathTime);
        }
    },
    
    updated : function(){
      
        if(graphController.displaySettings.controller)graphController.changeControllerLocation();
        if(graphController.displaySettings.directionLooked)graphController.changeDirectionLooked();
        if(graphController.displaySettings.nearControllerPath)graphController.changeNearControllerPath();
    },

}