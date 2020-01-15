let urlCliente = "http://localhost/Grupo2";
let urlServidor = "http://127.0.0.1:8000/api";
let urlImagenes = "http://127.0.0.1:8000";
class Producto {
  constructor(id, nombre, precio, descripcion, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.imagen = imagen;
  }
}
class Carrito {
  constructor() {
    this.productos = [];
  }
  anyadirProducto(producto) {
    this.productos.push(producto);
    $(".carrito__num-productos").text(this.productos.length);
    console.log(this.productos);
  }
}

let productosGlobal = [];
let carrito = new Carrito();

$(document).ready(function () {

  checkToken();
  cargarCategorias();
  cargarRedesSociales();
  // console.log("Va a ejercutarse leerURL");
  leerUrl();
  // console.log("ejecutado leerURL");

  //event listeners
  $(".menu-lateral__hamburguesa").on("click", toggleHamburguesa);
  $("#botonRegistrarse").on("click", abrirRegistro);
  $("#botonLogin").on("click", logIn);
  $(document).on("click", ".producto", abrirModalProducto)
  $(document).on("click", "#botonLogout", logout);
  $("#formularioRegistro").on("submit", registrar);
  $("#volverAtrasRegistro").attr("href", urlCliente);
  $(document).on("click", "#botonAnyadirCarrito", anyadirProducto);
  $("#botonAbrirLogIn").on({
    click: toggleLogin
  });
  $(".log-in").on({
    mouseleave: toggleLogin
  });
  window.addEventListener("popstate", function (event) {
    // console.log(event);
    //$('.page-content').html(state);
  });
});

function anyadirProducto() {
  let nombreProducto = $(this).parents().find(".modal-producto__header").text();
  carrito.anyadirProducto(nombreProducto);
}

function abrirModalProducto() {
  let nombreProducto = $(this).find(".producto__nombre").text()
  let informacionProducto = $(this).find(".producto__informacion").text();
  let precioProducto = $(this).find(".producto__precio").text();

  $(".modal-producto__header").text(nombreProducto);
  let html = "<p>" + informacionProducto + "</p>" + precioProducto;
  $(".modal-producto__body").html(html);

  $("#modalProducto").modal("show");
}

function abrirModalRegistro() {
  $("#modalRegistro").modal("show");
}

function toggleLogin() {
  $("#modalLogIn").modal("show");
  // let altura = document.getElementById("botonAbrirLogIn").getBoundingClientRect().height;
  // let posY = document.getElementById("botonAbrirLogIn").getBoundingClientRect().y;

  // if ($(".log-in").hasClass("log-in__fade-in")) {
  //   $(".log-in").removeClass("log-in__fade-in");
  //   $(".log-in").addClass("log-in__fade-out");
  // } else {
  //   $(".log-in").css({
  //     top: posY + altura + 20,
  //     right: 20
  //   });
  //   $(".log-in").removeClass("log-in__fade-out");
  //   $(".log-in").addClass("log-in__fade-in");
  // }
}

function logout() {
  window.localStorage.removeItem('Usuario');
  window.location.reload();
}

function checkToken() {
  let token = "Bearer " + window.localStorage.getItem('Usuario');

  if (window.localStorage.getItem('Usuario') != null) {
    $.ajax({
        type: "POST",
        url: urlServidor + "/auth/me",
        headers: {
          "Authorization": token
        }
      })
      .done(function (response) {
        abrirNotificacion("Bienvenido " + response.nickName + "!");
        let html = "";
        html += "<div class='carrito'>";
        html += "<i class='fas fa-shopping-cart'></i>"
        html += "</div>";
        html = "<div class='usuario'>";

        html += "<img class='usuario__imagen' src='http://127.0.0.1:8000/imagenes/usuarios/" + response.avatar + "'></img>";
        html += "<div class='usuario__nick'>";
        html += response.nickName;
        html += "</div>";
        html += "<div id='botonLogout' class='boton boton--terciario'>";
        html += "Logout";
        html += "</div>";
        html += "</div>";

        $("#divPerfilLogin").html(html);
        $(".log-in").hide();
      });
  }
}

