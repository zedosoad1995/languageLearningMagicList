docker-compose --file="infra/docker-compose-pg.yml" -p magic_words_list up -d
npx prisma migrate deploy