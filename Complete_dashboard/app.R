#//////////////////////////////////////////////////
#/*      CREATE Aalborg University               */
#/*      aldsanms                                */
#/*      feb-03-2023                             */
#/*      app.R                                   */
#/*      ImplementCompleteDashboard              */
#/*      v_1_3_2                                 */
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
MolesEvent <- (
  AllData %>% 
    filter(Event != "Sample") %>% 
    select(MoleId,Event,WallColumnCount,WallRowCount) %>%  
    filter(!is.na(MoleId))
)

MoleCreated <- (
  AllData %>% 
    filter(Event == "Mole Created") %>% 
    select(MolePositionWorldX,MolePositionWorldY)
)

Controller <- (
  AllData %>% 
    filter(Event == "Sample") %>% 
    select(RightControllerPosWorldX,RightControllerPosWorldZ,RightControllerPosWorldY,LeftControllerPosWorldX,LeftControllerPosWorldY,LeftControllerPosWorldZ)
)

WallInfo <- data.frame( 
  x_extrem = c(
    min(as.double(MoleCreated$MolePositionWorldX)),
    max(as.double(MoleCreated$MolePositionWorldX))
  ),
  y_extrem = c(
    min(as.double(MoleCreated$MolePositionWorldY)),
    max(as.double(MoleCreated$MolePositionWorldY))
  ),
  n_col_row = c(
    unique(MolesEvent$WallColumnCount),
    unique(MolesEvent$WallRowCount)
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
  ),
  x_extrem_right = c(
    min(as.double(Controller$RightControllerPosWorldX)),
    max(as.double(Controller$RightControllerPosWorldX))
  ),
  z_extrem_right = c(
    min(as.double(Controller$RightControllerPosWorldZ)),
    max(as.double(Controller$RightControllerPosWorldZ))
  )
  ,
  x_extrem_left = c(
    min(as.double(Controller$LeftControllerPosWorldX)),
    max(as.double(Controller$LeftControllerPosWorldX))
  ),
  z_extrem_left = c(
    min(as.double(Controller$LeftControllerPosWorldZ)),
    max(as.double(Controller$LeftControllerPosWorldZ))
  )
)
#browser()
molesEventStats <- data.frame( 
  moleSpawned = length(which(MolesEvent$Event=="Mole Spawned")),
  moleHit = length(which(MolesEvent$Event=="Mole Hit")),
  fakeMoleSpawned = length(which(MolesEvent$Event=="Fake Mole Spawned")) + length(which(MolesEvent$Event=="DistractorLeft Mole Spawned")) + length(which(MolesEvent$Event=="DistractorRight Mole Spawned")),
  fakeMoleHit = length(which(MolesEvent$Event=="Fake Mole Hit"))
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

  d3Output("pageGraph")
  
)




server <- function(input, output) {
  output$pageGraph <- renderD3({
    
    
    r2d3(
      data= data_to_json(data),
      script = "js/main.js",
      dependencies = list("js/wall.js", #v2_3_2
                          "js/utils.js", #v_1_0_1
                          "js/slider.js", #v_1_2_0
                          "js/graphController.js", #v1_2_0
                          "js/infosDisplay.js" #v1_1_0
                          )
    )
  
    
  })
}

shinyApp(ui, server)



