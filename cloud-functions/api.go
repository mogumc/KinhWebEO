package main

import (
	"fmt"
	"kinhweb-eo/config"
	"kinhweb-eo/handler"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	config.Init()

	r := gin.Default()

	// CORS 中间件
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/list", handler.List)
	r.GET("/down", handler.Down)
	r.GET("/config", handler.GetConfig)
	r.GET("/search", handler.Search)
	r.GET("/readme", handler.GetReadme)

	addr := fmt.Sprintf("%s:%d", config.Cfg.System.Host, config.Cfg.System.Port)
	log.Printf("KinhWebEO 启动成功 运行在: %s", addr)
	r.Run(addr)
}
