```md
# 当前任务

- 实现输入控件，输入一个url，调用接口 submitVideo提交url， submitVideo会返回taskId，然后用taskId调用 getScenes 可获取任务状态, getScenes接口仅在任务完成时返回数据，因此需要循环调用getScenes接口

# 要求

- 实现输入到切片展示前的流程，切片编辑部分已实现，无需修改

# 涉及主要文件

- /src/pages/Editor/index.tsx

# 限制

- 保持组件拆分清晰
- 不影响现有功能
- 不修改无关代码

# 验收标准

- 从输入到切片展示前流程正常
```
