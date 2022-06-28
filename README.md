
# Setting up locally

## Install NodeJS

## Install Git

## Fetch the source and dependencies

* Fetch the source: `git pull https://github.com/JeremyBaucherel/SAGA_FRONTEND.git`
* Install Node dependencies: `npm install` puis 'npm update' au besoin pour mettre à jour dans le futur sans tout réinstaller
* `npm audit fix --force`
* `npm audit fix`
* Build the app bundle: `npm run-script build` (`npm run-script watch` if you're developing)
* Run the server: `npm start`

By default, the [API endpoint](https://github.com/JeremyBaucherel/SAGA_BACKEND) will be defined at `127.0.0.1.8080`. If it running somewhere else, set the environment variable `SAGA_API_URL`.
