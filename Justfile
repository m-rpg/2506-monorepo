init:
  [ -f server/.env ] || cp server/.env.example server/.env
  [ -f client/.env ] || cp client/.env.example client/.env
  cd server && npm install
  cd client && npm install
