FROM ubuntu:22.04

# some update and typical linux container init stuff
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# install ollama into the container
RUN curl -fsSL https://ollama.ai/install.sh | sh

# not as self explanatory, just defines that the container listens on this port at runtime, still needs to be published and bound 
EXPOSE 11434

#start the server
CMD ["ollama", "serve"]


