package config

import (
	"os"
	"strconv"
)

type Config struct {
	System SystemConfig
	User   UserConfig
}

type SystemConfig struct {
	Port               int
	Host               string
	Title              string
	Foot               string
	InsecureSkipVerify bool
}

type UserConfig struct {
	BDUSS   string
	IsVIP   int
	AccLink string
	ApiPath string
}

var Cfg *Config

var defaultConfig = Config{
	System: SystemConfig{
		Port:               9000,
		Host:               "0.0.0.0",
		Title:              "KinhWeb",
		Foot:               "",
		InsecureSkipVerify: false,
	},
	User: UserConfig{
		BDUSS:   "",
		IsVIP:   0,
		AccLink: "",
		ApiPath: "https://pan.baidu.com",
	},
}

func Init() {
	Cfg = &Config{
		System: SystemConfig{
			Port:               getEnvInt("PORT", defaultConfig.System.Port),
			Host:               getEnv("HOST", defaultConfig.System.Host),
			Title:              getEnv("TITLE", defaultConfig.System.Title),
			Foot:               getEnv("FOOT", defaultConfig.System.Foot),
			InsecureSkipVerify: getEnvBool("INSECURE_SKIP_VERIFY", defaultConfig.System.InsecureSkipVerify),
		},
		User: UserConfig{
			BDUSS:   getEnv("BDUSS", defaultConfig.User.BDUSS),
			IsVIP:   getEnvInt("IS_VIP", defaultConfig.User.IsVIP),
			AccLink: getEnv("ACCLINK", defaultConfig.User.AccLink),
			ApiPath: getEnv("API_PATH", defaultConfig.User.ApiPath),
		},
	}
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	if val := os.Getenv(key); val != "" {
		if intVal, err := strconv.Atoi(val); err == nil {
			return intVal
		}
	}
	return defaultVal
}

func getEnvBool(key string, defaultVal bool) bool {
	if val := os.Getenv(key); val != "" {
		return val == "true" || val == "1" || val == "TRUE"
	}
	return defaultVal
}
