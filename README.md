
Animemash is an anime character voting website where two random characters stack up against each other and users can vote them based on their choice, all the votes recieved by a character will post its position on the Leaderboard.

i Built this project to learn FastAPI and practice building backend with auth and real database and to handle external api for our website for which i used jikan api for AnimeMash

Tech Stack: FastAPI,Postgresql(supabase),JWT,Vercel,Railway.

 the handling of the api of jikanapi has been a hard thing, understanding and implementing it took time.

how to run locally:

git clone <repo>

pip install -r requirements.txt

Create a .env file:

DATABASE_URL:< your supabase connection url >

SECRET_KEY:< your long string for jwt >

then:
uvicorn main:app --reload
