insert into recipebook_recipe_tag_kapcsolat(id, recipe_id, tag_id)
values(nextval('s_recipebook_recipe_tag_kapcsolat'), $1, $2);