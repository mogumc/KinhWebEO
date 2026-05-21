package handler

import (
	"encoding/base64"
	"encoding/json"
	"kinhweb-eo/config"
	"kinhweb-eo/result"
	"kinhweb-eo/utils"
	"log"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func Down(c *gin.Context) {
	fid := c.Query("fid")
	mode := c.Query("m")
	if fid == "" {
		result.Failed(c, -1, "Param Error")
		return
	}

	BDUSS := config.Cfg.User.BDUSS
	if BDUSS == "" {
		log.Printf("未填写BDUSS!")
		result.Failed(c, 501, "未配置后端账户")
		return
	}

	intfid, err := strconv.Atoi(fid)
	if err != nil {
		log.Printf("请求 Fid->%s 不是一个有效的参数", fid)
		result.Failed(c, -1, "Param Error")
		return
	}

	acclink := config.Cfg.User.AccLink
	if acclink == "" {
		downLocal(c, intfid, fid, BDUSS, mode)
	} else {
		downRemote(c, intfid, fid, BDUSS, acclink, mode)
	}
}

// downLocal 本地解析模式
func downLocal(c *gin.Context, intfid int, fid string, BDUSS string, mode string) {
	log.Printf("当前处于本地解析模式")
	apipath := config.Cfg.User.ApiPath
	apiUrl := apipath + "/api/filemetas?dlink=1&clienttype=0&rt=third&fsids=[%22" + fid + "%22]"

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
	log.Printf("请求 Fid->%d 返回状态码 errno->%d", intfid, errno)

	if errno != 0 {
		result.Failed(c, errno, "获取下载地址失败")
		return
	}

	info, ok := JsonData["info"].([]interface{})
	if !ok || len(info) == 0 {
		log.Printf("info 为空")
		result.Failed(c, errno, "获取下载地址失败")
		return
	}

	infoMap, ok := info[0].(map[string]interface{})
	if !ok {
		log.Printf("百度返回数据异常")
		result.Failed(c, errno, "获取下载地址失败")
		return
	}

	odlink, ok := infoMap["dlink"].(string)
	if !ok {
		log.Printf("百度返回数据异常")
		result.Failed(c, errno, "获取下载地址失败")
		return
	}

	rand := utils.Getrand(BDUSS)
	dl := strings.Replace(strings.Replace(odlink, "d.pcs.baidu.com", "218.93.204.36/b/d.pcs.baidu.com", -1), "https", "http", -1) + "&clienttype=0&channel=0&version=8.4.0.103&" + rand
	headResult := utils.Head(dl, c.Request.Header.Get("User-Agent"), "")
	dlink := ""
	if headResult != nil {
		if loc := headResult.Get("Location"); loc != "" {
			dlink = loc
		}
	}

	if dlink == "" {
		dl = odlink + "&clienttype=0&channel=0&version=8.4.0.103&" + rand
		headResult = utils.Head(dl, c.Request.Header.Get("User-Agent"), "")
		if headResult != nil {
			if loc := headResult.Get("Location"); loc != "" {
				dlink = loc
			}
		}
	}

	if dlink == "" {
		result.Failed(c, 99, "获取下载地址失败")
		return
	}

	if mode == ".baidu.com" {
		c.Redirect(302, dlink)
		return
	}

	data := gin.H{"fid": intfid, "dlink": dlink}
	result.Success(c, data)
}

// downRemote 远程解析模式
func downRemote(c *gin.Context, intfid int, fid string, BDUSS string, acclink string, mode string) {
	log.Printf("当前处于远程解析模式")
	res := utils.Get(acclink, "netdisk;Mo", "")

	var JsonData map[string]interface{}
	if err := json.Unmarshal([]byte(res), &JsonData); err != nil {
		log.Printf("解析Json失败 Url->%s", acclink)
		result.Failed(c, 500, "获取失败")
		return
	}

	// 兼容 string 和 float64 类型
	var codeStr string
	switch v := JsonData["code"].(type) {
	case string:
		codeStr = v
	case float64:
		codeStr = strconv.FormatFloat(v, 'f', 0, 64)
	default:
		log.Printf("加速链接返回了无效数据")
		result.Failed(c, -1, "无效的加速链接")
		return
	}

	intcode, err := strconv.Atoi(codeStr)
	if err != nil {
		log.Printf("加速链接返回了无效数据")
		result.Failed(c, -1, "无效的加速链接")
		return
	}

	if codeStr != "0" {
		log.Printf("加速链接无效 Url->%s", acclink)
		result.Failed(c, intcode, "无效的加速链接")
		return
	}

	pdata := "bduss=" + BDUSS + "&fid=" + fid + "&ua=" + base64.StdEncoding.EncodeToString([]byte(c.Request.Header.Get("User-Agent")))
	res = utils.Post(acclink, "KinhWeb", "", pdata)

	var JsonData2 map[string]interface{}
	if err := json.Unmarshal([]byte(res), &JsonData2); err != nil {
		log.Printf("解析Json失败 Url->%s", acclink)
		result.Failed(c, 500, "获取失败")
		return
	}

	errno := utils.ParseErrno(JsonData2["errno"])
	if errno != 0 {
		log.Printf("获取下载地址失败")
		result.Failed(c, errno, "获取下载地址失败")
		return
	}

	dlink, ok := JsonData2["dlink"].(string)
	if !ok || dlink == "" {
		log.Printf("获取下载地址失败")
		result.Failed(c, errno, "获取下载地址失败")
		return
	}

	log.Printf("获取到地址 %s", dlink)

	if mode == ".baidu.com" {
		c.Redirect(302, dlink)
		return
	}

	data := gin.H{"fid": intfid, "dlink": dlink}
	result.Success(c, data)
}
