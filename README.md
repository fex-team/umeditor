UMeditor
=======

## UMeditor富文本编辑器 ##

UMeditor，简称UM，是 [ueditor](http://ueditor.baidu.com) 的简版。是为满足广大门户网站对于简单发帖框和回复框的需求，专门定制的在线富文本编辑器。我们的目标不仅是要提高在线编辑的编辑体验，也希望能改变前端技术中关于富文本技术的门槛，让大家不再觉得这块是个大坑。

### 主要特点 ###

1. **轻量**: 主文件的代码量为139k。
2. **加载速度更快**: 放弃了使用传统的iframe模式，采用了div的加载方式，以达到更快的加载速度和零加载失败率。
2. **可定制**: 配置项完善，可定制程度高。
2. **可扩展**: 代码层次拆分清晰，功能以插件形式挂接，可灵活定制需要的功能。
3. **多后台支持**: 支持php、asp、jsp、.net四种后台部署代码
4. **功能丰富**: 支持插入公式、粘贴QQ截屏、拖放上传图片、插入地图、草稿箱功能

## 入门部署和体验 ##

### 第一步：下载编辑器 ###

到官网下载 umeditor 最新版源码版本，下载之后打开 _examples/index.html 就可以看到演示例子。[[下载页面]](http://ueditor.baidu.com/website/download.html#mini "下载页面") 

### 第二步：部署编辑器到页面 ###

* 解压下载的包，放到你的项目中。
* 在你的页面要插入编辑器的位置，插入代码：
```html
<!-- 加载编辑器的容器 -->
<script id="container" name="content" type="text/plain" style="width:600px;height:200px;">
    这里写你的初始化内容
</script>
```
* 在```<head></head>```标签最后，插入需要引用的文件和实例化编辑器的代码(注意修改引用文件的路径),
其中：UM 依赖 jquery 和 [etpl](https://github.com/ecomfe/etpl) , 注意引入文件的顺序
```html
<!-- 样式文件 -->
<link rel="stylesheet" href="./umeditor/themes/default/css/umeditor.css">
<!-- 引用jquery -->
<script src="./umeditor/third-party/jquery.min.js"></script>
<!-- 引入 etpl -->
<script type="text/javascript" src="../third-party/template.min.js"></script>
<!-- 配置文件 -->
<script type="text/javascript" src="./umeditor/umeditor.config.js"></script>
<!-- 编辑器源码文件 -->
<script type="text/javascript" src="./umeditor/umeditor.js"></script>
<!-- 语言包文件 -->
<script type="text/javascript" src="./umeditor/lang/zh-cn/zh-cn.js"></script>
<!-- 实例化编辑器代码 -->
<script type="text/javascript">
    $(function(){
        window.um = UM.getEditor('container', {
        	/* 传入配置参数,可配参数列表看umeditor.config.js */
            toolbar: ['undo redo | bold italic underline']
        });
    });
</script>
```
* 这时候你再浏览器打开你的页面，看到下面这样的编辑器，说明你已部署成功。
![部署成功](_doc/images/render-editor.png)

### 第三步：获取和设置编辑器的内容 ###

```javascript
/* 获取编辑器内容 */
var html = um.getContent();
var txt = um.um.getContentTxt();

/* 设置编辑器内容 */
um.setContent('要设置的编辑器内容.');
```

## 相关链接 ##

UMeditor官网: [http://ueditor.baidu.com](http://ueditor.baidu.com/website/umeditor.html "umeditor 官网")

百度FEX-Team: [http://fex.baidu.com](http://fex.baidu.com "umeditor github 地址")

## 联系我们 ##

邮件: [ueditor@baidu.com](mailto://email:ueditor@baidu.com "发邮件给百度f3开发组")
