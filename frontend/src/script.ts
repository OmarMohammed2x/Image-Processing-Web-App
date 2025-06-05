document.addEventListener('DOMContentLoaded', () => {
  const imagesContainer = document.querySelector('#images');
  const ResizedImagesContainer = document.querySelector(
    '.resizedImagesContainer',
  );
  const resizeForm = document.querySelector('#resize');
  const nameInput = resizeForm?.querySelector('#name') as HTMLInputElement;
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
    if (
      !imageInput.files ||
      (!imageInput.files[0]?.name.includes('.jpg') &&
        !imageInput.files[0]?.name.includes('.jpeg'))
    ) {
      alert('invalid image type, only accepts .jpg/.jpeg images');
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
                `<img src="../../backend/images/${data.filename}" alt="${data.filename}">`,
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
    const name = nameInput?.value;
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
        } else if (error.status == 405) {
          alert('Enter the image name');
        } else {
          alert('unknown error');
        }
      });
  });
  imagesContainer?.addEventListener('click', (evnt) => {
    const target = evnt.target as Element;
    if (target && target.matches('img')) {
      Array.from(imagesContainer.children).forEach((img) => {
        img.classList.remove('selected');
      });
      target.classList.add('selected');
      nameInput.value = (target as HTMLImageElement).alt;
    }
  });
  ResizedImagesContainer?.addEventListener('click', (evnt) => {
    const target = evnt.target as Element;
    if (target && target.matches('img')) {
      const path = (target as HTMLImageElement).src;
      const regex = /\/([^\/\[\]]+)\[(\d+)X(\d+)\]\.jpg$/;
      const matchCases = path.match(regex);
      if (matchCases) {
        const width = matchCases[2];
        const height = matchCases[3];
        const imgWindow = window.open(
          '',
          '_blank',
          `width=${width},height=${height}`,
        );
        if (imgWindow) {
          imgWindow.document.body.innerHTML = `
  <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background:#000;">
    <img src="${path}" style="width:${width}px; height:${height}px;">
  </body>
`;
        }
      }

      console.log(path.match(regex));
    }
  });
});
