goose -dir internal/migrate/db/migrations postgres "postgresql://postgres:postgres@127.0.0.1:5436/ring_orders?sslmode=disable" down
goose -dir internal/migrate/db/migrations create new_accepted_table sql
scp -r ./dist administrator@pro:/home/administrator/apps/rings
npx vite-bundle-visualizer
