package handler

import (
	"encoding/json"
	"kinhweb-eo/config"
	"kinhweb-eo/result"
	"kinhweb-eo/utils"
	"log"
	"net/url"

	"github.com/gin-gonic/gin"
)

func Search(c *gin.Context) {
	key := c.Query("key")
	dir := c.Query("dir")
	if key == "" {
		result.Failed(c, -1, "Param Error: key is required")
		return
	}
	if dir == "" {
		dir = "/"
	}

	BDUSS := config.Cfg.User.BDUSS
	if BDUSS == "" {
		result.Failed(c, 501, "未配置后端账户")
		return
	}

	// 构建百度搜索 API URL
	apiUrl := config.Cfg.User.ApiPath + "/api/search?clienttype=0&app_id=250528&web=1&order=name&desc=0&num=100&page=1&recursion=1&key=" + url.QueryEscape(key)

	// 使用统一的 Cookie 策略
	stoken := utils.GetStoken(BDUSS)
	cookie := "BDUSS=" + BDUSS + ";PANPSC=;BAIDUID=1;ndut_fmt=" + utils.Getndut()
	if stoken != "" {
		cookie += ";STOKEN=" + stoken + ";PANPSC=;BAIDUID=1;ndut_fmt=" + utils.Getndut()
	}
	res := utils.Get(apiUrl, "netdisk;Mo", cookie)

	var JsonData map[string]interface{}
	if err := json.Unmarshal([]byte(res), &JsonData); err != nil {
		log.Printf("解析搜索 JSON 失败 Url->%s", apiUrl)
		result.Failed(c, 500, "搜索失败")
		return
	}

	errno := utils.ParseErrno(JsonData["errno"])
	if errno == 0 {
		lists, ok := JsonData["list"].([]interface{})
		if !ok {
			lists = []interface{}{}
		}
		c.Header("Cache-Control", "public, max-age=300")
		result.Success(c, gin.H{"list": lists})
	} else {
		result.Failed(c, errno, "搜索无结果或失败")
	}
}
