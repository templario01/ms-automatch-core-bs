# Variables victor0141/automatch-inventory-script:1.2
IMAGE_NAME := victor0141/$(shell basename $(CURDIR))
TAG := 1.1

# Construir la imagen Docker
build:
	docker build --platform=linux/amd64 -t $(IMAGE_NAME):$(TAG) .

# Hacer pull de la imagen desde Docker Hub
pull:
	docker pull $(IMAGE_NAME):$(TAG)

# Agregar tag a la imagen
tag:
	docker tag $(IMAGE_NAME):$(TAG) $(IMAGE_NAME):$(TAG)

# Hacer push de la imagen a Docker Hub
push:
	docker push $(IMAGE_NAME):$(TAG)