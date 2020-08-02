-- First create user and password
CREATE USER mule_wtf_user SUPERUSER;
ALTER USER mule_wtf_user WITH PASSWORD 'mule_wtf_pass';

-- Now create database
CREATE DATABASE "mule_wtf_re" WITH OWNER mule_wtf_user;
GRANT ALL PRIVILEGES ON DATABASE "mule_wtf_re" TO mule_wtf_user;
