# Project Summary

This a image-processing app where you will upload your image,Your image will appear in gallery section where you will find some image to resize them as well.

After uploading your image , you can select it by clicking it then its name will appear automatically in the resize form , then choose the desired dimensions and click the resize button, And finaly ,your image will appear in resizd images section you can click it then a new window will appear where you can see your resized image!!

## endpoints
This endpoint is linked to the upload form to take the image from it and put it in the gallery section.

`http://localhost:3000/api/upload`

After choosing the desired dimensions and clicking resize button , Your inputs values will go to this queryparams and used along with sharp to implement the resize process.

`http://localhost:3000/api/resize?width=number&height=number&name=imageName`
## scripts
- type `npm run start` to run the server
- type `npm run lint` to run eslint in backend or frontend folders
- type `npm run format` to run the prettier
- type `npm run build` to transpile TS code.
- type `npm run jasmine` to run tests.
## Caching
If you tried to resize the image with the same dimensions more than one time you will encounter an alert telling you 'you have already resized this image with the same dimensions'