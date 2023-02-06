## Deployment
```
docker build -t artyst-backend-container .

aws lightsail push-container-image --region ap-southeast-2 \
--service-name artyst-backend \
--label artyst-backend-container \
--image artyst-backend-container:latest
```

Now re-deploy the `artyst-backend` container with the latest `artyst-backend-container`
