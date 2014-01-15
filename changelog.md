# UMeditor Change List

## 1.1.0

### 功能更新
1. 支持插入数学公式
2. 支持插入动态地图
3. 支持复制图片、截屏图片的粘贴
4. 添加自动保存插件，支持草稿箱功能
5. 支持拖放图片上传并插入

### 问题修复
1. 修复表情本地化出错问题
2. 修复excludeplugin配置项的问题
3. 修复多编辑器，dialog弹层被其他编辑器遮住的问题
4. 修复dialog的使用id选择元素，导致多编辑器dialog出错的问题
5. dialog的样式，添加前缀选择器.edui-dialog-dialogName
6. insertvideo dialog名称修改为video
7. 解决bootstrap 命名冲突


## 1.0.0

### 主要特点
1. 采用div作为编辑容器，加快加载速度
2. 采用原生编辑命令策略，减少代码整体代码量,也加快了执行的速度
3. 将原有ueditor的ui层，拆解为ui与adapter两层，进一步方便扩展功能
4. 整个项目基于jquery
5. 新增图片拖拽上传功能
6. 新增chrome浏览器下可视化的图片修改大小
7. 更加丰富的示例代码
8. 使用grunt作为部署
