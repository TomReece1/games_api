\c nc_games_test


  SELECT reviews.*, count(comments.body) AS comment_count FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id
      ORDER BY reviews.created_at desc;
  

  