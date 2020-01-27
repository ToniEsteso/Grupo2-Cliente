import {
  urlCliente,
  urlImagenes,
  urlServidor
} from "../../config.js";

// LOCALHOST
// let urlServidor = "http://127.0.0.1:8000/api";
// let urlCliente = "http://localhost/Grupo2";
// let urlImagenes = "http://127.0.0.1:8000";

//SERVIDOR CLASE
// let urlServidor = "http://172.16.205.54:10320/api";
// let urlCliente = "http://172.16.205.54:10310";
// let urlImagenes = "http://172.16.205.54:10320";

// SERVIDOR FRANCIA
// let urlServidor = "http://www.api.veganfood.pve2.fpmislata.com/public/api";
// let urlCliente = "http://www.veganfood.fpmislata.pve2.fpmislata.com";
// let urlImagenes = "http://www.api.veganfood.pve2.fpmislata.com";

class Producto {
  constructor(id, nombre, precio, descripcion, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.unidades = 1;
  }
}
class Carrito {
  constructor() {
    this.productos = [];
    this.fechaCompra = new Date();
    this.idUsuario = "invitado";
  }
  anyadirProducto(producto) {
    console.log(producto);
    if (this.productos.includes(producto)) {
      let repetido = this.productos.find(prod => prod == producto);
      repetido.unidades++;
    } else {
      this.productos.push(producto);
    }
    this.actualizarContador();
  }

  borrarProducto(producto) {
    let idProducto = producto.id;
    this.productos.splice(
      this.productos.findIndex(prod => prod.id == idProducto),
      1
    );

    this.actualizarContador();
    cargarProductosCarrito();
  }

  actualizarContador() {
    $(".icono-carrito__num-productos").text(this.productos.length);
  }
}

let productosGlobal = [];
let carrito = new Carrito();

$(document).ready(function () {
  checkToken();
  cargarCategorias();
  cargarRedesSociales();

  //event listeners
  $(document).on("click", "#botonCargarCategorias", cargarCategoriasBoton);
  $(document).on("click", "#botonCargarProductos", cargarProductos);
  $(document).on("click", "#botonCargarRecetas", cargarRecetas);

  $("#botonYaTengoCuenta").on("click", yaTengoCuenta);
  $(".menu-lateral__hamburguesa").on("click", toggleHamburguesa);
  $("#botonRegistrarse").on("click", abrirRegistro);
  $("#botonLogin").on("click", logIn);
  $(document).on("click", ".producto", toggleModalProducto);
  $(document).on("click", "#botonLogout", logout);
  $("#formularioRegistro").on("submit", registrar);
  $("#volverAtrasRegistro").attr("href", urlCliente);
  $(".icono-carrito").on("click", cargarProductosCarrito);
  $(document).on("click", "#logoHeader", function () {
    window.history.pushState({
        categoria: urlCliente
      },
      urlCliente,
      urlCliente + "/"
    );
    leerUrl();
  });
  $(document).on("click", "#botonComprar", enviarCarritoServidor);
  $(document).on("click", "#botonAnyadirCarrito", anyadirProducto);
  $(document).on("click", ".menu-lateral__enlace", cargarProductosCategoria);
  $(document).on("click", ".categorias", cargarProductosCategoria);
  $(document).on("click", ".usuario", cargarDropDownUsuario);
  $(document).on("click", ".producto-carrito__borrar", function () {
    carrito.borrarProducto(this);
  });
  $("#botonAbrirLogIn").on({
    click: toggleLogin
  });
  $(".log-in").on({
    mouseleave: toggleLogin
  });
});

function cargarDropDownUsuario() {
  $('.dropdown-usuario').toggle();
}

function yaTengoCuenta() {
  toggleModalRegistro();
  toggleLogin();
}

function enviarCarritoServidor() {
  console.log(carrito);
  carrito.fechaCompra = new Date().toISOString().slice(0, 19).replace('T', ' ');

  $.ajax({
      type: "POST",
      url: urlServidor + "/enviarCarrito",
      data: carrito,
    })
    .done(function (response) {
      console.log(response);
      console.log(response.responseText);
    });
}

function checkCarrito() {
  let carritoStorage = JSON.parse(window.localStorage.getItem("Carrito"));

  if (carritoStorage !== null) {
    carrito.productos = carritoStorage.productos;
    carrito.actualizarContador();
  } else {
    console.log("no entra en el if");
  }
}