function logIn() {
  let usuario = $("#inputUsuario").val();
  let password = $("#inputContrasenya").val();
  let objetoUsuario = {
    "email": usuario,
    "password": password
  };

  enviarLoginServidor(objetoUsuario);
}

function enviarLoginServidor(objetoUsuario) {
  $.post(urlServidor + "/auth/login", objetoUsuario)
    .done(function (response) {
      window.localStorage.setItem('Usuario', response.access_token);
      $("#modalLogIn").modal("hide");
      abrirNotificacion("Bienvenido " + response.user.nickName + "!");
      let html = "";
      html = "<div class='usuario'>";
      html += "<img class='usuario__imagen' src='http://127.0.0.1:8000/imagenes/usuarios/" + response.user.avatar + "'></img>";
      html += "<div class='usuario__nick'>";
      html += response.user.nickName;
      html += "</div>";
      html += "<div class='usuario__carrito'>";
      html += "<i class='fas fa-shopping-cart'></i>"
      html += "</div>";
      html += "<div id='botonLogout' class='boton boton--terciario'>";
      html += "Logout";
      html += "</div>";

      html += "</div>";

      $("#divPerfilLogin").html(html);
      $(".log-in").hide();
    })
    .fail(function () {
      abrirNotificacion("Login fallido");
    });
}

