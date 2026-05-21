package utils

import (
	"bytes"
	"crypto/tls"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

var client = &http.Client{
	CheckRedirect: func(req *http.Request, via []*http.Request) error {
		return http.ErrUseLastResponse
	},
	Timeout: 15 * time.Second,
	Transport: &http.Transport{
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
	},
}

func Get(url string, ua string, cookie string) string {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("创建GET请求失败: %v", err)
		return ""
	}
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Cookie", cookie)
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("GET请求失败: %v", err)
		return ""
	}
	defer resp.Body.Close()
	body := new(bytes.Buffer)
	if _, err := io.Copy(body, resp.Body); err != nil {
		log.Printf("读取响应体失败: %v", err)
	}
	return body.String()
}

func Head(url string, ua string, cookie string) http.Header {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("创建HEAD请求失败: %v", err)
		return nil
	}
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Cookie", cookie)
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("HEAD请求失败: %v", err)
		return nil
	}
	defer resp.Body.Close()
	return resp.Header
}

func GetWithResponse(url string, ua string, cookie string) (*http.Response, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Cookie", cookie)
	return client.Do(req)
}

func Post(url string, ua string, cookie string, data string) string {
	req, err := http.NewRequest("POST", url, strings.NewReader(data))
	if err != nil {
		log.Printf("创建POST请求失败: %v", err)
		return ""
	}
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Cookie", cookie)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("POST请求失败: %v", err)
		return ""
	}
	defer resp.Body.Close()
	body := new(bytes.Buffer)
	if _, err := io.Copy(body, resp.Body); err != nil {
		log.Printf("读取响应体失败: %v", err)
	}
	return body.String()
}
