library(shiny)
library(r2d3)
library(tidyverse)
library(sp)

data <- read.csv(file = "Eyes_log_Sample.csv",stringsAsFactors = FALSE,
                    strip.white = TRUE,
                    sep = ";")



data = data %>%filter(LocalGazeDirectionX != 'NULL')


Eyes_Data = data %>% select(LocalGazeDirectionX,LocalGazeDirectionY)


Xtrem_points <- chull(Eyes_Data$LocalGazeDirectionX, Eyes_Data$LocalGazeDirectionY)
plot(Eyes_Data[Xtrem_points, ])
lines(Eyes_Data[Xtrem_points, ])
D = Eyes_Data[Xtrem_points, ]



D = D %>% mutate(is_hull = TRUE,
  xy = paste(LocalGazeDirectionX,LocalGazeDirectionY))  %>% select(xy,is_hull)

data = data %>% mutate(
  xy = paste(LocalGazeDirectionX,LocalGazeDirectionY)
)

data = data %>% left_join(D, by = "xy")



ui <- fluidPage(
  verbatimTextOutput("selected"),
  
  
  d3Output("d3")
  

  
)




server <- function(input, output) {
  output$d3 <- renderD3({
    
    
    r2d3(
      data=data, 
      script = "main.js"
    )
  
    
  })
  output$selected <- renderText({
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) cos(bar_number)
  })
}

shinyApp(ui, server)