# DT
Welcome to my Digital Twin Tool that I created using Node.JS and OPC-UA. With the help of this tool, one can create his/her own digital twin of a system without writing a single line of code.
I have provided a tutorial video in the tool itself which you can access and see how to use the tool.

# Setup
Let's go through how you will use the tool. I recommend cloning the repository files or you can also download the .zip folder as per your liking.
1) If you don't have a code editor installed I recommend installing VSCode.
2) Also make sure to download Node.JS if your system doesn't has it installed, after downloading make sure to add its path in the Environment Variables. (you can type "node -v" to check if you installed it correctly)
3) After installing Node.JS, open the project folder in the code editor and open a new terminal.
4) We need to install a few libraries before running any code, just follow the steps in the same order by typing the folloing commands one after the other.
5) ```npm init```
6) ```npm i express```
7) ```npm i hbs```
8) ```npm i mysql2```
9) ```npm i socket.io```
10) ```npm i node-opcua```
11) ```npm i fs```

# Database configuration
Now all we need to do is install MySQL Workbench and create a new Schema and create some tables which are used in the project.
You can follow this tutorial to install MySQL correctly - https://youtu.be/GwHpIl0vqY4
After setting up your MySQL, remember to change the name of schema and password in the database/connection.js to avoid any error

To create the tables just copy the following queries from here and execute them in you MySQL Workbench-

1) ```CREATE TABLE login(
id int AUTO_INCREMENT PRIMARY KEY,
nam varchar(255),
pass varchar(255),
tim varchar(255)
); ```

2) ```CREATE TABLE machines(
mname varchar(255) NOT NULL
); ```

3) ```CREATE TABLE finalreport(
id int AUTO_INCREMENT PRIMARY KEY,
starttime varchar(255),
endtime varchar(255),
cycletime float,
time_stamp varchar(255),
downtime int,
number_of_jobs int,
good_jobs int,
bad_jobs int
); ```

# Conclusion
After setting up all your tables, you are set to use the tool just use the command "node src/app" in the terminal to run the application.
In your browser type "localhost:3000" to start the app.

Note - It may not run the first time due to the size of the application, it may give a database connection timeout error. Just run the application again and it should work.

Please watch the tutorial video before using the application to get a better idea of the project.

