document.addEventListener('DOMContentLoaded', () => {
  const imagesContainer = document.querySelector('#images');
  const ResizedImagesContainer = document.querySelector(
    '.resizedImagesContainer',
  );
  const resizeForm = document.querySelector('#resize');
  const uploadForm = document.querySelector('#upload');
  // i used type assertion to make this input able to use HTMLInputElement interface
  const imageInput = document.querySelector(
    '#imageInput',
  ) as unknown as HTMLInputElement;

  uploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (imageInput?.files && imageInput.files[0]) {
      console.log('this imageInput.files[0]: ', imageInput.files[0]);
      console.log('this imageInput.files: ', imageInput.files);
    }
    if (!imageInput.files || !imageInput.files[0]?.name.includes('.jpg')) {
      alert('invalid image type, only accepts .jpg images');
      return;
    }
    const formData = new FormData();
    if (imageInput?.files && imageInput.files[0]) {
      formData.append('image', imageInput.files[0]);
      await fetch('http://localhost:3000/api/upload', {
        method: 'post',
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log('this the data', data);
          const images = imagesContainer?.querySelectorAll('img');
          if (images) {
            const imageExists = Array.from(images).some((img) =>
              img.src.includes(data.filename),
            );
            if (imageExists) {
              alert('the image is aleardy uploaded');
              imageInput.value = '';
            } else {
              imagesContainer?.insertAdjacentHTML(
                'beforeend',
                `<img src="../../backend/images/${data.filename}" alt="Desert">`,
              );
              imageInput.value = '';
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert('upload your file');
    }
  });
  resizeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (resizeForm.querySelector('#name') as HTMLInputElement)?.value;
    const width = (resizeForm.querySelector('#width') as HTMLInputElement)
      ?.value;
    const height = (resizeForm.querySelector('#height') as HTMLInputElement)
      ?.value;
    fetch(
      `http://localhost:3000/api/resize?name=${name}&width=${width}&height=${height}`,
    )
      .then(async (res) => {
        console.log(res.ok);
        console.log(res.status);
        if (!res.ok) {
          const errorData = await res.text();
          const error = new Error(errorData || 'unknown error') as Error & {
            status?: number;
          };
          error.status = res.status;
          throw error;
        }
        return res.text();
      })
      .then((imgUrl) => {
        if (ResizedImagesContainer?.classList.contains('active')) {
          // normalize the image url to work on web
          const newImagePath = imgUrl.replace(/\\/g, '/');
          return newImagePath.replace('E:/Level four/Project', '../..');
        } else {
          ResizedImagesContainer?.classList.add('active');
          // normalize the image url to work on web
          const newImagePath = imgUrl.replace(/\\/g, '/');
          return newImagePath.replace('E:/Level four/Project', '../..');
        }
      })
      .then((imgUrl) => {
        console.log(imgUrl);
        ResizedImagesContainer?.insertAdjacentHTML(
          'beforeend',
          `<img src="${imgUrl}" alt="" />`,
        );
        (resizeForm as HTMLFormElement).reset();
      })
      .catch((error) => {
        if (error.status == 400) {
          alert('try upload your image first!, then resize it');
        } else if (error.status == 401) {
          alert('Image is already resized with the same dimensions');
        } else if (error.status == 403) {
          alert('invalid dimensions');
        } else if (error.status == 404) {
          alert('invalid image type');
        } else {
          alert('unknown error');
        }
      });
  });
});
