const popup = document.querySelector(".popup");
const saveButton = document.querySelector(".save__button");
const addCardButton = document.querySelector(".add__card");
const fiveContent = document.querySelector(".five__main__content");
saveButton.addEventListener("click", () => {
  popup.style.display = "block";
  fiveContent.style.display = "block";
});
addCardButton.addEventListener("click", () => {
  popup.style.display = "none";
});
// ----------------------------------------------
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $(".image-upload-wrap").hide();

      $(".file-upload-image").attr("src", e.target.result);
      $(".file-upload-content").show();

      $(".image-title").html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $(".file-upload-input").replaceWith($(".file-upload-input").clone());
  $(".file-upload-content").hide();
  $(".image-upload-wrap").show();
}
$(".image-upload-wrap").bind("dragover", function () {
  $(".image-upload-wrap").addClass("image-dropping");
});
$(".image-upload-wrap").bind("dragleave", function () {
  $(".image-upload-wrap").removeClass("image-dropping");
});
