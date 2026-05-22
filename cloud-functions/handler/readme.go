package handler

import (
	"encoding/json"
	"io"
	"kinhweb-eo/config"
	"kinhweb-eo/result"
	"kinhweb-eo/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetReadme(c *gin.Context) {
	fid := c.Query("fid")
	if fid == "" {
		result.Failed(c, -1, "Param Error")
		return
	}

	BDUSS := config.Cfg.User.BDUSS
	if BDUSS == "" {
		result.Failed(c, 501, "未配置后端账户")
		return
	}

	apipath := config.Cfg.User.ApiPath
	apiUrl := apipath + "/api/filemetas?dlink=1&clienttype=0&rt=third&fsids=[%22" + fid + "%22]"

	stoken := utils.GetStoken(BDUSS)
	cookie := "BDUSS=" + BDUSS + ";PANPSC=;BAIDUID=1;ndut_fmt=" + utils.Getndut()
	if stoken != "" {
		cookie += ";STOKEN=" + stoken + ";PANPSC=;BAIDUID=1;ndut_fmt=" + utils.Getndut()
	}
	res, err := utils.Get(apiUrl, "netdisk;Mo", cookie)
	if err != nil {
		result.Failed(c, 500, "Metadata fetch failed")
		return
	}

	var JsonData map[string]interface{}
	if err := json.Unmarshal([]byte(res), &JsonData); err != nil {
		result.Failed(c, 500, "Metadata fetch failed")
		return
	}

	info, ok := JsonData["info"].([]interface{})
	if !ok || len(info) == 0 {
		result.Failed(c, 404, "File not found")
		return
	}

	infoMap, ok := info[0].(map[string]interface{})
	if !ok {
		result.Failed(c, 500, "Data format error")
		return
	}

	filename, _ := infoMap["server_filename"].(string)
	if strings.ToLower(filename) != "readme.md" {
		result.Failed(c, 403, "Not a readme file")
		return
	}

	size, _ := infoMap["size"].(float64)
	if size > 10*1024*1024 {
		result.Failed(c, 403, "File too large")
		return
	}

	odlink, ok := infoMap["dlink"].(string)
	if !ok {
		result.Failed(c, 500, "Download link not found")
		return
	}

	dl := strings.Replace(strings.Replace(odlink, "d.pcs.baidu.com", "218.93.204.36/b/d.pcs.baidu.com", -1), "https", "http", -1) + "&clienttype=0&channel=0&version=8.4.0.103"
	headResult := utils.Head(dl, "netdisk;Mo", "")
	dlink := ""
	if headResult != nil {
		if loc := headResult.Get("Location"); loc != "" {
			dlink = loc
		}
	}

	if dlink == "" {
		dl = odlink + "&clienttype=0&channel=0&version=8.4.0.103"
		headResult = utils.Head(dl, "netdisk;Mo", "")
		if headResult != nil {
			if loc := headResult.Get("Location"); loc != "" {
				dlink = loc
			}
		}
	}

	if dlink == "" {
		result.Failed(c, 500, "Get download link failed")
		return
	}

	resp, err := http.Get(dlink)
	if err != nil || resp.StatusCode != http.StatusOK {
		result.Failed(c, 502, "Fetch content failed")
		return
	}
	defer resp.Body.Close()

	content, err := io.ReadAll(resp.Body)
	if err != nil {
		result.Failed(c, 500, "Read content failed")
		return
	}

	c.String(200, string(content))
}
