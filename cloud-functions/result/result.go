package result

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Result struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func Success(c *gin.Context, data interface{}) {
	if data == nil {
		data = gin.H{}
	}
	c.JSON(http.StatusOK, Result{
		Code:    200,
		Message: "请求成功",
		Data:    data,
	})
}

func Failed(c *gin.Context, code int, message string) {
	c.JSON(http.StatusOK, Result{
		Code:    code,
		Message: message,
		Data:    gin.H{},
	})
}
