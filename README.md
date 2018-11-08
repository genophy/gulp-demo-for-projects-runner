# gulp-demo-for-project-runner

## 用法
### npm run
>project不设置时，默认为app

```bash
npm run generate:project -- --project=note  # 创建项目 # gulp gp --project=note
npm run generate:view -- --project=note --view=index # 创建视图页面 # gulp gv --project=note --view=index
```
```bash
npm run  build -- --project=<projectname> # 默认dev模式打包
npm run  watch -- --project=<projectname> # dev模式监听改变
npm run  serve -- --project=<projectname> # dev模式启动服务
npm run  zip -- --project=<projectname>    # 打包
npm run  deploy -- --project=<projectname> # dev发布

npm run  build:release -- --project=<projectname> # 默认release模式打包
npm run  watch:release -- --project=<projectname> # release模式监听改变
npm run  serve:release -- --project=<projectname> # release模式启动服务
npm run  zip:release -- --project=<projectname>    # 打包
npm run  deploy:release -- --project=<projectname> # release发布

```

### 创建项目和视图页面: generate project and view
>project不设置时，默认为app
```bash
gulp generate:project --project=note  # 创建项目 # gulp gp --project=note
gulp generate:view --project=note --view=index # 创建视图页面 # gulp gv --project=note --view=index
```
>运行 bin/generate.sh 也可


```bash
gulp build --project=<projectname> # 默认dev模式打包
gulp watch --project=<projectname> # dev模式监听改变
gulp serve --project=<projectname> # dev模式启动服务
gulp zip --project=<projectname>    # 打包
gulp deploy --project=<projectname> # dev发布

gulp build:release --project=<projectname> # 默认release模式打包
gulp watch:release --project=<projectname> # release模式监听改变
gulp serve:release --project=<projectname> # release模式启动服务
gulp zip:release --project=<projectname>    # 打包
gulp deploy:release --project=<projectname> # release发布

```

### 命令行运行

```bash
bin/ios_run.sh      # (ios)
bin/linux_run.sh    # (linux)
bin/win_run.bat     # (windows)
```

## 代码注意
##### 页面视图(view/xxx/xxx)
- 只对包含【.app.】的文件进行处理，并且会删除【.app】

##### 样式(shared/style)
- 只对包含【.app.scss】的样式进行输出，并且会删除【.app】

##### 图片 (res/img/) 默认不进行压缩