function abrirRegistro() {
  abrirModalRegistro();
  // window.location = urlCliente + "/registro.html";
  // window.location.replace("registro.html");
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
    url: urlServidor + "/categorias"
  }).done(function (response) {
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
  $.ajax({
    type: "GET",
    url: urlServidor + "/carousel"
  }).done(function (response) {
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
  }).done(function (response) {
    let numRedes = response.data.length;
    let html = "";

    html += "<div class='l-columnas l-columnas" + (numRedes <= 4 ? "--" + numRedes + "-columnas" : "--4-columnas") + "'>";
    response.data.forEach(element => {
      html += "<a href='" + element.enlace + "' class='red'><i class='red__icono " + element.icono + "'></i>" + element.nombre + "</a>";
    });
    html += "</div>";
    $(".footer__enlaces").append(html);
  });
}

function cargarProductosCategoria(url) {
  // console.log(url);
  toggleHamburguesa();

  $.ajax({
      type: "GET",
      url: urlServidor + url
    })
    .done(function (response) {
      window.history.pushState({
        categoria: url
      }, url, urlCliente + url);


      let numRedes = response.data.length;
      let html =
        "<div class='l-columnas l-columnas--4-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        let producto = new Producto(element.id, element.nombre, element.precio, element.descripcion, element.imagen);

        let existe = false;
        productosGlobal.forEach(element => {
          if (element.id == producto.id) {
            existe = true;
          }
        });
        if (!existe) {
          productosGlobal.push(producto);
        }

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
    .fail(function () {
      // console.log("consulta fallida");
    });
}

function cargarProductos() {
  let url = "/productos";
  $.ajax({
    type: "GET",
    url: urlServidor + url
  })
    .done(function (response) {
      // console.log("Consulta done");
      window.history.pushState({
        categoria: url
      }, url, urlCliente + url);
      // console.log("productos");
      // console.log(response);
      // console.log(response.mensaje);
      let numRedes = response.data.length;
      let html =
        "<div class='l-columnas l-columnas--4-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        html += "<div class='producto'>";
        html +=
          "<img class='producto__imagen' src='" +
          urlImagenes +
          response.rutaImagenesServer +
          element.imagen +
          "'>";
        console.log("urlImagenes  --> " + urlImagenes);
        console.log("response.rutaServerImagenes  --> " + response.rutaServerImagenes);
        console.log("element.imagen  --> " + element.imagen);
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
    .fail(function () {
      // console.log("consulta fallida");
    });
}

function cargarProductos() {
  let url = "/productos";
  $.ajax({
    type: "GET",
    url: urlServidor + url
  })
    .done(function (response) {
      // console.log("Consulta done");
      window.history.pushState({
        categoria: url
      }, url, urlCliente + url);
      // console.log("productos");
      // console.log(response);
      // console.log(response.mensaje);
      let numRedes = response.data.length;
      let html =
        "<div class='l-columnas l-columnas--4-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        html += "<div class='producto'>";
        html +=
          "<img class='producto__imagen' src='" +
          urlImagenes +
          response.rutaImagenesServer +
          element.imagen +
          "'>";
        console.log("urlImagenes  --> " + urlImagenes);
        console.log("response.rutaServerImagenes  --> " + response.rutaServerImagenes);
        console.log("element.imagen  --> " + element.imagen);
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
    .fail(function () {
      // console.log("consulta fallida");
    });
}

function cargarRecetas() {
  let url = "/recetas";
  $.ajax({
    type: "GET",
    url: urlServidor + url
  })
    .done(function (response) {
      // console.log("Consulta done");
      window.history.pushState({
        categoria: url
      }, url, urlCliente + url);
      // console.log("productos");
      // console.log(response);
      // console.log(response.mensaje);
      let numRedes = response.data.length;
      let html =
        "<div class='l-columnas l-columnas--4-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        html += "<div class='producto'>";
        html +=
          "<img class='producto__imagen' src='" +
          urlImagenes +
          response.rutaImagenesServer +
          element.imagen +
          "'>";
        html += "<div class='producto__nombre'>" + element.nombre + "</div>";
        
        html +=
          "<a href='" + element.enlace + "'><div class='boton boton--secundario'> Enlace Web </div></a>";
        html += "</div>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
      //alert(location.href);
    })
    .fail(function () {
      // console.log("consulta fallida");
    });
}

function abrirNotificacion(mensaje) {
  $("#notificacion").text(mensaje);
  $("#notificacion").addClass("notificacion--show");

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    $("#notificacion").removeClass("notificacion--show");
  }, 3000);
}

// function cargarPagina() {
//   window.onpopstate()
// }

function leerUrl() {
  // console.log("HECHO LEER URL HOLAAAA");
  let url = location.href.split("Grupo2/")[1];
  let prueba = url.split("/")[0];
  // console.log("Prueba: " + prueba);
  switch (prueba) {
    case "":
      cargarPrincipal();
      cargarImagenesCarousel();
      break;
    case "categorias":
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

function registrar(e) {
  e.preventDefault();

  let usuario = $("#inputEmail").val();
  let password = $("#inputPassword1").val();
  let objetoUsuario = {
    "email": usuario,
    "password": password
  };
  var formData = new FormData(this);
  formData.append("nombre", $("#inputNombre").val());
  formData.append("apellidos", $("#inputApellidos").val());
  formData.append("email", $("#inputEmail").val());
  formData.append("nickName", $("#inputNick").val());
  formData.append("password1", $("#inputPassword1").val());
  formData.append("password2", $("#inputPassword2").val());
  formData.append("avatar", $("#inputAvatar")[0].files[0]);


  console.log(urlServidor + "/auth/register");

  $.ajax({
      url: urlServidor + "/auth/register",
      type: "post",
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    })
    .done(function (res) {
      enviarLoginServidor(objetoUsuario);
      $("#modalRegistro").modal("hide");
      abrirNotificacion("Registro completado");
    })
    .fail(function (res) {
      console.log("fail");

      console.log(res);
      console.log(res.responseText);
      abrirNotificacion("Registro fallido");
    });
}

function cargarPrincipal() {
  let html = "";
  html += '<div class="portada">';
  html += '<div class="portada__carousel">';
  html += '<div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel" data-interval="5000" data-pause="false">';
  html += '<div id="carousel" class="carousel-inner" ></div >';
  html += '</div >';
  html += '</div >';
  html += '<div class="portada__paneles">';
  html += ' <div class="l-columnas l-columnas--3-columnas l-columnas--gap-xl">';
  html += '  <div class="l-columnas__item">';
  html += '     <div class="boton boton--primario">Categorias</div>';
  html += '     </div>';
  html += '    <div class="l-columnas__item">';
  html += '      <div class="boton boton--primario" onclick="cargarProductos()">Productos</div>';
  html += '    </div>';
  html += '    <div class="l-columnas__item">';
  html += '      <div class="boton boton--primario" onclick="cargarRecetas()"> Recetas</div>';
  html += '</div>';
  html += '  </div>';
  html += '   </div>';
  html += ' </div > ';
  $(".l-page__content").html(html);
}