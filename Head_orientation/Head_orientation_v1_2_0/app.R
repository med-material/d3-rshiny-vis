
library(shiny)
library(r2d3)
library(tidyverse)
library(sp)
source("utils/loadrawdata.R")
options("digits.secs"=6)



AllData <- LoadFromDirectory("data")


HeadRot <- sort(AllData$HeadCameraRotEulerY, method = "shell", index.return = TRUE)


Moles <- unique(AllData %>% filter(filename == "data/log_Event.csv") %>% select(MoleId,MolePositionLocalX,MolePositionLocalY,WallColumnCount,WallRowCount) %>%  filter(!is.na(MoleId)))

MolesInfo <- data.frame(
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


data_to_json <- function(data) {
  jsonlite::toJSON(data, dataframe = "rows", auto_unbox = FALSE, rownames = TRUE)
} 

data <- list(
  "hr" = HeadRot$x,
  "mi" = MolesInfo
  )

ui <- fluidPage(
  verbatimTextOutput("selected"),
  
  
  d3Output("d3")
  
)




server <- function(input, output) {
  output$d3 <- renderD3({
    
    
    r2d3(
      data= data_to_json(data),
      script = "js/main.js",
      dependencies = list("js/wall_v2_0_0.js",
                          "js/utils_v1_0_0.js",
                          "js/graphStat_v1_0_0.js"
      )
    )
  
    
  })
  output$selected <- renderText({
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) cos(bar_number)
  })
}

shinyApp(ui, server)