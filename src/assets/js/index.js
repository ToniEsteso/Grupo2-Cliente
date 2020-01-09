$(document).ready(function () {
    cargarCategorias();
    cargarImagenesCarousel();
    cargarRedesSociales();

    //event listeners
    $(".menu-lateral__hamburguesa").on("click", toggleHamburguesa);
    $("#botonAbrirLogIn").on("click", abrirLogIn);
    $("#botonRegistrarse").on("click", registrarse);
    $("#botonLogin").on("click", logIn);
});

//cerrar el log in al hacer click en la pagina
$(document).mouseup(function (e) {
    var container = $(".log-in");

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
});

function abrirLogIn(event) {
    $(".log-in").show();
    $(".log-in").toggleClass("log-in--visible");
    let altura = this.getBoundingClientRect().height;
    let posY = this.getBoundingClientRect().y;

    $(".log-in").css({
        top: posY + altura + 20,
        right: 20
    });
}

function logIn() {
    let email = $("#inputUsuario").val();
    let password = $("#inputContrasenya").val();
    let objetoUsuario = {
        "email": email,
        "password": password
    };
    console.log(objetoUsuario);

    $.post("http://127.0.0.1:8000/api/auth/login", objetoUsuario)
        .done(function () {
            abrirNotificacion("Login correcto");
        })
        .fail(function () {
            abrirNotificacion("Login fallido");
        });
}

function registrarse() {
    window.location.replace("registro.html");
}

function toggleHamburguesa() {
    $(".menu-lateral__hamburguesa").html("");

    if (!$(".l-page").hasClass("l-page--con-sidebar")) {
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
}

function cargarCategorias() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/categorias",
    }).done(function (response) {
        console.log(response.mensaje);
        let html = "";
        html += "<div class='menu-lateral__contenedor-enlaces'>";
        response.data.forEach(element => {
            // html += "<div class='menu-lateral__item'><a href='#' class='menu-lateral__enlace'>" + element.nombre + "</a></div>"
            html += "<a href='#' class='menu-lateral__enlace' id='" + element.id + "'><i class='" + element.icono + " menu-lateral__icono'></i>" + element.nombre + "</a>"
        });
        html += "<div>";

        $("#menu-lateral").append(html);
    });
}

function cargarImagenesCarousel() {
    console.log("entrado");
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/carousel",
    }).done(function (response) {
        console.log(response);
        console.log(response.mensaje);
        let html = "";
        let contador = 0;
        response.imagenes.forEach(element => {
            html += "<div class='carousel-item " + (contador != 0 ? "" : "active") + "'>";
            html += "<img class='d-block c-carousel__imagen' src='http://127.0.0.1:8000" + response.rutaServer + "/" + element + "'>";
            html += "</div>";
            contador++;
        });

        $("#carousel").append(html);
    });
}

function cargarRedesSociales() {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/redessociales",
    }).done(function (response) {
        console.log(response.mensaje);
        let numRedes = response.data.length;
        let html = "";

        html += "<div class='l-columnas l-columnas" + ((numRedes <= 4) ? "--" + numRedes + "-columnas" : "--4-columnas") + "'>";
        response.data.forEach(element => {
            html += "<a href='" + element.enlace + "' class='red'><i class='red__icono " + element.icono + "'></i>" + element.nombre + "</a>";
        });
        html += "</div>";
        $(".footer__enlaces").append(html);
    });
}

function abrirNotificacion(mensaje) {
    console.log(mensaje);
    $("#notificacion").text(mensaje);
    $("#notificacion").addClass("notificacion--show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        $("#notificacion").removeClass("notificacion--show");
    }, 3000);
}