function cargarProductosCarrito() {
  // REDEFINIR ESTO PARA QUE LA PÁGINA DE PRODUCTOS LE MANDE AL CARRITO LA URL DE LAS IMÁGENES
  // Y ASÍ PODER COGER LA URL DE LAS IMÁGENES
  let html = "";
  let precioTotal = 0;
  if (carrito.productos.length === 0) {
    html += "<div class='producto-carrito'>";
    html += "No tienes productos en el carrito";
    html += "</div>";
  } else {
    carrito.productos.forEach(prod => {
      html += "<div class='producto-carrito'>";
      html +=
        "<img src='" +
        urlImagenes +
        prod.imagen +
        "' class='producto-carrito__imagen'>";
      html += "<div class='producto-carrito__nombre'>";
      html += prod.nombre;
      html += "</div>";
      html += "<div class='producto-carrito__unidades'>";
      html += prod.unidades;
      html += "</div>";
      html += "<div class='producto-carrito__precio'>";
      html += prod.precio;
      html += "</div>";
      html += "<div class='producto-carrito__precioUnidades'>";
      html += prod.unidades * prod.precio;
      precioTotal += prod.unidades * prod.precio;
      html += "</div>";
      html += "<div class='producto-carrito__borrar' id=" + prod.id + ">";
      html += "<i class='fas fa-trash'></i>";
      html += "</div>";
      html += "</div>";
    });
    html += "<div class='carrito__total'>";
    html += precioTotal;
    html += "</div>";
    html += "<div class='carrito__boton-comprar'>";
    html += "<div id='botonComprar' class='boton boton--primario'>Comprar</div>";
    html += "</div>";
  }
  $(".carrito").html(html);
  $("#modalCarrito").modal("toggle");
}

function anyadirProducto(e) {
  e.stopPropagation();
  let nombreProducto = $(this)
    .parents()
    .find("#nombreProducto")[
      $(this)
      .parents()
      .find("#nombreProducto").length - 1
    ].textContent;

  let producto = productosGlobal.find(
    element => element.nombre == nombreProducto
  );
  // SE QUEDA MAL AQUÍ, AQUÍ LA IMAGEN SE PONE EL UNDEFINED DELANTE
  carrito.anyadirProducto(producto);
}

function toggleModalProducto() {
  let nombreProducto = $(this)
    .find(".producto__nombre")
    .text();
  let informacionProducto = $(this)
    .find(".producto__informacion")
    .text();
  let precioProducto = $(this)
    .find(".producto__precio")
    .text();
  let imagenProducto = $(this)
    .find(".producto__imagen")
    .attr("src");

  $(".modal-producto__header").text(nombreProducto);
  let html =
    "<img class = 'modal-imagen' src = '" +
    imagenProducto +
    "'></img>" +
    "<p>" +
    informacionProducto +
    "</p>" +
    "<p>" +
    precioProducto +
    "</p>";
  $(".modal-producto__body").html(html);

  $("#modalProducto").modal("toggle");
}

function toggleModalRegistro() {
  $("#modalRegistro").modal("toggle");
}

function toggleLogin() {
  $("#modalLogIn").modal("toggle");
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
  window.localStorage.removeItem("Usuario");
  window.history.pushState({
      categoria: urlCliente
    },
    url,
    urlCliente
  );
  leerUrl();
}

function historialCarritos(idUsuario) {
  $.ajax({
    url: urlServidor + "/historialCarritos/" + idUsuario,
    success: function (response) {
      console.log(response);
    }
  });

}

