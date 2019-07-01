const image = document.getElementById('image');
const cropper = new Cropper(image, {
  // aspectRatio: 16 / 9,
  dragMode: 'none'
});

let selectedImage = null;
let count = 0;

function onClickImageItem(e) {
  if (selectedImage)  document.getElementById(selectedImage).classList.remove('image_lib_item_selected');
  
  if(selectedImage === e.target.id) {
    selectedImage = null;
  }
  else {
    selectedImage = e.target.id;
    e.target.classList.add('image_lib_item_selected');
  }
}

function getSelectedImageData() {
  if (!selectedImage) return null;
  const el = document.getElementById(selectedImage);
  return {
    id: el.id,
    data: el.src,
  }
}

function crop() {
  const canvas = cropper.getCroppedCanvas();
  const image = new Image();
  const data = canvas.toDataURL();
  // image_lib.push(data);
  count += 1;
  image.src = data;
  image.id = 'image_lib_item_' + count;
  image.onclick = onClickImageItem;
  image.className = "image_lib_item"
  document.getElementsByClassName("image_lib")[0].appendChild(image);
}

document.getElementById("cropBtn").addEventListener("click", crop);