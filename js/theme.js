const themeBtn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("theme");

if(savedTheme==="light"){

    document.body.classList.add("light-mode");

    themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

}

themeBtn.addEventListener("click",function(){

    document.body.classList.toggle("light-mode");

    if(document.body.classList.contains("light-mode")){

        localStorage.setItem("theme","light");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

        showToast("☀️ Light Mode");

    }

    else{

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

        showToast("🌙 Dark Mode");

    }

});