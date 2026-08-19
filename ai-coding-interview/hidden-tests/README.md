面试官用。候选人不应看到本目录。

```bash
# 对 starter 现状应大部分失败（这是预期）
node hidden.test.js

# 对候选人实现
CORE_PATH=/path/to/candidate/core.js node hidden.test.js
```

XSS 不能单靠这些测试定论：若未导出 `escapeHtml`，请在浏览器里创建标题 `<img src=x onerror=alert(1)>`，确认不弹窗且以文本显示。
