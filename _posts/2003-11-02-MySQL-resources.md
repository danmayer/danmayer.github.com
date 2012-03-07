---
layout: post
title: "MySQL resources"
category:
tags: []
---
{% include JB/setup %}
This is a collection of various tips and things I use in MySQL. This is actually up on the web more as a reference to myself than anything else. I keep learning this stuff, but since I don't use it all that frequently I tend to forget how to do something exactly the next time i need to. So here are little commands I use and some tiny descriptions. If you have some tips tricks or think i am doing something the hard way please feel free to comment and share. If you have any MySQL questions please feel free to post them if you think it is something I might be able to help you with. That said here is mysql information...

<B>MySQL Commands:</B>
//to start mysql on the command line
Mysql �u root �p   (It will then ask for your password)

//To start mysql server
Sudo bash
�bin/safe-mysqld� from the mysql root directory

//How to select data using rules involving more than one table from MYSQL:
Select * from user leftjoin link on user.id = from Left join msg on to=msg.id where user.name = �john�;

Database:mysql -u root �p *** //snowmass

//to create a text dump of a database
mysqldump �-user [user name] �-password=[password] [database name] > [dump file]

//to create a new database
mysql> create database somedb;

//granting privileges to a user
grant all privileges on *.* to NewsShaker@�localhost" > identified by 'passwrd';

//shows all the tables of a database
show tables;

//creates a new table in the database your currently using
create table "tablename" ("column1" "data type", "column2" "data type", "column3" "data type");

//creates a link table (which is really the same as other tables but just
//a way to associate data between tables
create table link (catID bigint, pageID bigint);

//deletes an entire table
drop table Pages;

//deletes an entry from table idgen where the item has a uid of 12
delete from idgen where uid=12;

//show only the colums of a table not the data
show columns from tablename;

//To change the data of an already existing entry
update tablename set columname = "whatever" where columnname = "something";

//to alter a table if you need to add a new field
alter table tablename add column_name column_type after column_name2;

//creates a dump of database called newsshaker
./mysqldump �u root �p newsshaker > ../../../ddmayer/newsshakerdb.txt
//at command line in the mysql/bin directory 

//to recreate the database from the dump file
./mysql -u root -pPASSWORD newsshaker < ./newsshakerdb.txt
//at the command line in the mysql/bin directory

//to get the count in a category since a date: 
select count(*) as co from Pages as p left join link as l on p.UID = l.PageID left join categories as c on c.UID = l.CatID where c.name like 'autism' and p.date > 20031201000000 group by c.UID; 

//to get only 5 in order as the very newest: 
select p.UID,p.date,c.UID from Pages as p left join link as l on p.UID = l.PageID left join categories as c on c.UID = l.CatID where c.name like 'autism' and p.date > 20031201000000 order by p.date DESC limit 5; 

//to get a whole category: 
select p.UID,p.date,c.UID from Pages as p left join link as l on p.UID = l.PageID left join categories as c on c.UID = l.CatID where c.name like 'autism';

//add a new user to your mysql system
mysql> GRANT ALL PRIVILEGES ON *.* TO 'monty'@'localhost'
    ->     IDENTIFIED BY 'some_pass' WITH GRANT OPTION;

//getting random results from a mysql query or mysql table
mysql_query("SELECT * FROM table ORDER BY RAND() LIMIT 1")

//renaming multiple tables at the same time.
RENAME TABLE old_table    TO backup_table,
             new_table    TO old_table,
             backup_table TO new_table;


<B>Links:</B><BR>
<a href="http://www.mysql.org"> MySQL home </a><BR>
<a href="http://sqlcourse.com/insert.html">My SQL commands tutorial</a><BR>
<a href="http://www.javacoding.net/articles/technical/java-mysql.html"> Java MySQL tutorial</a><BR>
<a href="http://www.developer.com/java/data/article.php/3417381">Great java Mysql developer tutorial</a>