import { urlCliente, urlImagenes, urlServidor } from "../../config.js";

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
  aumentarUnidades(idProducto) {
    let producto = this.productos.find(prod => prod.id == idProducto);
    producto.unidades++;
    cargarProductosCarrito();
  }
  disminuirUnidades(idProducto) {
    let producto = this.productos.find(prod => prod.id == idProducto);
    producto.unidades--;
    if (producto.unidades == 0) {
      this.borrarProducto(new Producto(idProducto, "", "", "", "", ""));
    }
    cargarProductosCarrito();
  }
  anyadirProducto(producto) {
    if (
      this.productos.includes(
        this.productos.find(prod => prod.id == producto.id)
      )
    ) {
      let repetido = this.productos.find(prod => prod.id == producto.id);
      repetido.unidades++;
    } else {
      this.productos.push(producto);
    }
    this.actualizarContador();
    enviarCarritoTemporal();
  }

  borrarProducto(producto) {
    let idProducto = producto.id;
    let prod = this.productos.find(prod => prod.id == idProducto);
    prod.unidades = 1;
    this.productos.splice(prod, 1);

    this.actualizarContador();
    cargarProductosCarrito();
    enviarCarritoTemporal();
  }

  actualizarContador() {
    $(".icono-carrito__num-productos").text(this.productos.length);
  }
}

let productosGlobal = [];
let nombreProductoDrag;
let carrito = new Carrito();
let mostradaBarraBusqueda = false;

$(document).ready(function() {
  //BARRA DE BÚSQUEDA RESPONSIVE

  checkearTamanyo();
  checkToken();
  cargarCategorias();
  cargarRedesSociales();

  //event listeners
  $(document).on("click", "#botonCargarCategorias", cargarCategoriasBoton);
  $(document).on("click", "#botonCargarProductos", cargarProductos);
  $(document).on("click", "#botonCargarRecetas", cargarRecetas);
  $(document).on("click", "#botonDatosUsuarioPerfil", cargarDatosUsuarioPerfil);
  $(document).on(
    "click",
    "#botonDatosUsuarioHistorial",
    cargarDatosUsuarioHistorial
  );
  $(document).on("click", ".botonAbrirProductosCarrito", abrirProductosCarrito);

  $("#botonYaTengoCuenta").on("click", yaTengoCuenta);
  $(".menu-lateral__hamburguesa").on("click", toggleHamburguesa);
  $("#botonRegistrarse").on("click", abrirRegistro);
  $("#botonLogin").on("click", logIn);
  $(document).on("click", ".producto", toggleModalProducto);
  $(document).on("click", "#botonLogout", logout);
  $(document).on("click", "#botonPerfil", cargarPaginaPerfil);
  $("#formularioRegistro").on("submit", registrar);
  $("#volverAtrasRegistro").attr("href", urlCliente);
  $(".icono-carrito").on("click", cargarProductosCarrito);
  $(document).on("click", "#logoHeader", function() {
    window.history.pushState(
      {
        categoria: urlCliente
      },
      urlCliente,
      urlCliente
    );
    leerUrl();
  });
  $(document).on("click", "#botonComprar", comprarCarrito);
  $(document).on("click", "#botonAnyadirCarrito", anyadirProducto);
  $(document).on("click", ".menu-lateral__enlace", cargarProductosCategoria);
  $(document).on("click", ".categorias", cargarProductosCategoria);
  $(document).on("click", ".usuario", cargarDropDownUsuario);
  $(document).on("click", "#disminuirUnidad", disminuirUnidad);
  $(document).on("click", "#aumentarUnidad", aumentarUnidad);
  $(document).on("click", ".producto-carrito__borrar", function(e) {
    carrito.borrarProducto(this);
  });
  $("#botonAbrirLogIn").on({
    click: toggleLogin
  });
  $(".log-in").on({
    mouseleave: toggleLogin
  });
  $(document).on("keyup", ".barra-busqueda__input", barraBusqueda);
  $(document).on("drop", ".icono-carrito", drop);
  // $(".icono-carrito").on("drop", anyadirProducto);
  // $(".icono-carrito").on("dragover", allowDrop);
  $(document).on("dragover", ".icono-carrito", allowDrop);
  $(document).on("dragstart", ".producto", drag);
});

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  let comprobacion = ev.originalEvent.dataTransfer.getData("text");
  if (comprobacion == "producto") {
    let producto = productosGlobal.find(
      element => element.nombre.toUpperCase() == nombreProductoDrag
    );
    carrito.anyadirProducto(producto);
  }
}

