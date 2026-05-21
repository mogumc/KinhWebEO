package utils

import (
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
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

func Getrand(bduss string) string {
	Url := "https://wenku.baidu.com/customer/interface/vipinfo"
	result := Get(Url, "netdisk;11.0.0", "BDUSS="+bduss)
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
