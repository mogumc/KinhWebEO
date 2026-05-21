package handler

import (
	"kinhweb-eo/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Index(c *gin.Context) {
	title := config.Cfg.System.Title
	if title == "" {
		title = "KinhWeb"
	}
	foot := config.Cfg.System.Foot

	c.HTML(http.StatusOK, "index.html", gin.H{
		"Title": title,
		"Foot":  foot,
	})
}