function disminuirUnidad() {
  console.log("disminuir");
  let idProducto = $(this)
    .parent()
    .parent()[0].id;
  console.log(idProducto);
  carrito.disminuirUnidades(idProducto);
}

function aumentarUnidad() {
  console.log("aumentar");
  let idProducto = $(this)
    .parent()
    .parent()[0].id;
  console.log(idProducto);
  carrito.aumentarUnidades(idProducto);
}

function abrirProductosCarrito() {
  let boton = $(this)
    .parent()
    .find(".botonAbrirProductosCarrito");

  if (boton.html().includes('<i class="fas fa-plus"></i>')) {
    //cerrar todos primero antes de abrir uno
    $(".botonAbrirProductosCarrito").html('<i class="fas fa-plus"></i>');
    $(".carrito-historial__total").hide();
    $(".carrito-historial__producto").hide();
    boton.html('<i class="fas fa-minus"></i>');

    $(this)
      .parent()
      .parent()
      .parent()
      .find(".carrito-historial__producto")
      .css("display", "flex");
    $(this)
      .parent()
      .parent()
      .parent()
      .find(".carrito-historial__total")
      .css("display", "flex");
  } else {
    boton.html('<i class="fas fa-plus"></i>');
    $(this)
      .parent()
      .parent()
      .parent()
      .find(".carrito-historial__producto")
      .hide();
    $(this)
      .parent()
      .parent()
      .parent()
      .find(".carrito-historial__total")
      .hide();
  }
}

function cargarDatosUsuarioPerfil() {
  let token = "Bearer " + window.localStorage.getItem("Usuario");
  let html = "";

  if (window.localStorage.getItem("Usuario") != "") {
    $.ajax({
      type: "POST",
      url: urlServidor + "/auth/me",
      headers: {
        Authorization: token
      }
    })
      .done(function(response) {
        html +=
          "<div class='l-perfil padding--xl padding@tablet--m padding@mobile--xs'>";
        html +=
          "<div class='datos-usuario padding@tablet--m padding@mobile--xs'>";
        html +=
          "<img class='datos-usuario__imagen' src='" +
          urlImagenes +
          "/imagenes/usuarios/" +
          response.avatar +
          "'>";
        html += "<div class='datos-usuario__datos'>";
        html +=
          "<div class='datos-usuario__nick'>" + response.nickName + "</div>";
        html +=
          "<div class='datos-usuario__email'>" + response.email + "</div>";
        html +=
          "<div class='datos-usuario__nombre'>" +
          response.apellidos +
          ", " +
          response.nombre +
          "</div>";
        html += "</div>";
        html += "<div class='datos-usuario__contenedor-enlaces'>";
        html +=
          "<a id='botonDatosUsuarioPerfil' href='javascript:void(0)' class='datos-usuario__enlace'>Perfil</a>";
        html +=
          "<a id='botonDatosUsuarioHistorial' href='javascript:void(0)' class='datos-usuario__enlace'>Historial de compras</a>";
        html += "</div>";

        html += "</div>";
        html += "</div>";

        $(".l-page__content").html(html);
      })
      .fail(function(response) {
        console.log("fail del me");
        console.log(response);
      });
  }
}

