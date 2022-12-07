//////////////////////////////////////////////////
/*                                              */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-07-2022                             */
/*      slider.js                               */
/*      v1_1_1                                  */
//////////////////////////////////////////////////

//Contains all the functions necessary for slider display.


var slider = {

    sliderSettings : {
        height : 0,//px
        width : 0,//px
        
        marginTop : 0,//px
        marginLeft : 0,//px
        
        sBtnHeight : 0,//px
        sBtnWidth : 0,//px
        sBtnMargingTop : 0,//px
        sBtnMargingLeft : 0,
        
        sliderHeight : 0,//px
        sliderWidth : 0,
        sliderMargingTop : 0,//px
        sliderMargingLeft : 0,//px
    },
    
    scale : {
        dateScale : {},
    },
    
    element : {
        sliderDiv : {},
        sliderAxisSvg : {},
        objStartButton : {},
        objSlider : {},
    },

    maxValue : 0,
    
    
    
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){
      
        slider.sliderSettings = newSettings;
        
        
        slider.maxValue = (ChartOptions.dateMax-ChartOptions.dateMin)/14;
        
        
        slider.scale.dateScale = d3.scaleTime()
            .domain([new Date(0),new Date(ChartOptions.dateMax.getTime() - ChartOptions.dateMin.getTime())])
            .range([0, slider.sliderSettings.sliderWidth]);
      
    },
    
    createSection : function(back){
        // Add a DIV for the slider
        slider.element.sliderDiv = utils.addElement("div",back,
            [
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 0);"+
                "width:"+slider.sliderSettings.width+"px;"+
                "height:"+(slider.sliderSettings.height)+"px;"+
                "margin-top:"+slider.sliderSettings.marginTop+"px;"+
                "margin-left:"+(slider.sliderSettings.marginLeft)+"px;"+
                "justify-content: center;"+
                "align-items: flex-top"
            ]
        ).attr('id', "divSlider");
        
        // Add a SVG for the slider axis
        slider.element.sliderAxisSvg = utils.addElement("svg",slider.element.sliderDiv,
            [
                "display: flex;"+
                "position:absolute;"+
                "background: rgb(50, 50, 50, 0);"+
                "width:"+500+"px;"+
                "height:"+(50)+"px;"+
                "margin-top:"+40+"px;"+
                "margin-left:"+(slider.sliderSettings.sBtnWidth+40)+"px;"+
                "justify-content: center;"+
                "align-items: flex-top"
            ]
        );
    },
    
    addSlider : function(){
    
          // Add a scrollbar
          slider.element.sliderDiv
              .append('input')
              .attr('type', "range")
              .attr('min', "0")
              .attr('max', slider.maxValue)
              .attr('id', "slider")
              .attr('name', "slider")
              .attr('onmousemove', "sliderChange()")
              .attr('style', 
                  "width:"+slider.sliderSettings.sliderWidth+"px;"+
                  "height:"+slider.sliderSettings.sliderHeight+"px;"+
                  "margin-top:"+slider.sliderSettings.sliderMargingTop+"px;"+
                  "margin-left:"+slider.sliderSettings.sliderMargingLeft+"px"
              );
          
          // Save button element on a variable
          slider.element.objStartButton = document.getElementById('startButton');
          slider.changeStartButtonValues();
          
          // Save  scrollbar on a variable
          slider.element.objSlider = document.getElementById('slider');
          
          // Add scale's legend
          slider.element.sliderAxisSvg.append('g')
              .call(d3.axisBottom(slider.scale.dateScale).tickFormat(d3.timeFormat("%s")).ticks(d3.timeSecond .every(15)));
      },
      
      addButton : function(){
          // Add a button start/stop
          slider.element.sliderDiv
              .append('button')
              .attr('id', "startButton")
              .attr('name', "startButton")
              .attr('text', "startButton")
              .attr('onclick', "startButtonOnclick()")
              .attr('style', "position:absolute")
              .attr('style', 
                  "width:"+slider.sliderSettings.sBtnWidth+"px;"+
                  "height:"+slider.sliderSettings.sBtnHeight+"px;"+
                  "margin-top:"+slider.sliderSettings.sBtnMargingTop+"px;"+
                  "margin-left:"+slider.sliderSettings.sBtnMargingLeft+"px"
          );
      },
      
      changeStartButtonValues : function(){
          if(ChartOptions.mouvementSettings.isStart){
              slider.element.objStartButton.textContent = 'Stop';
          }else{
              slider.element.objStartButton.textContent = 'Start';
          };
      },
}