# gulp-demo-for-project-runner
>gulp练习，用于项目运行
- gulp@4.0.0
- js项目发布方式，支持es6+。
- 默认采用scss样式。
- 拥有dev开发运行,release发布运行能力
- 支持zip打包功能

## 用法
### 创建项目和视图页面: create project and view
```bash
gulp create:init --project=m_note  # 创建项目
gulp create:view --project=m_note --name=index # 创建视图页面

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
os-shell/dev_run.bat # (windows)
os-shell/dev_run.sh  # (linux)
os-shell/dev_run_ios.sh # (mac)
```

### 命令行运行:发布模式: for release( the compress dev which also for prod)

```bash
os-shell/release_run.bat # (windows)
os-shell/release_run.sh  # (linux)
os-shell/release_run_ios.sh # (mac)
```

### 打包zip
```bash
gulp zip --project=note
gulp zip:release --project=note
```

