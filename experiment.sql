\c nc_games_test

  SELECT * FROM comments;


INSERT INTO comments
(body, review_id, author)
VALUES
('apt analysis robert', 1, 'mallionaire')
RETURNING *;

SELECT * FROM comments;
  

