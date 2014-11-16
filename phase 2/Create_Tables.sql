CREATE TABLE Users (
  u_id int NOT NULL,
  password_hash VARCHAR(128) NOT NULL,
  fb_id int Not NULL,
  PRIMARY KEY (u_id)
);
CREATE TABLE Location (
  l_id int NOT NULL,
  longitude NUMBER,
  latitude NUMBER,
  loc_name VARCHAR(512),
  country VARCHAR(512),
  state VARCHAR(512),
  city VARCHAR(512),
  PRIMARY KEY (l_id)
);

CREATE TABLE Trip (
  t_id int NOT NULL,
  location int NOT NULL,
  start_date date,
  end_date date,
  creator int NOT NULL,
  PRIMARY KEY (t_id),
  FOREIGN KEY (location) REFERENCES Location(l_id)
);


CREATE TABLE Album (
  a_id int NOT NULL,
  PRIMARY KEY (a_id)
);

CREATE TABLE Photo (
  p_id int NOT NULL,
  url VARCHAR(512) NOT NULL,
  published_by int NOT NULL,
  a_id int,
  PRIMARY KEY (p_id),
  FOREIGN KEY(published_by) REFERENCES Users(u_id),
  FOREIGN KEY (a_id) REFERENCES Album(a_id)
);

CREATE TABLE Groups (
  g_id int NOT NULL,
  name VARCHAR(512) NOT NULL,
  PRIMARY KEY (g_id)
);

CREATE TABLE friends_with (
  friend int NOT NULL,
  other_friend NOT NULL,
  PRIMARY KEY (friend, other_friend),
  FOREIGN KEY (friend) references Users(u_id),
  FOREIGN KEY (other_friend) references Users(u_id)
);



CREATE TABLE like_photo (
  u_id int NOT NULL,
  p_id int NOT NULL,
  PRIMARY KEY (u_id, p_id),
  FOREIGN KEY (u_id) REFERENCES Users(u_id),
  FOREIGN KEY (p_id) REFERENCES Photo(p_id)
);
CREATE TABLE Comments (
  c_id int NOT NULL,
  c_string VARCHAR(4000),
  time date DEFAULT sysdate,
  PRIMARY KEY (c_id)
);
CREATE TABLE comments_photo (
  u_id int NOT NULL,
  p_id int NOT NULL,
  c_id int NOT NULL,
  PRIMARY KEY (u_id, p_id, c_id),
  FOREIGN KEY (u_id) REFERENCES Users(u_id),
  FOREIGN KEY (p_id) REFERENCES Photo(p_id),
  FOREIGN KEY (c_id) REFERENCES Comments(c_id)
);

CREATE TABLE Users_in_Groups (
  u_id int NOT NULL,
  g_id int NOT NULL,
  PRIMARY KEY (u_id, g_id),
  FOREIGN KEY (u_id) REFERENCES Users(u_id),
  FOREIGN KEY (g_id) REFERENCES Groups(g_id)
);


CREATE TABLE photo_share (
  p_id int NOT NULL,
  g_id int NOT NULL,
  time date DEFAULT sysdate,
  PRIMARY KEY (p_id, g_id),
  FOREIGN KEY (p_id) REFERENCES Photo(p_id),
  FOREIGN KEY (g_id) REFERENCES Groups(g_id)
);

CREATE TABLE album_share (
  a_id int NOT NULL,
  g_id int NOT NULL,
  time date DEFAULT sysdate,
  PRIMARY KEY (a_id, g_id),
  FOREIGN KEY (a_id) REFERENCES Album(a_id),
  FOREIGN KEY (g_id) REFERENCES Groups(g_id)
);



CREATE TABLE invite_trip (
  t_id int,
  invited_Users int,
  invited_by int NOT NULL,
  accepted int DEFAULT 0,
  PRIMARY KEY (t_id, invited_Users),
  FOREIGN KEY (t_id) REFERENCES Trip(t_id),
  FOREIGN KEY (invited_Users) REFERENCES Users(u_id),
  FOREIGN KEY (invited_by) REFERENCES Users(u_id)
);



CREATE TABLE rate_location (
  u_id int,
  l_id int,
  rating int NOT NULL,
  PRIMARY KEY (u_id, l_id),
  FOREIGN KEY (u_id) REFERENCES Users(u_id),
  FOREIGN KEY(l_id) REFERENCES Location(l_id)
);

CREATE TABLE trip_affiliated_Groups (
  t_id int,
  g_id int,
  PRIMARY KEY (t_id, g_id),
  FOREIGN KEY (t_id) REFERENCES Trip(t_id),
  FOREIGN KEY (g_id) REFERENCES Groups(g_id)
);

