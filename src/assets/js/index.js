$(document).ready(function () {
    cargarCategorias();

    //event listeners
    $(".menu-lateral__hamburguesa").on("click", function () {
        if ($(".l-page").hasClass("l-page--sin-sidebar")) {
            //abrir el menu lateral
            $(".l-page").removeClass("l-page--sin-sidebar");
            $(".l-page__menu-lateral").removeClass("l-page__menu-lateral__animacion-cerrar");
            $(".l-page__content").removeClass("l-page__content__animacion-sin-sidebar");

            $(".l-page").addClass("l-page--con-sidebar");
            $(".l-page__menu-lateral").addClass("l-page__menu-lateral__animacion-abrir");
            $(".l-page__content").addClass("l-page__content__animacion-con-sidebar");


            $(".menu-lateral__hamburguesa").html("&#8678;")
        } else {
            //cerrar el menu lateral
            $(".l-page").removeClass("l-page--con-sidebar");
            $(".l-page__menu-lateral").removeClass("l-page__menu-lateral__animacion-abrir");
            $(".l-page__content").removeClass("l-page__content__animacion-con-sidebar");

            $(".l-page").addClass("l-page--sin-sidebar");
            $(".l-page__menu-lateral").addClass("l-page__menu-lateral__animacion-cerrar");
            $(".l-page__content").addClass("l-page__content__animacion-sin-sidebar");

            $(".menu-lateral__hamburguesa").html("&#8680;");
        }
    });
});

function cargarCategorias() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/categorias",
    }).done(function (response) {
        let html = "";
        response.forEach(element => {
            html += "<div class='menu-lateral__item'><a href='#' class='menu-lateral__enlace'>" + element.nombre + "</a></div>"
        });

        $("#menu-lateral").append(html);
    });
}