load data 
infile 'USERS.csv' "str '\r\n'"
append
into table USERS
fields terminated by ','
OPTIONALLY ENCLOSED BY '"' AND '"'
trailing nullcols
           ( U_ID CHAR(4000),
             PASSWORD_HASH CHAR(4000),
             FIRST_NAME CHAR(4000),
             LAST_NAME CHAR(4000),
             EMAIL CHAR(4000),
             AFFILIATION CHAR(4000)
           )
