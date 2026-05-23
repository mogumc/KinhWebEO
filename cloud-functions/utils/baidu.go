package utils

import (
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"kinhweb-eo/config"
	"log"
	"strconv"
	"strings"
	"time"
)

func Getndut() string {
	data := "time=" + strconv.FormatInt(time.Now().Unix(), 10) + ";ua=other"
	key := []byte("01hltm9JcnEfqy5t")
	iv := []byte("Fsadviz5BSekw310")
	ndut_fmt := "-1"
	ndut, err := AesEncrypt([]byte(data), key, iv)
	if err != nil {
		log.Printf("Getndut error: %v", err)
	} else {
		ndut_fmt = strings.ToUpper(hex.EncodeToString(ndut))
	}
	return ndut_fmt
}

func GetStoken() string {
	apipath := config.Cfg.User.ApiPath
	bduss := config.Cfg.User.BDUSS
	ptoken := config.Cfg.User.PTOKEN
	stoken := config.Cfg.User.STOKEN
	if stoken != "" {
		return stoken
	}
	url := apipath + "/rest/2.0/xpan/file?method=plantcookie&type=stoken&source=pcs"
	cookie := "BDUSS=" + bduss + ";PANPSC=;BAIDUID=1;ndut_fmt=" + Getndut()
	if ptoken != "" {
		cookie = "BDUSS=" + bduss + ";PTOKEN=" + ptoken + "PANPSC=;BAIDUID=1;ndut_fmt=" + Getndut()
	}
	resp, err := GetWithResponse(url, "netdisk;Mo", cookie)
	if err != nil {
		log.Printf("GetStoken request failed: %v", err)
		return ""
	}
	defer resp.Body.Close()
	location := resp.Header.Get("Location")
	if location != "" && ptoken != "" {
		log.Printf("GetStoken need verfiy: %v", "需要重新登录")
		// 尝试重新登录
		loginUrl := "https://wappass.baidu.com/v3/login/api/auth?notjump=1&return_type=3&tpl=netdisk&u=https%3A%2F%2Fpan.baidu.com%2Frest%2F2.0%2Fxpan%2Ffile%3Fmethod%3Dplantcookie%26source%3Dpcs%26callid%3D0.1%26type%3Dstoken%26from_module%3Dcloud-ui"
		resp2, err2 := GetWithResponse(loginUrl, "netdisk;Mo", cookie)
		if err2 != nil {
			log.Printf("GetStoken request failed: %v", err)
			return ""
		}
		location2 := resp2.Header.Get("Location")
		if location2 == "" {
			log.Printf("GetStoken request failed: %v", "BDUSS无效")
			return ""
		}

		if !strings.Contains(location2, "&errno=0") && !strings.Contains(location2, "&stoken=") {
			log.Printf("GetStoken failed: %s", "PTOKEN无效")
			return ""
		}

		resp, err = GetWithResponse(location2, "netdisk;Mo", cookie)
	}

	// 检查 Set-Cookie 响应头
	cookies := resp.Header.Values("Set-Cookie")
	for _, cookie := range cookies {
		if strings.Contains(cookie, "STOKEN=") {
			parts := strings.Split(cookie, ";")
			for _, p := range parts {
				p = strings.TrimSpace(p)
				if strings.HasPrefix(p, "STOKEN=") {
					return strings.TrimPrefix(p, "STOKEN=")
				}
			}
		}
	}
	return ""
}

func Getrand(bduss string) string {
	Url := "https://wenku.baidu.com/customer/interface/vipinfo"
	result, err := Get(Url, "netdisk;11.0.0", "BDUSS="+bduss)
	if err != nil {
		log.Printf("Getrand request failed: %v", err)
		return "rand=0000&rand2=0000&devuid=114514&time=" + strconv.FormatInt(time.Now().Unix(), 10)
	}
	var JsonData map[string]interface{}
	Time := strconv.FormatInt(time.Now().Unix(), 10)
	if json.Unmarshal([]byte(result), &JsonData) == nil {
		data, ok := JsonData["data"].(map[string]interface{})
		if !ok {
			return "rand=0000&rand2=0000&devuid=114514&time=" + Time
		}
		uid, ok := data["uid"].(float64)
		if !ok {
			return "rand=0000&rand2=0000&devuid=114514&time=" + Time
		}
		UserIDString := strconv.FormatInt(int64(uid), 10)
		log.Printf("UID->%s", UserIDString)
		DevUIDSha1Byte := sha1.Sum([]byte(bduss))
		DevUID := hex.EncodeToString(DevUIDSha1Byte[:])
		BDUSSSha1Byte := sha1.Sum([]byte(bduss))
		BDUSSSha1 := hex.EncodeToString(BDUSSSha1Byte[:])
		RandByte := sha1.Sum([]byte(BDUSSSha1 + UserIDString + "ebrcUYiuxaZv2XGu7KIYKxUrqfnOfpDF" + Time + DevUID))
		Rand := hex.EncodeToString(RandByte[:])
		return "rand=" + Rand + "&rand2=" + Rand + "&devuid=" + DevUID + "&time=" + Time
	}
	return "rand=0000&rand2=0000&devuid=114514&time=" + Time
}
