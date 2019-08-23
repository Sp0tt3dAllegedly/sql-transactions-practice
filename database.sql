CREATE TABLE account (
	id SERIAL PRIMARY KEY,
	name VARCHAR(80) NOT NULL
);

CREATE TABLE transaction (
	id SERIAL PRIMARY KEY,
	acct_id INTEGER REFERENCES account NOT NULL,
	amount MONEY NOT NULL
);