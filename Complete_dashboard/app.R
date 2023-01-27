#//////////////////////////////////////////////////
#/*      CREATE Aalborg University               */
#/*      aldsanms                                */
#/*      jan-25-2023                             */
#/*      app.R                                   */
#/*      ImplementCompleteDashboard              */
#/*      v_1_2_0                                 */
#//////////////////////////////////////////////////


library(shiny)
library(r2d3)
library(tidyverse)
library(sp)
source("utils/loadrawdata.R")
options("digits.secs"= 6)
options(r2d3.shadow = FALSE)

#loading data
AllData <- LoadFromDirectory("data")

#retrieval of information necessary for the construction of the wall
Moles <- (
  AllData %>% 
    filter(Event != "Sample") %>% 
    select(MoleId,MolePositionLocalX,MolePositionLocalY,WallColumnCount,WallRowCount,Event) %>%  
    filter(!is.na(MoleId))
)

Controller <- (
  AllData %>% 
    filter(Event == "Sample") %>% 
    select(RightControllerPosWorldX,RightControllerPosWorldZ,RightControllerPosWorldY)
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

ControllerInfos = data.frame(
  x_extrem = c(
    min(as.double(Controller$RightControllerPosWorldX)),
    max(as.double(Controller$RightControllerPosWorldX))
  ),
  z_extrem = c(
    min(as.double(Controller$RightControllerPosWorldZ)),
    max(as.double(Controller$RightControllerPosWorldZ))
  )
)

molesEventStats <- data.frame( 
  moleSpawned = length(which(Moles$Event=="Mole Spawned")),
  moleHit = length(which(Moles$Event=="Mole Hit")),
  fakeMoleSpawned = length(which(Moles$Event=="Fake Mole Spawned")),
  fakeMoleHit = length(which(Moles$Event=="Fake Mole Hit"))
)

MotorSpace <- unique(
  AllData %>% 
    select(Timestamp,MotorSpaceName,MotorSpaceWidth,MotorSpaceHeight,MotorSpaceCenterPositionX,MotorSpaceCenterPositionY,MotorSpaceCenterPositionZ,MotorSpaceGainX,MotorSpaceGainY) %>%  
    filter(!is.na(MotorSpaceName))
)
MotorSpaceName <- unique(
  MotorSpace %>% 
    select(MotorSpaceName) %>%  
    filter(!is.na(MotorSpaceName))
)

ad = (AllData %>% filter(Event == "Sample"))
aed = (AllData %>% filter(Event != "Sample"))

activeController <- unique(
  AllData %>% 
    select(ControllerName,ControllerSmoothed) %>%  
    filter(!is.na(ControllerName))
)


data_to_json <- function(data) {
  jsonlite::toJSON(data, dataframe = "rows", auto_unbox = FALSE, rownames = TRUE)
} 

data <- list(
  "wallInfo" = WallInfo,
  "ControllerInfos" = ControllerInfos,
  "aed" = aed,
  "ad" = ad,
  "ms" = molesEventStats,
  "motorSpace" = MotorSpace,
  "motorSpaceName" = MotorSpaceName,
  "activeController" = activeController
  )

ui <- fluidPage(
  verbatimTextOutput("selected"),
  
  d3Output("pageGraph")
  
)




server <- function(input, output) {
  output$pageGraph <- renderD3({
    
    
    r2d3(
      data= data_to_json(data),
      script = "js/main.js",
      dependencies = list("js/wall.js", #v2_2_3
                          "js/utils.js", #v_1_0_1
                          "js/slider.js", #v_1_1_3
                          "js/graphController.js", #v1_1_4
                          "js/infosDisplay.js" #v1_1_0
                          )
    )
  
    
  })
  output$selected <- renderText({
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) cos(bar_number)
  })
}

shinyApp(ui, server)



