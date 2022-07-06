\c nc_games_test

--   SELECT * FROM comments;


-- INSERT INTO comments
-- (body, review_id, author)
-- VALUES
-- ('apt analysis robert', 1, 'mallionaire')
-- RETURNING *;

-- SELECT * FROM comments;
  


SELECT COUNT(comments.review_id) AS TOTAL_COMMENTS from comments
LEFT JOIN reviews
ON reviews.review_id = comments.review_id
WHERE reviews.review_id = 2;

-- SELECT count(comments.review_id) AS comment_count FROM comments
--       LEFT JOIN reviews ON reviews.review_id = comments.review_id
--       WHERE reviews.review_id = 2;
      -- GROUP BY reviews.review_id;