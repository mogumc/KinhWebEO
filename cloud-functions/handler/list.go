package handler

import (
	"encoding/json"
	"kinhweb-eo/config"
	"kinhweb-eo/result"
	"kinhweb-eo/utils"
	"log"
	"net/url"
	"strconv"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	dir := c.Query("dir")
	if dir == "" {
		result.Failed(c, -1, "Param Error")
		return
	}

	BDUSS := config.Cfg.User.BDUSS
	if BDUSS == "" {
		log.Printf("未填写BDUSS!")
		result.Failed(c, 501, "未配置后端账户")
		return
	}

	apiUrl := config.Cfg.User.ApiPath + "/api/list?order=time&dir=" + url.QueryEscape(dir)
	cookie := "BDUSS=" + BDUSS + ";PANPSC=;BAIDUID=1;ndut_fmt=" + utils.Getndut()
	res := utils.Get(apiUrl, "netdisk;Mo", cookie)

	var JsonData map[string]interface{}
	if err := json.Unmarshal([]byte(res), &JsonData); err != nil {
		log.Printf("解析Json失败 Url->%s", apiUrl)
		result.Failed(c, 500, "获取失败")
		return
	}

	// 兼容 errno 可能是 string 或 float64 类型
	errno := parseErrno(JsonData["errno"])

	log.Printf("请求 Path->%s 返回状态码 errno->%d", dir, errno)

	if errno == 0 {
		lists, ok := JsonData["list"].([]interface{})
		if !ok {
			lists = []interface{}{}
		}
		data := gin.H{"dir": dir, "list": lists}
		result.Success(c, data)
	} else {
		result.Failed(c, errno, "文件列表为空")
	}
}

// parseErrno 解析 errno 字段，兼容 string 和 float64 类型
func parseErrno(v interface{}) int {
	switch val := v.(type) {
	case float64:
		return int(val)
	case string:
		if i, err := strconv.Atoi(val); err == nil {
			return i
		}
	}
	return -1
}
