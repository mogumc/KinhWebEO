package config

import (
	"os"
	"strconv"

	"gopkg.in/yaml.v3"
)

type Config struct {
	System SystemConfig `yaml:"system"`
	User   UserConfig   `yaml:"user"`
}

type SystemConfig struct {
	Port  int    `yaml:"bind_port"`
	Host  string `yaml:"bind_host"`
	Title string `yaml:"title"`
	Foot  string `yaml:"foot"`
}

type UserConfig struct {
	BDUSS   string `yaml:"bduss"`
	IsVIP   int    `yaml:"is_vip"`
	AccLink string `yaml:"acclink"`
	ApiPath string `yaml:"api_path"`
}

var Cfg *Config

// 默认值配置
var defaultConfig = Config{
	System: SystemConfig{
		Port:  9000,
		Host:  "0.0.0.0",
		Title: "KinhWeb",
		Foot:  "",
	},
	User: UserConfig{
		BDUSS:   "",
		IsVIP:   0,
		AccLink: "",
		ApiPath: "http://110.242.69.43",
	},
}

func Init() {
	Cfg = &Config{
		System: SystemConfig{
			Port:  getEnvInt("PORT", defaultConfig.System.Port),
			Host:  getEnv("HOST", defaultConfig.System.Host),
			Title: getEnv("TITLE", defaultConfig.System.Title),
			Foot:  getEnv("FOOT", defaultConfig.System.Foot),
		},
		User: UserConfig{
			BDUSS:   getEnv("BDUSS", defaultConfig.User.BDUSS),
			IsVIP:   getEnvInt("IS_VIP", defaultConfig.User.IsVIP),
			AccLink: getEnv("ACCLINK", defaultConfig.User.AccLink),
			ApiPath: getEnv("API_PATH", defaultConfig.User.ApiPath),
		},
	}
}

// LoadFromBytes 从 []byte 解析 YAML 并合并到当前配置
// 优先级：环境变量 > YAML 文件值 > 默认值
func LoadFromBytes(data []byte) {
	var fileCfg Config
	if err := yaml.Unmarshal(data, &fileCfg); err != nil {
		return
	}
	mergeConfig(Cfg, &fileCfg)
}

// LoadFromFile 从文件路径读取 YAML 并合并（本地开发用）
func LoadFromFile(path string) {
	data, err := os.ReadFile(path)
	if err != nil {
		return
	}
	LoadFromBytes(data)
}

// mergeConfig 合并配置，非零值覆盖目标值
func mergeConfig(dst, src *Config) {
	if src.System.Port > 0 {
		dst.System.Port = src.System.Port
	}
	if src.System.Host != "" {
		dst.System.Host = src.System.Host
	}
	if src.System.Title != "" {
		dst.System.Title = src.System.Title
	}
	if src.System.Foot != "" {
		dst.System.Foot = src.System.Foot
	}
	// BDUSS 是必填项，空值不覆盖
	if src.User.BDUSS != "" {
		dst.User.BDUSS = src.User.BDUSS
	}
	if src.User.IsVIP > 0 {
		dst.User.IsVIP = src.User.IsVIP
	}
	if src.User.AccLink != "" {
		dst.User.AccLink = src.User.AccLink
	}
	if src.User.ApiPath != "" {
		dst.User.ApiPath = src.User.ApiPath
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
