#!/bin/bash
#curl \
# -H 'authorization: Bearer OLzQ1bH3rNh0!ObG&Suvr55Ne4L5(TYXe5zusc)2z5!PZSIsI%RaQ3s!wCvC20z^' \
# 'https://public-api.wordpress.com/rest/v1.1/me/posts' | jq '.' > ALL_POSTS.json
# ^^^^ THIS ONE ABOVE EXPIRES
#https://developer.wordpress.com/docs/oauth2/
# VVVV THIS ONE BELOW NEVER EXPIRES
# curl \
# -H 'authorization: Bearer OLzQ1bH3rNh0!ObG&Suvr55Ne4L5(TYXe5zusc)2z5!PZSIsI%RaQ3s!wCvC20z^' \
# 'https://public-api.wordpress.com/rest/v1.1/me/posts' | jq '.' > ALL_POSTS.json
 curl \
 -H 'authorization: Bearer OLzQ1bH3rNh0!ObG&Suvr55Ne4L5(TYXe5zusc)2z5!PZSIsI%RaQ3s!wCvC20z^' \
 'https://public-api.wordpress.com/rest/v1.1/me/sites' | jq '.' > ALL_SITES.json
# curl \
# -H 'authorization: Bearer OLzQ1bH3rNh0!ObG&Suvr55Ne4L5(TYXe5zusc)2z5!PZSIsI%RaQ3s!wCvC20z^' \
# 'https://public-api.wordpress.com/rest/v1.1/insights' | jq '.' > ALL_INSIGHTS.json






#curl \
# 'https://public-api.wordpress.com/oauth2/authorize?client_id=78703&redirect_uri=https://wp-api-dev.w-b.dev&response_type=code'
# 9Zvg0aHGUu

#curl 'https://public-api.wordpress.com/oauth2/token' -X POST --header "Content-Type: application/json" --data @wp_auth.json | jq '.'

#OLzQ1bH3rNh0!ObG&Suvr55Ne4L5(TYXe5zusc)2z5!PZSIsI%RaQ3s!wCvC20z^
