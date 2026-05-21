package utils

import "strconv"

// ParseErrno 解析 errno 字段，兼容 string 和 float64 类型
func ParseErrno(v interface{}) int {
	switch val := v.(type) {
	case float64:
		return int(val)
	case string:
		if i, err := strconv.Atoi(val); err == nil {
			return i
		}
	}
	return -1
}
