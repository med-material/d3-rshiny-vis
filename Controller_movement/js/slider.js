//////////////////////////////////////////////////
/*                                              */
/*      CREATE Aalborg University               */
/*      aldsanms                                */
/*      nov-22-2022                             */
/*      slider.js                               */
/*      v1_0_0                                  */
//////////////////////////////////////////////////

//Contains all the functions necessary for slider display.




var slider = {

    sliderSettings : {
    
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
    
    addSlider : function(){
    
        // Add a DIV for the slider
        var divSlider = utils.addElement("div",back,
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
        
        
        // Add a SVG for the slider
        var sliderAxis = utils.addElement("svg",divSlider,
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
        )
        
        // Add a button start/stop
        d3.select("#divSlider")
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
        
        // Add a scrollbar
        d3.select("#divSlider")
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
        sliderAxis.append('g')
            .call(d3.axisBottom(slider.sliderSettings.dateScale).tickFormat(d3.timeFormat("%s")).ticks(d3.timeSecond .every(15)));
        
        
        },
        
        changeStartButtonValues : function(){
            if(mouvementSettings.isStart){
                slider.sliderSettings.objStartButton.textContent = 'Stop';
            }else{
                slider.sliderSettings.objStartButton.textContent = 'Start';
            }
        }
    
    



}