function cargarDatosUsuarioHistorial() {
  $.ajax({
    type: "GET",
    url: urlServidor + "/historialCarritos/" + carrito.idUsuario
  }).done(function(response) {
    let arrayCarritosHistorial = response.data;
    let html = "";
    let contador = 1;
    arrayCarritosHistorial.forEach(carrito => {
      html += "<div class='carrito-historial'>";
      html += "<div class='carrito-historial__header'>";
      let fecha = new Date(carrito.fechaCompra);

      let meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
      ];
      html +=
        "#" +
        contador +
        ", " +
        fecha.getDate() +
        " de " +
        meses[fecha.getMonth()] +
        " de " +
        fecha.getFullYear();
      contador++;
      html +=
        "<div class='carrito-historial__abrir-productos'><span class='botonAbrirProductosCarrito'><i class='fas fa-plus'></i></span></div>";
      html += "</div>";
      html += "<div class='carrito-historial__contenedor-productos'>";
      let total = 0;
      carrito.productos.forEach(prod => {
        html +=
          "<div class='carrito-historial__producto'>x" +
          prod.unidades +
          "    " +
          prod.nombre;
        html +=
          "<div class='carrito-historial__producto-precio'>" +
          prod.precio * prod.unidades +
          "</div>";
        html += "</div>";
        total += prod.precio * prod.unidades;
      });
      html += "<div class='carrito-historial__total'>" + total + "</div>";
      html += "</div>";
      html += "</div>";
      html += "</div>";
    });
    $(".datos-usuario__datos").html(html);
  });
}

function cargarDropDownUsuario() {
  $(".dropdown-usuario").toggle();
}

function yaTengoCuenta() {
  toggleModalRegistro();
  toggleLogin();
}

function enviarCarritoTemporal() {
  carrito.fechaCompra = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  $.ajax({
    type: "POST",
    url: urlServidor + "/insertarCarritoTemporal",
    data: carrito
  })
    .done(function(response) {})
    .fail(function(response) {
      console.log("fail");
    });
}

function comprarCarrito(params) {
  carrito.fechaCompra = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  $.ajax({
    type: "POST",
    url: urlServidor + "/comprarCarrito",
    data: carrito
  })
    .done(function(response) {
      if (response.error !== "null") {
        $("#modalCarrito").modal("hide");
        abrirNotificacion("Necesitas iniciar sesión para comprar");
        toggleModalRegistro();
      } else {
        carrito.productos = [];
        carrito.actualizarContador();
        $("#modalCarrito").modal("hide");
        abrirNotificacion("Carrito comprado");
      }
    })
    .fail(function(response) {});
}

function checkCarrito(idUsuario) {
  $.ajax({
    type: "GET",
    url: urlServidor + "/carrito/" + idUsuario
  })
    .done(function(response) {
      console.log(response);
      if (!typeof response.error == undefined) {
      } else {
        let carritoTemporalServidor = response.data[0];
        carrito = new Carrito();
        carrito.idUsuario = carritoTemporalServidor.idUsuario;
        carrito.fechaCompra = carritoTemporalServidor.fechaCompra;
        carrito.productos = carritoTemporalServidor.productos;
        carrito.actualizarContador();
        console.log(carrito);
      }
    })
    .fail(function(response) {});
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
    html += "<div class='l-columnas l-columnas--1-columnas'>";
    carrito.productos.forEach(prod => {
      html += "<div class='l-columnas__item'>";
      html += "<div class='producto-carrito' id='" + prod.id + "'>";

      html +=
        "<img src='" +
        urlImagenes +
        prod.imagen +
        "' class='producto-carrito__imagen'>";

      html += "<div class='producto-carrito__nombre'>";
      html += prod.nombre;
      html += "</div>";

      html += "<div class='producto-carrito__unidades'>";
      html +=
        "<i id='disminuirUnidad' class='fas fa-minus producto-carrito__icono-unidad'></i>";
      html += prod.unidades;
      html +=
        "<i id='aumentarUnidad' class='fas fa-plus producto-carrito__icono-unidad'></i>";
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
      html += "</div>";
    });
    html += "</div>";

    html += "<div class='carrito__total'>";
    html += precioTotal;
    html += "</div>";

    html += "<div class='carrito__boton-comprar'>";
    html +=
      "<div id='botonComprar' class='boton boton--primario'>Comprar</div>";
    html += "</div>";
  }
  $(".carrito").html(html);
  $("#modalCarrito").modal("show");
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

