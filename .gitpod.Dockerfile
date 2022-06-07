FROM gitpod/workspace-full

RUN sudo apt install mysql-client -y

RUN curl -o https://sfc-repo.snowflakecomputing.com/snowsql/bootstrap/1.2/linux_x86_64/snowsql-1.2.21-linux_x86_64.bash
RUN bash snowsql-1.2.21-linux_x86_64.bash

RUN curl --proto '=https' --tlsv1.2 -sSf https://tiup-mirrors.pingcap.com/install.sh | sh
