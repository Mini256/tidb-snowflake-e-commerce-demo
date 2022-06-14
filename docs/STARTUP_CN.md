# 启动 E-Commerce Demo

## 启动

可以打开项目地址，点击 [README.md](README.md) 上的 “Open on GitPod” 按钮，使用 GitPod 运行 Demo。GitPod 将会为你将 Demo 代码准备执行环境，使用在线编辑器打开，并且自动安装依赖，对前后端程序进行构建。

> 如果是在本地环境下启动 Demo，那么你的本地环境当中至少要包括以下软件：
>
> - JDK
> - Node.js
> - MySQL Client
> - SnowSQL Client

在程序运行之前，你在终端窗口中，根据提示填写必要的数据库连接信息：

<img width="1431" alt="image" src="https://user-images.githubusercontent.com/5086433/173553194-761fe9e9-af6e-46d6-9522-6925723a2066.png">

下面将会介绍如何创建 TiDB Cloud 和 Snowflake 账号。

## 创建 TiDB Cloud 集群

根据开发者指南创建你的 [TiDB Cloud](https://docs.pingcap.com/tidb/dev/dev-guide-build-cluster-in-cloud
) 集群。

![image](https://user-images.githubusercontent.com/5086433/173550432-c23855e3-5176-4672-9c01-27e11aa73c5d.png)

你可以通过点击 TiDB 集群状态页面上的的 “Connect” 按钮打开集群的连接信息提示框得到 TiDB 集群的连接信息。

例如：

```bash
mysql --connect-timeout 15 -u root -h tidb.8ea4f407.3a3ce0a0.ap-southeast-1.prod.aws.tidbcloud.com -P 4000 -p
```

- `TIDB_HOST`: tidb.8ea4f407.3a3ce0a0.ap-southeast-1.prod.aws.tidbcloud.com
- `TIDB_PORT`: 4000
- `TIDB_USERNAME`: root
- `TIDB_PASSWORD`: <创建 TiDB 集群时所填写的密码>

根据命令行窗口上的提示依次填写 TiDB 集群的连接信息。如果发现连接失败，请检查连接信息是否填写正确以及是否在 TiDB Cloud 的防火墙上允许当前终端连接到 TiDB Cloud。

## 注册 Snowflake 账号

1. 在注册页面填写登陆信息

1.1 填写邮箱以及个人信息；

<img width="492" alt="image" src="https://user-images.githubusercontent.com/5086433/173524767-3383bacf-7c6e-46cc-9959-660d35ff17d9.png">

1.2 选择 Snowflake 版本、云服务提供商以及一个可用区（可以优先选择里 GitPod 更近的节点）；

<img width="483" alt="image" src="https://user-images.githubusercontent.com/5086433/173525174-fc608d8d-290e-4cb1-a243-a6da06603980.png">

3. Snowflake 会想你发送一份激活邮件，点击激活链接进入到注册界面，可以在界面上数据该账号的管理员用户名和密码。

得到：

- `SNOWSQL_USERNAME`: 用户名
- `SNOWSQL_PASSWORD`: 用户密码
- `SNOWSQL_ROLE`: 用户角色，默认为 `ACCOUNTADMIN`

4. 账号注册完毕之后 Snowflake 会给你再次发送一封 Welcome 邮件，这里包含了 Snowflake 的连接地址。

<img width="653" alt="image" src="https://user-images.githubusercontent.com/5086433/173567557-7b96277c-fdf3-4ae8-bdb7-e89c2be1bd71.png">

得到：

- `SNOWSQL_HOST` : `GQ01328.ap-northeast-1.aws.snowflakecomputing.com`
- `SNOWSQL_ACCOUNT`：`GQ01328`

5. 进入到 Snowflake 后台管理界面；

<img width="1435" alt="image" src="https://user-images.githubusercontent.com/5086433/173538443-a4a4f5c5-3180-4b47-970f-3c57dffcea4f.png">

6. 点击侧边栏中的 “Admin” > “Partner Connect” 进入到 Snowflake 数据服务合作商的也表页面，找到数据集成服务商 ETLeap；

<img width="1426" alt="image" src="https://user-images.githubusercontent.com/5086433/173540263-70c34974-31f9-466c-bd4d-3c9845b1fc41.png">

7. 点击 “Connect” 按钮，ETLeap 将会为你自动创建关联的账号；

<img width="856" alt="image" src="https://user-images.githubusercontent.com/5086433/173540930-b355247d-edd0-49ff-810b-2275b34cfbed.png">

得到：

- `SNOWSQL_DATABASE`: ETLeap 会默认创建名为 `PC_ETLEAP_DB` 的数据库
- `SNOWSQL_WAREHOUSE`: PETLeap 会默认创建名为 `PC_ETLEAP_WH` 的数据仓库
- `SNOWSQL_SCHEMA`: ETLeap 会默认在数据库下创建名为 `PUBLIC` 的 SCHEMA

8. 点击 “Activate” 按钮进入到 ETLeap 的激活页面，填写账号密码，完成激活。

<img width="848" alt="image" src="https://user-images.githubusercontent.com/5086433/173541215-15b34852-2a48-446a-8054-c4078d8cadd2.png">

<img width="921" alt="image" src="https://user-images.githubusercontent.com/5086433/173542047-c0f7970e-462f-4115-8c4f-13d01cb719f7.png">

9. 根据提示将上述得到的 Snowflake 信息依次填入：

例如，上述步骤得到的信息如下：

```bash
SNOWSQL_HOST=GQ01328.ap-northeast-1.aws.snowflakecomputing.com
SNOWSQL_ACCOUNT=GQ01328
SNOWSQL_WAREHOUSE=PC_ETLEAP_WH
SNOWSQL_DATABASE=PC_ETLEAP_DB
SNOWSQL_SCHEMA=PUBLIC
SNOWSQL_USER=<管理员用户名>
SNOWSQL_ROLE=ACCOUNTADMIN
SNOWSQL_PWD=<管理员用户的密码>
```

依次填写到终端的提示输入中，完成 Snowflake 端的配置。

10. 填写完毕后，后端程序将被自动启动，导入数据的程序也会随着后端程序的启动而启动。

## 建立数据从 Snowflake 到 TiDB 的通道（Pipeline）

ETLeap 账号激活完成后，ETLeap 将会在 Snowflake 上自动创建名为 `PC_ETLEAP_DB` 的数据库，并配置好 Snowflake 的连接信息。

<img width="1213" alt="image" src="https://user-images.githubusercontent.com/5086433/173547399-541060c6-ca6b-431a-8cca-0fdc4996d303.png">

你可以根据视频指引，根据从 Snowflake 到 TiDB 的通道（Pipeline）

<video width="100%" height="100%" autoplay="" loop="" controls=""><source src="https://user-images.githubusercontent.com/55385323/172923035-6327f6ff-f141-4c48-ba87-56a1ddbce6d7.mp4" type="video/mp4"></video>