# gulp-demo-for-projects-runner
>gulp练习，用于项目运行
- gulp@4.0.0
- js项目发布方式，支持es6+。
- 默认采用scss样式。
- 拥有dev开发运行,release发布运行能力
- 支持zip打包功能

## 用法
### 创建项目和视图页面: generate project and view
>project不设置时，默认为app
```text
gulp generate:project --project=note  # 创建项目 # gulp gp --project=note
gulp generate:view --project=note --view=index # 创建视图页面 # gulp gv --project=note --view=index
# 直接用命令行 bin/generate.sh 也可

gulp default_start --project=<projectname> # 默认dev模式打包
gulp watch --project=<projectname> # dev模式监听改变
gulp serve --project=<projectname> # dev模式启动服务
# 访问: http://localhost:8000/view/index/index.html

gulp default_start:release --project=<projectname> # 默认release模式打包
gulp watch:release --project=<projectname> # release模式监听改变
gulp serve:release --project=<projectname> # release模式启动服务
# 访问: http://localhost:8100/view/index/index.html

```



### 命令行运行:开发模式: for dev

```bash
bin/dev_run.bat # (windows)
bin/dev_run.sh  # (linux)
bin/dev_run_ios.sh # (mac)
```

### 命令行运行:发布模式: for release( the compress dev which also for prod)

```bash
bin/release_run.bat # (windows)
bin/release_run.sh  # (linux)
bin/release_run_ios.sh # (mac)
```

### 打包zip
```bash
gulp zip --project=note
gulp zip:release --project=note
```

## 代码注意
##### 页面视图(view/xxx/xxx)
- 只对包含【.app.】的文件进行处理，并且会删除【.app】

##### 样式(shared/style)
- 只对包含【.app.scss】的样式进行输出，并且会删除【.app】

##### 图片 (res/img/)
- 默认dev模式都不对图片进行压缩
- release模式下,当图片名包含【.large.】的时候，不进行压缩
