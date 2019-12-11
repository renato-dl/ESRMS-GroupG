FROM mariadb:latest

ENV MYSQL_ROOT_PASSWORD dbpass  
ENV MYSQL_DATABASE ESRMS

ADD init.sql /docker-entrypoint-initdb.d

CMD ["--character-set-server=utf8mb4", "--collation-server=utf8mb4_general_ci"]