function cargarPaginaPerfil() {
  let url = "/perfil";
  window.history.pushState(
    {
      categoria: url
    },
    url,
    urlCliente + url
  );

  cargarDatosUsuarioPerfil();
}

function logout() {
  window.localStorage.removeItem("Usuario");
  window.history.pushState(
    {
      categoria: urlCliente
    },
    urlCliente,
    urlCliente + "/"
  );
  location.reload();
  leerUrl();
}

function historialCarritos(idUsuario) {
  $.ajax({
    url: urlServidor + "/historialCarritos/" + idUsuario,
    type: "GET"
  }).done(function(response) {});
}

function checkToken() {
  let token = "Bearer " + window.localStorage.getItem("Usuario");

  if (window.localStorage.getItem("Usuario") != "") {
    $.ajax({
      type: "POST",
      url: urlServidor + "/auth/me",
      headers: {
        Authorization: token
      }
    })
      .done(function(response) {
        carrito.idUsuario = response.id;
        abrirNotificacion("Bienvenido " + response.nickName + "!");
        checkCarrito(response.id);
        let html = "";
        html += "<div class='carrito'>";
        html += "<i class='fas fa-shopping-cart'></i>";
        html += "</div>";
        html = "<div class='usuario'>";

        html +=
          "<img class='usuario__imagen' src='" +
          urlImagenes +
          "/imagenes/usuarios/" +
          response.avatar +
          "'></img>";

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
      .fail(function(response) {
        console.log("fail del me");
        console.log(response);
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
    .done(function(response) {
      window.localStorage.setItem("Usuario", response.access_token);
      $("#modalLogIn").modal("hide");
      checkCarrito(response.user.id);
      abrirNotificacion("Bienvenido " + response.user.nickName + "!");
      carrito.idUsuario = response.user.id;
      let html = "";
      html = "<div class='usuario'>";
      html +=
        "<img class='usuario__imagen' src='" +
        urlImagenes +
        "/imagenes/usuarios/" +
        response.user.avatar +
        "'></img>";

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
    .fail(function() {
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
  }).done(function(response) {
    let html = "";
    html += "<div class='menu-lateral__contenedor-enlaces'>";
    response.data.forEach(element => {
      // html += "<div class='menu-lateral__item'><a href='#' class='menu-lateral__enlace'>" + element.nombre + "</a></div>"

      html +=
        "<a href='javascript:void(0)'class='menu-lateral__enlace' id='" +
        element.nombre +
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
  }).done(function(response) {
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
  }).done(function(response) {
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
        "' target = '_blank' class='red'><i class='red__icono " +
        element.icono +
        "'></i>" +
        element.nombre +
        "</a>";
    });
    html += "</div>";
    $(".footer__enlaces").append(html);
  });
}

function cargarProductosCategoria(event, categoria = "undefined") {
  let desde = $(this)[0].className;
  if (categoria === "undefined" && desde == "menu-lateral__enlace") {
    toggleHamburguesa();
    categoria = this.id;
  } else if (categoria === "undefined" && desde == "categorias") {
    categoria = this.id;
  }

  let url = "/categorias/" + categoria + "/productos";
  $.ajax({
    type: "GET",
    url: urlServidor + url
  }).done(function(response) {
    window.history.pushState(
      {
        categoria: url
      },
      url,
      urlCliente + url
    );

    let numRedes = response.data.length;
    let html =
      "<div class='l-columnas l-columnas--4-columnas l-columnas--gap-l l-columnas@tablet-gap-xs l-columnas--tablet-2-columnas l-columnas@mobile-gap-m l-columnas@mobile-1-columnas'>"; /*div general que contenga todos los div de productos*/
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
        "<div class='producto__informacion'>" + element.descripcion + "</div>";
      html += "<div class='producto__precio'>" + element.precio + "€</div>";
      html +=
        "<div class='producto__boton'><div id='botonAnyadirCarrito' class='boton boton--primario'>Añadir al carrito</div></div>";
      html += "</div>";
    });
    html += "</div>";
    $(".l-page__content").html("");
    $(".l-page__content").html(html);
    //alert(location.href);
  });
}

function cargarProductos() {
  let url = "/productos";
  $.ajax({
    type: "GET",
    url: urlServidor + url
  })
    .done(function(response) {
      window.history.pushState(
        {
          categoria: url
        },
        url,
        urlCliente + url
      );

      let html =
        "<div class='l-columnas l-columnas--4-columnas l-columnas--gap-l l-columnas--tablet-gap-xs l-columnas@tablet-2-columnas l-columnas@mobile-gap-m l-columnas@mobile-1-columnas'>"; /*div general que contenga todos los div de productos*/
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

        html += "<div class='producto' draggable='true'>";
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
        html += "<div class='producto__precio'>" + element.precio + "€</div>";
        html +=
          "<div class='producto__boton'><div id='botonAnyadirCarrito' class='boton boton--primario'>Añadir al carrito</div></div>";
        html += "</div>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
      //alert(location.href);
    })
    .fail(function() {});
}

function drag(ev) {
  ev.originalEvent.dataTransfer.setData("text", "producto");
  nombreProductoDrag = $(ev.currentTarget).find("#nombreProducto")[0].innerText;
}

function cargarRecetas() {
  let url = "/recetas";
  $.ajax({
    type: "GET",
    url: urlServidor + url
  })
    .done(function(response) {
      window.history.pushState(
        {
          categoria: url
        },
        url,
        urlCliente + url
      );

      let html =
        "<div class='l-columnas l-columnas--4-columnas  l-columnas--gap-l l-columnas--tablet-2-columnas l-columnas@mobile-1-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        html +=
          "<a href='" +
          element.enlace +
          "' target = '_blank' style='text-decoration: none'>";
        html += "<div class='recetas'>";
        html +=
          "<img class='recetas__imagen' src='" +
          urlImagenes +
          response.rutaImagenesServer +
          element.imagen +
          "'>";
        html += "<div class='recetas__nombre'>" + element.nombre + "</div>";
        html += "<div class='recetas__enlace'> Ver receta </div>";
        html += "</div>";
        html += "</a>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
      //alert(location.href);
    })
    .fail(function() {});
}

function cargarCategoriasBoton() {
  let url = "/categorias";
  $.ajax({
    type: "GET",
    url: urlServidor + url
  })
    .done(function(response) {
      window.history.pushState(
        {
          categoria: url
        },
        url,
        urlCliente + url
      );
      let numRedes = response.data.length;
      let html =
        "<div class='l-columnas l-columnas--4-columnas  l-columnas--gap-l l-columnas--tablet-gap-xs l-columnas--tablet-2-columnas l-columnas@mobile-gap-m l-columnas@mobile-1-columnas'>";
      response.data.forEach(element => {
        html += "<div class='categorias' id=" + element.nombre + ">";

        html +=
          "<img class='categorias__imagen' src='" +
          urlImagenes +
          response.rutaImagenesServer +
          element.imagen +
          "'>";

        html += "<div class='categorias__nombre'>" + element.nombre + "</div>";

        html += "</div>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
      //alert(location.href);
    })
    .fail(function() {});
}

function cargarPaginaError(prueba) {
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
  setTimeout(function() {
    $("#notificacion").removeClass("notificacion--show");
  }, 3000);
}

// function cargarPagina() {
//   window.onpopstate()
// }

function leerUrl() {
  $(".barra-busqueda__input").val("");
  let url = location.href.split(urlCliente + "/")[1];
  if (typeof url !== "undefined") {
    let paginaCarga = url.split("/")[0];
    let separador = paginaCarga.split("=")[0];
    switch (separador) {
      case "":
        cargarPrincipal();
        cargarImagenesCarousel();
        break;
      case "categorias":
        let categoria = url.split("/")[1];
        if (categoria) {
          cargarProductosCategoria(event, categoria);
        } else {
          cargarCategoriasBoton();
        }
        break;
      case "productos":
        cargarProductos();
        break;
      case "recetas":
        cargarRecetas();
        break;
      case "busqueda":
        let busqueda = paginaCarga.split("=")[1];
        barraBusqueda(event, busqueda);
        $(".barra-busqueda__input").val(busqueda);
        break;
      case "perfil":
        cargarPaginaPerfil();
        break;
      default:
        cargarPaginaError(paginaCarga);
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
    .done(function(res) {
      enviarLoginServidor(objetoUsuario);
      $("#modalRegistro").modal("hide");
      abrirNotificacion("Registro completado");
    })
    .fail(function(res) {
      abrirNotificacion("Registro fallido");
    });
}

function cargarPrincipal() {
  let html = "";
  html += '<div class="portada">';
  html +=
    '<div class="portada__carousel padding@tablet--m padding@mobile--xs">';
  html +=
    '<div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel" data-interval="5000" data-pause="false">';
  html += '<div id="carousel" class="carousel-inner" ></div >';
  html += "</div >";
  html += "</div >";
  html += '<div class="portada__paneles padding@tablet--m padding@mobile--xs">';
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
function barraBusqueda(event, consulta = "undefined") {
  if (consulta == "undefined") {
    consulta = $(".barra-busqueda__input").val();
  }
  let html;
  if (consulta === "") {
    cargarProductos();
  }
  let url = "/busqueda=" + consulta;
  $.ajax({
    type: "GET",
    url: urlServidor + url
  })
    .done(function(response) {
      window.history.pushState(
        {
          categoria: url
        },
        url,
        urlCliente + url
      );

      if (response.data.length != 0) {
        html =
          "<div class='l-columnas l-columnas--4-columnas l-columnas--gap-l l-columnas--tablet-gap-xs l-columnas--tablet-2-columnas l-columnas@mobile-gap-m l-columnas@mobile-1-columnas'>";
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
          html += "<div class='producto__precio'>" + element.precio + "€</div>";
          html +=
            "<div class='producto__boton'><div id='botonAnyadirCarrito' class='boton boton--primario'>Añadir al carrito</div></div>";
          html += "</div>";
        });
      } else {
        $(".l-page__content").html("");

        let html =
          "<div class='l-columnas l-columnas--1-columnas l-columnas--gap-l l-columnas--tablet-gap-xs l-columnas--tablet-2-columnas l-columnas@mobile-gap-m l-columnas@mobile-1-columnas'>"; /*div general que contenga todos los div de productos*/
        html += "<div class='productoError'>";
        html +=
          "<div class='productoError__informacion'>Producto no encontrado</div>";
        html += "</div>";
        html += "</div>";

        $(".l-page__content").html(html);
      }

      $(".l-page__content").html(html);
    })
    .fail(function(response) {});
}

function mostrarOcultarBusqueda() {
  if (!mostradaBarraBusqueda) {
    $(".barra-busqueda__input").show("slow");
    mostradaBarraBusqueda = true;
    $(".barra-busqueda__boton").css({
      "border-left": "",
      "border-radius": ""
    });
  } else {
    $(".barra-busqueda__input").hide("slow");
    $(".barra-busqueda__boton").css({
      "border-left": "1px solid #f8991d",
      "border-radius": "5px"
    });
    mostradaBarraBusqueda = false;
  }
}

function checkearTamanyo() {
  if (window.matchMedia("(max-width: 600px)").matches) {
    $(document).on("click", ".barra-busqueda__boton", mostrarOcultarBusqueda);
    $(".barra-busqueda__boton").css({
      "border-left": "1px solid #f8991d",
      "border-radius": "5px"
    });
  }
}
