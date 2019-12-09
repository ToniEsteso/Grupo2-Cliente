$(document).ready(function () {
    cargarCategorias();

    //event listeners
    $(".menu-lateral__hamburguesa").on("click", function () {
        console.log("hamburguesota");
        $(".l-page").toggleClass("l-page--sin-sidebar");
        $(".l-page__menu-lateral").toggleClass("l-page__menu-lateral__animacion-cerrar");
    });
});

function cargarCategorias() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/categorias",
    }).done(function (response) {
        let html = "";
        response.forEach(element => {
            html += "<div class='menu-lateral__item'><a href='#' class='menu-lateral__enlace'>" + element.nombre+"</a></div>"
        });

        $("#menu-lateral").append(html);
    });
}