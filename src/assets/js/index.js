$(document).ready(function () {
  checkToken();
  cargarCategorias();
  cargarImagenesCarousel();
  cargarRedesSociales();

  //event listeners
  $(".menu-lateral__hamburguesa").on("click", toggleHamburguesa);
  $("#botonRegistrarse").on("click", abrirRegistro);
  $("#botonLogin").on("click", logIn);
  $("#formularioRegistro").on("submit", registrar);
  $(document).on("click", "#botonLogout", logout);

  $("#botonAbrirLogIn").on({
    click: toggleLogin
  });
  $(".log-in").on({
    mouseleave: toggleLogin
  })

  window.addEventListener('popstate', function (event) {
    console.log(event);
    //$('.page-content').html(state);        
  });
});

function toggleLogin() {
  let altura = document.getElementById("botonAbrirLogIn").getBoundingClientRect().height;
  let posY = document.getElementById("botonAbrirLogIn").getBoundingClientRect().y;

  if ($(".log-in").hasClass("log-in__fade-in")) {
    $(".log-in").removeClass("log-in__fade-in");
    $(".log-in").addClass("log-in__fade-out");
  } else {
    $(".log-in").css({
      top: posY + altura + 20,
      right: 20
    });
    $(".log-in").removeClass("log-in__fade-out");
    $(".log-in").addClass("log-in__fade-in");
  }
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
        url: "http://127.0.0.1:8000/api/auth/me",
        headers: {
          "Authorization": token
        }
      })
      .done(function (response) {
        abrirNotificacion("Bienvenido " + response.nickName + "!");
        let html = "";
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
  $.post("http://127.0.0.1:8000/api/auth/login", objetoUsuario)
    .done(function (response) {
      window.localStorage.setItem('Usuario', response.access_token);

      abrirNotificacion("Bienvenido " + response.user.nickName + "!");
      let html = "";
      html = "<div class='usuario'>";

      html += "<img class='usuario__imagen' src='http://127.0.0.1:8000/imagenes/usuarios/" + response.user.avatar + "'></img>";
      html += "<div class='usuario__nick'>";
      html += response.user.nickName;
      html += "</div>";
      html += "<div id='botonLogout' class='boton boton--terciario'>";
      html += "Logout";
      html += "</div>";

      html += "</div>";

      $("#divPerfilLogin").html(html);
      $(".log-in").hide();
    })
    .fail(function (response) {
      console.log(response.responseText);
      
      abrirNotificacion("Login fallido");
    });
}

function abrirRegistro() {
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
    url: "http://127.0.0.1:8000/api/categorias"
  }).done(function (response) {
    let html = "";
    html += "<div class='menu-lateral__contenedor-enlaces'>";
    response.data.forEach(element => {
      // html += "<div class='menu-lateral__item'><a href='#' class='menu-lateral__enlace'>" + element.nombre + "</a></div>"
      html +=
        "<a href='categorias/" +
        element.nombre +
        "'class='menu-lateral__enlace' id='" +
        element.id +
        "' onclick='cargarProductosCategoria(event, \"" +
        element.nombre +
        "\")'><i class='" +
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
    url: "http://127.0.0.1:8000/api/carousel"
  }).done(function (response) {
    let html = "";
    let contador = 0;
    response.imagenes.forEach(element => {
      html +=
        "<div class='carousel-item " + (contador != 0 ? "" : "active") + "'>";
      html +=
        "<img class='d-block c-carousel__imagen' src='http://127.0.0.1:8000" +
        response.rutaServerImagenes +
        "/" +
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
    url: "http://127.0.0.1:8000/api/redessociales",
  }).done(function (response) {
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

function cargarProductosCategoria(event, nombreCategoria) {
  toggleHamburguesa();
  event.stopPropagation();
  event.preventDefault();

  $.ajax({
      type: "GET",
      url: "http://127.0.0.1:8000/api/categorias/" + nombreCategoria + "/productos"
    }).done(function (response) {
      // No hay forma de poner en la url categorias/Carnes ya que se va sumando todo el rato el categorias y va saliendo así categorias/categorias/categorias/ --> Un ejemplo
      window.history.pushState({
          categoria: nombreCategoria
        },
        nombreCategoria, nombreCategoria
      );
      let numRedes = response.data.length;
      let html =
        "<div class='l-columnas l-columnas--4-columnas'>"; /*div general que contenga todos los div de productos*/
      response.data.forEach(element => {
        html += "<div class='producto'>";
        html += "<img class='producto__imagen' src='http://127.0.0.1:8000" + response.rutaServerImagenes + element.imagen + "'>";
        html += "<div class='producto__nombre'>" + element.nombre + "</div>";
        html += "<div class='producto__informacion'>" + element.descripcion + "</div>";
        html += "<div class='producto__precio'>Precio: " + element.precio + "€</div>";
        html += "</div>";
      });
      html += "</div>";
      $(".l-page__content").html("");
      $(".l-page__content").html(html);
    })
    .fail(function () {
      console.log("consulta fallida");
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

window.onbeforeunload = function () {
  // Aquí poner todo el código de leer la url, ver en que página está y cargar lo correspondiente
  // return "¿Desea recargar la página web?";
};

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

  $.ajax({
      url: "http://127.0.0.1:8000/api/auth/register",
      type: "post",
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    })
    .done(function (res) {
      abrirNotificacion("Registro completado");
      setTimeout(() => {
        window.location.replace("index.html");
        enviarLoginServidor(objetoUsuario);
      }, 1000);
    })
    .fail(function (res) {
      abrirNotificacion("Registro fallido");
    });
}