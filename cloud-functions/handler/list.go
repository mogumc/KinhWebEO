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

	apiUrl := config.Cfg.User.ApiPath + "/api/list?clienttype=0&app_id=250528&web=1&order=time&dir=" + url.QueryEscape(dir)
	stoken := utils.GetStoken(BDUSS)
	cookie := "BDUSS=" + BDUSS + ";PANPSC=;BAIDUID=1;ndut_fmt=" + utils.Getndut()
	if stoken != "" {
		cookie += ";STOKEN=" + stoken + ";PANPSC=;BAIDUID=1;ndut_fmt=" + utils.Getndut()
	}
	res := utils.Get(apiUrl, "netdisk;Mo", cookie)

	var JsonData map[string]interface{}
	if err := json.Unmarshal([]byte(res), &JsonData); err != nil {
		log.Printf("解析Json失败 Url->%s", apiUrl)
		result.Failed(c, 500, "获取失败")
		return
	}

	errno := utils.ParseErrno(JsonData["errno"])
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
