FROM gitpod/workspace-java-17

# Insatll MySQL Client
RUN sudo apt install mysql-client -y

# Install Node.js
RUN curl -s https://deb.nodesource.com/setup_16.x | sudo bash
RUN sudo apt install nodejs -y
RUN sudo npm install -g npm

# Insatll SnowSQL
RUN curl -O https://sfc-repo.snowflakecomputing.com/snowsql/bootstrap/1.2/linux_x86_64/snowsql-1.2.21-linux_x86_64.bash
RUN SNOWSQL_DEST=~/bin SNOWSQL_LOGIN_SHELL=~/.profile bash snowsql-1.2.21-linux_x86_64.bash
RUN sudo cp ~/bin/snowsql /usr/bin/snowsql
