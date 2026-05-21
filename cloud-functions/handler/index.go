package handler

import (
	"kinhweb-eo/result"
	"time"

	"github.com/gin-gonic/gin"
)

func Index(c *gin.Context) {
	result.Success(c, gin.H{
		"time": time.Now(),
	})
	return
}
