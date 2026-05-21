package handler

import (
	"encoding/json"
	"io"
	"kinhweb-eo/config"
	"kinhweb-eo/result"
	"kinhweb-eo/utils"
	"log"
	"net/url"
	"strconv"
	"strings"

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

	errno := utils.ParseErrno(JsonData["errno"])
	log.Printf("请求 Path->%s 返回状态码 errno->%d", dir, errno)

	if errno == 0 {
		lists, ok := JsonData["list"].([]interface{})
		if !ok {
			lists = []interface{}{}
		}

		// 检查 README
		var readmeContent string
		for _, item := range lists {
			file := item.(map[string]interface{})
			filename := file["server_filename"].(string)
			if strings.ToLower(filename) == "readme.md" {
				// 获取 README 内容
				dlink := file["dlink"].(string)
				readmeContent = fetchReadmeContent(dlink, BDUSS)
				break
			}
		}

		data := gin.H{"dir": dir, "list": lists, "readme": readmeContent}
		result.Success(c, data)
	} else {
		result.Failed(c, errno, "文件列表为空")
	}
}

func fetchReadmeContent(dlink, BDUSS string) string {
	cookie := "BDUSS=" + BDUSS + ";PANPSC=;BAIDUID=1;ndut_fmt=" + utils.Getndut()
	res, err := utils.GetWithResponse(dlink, "netdisk;Mo", cookie)
	if err != nil {
		return ""
	}
	defer res.Body.Close()
	content, _ := io.ReadAll(res.Body)
	// 限制 README 大小，防止超大文件攻击
	if len(content) > 1024*50 {
		return string(content[:1024*50]) + "\n...(内容过长已截断)"
	}
	return string(content)
}

	}
	return -1
}
