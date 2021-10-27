# Drop the database
DROP DATABASE IF EXISTS drivethru;

# Create the database for the tables.
CREATE DATABASE drivethru;

# Create the Option table
CREATE TABLE drivethru.option(
OPTION_ID SMALLINT NOT NULL,
OPTION_NAME TINYTEXT NOT NULL,
PRIMARY KEY (OPTION_ID)
);

#Create the Chain Table
CREATE TABLE drivethru.chain(
CHAIN_ID SMALLINT NOT NULL,
CHAIN_NAME TINYTEXT NOT NULL,
CHAIN_PHONE TINYTEXT NULL,
PRIMARY KEY (CHAIN_ID)
);

#Create the Restaurant Table
CREATE TABLE drivethru.restaurant(
REST_ID SMALLINT NOT NULL,
REST_LOCATION CHAR(8) NOT NULL,
CHAIN_ID SMALLINT NOT NULL,
PRIMARY KEY (REST_ID),
FOREIGN KEY (CHAIN_ID) REFERENCES drivethru.chain(CHAIN_ID)
);

#Create the Measurement table.
CREATE TABLE drivethru.measurement(
	MEAS_ID BIGINT NOT NULL,
    REST_ID SMALLINT NOT NULL,
    MEAS_TIME_IN DATETIME NOT NULL,
    MEAS_TIME_OUT DATETIME NOT NULL,
    MEAS_DRIVETHROUGH BOOLEAN NOT NULL,
    PRIMARY KEY (MEAS_ID),
    FOREIGN KEY (REST_ID) REFERENCES drivethru.restaurant(REST_ID)
);

#Create the Accessibility table.
CREATE TABLE drivethru.accessibility(
OPTION_ID SMALLINT NOT NULL,
REST_ID SMALLINT NOT NULL,
PRIMARY KEY (OPTION_ID, REST_ID),
FOREIGN KEY (OPTION_ID) REFERENCES drivethru.option(OPTION_ID),
FOREIGN KEY (REST_ID) REFERENCES drivethru.restaurant(REST_ID)
);

#Load data into the Option table (All options are real offerings)
INSERT INTO drivethru.option (OPTION_ID, OPTION_NAME)
VALUES(0, "Gluten Free");
INSERT INTO drivethru.option (OPTION_ID, OPTION_NAME)
VALUES(1, "Kosher");
INSERT INTO drivethru.option (OPTION_ID, OPTION_NAME)
VALUES(2, "Vegan");
INSERT INTO drivethru.option (OPTION_ID, OPTION_NAME)
VALUES(3, "Vegetarian");
INSERT INTO drivethru.option (OPTION_ID, OPTION_NAME)
VALUES(4, "Paleo");
INSERT INTO drivethru.option (OPTION_ID, OPTION_NAME)
VALUES(5, "Pescatarian");
INSERT INTO drivethru.option (OPTION_ID, OPTION_NAME)
VALUES(6, "Keto");

#Load data into the Chain table (All chains are present at JMU)
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(0, "MCDonalds", "1 (800) 244-6227");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(1, "Burger King", "1 (866) 394-2493");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(2, "Taco Bell", "1 (800) 822-6235");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(3, "Urgies Cheesesteak", "540-615-5455");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(4, "Magnolias", "(540) 217-5816");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(5, "Hokkaido", "(540) 432-2388");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(6, "Bella Luna", "(540) 433-1366");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(7, "Benny's", "(540) 432-6400");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(8, "Chik-fil-A", "1 (866) 232-2040");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(9, "Hardee's", "1 (877) 799-7827");
INSERT INTO drivethru.chain (CHAIN_ID, CHAIN_NAME, CHAIN_PHONE)
VALUES(10, "Wendy's", "1 (888) 624-8140");

#Load data into the Restaurant table (All locational data is accurate)
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (0, "dnzftw3e", 0);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (1, "dnzftgwn", 0);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (2, "dnzft3bz", 0);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (3, "dnzfsdpp", 0);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (4, "dnzftrkj", 1);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (5, "dnzftfyu", 1);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (6, "dnzfsdrs", 1);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (7, "dnzftudx", 2);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (8, "dnzfsdr3", 2);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (9, "dnzftr5w", 3);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (10, "dnzftr3d", 4);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (11, "dnzfs825", 5);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (12, "dnzftr27", 6);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (13, "dnzftr70", 7);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (14, "dnzftud1", 8);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (15, "dnzftjr1", 8);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (16, "dnzfttcg", 9);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (17, "dnzfsun9", 10);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (18, "dnzftue7", 10);
INSERT INTO drivethru.restaurant (REST_ID, REST_LOCATION, CHAIN_ID)
VALUES (19, "dnzfmrsr", 10);

#Load data into the accessibility table
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (0, 0);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (2, 0);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (3, 0);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (4, 0);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (5, 0);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (6, 0);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (0, 1);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (2, 1);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (3, 1);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (4, 1);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (5, 1);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (6, 1);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (0, 2);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (2, 2);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (3, 2);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (4, 2);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (5, 2);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (6, 2);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (2, 3);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (3, 3);
INSERT INTO drivethru.accessibility (OPTION_ID, REST_ID)
VALUES (4, 3);

#Load data into the measurements table
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (1, 1, "2000-01-01T01:10:10", "2000-01-01T02:10:10", 60); 
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (2, 2, "2000-01-01T01:10:10", "2000-01-01T01:15:10", 5); 
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (3, 3, "2000-01-02T01:10:10", "2000-01-02T01:18:10", 8); 
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (4, 4, "2000-01-03T02:00:10", "2000-01-03T02:10:10", 10); 
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (5, 5, "2000-01-09T09:18:10", "2000-01-01T09:23:32", 5); 
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (6, 6, "2000-01-01T01:10:10", "2000-01-01T01:17:10", 7); 
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (7, 7, "2000-01-04T02:08:10", "2000-01-04T02:10:10", 2); 
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (8, 8, "2000-01-01T02:01:10", "2000-01-01T02:10:10", 9); 
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (9, 9, "2000-01-03T01:02:10", "2000-01-03T02:10:10", 8); 
INSERT INTO drivethru.measurement (MEAS_ID, REST_ID, MEAS_TIME_IN, MEAS_TIME_OUT, MEAS_DRIVETHROUGH)
VALUES (10, 10, "2000-01-01T02:10:10", "2000-01-01T02:25:10", 15); 
