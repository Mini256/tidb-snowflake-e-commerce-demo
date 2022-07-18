# TiDB Cloud + Snowflake Demo Step By Step Guidance

You can find the code here: https://github.com/Mini256/tidb-snowflake-e-commerce-demo

And visit our live demo here: https://tidb-snowflake-e-commerce-demo.vercel.app

## Demo Proposal

In this demo, we use TiDB Cloud and Snowflake to build an online e-commerce system, which uses TiDB's powerful realtime HTAP capability and Snowflake's offline analysis capability for a large amount of data in the system.

In the traditional e-commerce scenario, especially data reporting or real-time monitoring. There was a third party data warehouse used to do pre-aggregation of data and then put it into MySQL to do queries. As the business grows and the report forms become more diversified, the scalability of MySQL becomes a bottleneck. Besides, multi-node MySQL's library and table splitting scheme are complexed, and the operation and maintenance are very difficult.

> Compared to MySQL, TiDB has lower latency and better scalability in TP under many scenarios, especially served as the underlying storage for e-commerce big sales promotion.
>
> 1. TiDB supports high-speed access and provides good batch query capability.
> 2. Row-based storage with index precise positioning providing millisecond response, and HTAP architecture can support future business development.
> 3. TiDB support real-time analysis (such as the day of the data that can not be timely ETLing, like orders and expresses).

