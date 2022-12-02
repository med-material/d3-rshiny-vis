//////////////////////////////////////////////////
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      dec-02-2022                             */
/*      slider.js                               */
/*      v1_1_0                                  */
//////////////////////////////////////////////////

//Contains all the functions necessary for slider display.


var slider = {

    sliderSettings : {
        sliderDiv : {},
        sliderAxisSvg : {},
        
        height : 60,//px
        width : 450,//px
        
        marginTop : 720,//px
        marginLeft : 175,//px
        
        
        sliderValue : 0,
        
        dateScale : {},
        
        objStartButton : {},
        sBtnHeight : 50,//px
        sBtnWidth : 100,//px
        sBtnMargingTop : 5,//px
        sBtnMargingLeft : 0,
        
        objSlider : {},
        sliderHeight : 50,//px
        sliderWidth : 330,
        sliderMargingTop : 5,//px
        sliderMargingLeft : 10,//px
        
        n : 0,
    
    },
    
    test : function(){
        return 1;
    },
    
    updateLocalVariables : function(newSettings){
      
        slider.sliderSettings.height = newSettings.height;
        slider.sliderSettings.width = newSettings.width;
        
        slider.sliderSettings.marginTop = newSettings.marginTop;
        slider.sliderSettings.marginLeft = newSettings.marginLeft;
        
        slider.sliderSettings.sBtnHeight = newSettings.sBtnHeight;
        slider.sliderSettings.sBtnWidth = newSettings.sBtnWidth;
        slider.sliderSettings.sBtnMargingTop = newSettings.sBtnMargingTop;
        slider.sliderSettings.sBtnMargingLeft = newSettings.sBtnMargingLeft;
        
        slider.sliderSettings.sliderHeight = newSettings.sliderHeight;
        slider.sliderSettings.sliderWidth = newSettings.sliderWidth;
        slider.sliderSettings.sliderMargingTop = newSettings.sliderMargingTop;
        slider.sliderSettings.sliderMargingLeft = newSettings.sliderMargingLeft;
        
        slider.sliderSettings.n = (ChartOptions.DataArrays.dateMax-ChartOptions.DataArrays.dateMin)/14;
        
        slider.sliderSettings.dateScale = d3.scaleTime()
            .domain([new Date(0),new Date(ChartOptions.DataArrays.dateMax.getTime() - ChartOptions.DataArrays.dateMin.getTime())])
            .range([0, slider.sliderSettings.sliderWidth]);
      
    },
    
    createSection : function(back){
        // Add a DIV for the slider
        slider.sliderSettings.sliderDiv = utils.addElement("div",back,
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
        slider.sliderSettings.sliderAxisSvg = utils.addElement("svg",slider.sliderSettings.sliderDiv,
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
          slider.sliderSettings.sliderDiv
              .append('input')
              .attr('type', "range")
              .attr('min', "0")
              .attr('max', slider.sliderSettings.n)
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
          slider.sliderSettings.objStartButton = document.getElementById('startButton');
          slider.changeStartButtonValues();
          
          // Save  scrollbar on a variable
          slider.sliderSettings.objSlider = document.getElementById('slider');
          
          // Add scale's legend
          slider.sliderSettings.sliderAxisSvg.append('g')
              .call(d3.axisBottom(slider.sliderSettings.dateScale).tickFormat(d3.timeFormat("%s")).ticks(d3.timeSecond .every(15)));
      },
      
      addButton : function(){
          // Add a button start/stop
          slider.sliderSettings.sliderDiv
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
              slider.sliderSettings.objStartButton.textContent = 'Stop';
          }else{
              slider.sliderSettings.objStartButton.textContent = 'Start';
          };
      },
}
