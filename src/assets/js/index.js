let urlCliente = "http://localhost/Grupo2";
let urlServidor = "http://127.0.0.1:8000/api";
let urlImagenes = "http://127.0.0.1:8000";

$(document).ready(function() {
  console.log("Se va a ejecutar todo");
  cargarCategorias();
  cargarRedesSociales();
  console.log("Va a ejercutarse leerURL");
  leerUrl();
  console.log("ejecutado leerURL");

  //event listeners
  $(".menu-lateral__hamburguesa").on("click", toggleHamburguesa);
  $("#botonAbrirLogIn").on("click", abrirLogIn);
  $("#botonRegistrarse").on("click", registrarse);
  $("#botonLogin").on("click", logIn);
});

//cerrar el log in al hacer click en la pagina
$(document).mouseup(function(e) {
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
    email: email,
    password: password
  };
  console.log(objetoUsuario);

  $.post(urlServidor + "/api/auth/login", objetoUsuario)
    .done(function() {
      abrirNotificacion("Login correcto");
    })
    .fail(function() {
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
    $(".l-page__menu-lateral").removeClass(
      "l-page__menu-lateral__animacion-cerrar"
    );
    $(".l-page__content").removeClass("l-page__content__animacion-sin-sidebar");

    $(".l-page").addClass("l-page--con-sidebar");
    $(".l-page__menu-lateral").addClass(
      "l-page__menu-lateral__animacion-abrir"
    );
    $(".l-page__content").addClass("l-page__content__animacion-con-sidebar");

    $(".menu-lateral__hamburguesa").html("<i class='fas fa-times'></i>");
  } else {
    //cerrar el menu lateral
    $(".l-page").removeClass("l-page--con-sidebar");
    $(".l-page__menu-lateral").removeClass(
      "l-page__menu-lateral__animacion-abrir"
    );
    $(".l-page__content").removeClass("l-page__content__animacion-con-sidebar");

    $(".l-page").addClass("l-page--sin-sidebar");
    $(".l-page__menu-lateral").addClass(
      "l-page__menu-lateral__animacion-cerrar"
    );
    $(".l-page__content").addClass("l-page__content__animacion-sin-sidebar");

    $(".menu-lateral__hamburguesa").html("<i class='fas fa-bars'></i>");
  }
}

function cargarCategorias() {
  $.ajax({
    type: "GET",
    url: urlServidor + "/categorias"
  }).done(function(response) {
    console.log(response.mensaje);
    let html = "";
    html += "<div class='menu-lateral__contenedor-enlaces'>";
    response.data.forEach(element => {
      // html += "<div class='menu-lateral__item'><a href='#' class='menu-lateral__enlace'>" + element.nombre + "</a></div>"
      html +=
        "<a href='javascript:void(0)'class='menu-lateral__enlace' id='" +
        element.id +
        "' onclick='cargarProductosCategoria(\"/categorias/" +
        element.nombre +
        "/productos\")'><i class='" +
        element.icono +
        " menu-lateral__icono'></i>" +
        element.nombre +
        "</a>";

      // html +=
      //   "<a href='categorias/" +
      //   element.nombre +
      //   "'class='menu-lateral__enlace' id='" +
      //   element.id +
      //   "' onclick='cargarProductosCategoria(this)' nombre=" + element.nombre + "><i class='" +
      //   element.icono +
      //   " menu-lateral__icono'></i>" +
      //   element.nombre +
      //   "</a>";
    });
    html += "<div>";

    $("#menu-lateral").append(html);
  });
}

function cargarImagenesCarousel() {
  console.log("entrado");
  $.ajax({
    type: "GET",
    url: urlServidor + "/carousel"
  }).done(function(response) {
    console.log(response);
    console.log(response.mensaje);
    let html = "";
    let contador = 0;
    response.imagenes.forEach(element => {
      html +=
        "<div class='carousel-item " + (contador != 0 ? "" : "active") + "'>";
      html +=
        "<img class='d-block c-carousel__imagen' src='" +
        urlImagenes +
        response.rutaServerImagenes +
        element +
        "'>";
      html += "</div>";
      contador++;
    });

    $("#carousel").append(html);
  });
}

function cargarRedesSociales() {
  $.ajax({
    type: "GET",
    url: urlServidor + "/redessociales"
  }).done(function(response) {
    console.log(response.mensaje);
    let numRedes = response.data.length;
    let html = "";

    html +=
      "<div class='l-columnas l-columnas" +
      (numRedes <= 4 ? "--" + numRedes + "-columnas" : "--4-columnas") +
      "'>";
    response.data.forEach(element => {
      html +=
        "<a href='" +
        element.enlace +
        "' class='red'><i class='red__icono " +
        element.icono +
        "'></i>" +
        element.nombre +
        "</a>";
    });
    html += "</div>";
    $(".footer__enlaces").append(html);
  });
}

function cargarProductosCategoria(url) {
  console.log(url);

  $.ajax({
    type: "GET",
    url: urlServidor + url
  })
    .done(function(response) {
      console.log("Consulta done");
      window.history.pushState({ categoria: url }, url, urlCliente + url);
      console.log("productos");
      console.log(response);
      console.log(response.mensaje);
      let numRedes = response.data.length;
      let html =
        "<div class='l-columnas l-columnas--4-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        html += "<div class='producto'>";
        html +=
          "<img class='producto__imagen' src='" +
          urlImagenes +
          response.rutaServerImagenes +
          element.imagen +
          "'>";
        html += "<div class='producto__nombre'>" + element.nombre + "</div>";
        html +=
          "<div class='producto__informacion'>" +
          element.descripcion +
          "</div>";
        html +=
          "<div class='producto__precio'>Precio: " + element.precio + "€</div>";
        html += "</div>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
      //alert(location.href);
    })
    .fail(function() {
      console.log("consulta fallida");
    });
}

function abrirNotificacion(mensaje) {
  console.log(mensaje);
  $("#notificacion").text(mensaje);
  $("#notificacion").addClass("notificacion--show");

  // After 3 seconds, remove the show class from DIV
  setTimeout(function() {
    $("#notificacion").removeClass("notificacion--show");
  }, 3000);
}

// function cargarPagina() {
//   window.onpopstate()
// }

function leerUrl() {
  console.log("HECHO LEER URL HOLAAAA");
  let url = location.href.split("Grupo2/")[1];
  let prueba = url.split("/")[0];
  console.log("Prueba: " + prueba);
  switch (prueba) {
    case "":
      console.log("Hola1");
      cargarImagenesCarousel();
      break;
    case "categorias":
      console.log("Hola2");
      cargarProductosCategoria("/" + url);
      break;
    case "productos":
      break;
    case "recetas":
      break;
    default:
      // Aquí cargar una página de error
      break;
  }
}

window.addEventListener("hashchange", leerUrl);
window.addEventListener("load", leerUrl);
