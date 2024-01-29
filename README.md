### Installation
1. You'll need docker and docker-compose installed on your machine.
```bash
docker-compose up -d
```
2. Install the requirements
```bash
npm install
```
3. Run the app
```bash
npm run start:dev
```

### Usage
The app will be running on port 3000.
```
POST http://localhost:3000/short_url
{
    "url": "https://www.google.com"
}
```
to get the short url for a given url.

Use the short url to redirect to the original url.


