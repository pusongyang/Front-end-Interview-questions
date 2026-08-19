# 面试官指南（不要发给候选人）

## 口头说明（约 30 秒）

「这 1 小时请用你平时的 AI 工具完成。我看重你怎么拆任务、怎么验证，不看你会不会手写每一行。做完后我会问：哪些是模型写的、你改了什么、怎么证明做对了。有需求不清楚请当场问我。」

## 开始前

1. 把 `starter/` 拷到**私有仓库**发给候选人，或面试时现场给 zip。
2. 确认她的机器有 Node 18+、浏览器、以及她习惯的 AI 工具。
3. 不要把本文件、`hidden-tests/`、`rubric.md` 发给她。

## 现场流程

| 时间 | 你做什么 |
| --- | --- |
| 0–5 min | 读任务书。强调：用 AI 是加分项的前提，不是可以不看代码。 |
| 5–50 min | 沉默观察，只在她完全停住时问：「你现在相信哪一条已经过了？」 |
| 50–60 min | 复盘三问（见 00-design.md）。跑隐藏测试。 |

## starter 里埋的缺陷（代码里没有 BUG 注释）

| 位置 | 现象 | 常见错误修法 |
| --- | --- | --- |
| `searchIssues` | `includes` 原样匹配，只搜 title | 只 `toLowerCase` 了 title，忘了 body |
| `filterByStatus` | `all` 被当成状态值去 `===` | 改成 `!status` 但 URL 里仍写 `status=all` 时又坏 |
| `createIssue` | `id = issues.length + 1` | 只改成 `Date.now()`，同毫秒双击仍可能撞（可接受）；更好是单调递增 max+1 |
| `ui.js` `render` | `innerHTML` 拼接 title/body | 只 escape title、或改用框架重写整页 |
| `loadState` | `JSON.parse` 无 try/catch | P2 以外可忽略；有人会主动修，记加分 |
| 无 URL 同步 | 刷新丢失筛选 | 只 `pushState` 不读 onload；或每敲一个字母 push 一次历史 |

**「可叠加」期望（隐藏标准）：AND。**  
例如 `status=open&label=bug` 只显示开放且带 bug 的。OR 只要她在 `DECISIONS.md` 写清，且实现与文档一致，也算过（此时跳过 hidden 的 AND 用例，改用手测）。没写文档又说不清，P1 降档。

## 观察：绿旗 / 红旗

**绿旗**

- 先跑 `npm test` 和打开页面，再打开 AI。
- prompt 里贴验收标准、约束（不许上框架）、相关文件名。
- 一次只让 AI 做 P0 或单一函数，而不是「按 brief 全做」。
- AI 返回后自己跑测试、用 `<img src=x onerror=alert(1)>` 点一下。
- 删掉 AI 加的无用抽象（redux、class 体系、额外依赖）。
- 主动问 AND/OR，或写进 DECISIONS.md。

**红旗**

- 把整份 brief 丢进 AI，然后等待，不读 diff。
- 测试红了就「再生成一遍」，不看失败断言。
- 为了 labels 引入 React + Vite。
- 宣称 XSS 已修，但 title 仍走 `innerHTML`。
- 60 分钟结束时说不清改了哪些函数。

## 面试结束后怎么验收

在候选人目录执行：

```bash
cd starter && npm test
node ../hidden-tests/hidden.test.js
```

隐藏测试覆盖：大小写+body 搜索、`all`、XSS escape、label 过滤、AND 叠加、URL query 的 parse/serialize（若她把函数导出了）。若她没导出 URL 辅助函数，改为**手动**：设置筛选 → 看地址栏 → 刷新是否恢复。

## 参考实现要点（不是唯一写法）

- 搜索：`(title + body).toLowerCase().includes(query.trim().toLowerCase())`，空 query 不过滤。
- `filterByStatus`：`status == null || status === 'all' || issue.status === status`。
- XSS：`escapeHtml` + `textContent`，或只允许纯文本节点。
- labels：`split(/,/)` + trim + filter Boolean；过滤 `issue.labels.includes(label)`。
- URL：`URLSearchParams`；读取 `location.search` 作为初始 `query/status/label`；变更时 `history.replaceState`（比 `pushState` 更符合「筛选不是浏览历史」）。
- id：`Math.max(0, ...ids) + 1`。
