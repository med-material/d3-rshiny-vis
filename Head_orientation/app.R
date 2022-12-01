#//////////////////////////////////////////////////
#/*      CREATE Aalborg University               */
#/*      aldsanms                                */
#/*      dec-01-2022                             */
#/*      Head_orientation                        */
#/*      app.R                                   */
#/*      v_1_2_2                                 */
#//////////////////////////////////////////////////
# This program allows you to see some stats about the player's head orientation.  
  

library(shiny)
library(r2d3)
library(tidyverse)
library(sp)
source("utils/loadrawdata.R")
options("digits.secs"=6)


#loading data
AllData <- LoadFromDirectory("data")



#retrieval of information necessary for the construction of the wall
Moles <- unique(
  AllData %>% 
    filter(filename == "data/log_Event.csv") %>% 
    select(MoleId,MolePositionLocalX,MolePositionLocalY,WallColumnCount,WallRowCount) %>%  
    filter(!is.na(MoleId))
  )

WallInfo <- data.frame( 
    x_extrem = c(
        min(as.double(Moles$MolePositionLocalX)),
        max(as.double(Moles$MolePositionLocalX))
    ),
    y_extrem = c(
      min(as.double(Moles$MolePositionLocalY)),
      max(as.double(Moles$MolePositionLocalY))
    ),
    n_col_row = c(
      unique(Moles$WallColumnCount),
      unique(Moles$WallRowCount)
    )
)


#angle mapping at -180 to 180
HeadCameraRotEulerY_not_na = AllData %>% drop_na(HeadCameraRotEulerY)

HeadCameraRotEulerY_wrap <- ifelse(
  (as.double(HeadCameraRotEulerY_not_na$HeadCameraRotEulerY) > 180),#if
      -(360 - as.double(HeadCameraRotEulerY_not_na$HeadCameraRotEulerY)) , #do
      HeadCameraRotEulerY_not_na$HeadCameraRotEulerY #else do
  )

#sort of angles
HeadCameraRotEulerY_wrap_sort <- sort(as.double(HeadCameraRotEulerY_wrap), method = "shell", index.return = TRUE)


#grouping of different variables to send them with R2D3
data_to_json <- function(data) {
  jsonlite::toJSON(data, dataframe = "rows", auto_unbox = FALSE, rownames = TRUE)
} 

data <- list(
  "wallInfo" = WallInfo,
  "hearCamRotSort" = HeadCameraRotEulerY_wrap_sort$x
  )



#creating a user interface
ui <- fluidPage(
  verbatimTextOutput("selected"),
  
  
  d3Output("pageGraph")
  
)



server <- function(input, output) {
  output$pageGraph <- renderD3({
    
    
    r2d3(
      data= data_to_json(data),
      script = "js/main.js",
      dependencies = list("js/wall.js", #v2_1_0
                          "js/utils.js", #v1_0_1
                          "js/headOrientation.js" #v1_0_0 
                      )
    )
  
    
  })
  output$selected <- renderText({
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) cos(bar_number)
  })
}

shinyApp(ui, server)