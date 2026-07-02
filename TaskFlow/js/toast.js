const toast=document.getElementById("toast");

function showToast(message){

    toast.textContent=message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer=setTimeout(function(){

        toast.classList.remove("show");

    },2500);

}