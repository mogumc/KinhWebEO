package utils

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"kinhweb-eo/config"
)

var (
	clientOnce sync.Once
	client     *http.Client
)

// getClient 初始化或获取 HTTP 客户端
func getClient() *http.Client {
	clientOnce.Do(func() {
		transport := &http.Transport{}
		if config.Cfg != nil && config.Cfg.System.InsecureSkipVerify {
			transport.TLSClientConfig = &tls.Config{
				InsecureSkipVerify: true,
			}
		}

		client = &http.Client{
			CheckRedirect: func(req *http.Request, via []*http.Request) error {
				return http.ErrUseLastResponse
			},
			Timeout:   15 * time.Second,
			Transport: transport,
		}
	})
	return client
}

func Get(url string, ua string, cookie string) (string, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("创建GET请求失败: %w", err)
	}
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Cookie", cookie)
	resp, err := getClient().Do(req)
	if err != nil {
		return "", fmt.Errorf("GET请求失败: %w", err)
	}
	defer resp.Body.Close()
	body := new(bytes.Buffer)
	if _, err := io.Copy(body, resp.Body); err != nil {
		return "", fmt.Errorf("读取响应体失败: %w", err)
	}
	return body.String(), nil
}

func Head(url string, ua string, cookie string) http.Header {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("创建HEAD请求失败: %v", err)
		return nil
	}
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Cookie", cookie)
	resp, err := getClient().Do(req)
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
	return getClient().Do(req)
}

func Post(url string, ua string, cookie string, data string) (string, error) {
	req, err := http.NewRequest("POST", url, strings.NewReader(data))
	if err != nil {
		return "", fmt.Errorf("创建POST请求失败: %w", err)
	}
	req.Header.Set("User-Agent", ua)
	req.Header.Set("Cookie", cookie)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := getClient().Do(req)
	if err != nil {
		return "", fmt.Errorf("POST请求失败: %w", err)
	}
	defer resp.Body.Close()
	body := new(bytes.Buffer)
	if _, err := io.Copy(body, resp.Body); err != nil {
		return "", fmt.Errorf("读取响应体失败: %w", err)
	}
	return body.String(), nil
}
