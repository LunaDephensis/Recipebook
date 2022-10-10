insert into recipebook_tags(id, title, user_id)
values(nextval('s_recipebook_tags'), $1, (select id from recipebook_user
where username = $2));