function checkToken() {

  let token = "Bearer " + window.localStorage.getItem("Usuario");

  if (window.localStorage.getItem("Usuario") != null) {
    $.ajax({
      type: "POST",
      url: urlServidor + "/auth/me",
      headers: {
        Authorization: token
      }
    }).done(function (response) {
      checkCarrito();

      carrito.idUsuario = response.id;
      abrirNotificacion("Bienvenido " + response.nickName + "!");
      let html = "";
      html += "<div class='carrito'>";
      html += "<i class='fas fa-shopping-cart'></i>";
      html += "</div>";
      html = "<div class='usuario'>";

      html +=
        "<img class='usuario__imagen' src='http://127.0.0.1:8000/imagenes/usuarios/" +
        response.avatar +
        "'></img>";
      html += "<div class='usuario__nick'>";
      html += response.nickName;
      html += "</div>";

      html += "<div class='dropdown-usuario'>";
      html += "<div id='botonPerfil' class='boton boton--terciario'>";
      html += "Perfil";
      html += "</div>";
      html += "<div id='botonLogout' class='boton boton--terciario'>";
      html += "Logout";
      html += "</div>";
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
    email: usuario,
    password: password
  };

  enviarLoginServidor(objetoUsuario);
}

function enviarLoginServidor(objetoUsuario) {
  $.post(urlServidor + "/auth/login", objetoUsuario)
    .done(function (response) {
      window.localStorage.setItem("Usuario", response.access_token);
      $("#modalLogIn").modal("hide");
      abrirNotificacion("Bienvenido " + response.user.nickName + "!");
      carrito.idUsuario = response.user.id;
      let html = "";
      html = "<div class='usuario'>";
      html +=
        "<img class='usuario__imagen' src='http://127.0.0.1:8000/imagenes/usuarios/" +
        response.user.avatar +
        "'></img>";
      html += "<div class='usuario__nick'>";
      html += response.user.nickName;
      html += "</div>";

      html += "<div class='dropdown-usuario'>";
      html += "<div id='botonPerfil' class='boton boton--terciario'>";
      html += "Perfil";
      html += "</div>";
      html += "<div id='botonLogout' class='boton boton--terciario'>";
      html += "Logout";
      html += "</div>";
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
  toggleModalRegistro();
  // window.location = urlCliente + "/registro.html";
  // window.location.replace("registro.html");
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
  }).done(function (response) {
    let html = "";
    html += "<div class='menu-lateral__contenedor-enlaces'>";
    response.data.forEach(element => {
      // html += "<div class='menu-lateral__item'><a href='#' class='menu-lateral__enlace'>" + element.nombre + "</a></div>"

      html +=
        "<a href='javascript:void(0)'class='menu-lateral__enlace' id='" +
        element.id +
        "'><i class='" +
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
    console.log("hecho carousel");
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

    $(".carousel").carousel({
      "data-pause": false,
      interval: 3000
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

function cargarProductosCategoria() {
  toggleHamburguesa();

  let categoria = this.textContent;

  let url = "/categorias/" + categoria + "/productos";
  $.ajax({
      type: "GET",
      url: urlServidor + url
    })
    .done(function (response) {
      window.history.pushState({
          categoria: url
        },
        url,
        urlCliente + url
      );

      let numRedes = response.data.length;
      let html =
        "<div class='l-columnas l-columnas--4-columnas l-columnas--gap-l l-columnas--tablet-gap-xs l-columnas--tablet-2-columnas l-columnas@mobile-gap-m l-columnas@mobile-1-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        let producto = new Producto(
          element.id,
          element.nombre,
          element.precio,
          element.descripcion,
          response.rutaServerImagenes + element.imagen
        );
        console.log("CARGAR PRODUCTOS: " + element.imagen);

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
        html +=
          "<div id='nombreProducto' class='producto__nombre'>" +
          element.nombre +
          "</div>";
        html +=
          "<div class='producto__informacion'>" +
          element.descripcion +
          "</div>";
        html +=
          "<div class='producto__precio'>Precio: " + element.precio + "€</div>";
        html +=
          "<div class='producto__boton'><div id='botonAnyadirCarrito' class='boton boton--primario'>Añadir al carrito</div></div>";
        html += "</div>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
      //alert(location.href);
    })
    .fail(function () {});
}

function cargarProductos() {
  let url = "/productos";
  $.ajax({
      type: "GET",
      url: urlServidor + url
    })
    .done(function (response) {
      window.history.pushState({
          categoria: url
        },
        url,
        urlCliente + url
      );

      let html =
        "<div class='l-columnas l-columnas--4-columnas l-columnas--gap-l l-columnas--tablet-gap-xs l-columnas--tablet-2-columnas l-columnas@mobile-gap-m l-columnas@mobile-1-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        let producto = new Producto(
          element.id,
          element.nombre,
          element.precio,
          element.descripcion,
          response.rutaImagenesServer + element.imagen
        );

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
          producto.imagen +
          "'>";
        html +=
          "<div id='nombreProducto' class='producto__nombre'>" +
          element.nombre +
          "</div>";
        html +=
          "<div class='producto__informacion'>" +
          element.descripcion +
          "</div>";
        html +=
          "<div class='producto__precio'>Precio: " + element.precio + "€</div>";
        html +=
          "<div class='producto__boton'><div id='botonAnyadirCarrito' class='boton boton--primario'>Añadir al carrito</div></div>";
        html += "</div>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
      //alert(location.href);
    })
    .fail(function () {});
}

function cargarRecetas() {
  let url = "/recetas";
  $.ajax({
      type: "GET",
      url: urlServidor + url
    })
    .done(function (response) {
      window.history.pushState({
          categoria: url
        },
        url,
        urlCliente + url
      );

      let html =
        "<div class='l-columnas l-columnas--4-columnas  l-columnas--gap-l l-columnas--tablet-2-columnas l-columnas@mobile-1-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        html += "<div class='recetas'>";
        html +=
          "<img class='recetas__imagen' src='" +
          urlImagenes +
          response.rutaImagenesServer +
          element.imagen +
          "'>";
        html += "<div class='recetas__nombre'>" + element.nombre + "</div>";

        html +=
          "<a href='" +
          element.enlace +
          "' class='recetas__enlace'><div class='boton boton--primario'> Enlace Web </div></a>";
        html += "</div>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
      //alert(location.href);
    })
    .fail(function () {});
}

function cargarCategoriasBoton() {
  let url = "/categorias";
  $.ajax({
      type: "GET",
      url: urlServidor + url
    })
    .done(function (response) {
      window.history.pushState({
          categoria: url
        },
        url,
        urlCliente + url
      );
      let numRedes = response.data.length;
      let html =
        "<div class='l-columnas l-columnas--4-columnas  l-columnas--gap-l l-columnas--tablet-gap-xs l-columnas--tablet-2-columnas l-columnas@mobile-gap-m l-columnas@mobile-1-columnas'>";
      response.data.forEach(element => {
        html += "<div class='categorias'>";

        html +=
          "<img class='categorias__imagen' src='" +
          urlImagenes +
          response.rutaImagenesServer +
          element.imagen +
          "'>";
        console.log(urlImagenes);
        console.log(response.rutaServerImagenes);
        console.log(element.imagen);

        html += "<div class='categorias__nombre'>" + element.nombre + "</div>";

        html += "</div>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
      //alert(location.href);
    })
    .fail(function () {});
}

function cargarPaginaError(prueba) {
  console.log("ENTRA EN ERROR");
  let html = "<div class='error'>";

  html += "<div class='error__imagen'>";
  html += "<div class='errorImagen404'>";

  html += "<div class='errorImagen404__numero1'>";
  html += "<h1>4</h1>";
  html += "</div>";

  html += "<div class='errorImagen404__imagenTomate'>";
  html += "<img src='assets/img/tomateError.png'>";
  html += "</div>";

  html += "<div class='errorImagen404__numero2'>";
  html += "<h1>4</h1>";
  html += "</div>";

  html += "</div>";
  html += "</div>";

  html += "<div class='error__mensaje'>";
  html += "<p> ERROR </p>";
  html += "<p> PÁGINA NO ENCONTRADA </p></br>";
  html += "<p> La página " + prueba + " no existe o no se encuentra </p>";
  html += "</div>";

  html += "</div>";

  $(".l-page__content").html("");
  $(".l-page__content").html(html);
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
  console.log("leer url");

  let url = location.href.split("Grupo2/")[1];
  console.log(url);
  if (typeof url !== "undefined") {
    let prueba = url.split("/")[0];
    console.log("URL: " + url);
    console.log("PRUEBA: " + prueba);
    switch (prueba) {
      case "":
        cargarPrincipal();
        cargarImagenesCarousel();
        break;
      case "categorias":
        console.log("entrado en cateogiras");
        // HACER IF PARA CARGAR CATEGORIAS Y PRODUCTOS POR CATEGORIA
        // cargarProductosCategoria("/" + url);
        cargarCategoriasBoton();
        break;
      case "productos":
        cargarProductos();
        break;
      case "recetas":
        cargarRecetas();
        break;
      default:
        cargarPaginaError(prueba);
        break;
    }
  } else {
    cargarPrincipal();
    cargarImagenesCarousel();
  }
}

window.addEventListener("hashchange", leerUrl);
window.addEventListener("load", leerUrl);

function registrar(e) {
  e.preventDefault();

  let usuario = $("#inputEmail").val();
  let password = $("#inputPassword1").val();
  let objetoUsuario = {
    email: usuario,
    password: password
  };
  var formData = new FormData(this);
  formData.append("nombre", $("#inputNombre").val());
  formData.append("apellidos", $("#inputApellidos").val());
  formData.append("email", $("#inputEmail").val());
  formData.append("nickName", $("#inputNick").val());
  formData.append("password1", $("#inputPassword1").val());
  formData.append("password2", $("#inputPassword2").val());
  formData.append("avatar", $("#inputAvatar")[0].files[0]);

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
      abrirNotificacion("Registro fallido");
    });
}

function cargarPrincipal() {
  let html = "";
  html += '<div class="portada">';
  html += '<div class="portada__carousel">';
  html +=
    '<div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel" data-interval="5000" data-pause="false">';
  html += '<div id="carousel" class="carousel-inner" ></div >';
  html += "</div >";
  html += "</div >";
  html += '<div class="portada__paneles">';
  html +=
    ' <div class="l-columnas l-columnas--3-columnas l-columnas--gap-xl l-columnas--tablet-gap-m l-columnas--tablet-2-columnas l-columnas@mobile-gap-xs l-columnas@mobile-1-columnas">';
  html += '  <div class="l-columnas__item">';
  html +=
    '     <div id="botonCargarCategorias" class="boton boton--primario">Categorias</div>';
  html += "     </div>";
  html += '    <div class="l-columnas__item">';
  html +=
    '      <div id="botonCargarProductos" class="boton boton--primario">Productos</div>';
  html += "    </div>";
  html += '    <divclass="l-columnas__item">';
  html +=
    '      <div id="botonCargarRecetas" class="boton boton--primario"> Recetas</div>';
  html += "</div>";
  html += "  </div>";
  html += "   </div>";
  html += " </div > ";
  $(".l-page__content").html(html);
}

//BARRA DE BÚSQUEDA

$(".barra-busqueda__input").keyup(function (e) {
  let consulta = $(".barra-busqueda__input").val();

  if (consulta == "") {
    cargarProductos();
  }
  let url = "/barra/" + consulta;
  console.log(url);

  $.ajax({
      type: "GET",
      url: urlServidor + url
    })
    .done(function (response) {
      window.history.pushState({
          categoria: url
        },
        url,
        urlCliente + url
      );

      let html =
        "<div class='l-columnas l-columnas--4-columnas l-columnas--gap-l'>";

      if (response.data.length != 0) {
        response.data.forEach(element => {
          let producto = new Producto(
            element.id,
            element.nombre,
            element.precio,
            element.descripcion,
            response.rutaServerImagenes + element.imagen
          );

          let existe = false;
          productosGlobal.forEach(element => {
            if (element.id == producto.id) {
              existe = true;
            }
          });
          if (!existe) {
            productosGlobal.push(producto);
          }
          $(".l-page__content").html("");

          html += "<div class='producto'>";
          html +=
            "<img class='producto__imagen' src='" +
            urlImagenes +
            response.rutaImagenesServer +
            element.imagen +
            "'>";
          html +=
            "<div id='nombreProducto' class='producto__nombre'>" +
            element.nombre +
            "</div>";
          html +=
            "<div class='producto__informacion'>" +
            element.descripcion +
            "</div>";
          html +=
            "<div class='producto__precio'>Precio: " + element.precio + "€</div>";
          html +=
            "<div class='producto__boton'><div id='botonAnyadirCarrito' class='boton boton--primario'>Añadir al carrito</div></div>";
          html += "</div>";

          $(".l-page__content").html(html);
        });
      } else {
        $(".l-page__content").html("");

        let html =
          "<div class='l-columnas l-columnas--1-columnas l-columnas--gap-l'>"; /*div general que contenga todos los div de productos*/
        html += "<div class='productoError'>";
        html +=
          "<div class='productoError__informacion'>Producto no encontrado</div>";
        html += "</div>";
        html += "</div>";

        $(".l-page__content").html(html);
      }

      //alert(location.href);
      console.log(url);
    });
});