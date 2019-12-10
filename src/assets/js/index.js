$(document).ready(function () {
    cargarCategorias();
    cargarImagenesCarousel();

    //event listeners
    $(".menu-lateral__hamburguesa").on("click", function () {
        $(".menu-lateral__hamburguesa").html("");

        if ($(".l-page").hasClass("l-page--sin-sidebar")) {
            //abrir el menu lateral
            $(".l-page").removeClass("l-page--sin-sidebar");
            $(".l-page__menu-lateral").removeClass("l-page__menu-lateral__animacion-cerrar");
            $(".l-page__content").removeClass("l-page__content__animacion-sin-sidebar");

            $(".l-page").addClass("l-page--con-sidebar");
            $(".l-page__menu-lateral").addClass("l-page__menu-lateral__animacion-abrir");
            $(".l-page__content").addClass("l-page__content__animacion-con-sidebar");

            $(".menu-lateral__hamburguesa").html("<i class='fas fa-times'></i>");
        } else {
            //cerrar el menu lateral
            $(".l-page").removeClass("l-page--con-sidebar");
            $(".l-page__menu-lateral").removeClass("l-page__menu-lateral__animacion-abrir");
            $(".l-page__content").removeClass("l-page__content__animacion-con-sidebar");

            $(".l-page").addClass("l-page--sin-sidebar");
            $(".l-page__menu-lateral").addClass("l-page__menu-lateral__animacion-cerrar");
            $(".l-page__content").addClass("l-page__content__animacion-sin-sidebar");

            $(".menu-lateral__hamburguesa").html("<i class='fas fa-bars'></i>");
        }
    });
});

function cargarCategorias() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/categorias",
    }).done(function (response) {
        let html = "";
        html += "<div class='menu-lateral__contenedor-items'>";
        response.forEach(element => {
            html += "<div class='menu-lateral__item'><a href='#' class='menu-lateral__enlace'>" + element.nombre + "</a></div>"
        });
        html += "<div>";

        $("#menu-lateral").append(html);
    });
}

function cargarImagenesCarousel() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/carousel",
    }).done(function (response) {
        let html = "";
        let contador = 0;
        response.forEach(element => {
            html += "<div class='carousel-item " + (contador != 0 ? "" : "active") + "'>";
            html += "<img class='d-block w-100 imagen-carousel' src='assets/img/carousel" + element.id + "." + element.extension + "'>";
            html += "</div>";
            contador++;
        });

        $("#carousel").append(html);
    });
}