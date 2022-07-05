# ETL data from TiDB to Snowflake by ETLeap

In this guide, we will describe how to use ETLeap to synchronize orders data and items data from the TiDB database to Snowflake step by step.

1. Activate ETLeap Account
   
    ETLeap is Snowflake's official partner data integration service provider and can be found on the "Admin > Partner Connect" page.

    <img width="1519" alt="ETLeap in Snowflake partner connect" src="https://user-images.githubusercontent.com/5086433/177075372-c460d28d-379c-4f4d-8bb7-fe705d86d225.png">

    When you first time click the "Connect" button, ETLeap will create a new account automatically.

    <img width="1000" alt="ETLeap in Snowflake partner connect" src="https://user-images.githubusercontent.com/5086433/173540930-b355247d-edd0-49ff-810b-2275b34cfbed.png">

    Click the "Activate" button and go to the ETLeap set up page to active new account.

    <img width="1000" alt="ETLeap in Snowflake partner connect" src="https://user-images.githubusercontent.com/5086433/173541215-15b34852-2a48-446a-8054-c4078d8cadd2.png">

    <img width="802" alt="image" src="https://user-images.githubusercontent.com/5086433/177128923-b6560943-4f62-40f8-8223-f17ac1eb10fd.png">

2. Set up the destination data source

    ETLeap will automatically create a target data source for Snowflake after successful activation, which is associated with the `PC_ETLEAP_DB` database and `PC_ETLEAP_USER` user by default.

    <img width="1153" alt="image" src="https://user-images.githubusercontent.com/5086433/177245029-92f1d26e-8b5e-4803-9951-89171f0e82ea.png">

    If the database you need to sync to is not the default database `PC_ETLEAP_DB`, please go to the **Connections** page, find the Snowflake connection and click the **EDIT** button to change the configuration.

    <img width="1154" alt="image" src="https://user-images.githubusercontent.com/5086433/177245460-c8345513-9a3d-41ee-ad89-dba5dc7aeb22.png">

    For example, suppose we want to synchronize data to the `ECOMMERCE` database, the `PUBLIC` schema and the `COMPUTE_WH` virtual data warehouse.

    We can execute the following SQL on Snowflake to grant users with the `PC_ETLEAP_ROLE` role access to this database.

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE "ECOMMERCE" TO ROLE PC_ETLEAP_ROLE;
    USE ECOMMERCE;
    GRANT ALL PRIVILEGES ON SCHEMA "PUBLIC" TO ROLE PC_ETLEAP_ROLE;
    GRANT ALL PRIVILEGES ON WAREHOUSE COMPUTE_WH TO ROLE PC_ETLEAP_ROLE;
    ```

    <img width="1238" alt="image" src="https://user-images.githubusercontent.com/5086433/177258830-abf495d7-2c36-4335-b469-3204cdec6947.png">

    <img width="1235" alt="image" src="https://user-images.githubusercontent.com/5086433/177259629-a9c07085-4715-4cbb-945a-85793134d88d.png">

    After this, we can set this database and schema to the Snowflake data source configuration in ETLeap. Click "Validate and Save Changes" button to verify the connection.

    <img width="648" alt="image" src="https://user-images.githubusercontent.com/5086433/177246990-53deaad8-e76f-4c5a-8fe2-ba98a8d33036.png">


3. Create source data source

    3.1 Select MySQL as connector

    Since TiDB is compatible with the MySQL protocol, we can use the MySQL connector to connect it.

    <img width="1294" alt="image" src="https://user-images.githubusercontent.com/5086433/177104261-2ff4ca7f-a82f-4a62-8925-7e7e16f5d9ea.png">

    3.2 Select the connection method

    In this demo, we can select the `DIRECT` connection mode and add the IP address of the ETLeap server as the trusted IP address of TiDB Cloud.

    <img width="746" alt="image" src="https://user-images.githubusercontent.com/5086433/177135191-01d999c3-40a4-4b4a-9035-716189fd23cb.png">

    <img width="1313" alt="image" src="https://user-images.githubusercontent.com/5086433/177240458-c1133912-ed6d-4195-8b38-f064721662bd.png">

    For convenience, we can also add `0.0.0.0/0` as a trusted IP address to allow access to all IPs. (**Only for test**)

    3.3 Config connection information

   - Input the TiDB host and port
   - Cancel the "Validate SSL Certificate" checkbox

    <img width="634" alt="image" src="https://user-images.githubusercontent.com/5086433/177241029-d88a2f89-2480-44f5-b4a0-373b0bc9ffad.png">

    3.4 Select the database name

    <img width="631" alt="image" src="https://user-images.githubusercontent.com/5086433/177243696-3666d4b8-cc92-439a-8b98-57734cdeba0a.png">

    3.5 Additional properties

    > Do not select the "Enable Change Data Capture (CDC)" option, because TiDB does not use the MySQL binlogs format.

    <img width="649" alt="image" src="https://user-images.githubusercontent.com/5086433/177244068-09398579-9e98-4495-90ac-dc545e0ad6f8.png">

4. Create Pipeline

    4.1 Select the database tables that need to be synchronized

    Here we need to select the `orders` and `items` database tables to sync to Snowflake.

    <img width="843" alt="image" src="https://user-images.githubusercontent.com/5086433/177244613-d505ac04-b8f7-4f4f-a764-87a53c5a05f1.png">

    4.2 Select which schema you need to sync your data to on Snowflake.

    <img width="1246" alt="image" src="https://user-images.githubusercontent.com/5086433/177260995-5c91978d-7cec-41d3-ae79-654803e674ef.png">

    4.3 Click the **EDIT SETTING** button to go to the advanced settings page.

    <img width="1234" alt="image" src="https://user-images.githubusercontent.com/5086433/177261092-55622961-d215-4f35-afa9-0dda1d54ee18.png">

    4.4 Setting Primary Key and Update timestamp 
    
    You can set the **Primary key** and **Update timestamp** for each table here. ETLeap will use the **Primary key** as a unique identifier for the data rows to determine whether to append or update when loading a piece of data. It also determines whether a row should be updated based on whether the **Update timestamp** has changed.

    <img width="1227" alt="image" src="https://user-images.githubusercontent.com/5086433/177261503-975b1525-b0bb-4779-9e36-692752e91442.png">

    4.5 We can set the `create_time` column to [**Clustering Keys**](https://docs.snowflake.com/en/user-guide/tables-clustering-keys.html).

    <img width="1229" alt="image" src="https://user-images.githubusercontent.com/5086433/177261699-4ed88c6a-c76b-4a2c-9dce-e3e5420a4a4f.png">

    4.6 **START ETL'ING**

    <img width="1230" alt="image" src="https://user-images.githubusercontent.com/5086433/177261883-6ceec980-844a-4b23-be2f-c467295023c0.png">

5. Just waiting for ETleap to finish its work

    After the pipeline is created, we can go back to the Dashboard page to observe the progress of the pipeline execution.

    <img width="1493" alt="image" src="https://user-images.githubusercontent.com/5086433/177262417-dcec3405-1985-4460-b455-8fc05b47a6a8.png">

    ETLeap synchronizes data from TiDB to Snowflake in batches, following steps of extraction, transformation, and loading.

    <img width="1504" alt="image" src="https://user-images.githubusercontent.com/5086433/177262601-fb6d03ae-8ad7-4fe7-a6bb-215b78f4802a.png">

    In addition to full sync, we can also set how often pipeline performs incremental syncs on the **SCHEDULES** page.

    <img width="1488" alt="image" src="https://user-images.githubusercontent.com/5086433/177264221-1af3e611-16e3-4511-be2c-4f128781efe0.png">

6. Verify synchronization results

    Back in our Snowflake dashboard, we can see the data table information on the **Data** page and confirm that the data has been synchronized by looking at the number of rows of data in the **Data Preview**.

