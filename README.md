# gulp-demo-for-project-runner
gulp练习，用于项目运行
>最原始的纯js项目发布方式。依赖jquery，拥有运行，zip打包等功能

# 用法
## 创建项目和视图页面: create project and view
```bash
gulp create:init --project=m_note  # 创建项目
gulp create:view --project=m_note --name=index # 创建视图页面

```

## 开发模式: for dev:
```bash
os-shell/dev_run.bat # (windows)
os-shell/dev_run.sh  # (linux)
os-shell/dev_run_ios.sh # (mac)
```

## 发布模式: for release( the compress dev):
```bash
os-shell/release_run.bat # (windows)
os-shell/release_run.sh  # (linux)
os-shell/release_run_ios.sh # (mac)
```

## 打包zip
```bash
gulp zip --project=note
gulp zip:release --project=note
```