This guide is more oriented towards telling you how to configure and use, rather than how to develop. But you can still find our backend code under [here](https://github.com/Mini256/tidb-snowflake-e-commerce-demo/tree/main/backend) and learn how we implement this demo. We still introduce some details on the demo page, such as table structures, the SQL we execute.

## Demo Structure

![image](https://user-images.githubusercontent.com/5086433/172916424-736fdf79-34b7-4c09-a580-093b71b94144.png)

We divide the demo into three layers: Business layer, Data center layer(TiDB Cloud) and Data warehouse layer(Snowflake).

This demo uses TiDB to store business data such as orders, expresses, user data, etc. Use Snowflake as data warehouse to archive cold data and data warehouse modeling. This demo builds a simple real-time dashboard to monitor today's product sales situation, as well as analyzes users' consumption ability and calculate users' labels according to users' purchasing behavior. Besides, it calculates popular items at different grade prices according to item sales, so as to build a simple item recommendation function.

### 1. Business layer

Generate business data.

1. Order business: Generate orders table data.
2. Express business: Generate express table data. The express table and the orders table are stored in different TiDB databases separately. These two tables can be related by order_id.
3. Other businesses(**Ignore at Demo stage**): Use databases (such as MySQL or Oracle), and synchronize data to a unified TiDB cluster in real time through synchronization tools.

### 2. Data center layer

Collect business data and provide data services.

1. Collect business data through data integration tools such as DM and Flink CDC and write to the unified TiDB cluster.
2. Data service: Query user tags and recommend hot-selling products to users.
   1. Generate user tags based on user purchase behavior: whether high-net-worth customers or not.
   2. Generate two batches of weekly hot-selling products according to the sales data: hot-selling products with high unit price and hot-selling products with low unit price.
   3. Recommend high-net-worth hot-selling products to high-net-worth users, and low-unit-price hot-selling products to low-net-worth users.
3. Unified view: Users can query their own orders and the express information associated with the orders in real time.
4. Real-time analysis: Data analysts analyze the real-time transaction data of the day.
   1. The total amount, and number of transactions on the day.
   2. Group by commodity type to display the total amount, and number of transactions.

### 3. Data warehouse layer

Use Snowflake to complete data warehouse modeling and cold data archiving.

1. Cold data archiving: Store TiDB orders and express yesterday's data in Snowflake.
2. Data warehouse modeling: Calculate the monthly bill data of each user, and get the monthly summary expenditure data.
3. Machine Learning (**Ignore at Demo stage**): Mining transaction data through machine learning.

## Before we start

This is the first page of live demo:

![image](https://user-images.githubusercontent.com/56986964/176667665-13bf34e0-3423-4872-8f97-2d29881bcfdf.png)

As you can see, we need a custom backend endpoint to support this demo.

We recommend user create a gitpod workspace as the backend, by clicking the link in helper text on the first page.

The backend need TiDB and Snowflake connection, you can use your existing instance to try this demo.

If you have no TiDB or Snowflake instances, don't worry.

In this scenario, user could create a trial account of TiDB Cloud, Snowflake and ETLeap(for data pipeline from TiDB to Snowflake).

## Run demo backend

You can click the `Gitpod` button on [Github repo](https://github.com/Mini256/tidb-snowflake-e-commerce-demo), or click the URL in live demo page.

Then authorize the `Gitpod`, a new workspace will run automatically.

We define scripts in `gitpod.yml` so that all works will automatically run.

The backend server will serve port `8080` if run successfully. But in Gitpod workspace, the port need to be forwarded. You can get the public `8080` port URL like the picture below.

![image](https://user-images.githubusercontent.com/56986964/176807817-024409f2-bc63-41e8-98ed-24c9416d9f00.png)

Gitpod workspace will open a preview tab of live demo after port `8080` is ready. We recommend here to copy the URL or Endpoint, paste on our live demo website using your own browser.

> Gitpod Preview browser tab has many limitations, so that we recommend using your own browser tab intstead of Gitpod Preview tab.

## Visit and config live demo

### 1. Visit home page and configure

Visit our live demo here: https://tidb-snowflake-e-commerce-demo.vercel.app

Paste and check the endpoint URL you get from previous step.

You will see the Config Stepper if the backend is not fully ready.

![image](https://user-images.githubusercontent.com/56986964/176808844-39d0d1b6-3527-4cd2-bd0b-7952bdad9266.png)

Click the `Walkthrough` button and you will get a guidance for creating TiDB Cloud.

### 2. Configure TiDB Connection

#### 2.1 Register TiDB Cloud

We recommend [TiDB Cloud](https://tidbcloud.com) here instead of a self-host TiDB instance.

1. If you do not have a TiDB Cloud account, click [TiDB Cloud](https://tidbcloud.com/free-trial) to sign up for an account.
2. [Sign in](https://tidbcloud.com/) with your TiDB Cloud account.
3. To create a Developer Tier cluster for one year free, you can either select the **Developer Tier** plan on the [plan page](https://tidbcloud.com/console/plans) or click [Create a Cluster (Dev Tier)](https://tidbcloud.com/console/create-cluster?tier=dev).
4. On the **Create a Cluster (Dev Tier)** page, set up your cluster name, password, cloud provider (for now, only AWS is available for Developer Tier), and region (a nearby region is recommended). Then click **Create** to create your cluster.
5. Your TiDB Cloud cluster will be created in approximately 5 to 15 minutes. You can check the creation progress at [Active Clusters](https://tidbcloud.com/console/clusters).
6. After creating a cluster, on the **Active Clusters** page, click the name of your newly created cluster to navigate to the cluster control panel.

   ![active clusters](https://download.pingcap.com/images/docs/develop/IMG_20220331-232643794.png)

7. Click **Connect** to create a traffic filter (a list of client IPs allowed for TiDB connection).

   ![connect](https://download.pingcap.com/images/docs/develop/IMG_20220331-232726165.png)

8. In the popup window, click **Add Your Current IP Address** to fill in your current IP address, and then click **Create Filter** to create a traffic filter.
9. Copy the string to connect with a SQL client for later use.

   ![SQL string](https://download.pingcap.com/images/docs/develop/IMG_20220331-232800929.png)

> Tip:
> For Gitpod Workspace usage, we can set an Allow All traffic filter here by setting an IP address `0.0.0.0/0`.
> ![image](https://user-images.githubusercontent.com/56986964/176811095-f6c499d5-11ed-41e0-ba54-70ffd8ca6b89.png)

#### 2.2 Configure TiDB Connection

Configure the TiDB Cloud Host Address and password.

In this demo we will create a database `ECOMMERCE`.

![image](https://user-images.githubusercontent.com/56986964/176811398-21aeb283-4f28-44b6-b91b-5d2c83339c29.png)

Click `Continue` after all settled.

You will see the next stepper if the backend successfully connect to TiDB instance. If you see error message, don't worry. Check your input, make sure each input fields are correct. Do remember set a `Allow All` traffic filter if you use TiDB Cloud.

### 3. Create Schema on TiDB

Click the `Create` button and the schema will be created.

![image](https://user-images.githubusercontent.com/56986964/176812098-a10ad959-598c-4d37-8a99-83fe42de5d63.png)

### 4. Import initial data

Click the `Import` button and the initial data will be imported.

![image](https://user-images.githubusercontent.com/56986964/176813193-cd3fe23f-ef05-4a3c-a7fd-16b2e4e65d55.png)

You can check the status anytime.

![image](https://user-images.githubusercontent.com/56986964/176813320-b07baf08-bb0e-428c-94e3-4f7aa66bbeef.png)

### 5. Configure Snowflake Connection

Click the `Walkthrough` button and you will get a guidance for creating Snowflake cluster.

![image](https://user-images.githubusercontent.com/56986964/176813458-a3b2224e-fc0e-4060-ad4e-7f6b50076be0.png)

#### 5.1 Create Snowflake Cluster

1. Create Snowflake account([snowflake.com](https://signup.snowflake.com/)): ![image](https://user-images.githubusercontent.com/5086433/173524767-3383bacf-7c6e-46cc-9959-660d35ff17d9.png)

2. Config version, cloud provider and region: ![image](https://user-images.githubusercontent.com/5086433/173525174-fc608d8d-290e-4cb1-a243-a6da06603980.png)

3. Get details from link in email which will automatically be sent to you after submitting:

   Then we can get(for example):

   - `SNOWSQL_USERNAME`
   - `SNOWSQL_PASSWORD`
   - `SNOWSQL_ROLE`: `ACCOUNTADMIN`

4. Get Snowflake URL from link in email which will automatically be sent to you after activating account: ![image](https://user-images.githubusercontent.com/5086433/173567557-7b96277c-fdf3-4ae8-bdb7-e89c2be1bd71.png)

   Then we can get(for example):

   - `SNOWSQL_HOST`: `GQ01328.ap-northeast-1.aws.snowflakecomputing.com`
   - `SNOWSQL_ACCOUNT`: `GQ01328`

5. Visit snowflake manage page, then choose `Admin` > `Partner Connect` on left navigation, then choose `ETLeap`:

   > This step is for further data pipeline from TiDB to Snowflake.
   >
   > **Note**: A Snowflake trial account will **expire** after 30 days and ETLeap will expire after 15 days.

   ![image](https://user-images.githubusercontent.com/5086433/173540263-70c34974-31f9-466c-bd4d-3c9845b1fc41.png)

6. Click `Connect`:

   ![image](https://user-images.githubusercontent.com/5086433/173540930-b355247d-edd0-49ff-810b-2275b34cfbed.png)

   Then we can get(for example):

   - `SNOWSQL_DATABASE`: `PC_ETLEAP_DB`
   - `SNOWSQL_WAREHOUSE`: `PC_ETLEAP_WH`
   - `SNOWSQL_SCHEMA`: `PUBLIC`

7. Active `ETLeap`: ![image](https://user-images.githubusercontent.com/5086433/173541215-15b34852-2a48-446a-8054-c4078d8cadd2.png) ![image](https://user-images.githubusercontent.com/5086433/173542047-c0f7970e-462f-4115-8c4f-13d01cb719f7.png)

8. After all settled, we can get all these data:

   ```
   SNOWSQL_HOST=GQ01328.ap-northeast-1.aws.snowflakecomputing.com
   SNOWSQL_ACCOUNT=GQ01328
   SNOWSQL_WAREHOUSE=PC_ETLEAP_WH
   SNOWSQL_DATABASE=PC_ETLEAP_DB
   SNOWSQL_SCHEMA=PUBLIC
   SNOWSQL_USER=<admin username>
   SNOWSQL_ROLE=ACCOUNTADMIN
   SNOWSQL_PWD=<admin password>
   ```

#### 5.2 Input Snowflake Info

Click `Continue` and backend will check the connection.

![image](https://user-images.githubusercontent.com/56986964/176814605-8aa32be0-e01b-4fff-9d03-a792f497214e.png)

### 6. Create Snowflake Schema

![image](https://user-images.githubusercontent.com/56986964/176831457-c3e37f6c-f2e5-45db-a982-d59e78fcf17c.png)

### 7. Finish configuration

After all settled, you can click `Continue` button.

You'll be directed to demo console page.

![image](https://user-images.githubusercontent.com/56986964/176831640-7ff917ed-176d-40b8-b5de-3e0313309e62.png)

### 8. Create Pipeline between TiDB and Snowflake

After initial configuration, you will be directed to `Console` - `Pipeline` page.

In this page, we will perform offiline analysis on Snowflake, and create a pipeline between TiDB and Snowflake. So that Snowflake analysis data will be written back to TiDB.

You can edit your endpoint at any time by click the edit icon on header.

And switch to other pages by click left navigation.

![image](https://user-images.githubusercontent.com/56986964/176831838-88160867-c9d6-41de-b946-77a9a457c3f2.png)

#### 8.1 ETL data from TiDB to Snowflake

🚀 You can easily synchronize data from TiDB to Snowflake using the following proven ETL tools: (Click the link to check out the step-by-step guide)

- [ETLeap](PIPLINE_ETLEAP.md)
- AirByte (Coming soon!)

#### 8.2 Perform offline analysis on Snowflake

You can see three tabs, each tab perform different calculate job.

You can easily run the calculation by clicking the button below.

After calculation, item label and user label will display correctly in `Items` page and `Recommended Items` page.

![image](https://user-images.githubusercontent.com/56986964/176833871-949364ce-055f-4809-ba94-6bf67baf991c.png)

#### 8.3 Write back data to TiDB

You can easily wirte back analysis data from Snowflake to TiDB by clicking the button.

![image](https://user-images.githubusercontent.com/56986964/176835352-d9810340-0c2f-490c-9e20-030f83550e06.png)

#### 8.4 Next step

After writting data back to TiDB, you have finished all initial steps of this demo.

Then you can visit `Recommend Items` page to take a view of labeled items. Or you can visit any other page you like.
