exports.deletarTabelaCQL = `
    DROP TABLE IF EXISTS posts.posts_by_day_of_month`;

/* WHAT AM I EXPECTING TO QUERY?
* - GET ME ALL RECENT POSTS
* */

// https://docs.datastax.com/en/astra-cql/doc/cql/cql_reference/refDataTypes.html
exports.criacaoTabelaCQLPostsByDate = `
    CREATE TABLE IF NOT EXISTS posts.posts_by_date
    (
        post_creation_date timestamp,
        post_timestamp timestamp,
        post_id UUID,
        post_title text,
        post_body text,
        post_image text,
        post_is_favorite boolean,
        post_category text,
        PRIMARY KEY ((post_creation_date), post_timestamp, post_id)
    )
  `; // criacao da tabela 1
exports.insercaoTabelaCQLPostsByDate = `
    INSERT INTO posts.posts_by_date
    (
        post_creation_date,
        post_timestamp,
        post_id,
        post_title,
        post_body,
        post_image,
        post_is_favorite,
        post_category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `; // prepared statement para insercao na tabela
