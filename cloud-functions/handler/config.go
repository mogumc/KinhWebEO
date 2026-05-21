package handler

import (
	"kinhweb-eo/config"
	"kinhweb-eo/result"

	"github.com/gin-gonic/gin"
)

func GetConfig(c *gin.Context) {
	title := config.Cfg.System.Title
	if title == "" {
		title = "KinhWeb"
	}
	foot := config.Cfg.System.Foot

	result.Success(c, gin.H{
		"title": title,
		"foot":  foot,
	})
}
