create table recipebook_user(
	id integer primary key,
	username varchar(100) unique,
	password text
);

create sequence s_recipebook_user;

create table recipebook_recipes(
	id integer primary key,
	title varchar(255),
	user_id integer,
	elkeszitesi_ido integer,
	letrehozas_datuma timestamp,
	hozzavalok text,
	elkeszitesi_mod text,
	kep bytea,
	constraint fk_recipebook_recipes_user foreign key(user_id) references recipebook_user(id)
);

create sequence s_recipebook_recipes;

create table recipebook_tags(
	id integer primary key,
	title varchar(100),
	user_id integer,
	constraint fk_recipebook_tags_user foreign key(user_id) references recipebook_user(id)
);

create sequence s_recipebook_tags;

create table recipebook_recipe_tag_kapcsolat(
	id integer primary key,
	recipe_id integer,
	tag_id integer,
	constraint fk_recipebook_recipe_kapcsolat foreign key(recipe_id) references recipebook_recipes(id),
	constraint fk_recipebook_tag_kapcsolat foreign key(tag_id) references recipebook_tags(id)
);

create sequence s_recipebook_recipe_tag_kapcsolat;

alter table recipebook_user add column email varchar(350);

alter table recipebook_recipes drop column kep;

alter table recipebook_recipes add column picture varchar(255);