\c nc_games_test


  SELECT reviews.*, count(comments.body) AS comment_count FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = 2
  GROUP BY reviews.review_id;
  

  