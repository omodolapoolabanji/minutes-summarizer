# can define commands to start mongodb (I have no idea what your path to mongo is so I won't do that for you)

#make sure the script fails on error
set -e

#build the docker image and tag it as ollama-docker
docker build -t ollama-docker .

#check whether the container is running
if [ "$(docker ps -q -f name=ollama-container)" ]; then
    echo "Ollama container already running"
    docker stop ollama-container
    docker rm ollama-container
fi

echo "starting the ollama container"
docker run -d --name ollama-container -p 11434:11434 ollama-docker

#pull the ollama model into the container
docker exec ollama-container ollama pull tinyllama

#if you want to opt to create a mongo build in the container
# docker run -d --name mongo -p 27017:27017 -v mongo_data:/data/db mongo:6
# or create a docker-compose.yaml idk

#run the express server 
npx ts-node index.ts