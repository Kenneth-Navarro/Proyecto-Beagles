$(document).ready(function () {
cargaEventos();

});


$(document).on('click', '#registrar', function() {
  completarRegistro($(this).attr('id-data'));
});


$(document).on('click', '#btnCompletarRegistro', function(e){
  e.preventDefault();
  var idevento = $("#_idevento").val();
  var nombreUsu = $("#usuarioModal").val();
  var nombre= $("#nombreModal").val();
  var pApellido = $("#pApellidoModal").val();
  var sApellido = $("#sApellidoModal").val();
  var correo = $("#correoModal").val();
  var telefono = $("#telefonoModal").val();

  // Obtener nombres de personas
  var personas = [];
  $(".nuevaPersona").each(function() {
    var nombrePersona = $(this).val().trim();
    if (nombrePersona !== "") {
      personas.push(nombrePersona);
    }
  });

  // Obtener nombres de mascotas
  var mascotas = [];
  $(".nuevaMascota").each(function() {
    var nombreMascota = $(this).val().trim();
    if (nombreMascota !== "") {
      mascotas.push(nombreMascota);
    }
  });

  Registrar(idevento, nombreUsu, nombre, pApellido, sApellido, correo, telefono, personas, mascotas);
});



function completarRegistro(idevento){
  var usuarioGuardado = JSON.parse(sessionStorage.getItem('Usuario'));
  //el usuario no ha iniciado sesion
  if (!usuarioGuardado) {
    Swal.fire({
        icon: "warning",
        title: "No ha iniciado sesión",
        text: "Por favor inicie sesión para completar el registro.",
        showCancelButton: true,
        confirmButtonText: "Iniciar Sesión",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Redirigir al usuario a la página de iniciar sesión si decide iniciar sesión
            window.location.href = "/iniciarSesion";
        } else {
            // Mostrar un mensaje de confirmación si decide cancelar
            Swal.fire({
                icon: "info",
                title: "Operación cancelada",
                text: "El registro no se ha completado."
            });
        }
    });
} else {

  verificarRegistro(idevento,usuarioGuardado);
  }
}



function Registrar(idevento, nombreUsu,nombre, pApellido,sApellido, correo,telefono,personas,mascotas){
  var formData = new FormData();
  formData.append("idEvento", idevento);
  formData.append("nombreUsu", nombreUsu);
  formData.append("nombre", nombre);
  formData.append("pApellido", pApellido);
  formData.append("sApellido", sApellido);
  formData.append("correo", correo);
  formData.append("telefono", telefono); 
  formData.append("nombresPersonas", personas); 
  formData.append("nombresMascotas", mascotas);
  formData.append("accion", "Ingreso");

  $('.loader-background').show();
  $('.loader').show();

  $.ajax({
    url: "/admin/eventos/registro",
    type: "POST",
    data: formData,
    processData: false, 
    contentType: false, 
    success: function (response) {
      $('.loader-background').hide();
      $('.loader').hide();
      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "¡Uy ha Ocurrido un Error!",
          text: response.error,
        }).then((result) => {
          if (result.isConfirmed) {
            
          }
          
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "¡Exito!",
          text: "Información Almacenada Correctamente.",
        }).then((result) => {
          if (result.isConfirmed) {
          }
          location.reload()
        });
      }
    },
    error: function (xhr, status, error) {
      $('.loader-background').hide();
      $('.loader').hide();
      console.log("Error: ", error);
      console.log("Mensaje de error: ", xhr.responseJSON.error);
    },
  });
}



function cargaEventos() {
  $('.loader-background').show();
  $('.loader').show();
    $.ajax({
      url: "/eventosP/obtenerEventosP",
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      success: function (response) {
        $('.loader-background').hide();
        $('.loader').hide();
        if (response.error) {
          Swal.fire({
            icon: "error",
            title: "¡Uy ha Ocurrido un Error!",
            text: "No se ha podido cargar la información. Por favor comuniquese con el desarrollador.",
          }).then((result) => {
            if (result.isConfirmed) {
            }
          });
        } else {
            mostrarEventosP(response)
        }
      },
      error: function (xhr, status, error) {
        $('.loader-background').hide();
        $('.loader').hide();
        console.log("Error: ", error);
        console.log("Mensaje de error: ", xhr.responseJSON.error);
      },
    });
  
  }

 function mostrarEventosP(eventoArray) {
    var eventosContainer = document.getElementById('eventosContainer');
  
    for (var i = 0; i < eventoArray.length; i++) {
        var eventoHTML =
            '<div class="row justify-content-center mb-3">' +
            '   <div class="col-md-9">' +
            '       <div class="card mb-0 card-custom">' + 
            '           <div class="row g-0">' +
            '               <div class="col-md-4">' +
            '                   <img class="img-fluid w-100 img-custom" src="' + eventoArray[i].Imagen + '" alt="">' +
            '               </div>' +
            '               <div class="col-md-8 col-md-8-custom">' +
            '                   <div class="card-body card-body-custom">' +
            '                       <div>' +
            '                           <p class="text-club">Club de Beagles</p>' +
            '                           <h5 class="card-title card-title-custom">' + eventoArray[i].Nombre + '</h5>' +
            '                           <p class="card-text card-text-custom">' + eventoArray[i].Descripcion + '</p>' +
            '                           <p><span style="font-weight: bold;">Fecha:</span> <small>' + eventoArray[i].Fecha + '</small></p>' +
            '                           <p><span style="font-weight: bold;">Hora:</span> <small>' + eventoArray[i].Hora + '</small></p>' +
            '                           <p><span style="font-weight: bold;">Precio:</span> <small>₡' + eventoArray[i].Precio + '</small></p>' +
            '                       </div>' +
            '                       <div>' +
            '                           <hr class="hr-custom">' +
            '                           <div style="display: flex; justify-content: center;">' +
            '                               <a class="boton btn btn-sm btn-custom" id="registrar" id-data="' + eventoArray[i]._id+'" href="#">Registrarse</a>' +
            '                           </div>' +
            '                       </div>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>';
  
        eventosContainer.innerHTML += eventoHTML;
    }

}


function RegistrarEvento(usuario, idevento) {
  $("#modalHijo").empty();

  var titulo = "Registro";
  var readonly = "readonly='true'";
  var colorBotonAgregar = "#6E5240";

  var nombreUsuario = "";
  var nombre = "";
  var PrimerApellido = "";
  var SegundoApellido = "";
  var Telefono = "";
  var Correo = "";
  if (usuario.Rol == "Administrador") {
    nombreUsuario = usuario.Empleado[0].Usuario;
    nombre = usuario.Empleado[0].Nombre;
    PrimerApellido = usuario.Empleado[0].PrimerApellido;
    SegundoApellido = usuario.Empleado[0].SegundoApellido;
    Telefono = usuario.Empleado[0].Telefono;
    Correo = usuario.Empleado[0].Correo;
  } else {
    nombreUsuario = usuario.Usuario;
    nombre = usuario.Nombre;
    PrimerApellido = usuario.PrimerApellido;
    SegundoApellido = usuario.SegundoApellido;
    Telefono = usuario.Telefono;
    Correo = usuario.Correo;
  }

  var HTML =
    "<div class='modal-header'>" +
    "<h1 class='modal-title tituloModal fs-4'>" + titulo + "</h1>" +
    "<button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
    "</div>" +
    "<div class='modal-body'>" +
    "<div class='row'>" +
    "<div class='col-6'>" +
    "<input type='hidden' id='_idevento' value='" + idevento + "'>" +
    "<div>" +
    "<label for='usuarioModal'>Nombre de Usuario</label>" +
    "<input id='usuarioModal' type='text' value='" + nombreUsuario + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "<div>" +
    "<label for='nombreModal'>Nombre</label>" +
    "<input id='nombreModal' type='text' value='" + nombre + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "<div>" +
    "<label for='pApellidoModal'>Primer Apellido</label>" +
    "<input id='pApellidoModal' type='text' value='" + PrimerApellido + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "<div>" +
    "<label for='sApellidoModal'>Segundo Apellido</label>" +
    "<input id='sApellidoModal' type='text' value='" + SegundoApellido + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "</div>" +
    "<div class='col-6'>" +
    "<div>" +
    "<label for='correoModal'>Correo Electrónico</label>" +
    "<input id='correoModal' type='email' value='" + Correo + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "<div>" +
    "<label for='telefonoModal'>Teléfono</label>" +
    "<input id='telefonoModal' type='text' value='" + Telefono + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "</div>" +
    "</div>" +
    "<br/>" +
    "<div class='row'>" +
    "<div class='col-6'>" +
    "<label for='Personasmodal'>Perosnas Adicionales </label>" +
    "<div id='personasContainer'></div>" +
    "<button type='button' class='btn btn-primary mb-2' style='background-color: " + colorBotonAgregar + "; border: none; float: right;' id='agregarPersona'>Agregar Persona</button>" +
    "</div>" +
    "<div class='col-6'>" +
    "<label for='Mascotasmodal'>Mascotas</label>" +
    "<div id='mascotasContainer'></div>" +
    "<button type='button' class='btn btn-primary mb-2' style='background-color: " + colorBotonAgregar + "; border: none; float: right;' id='agregarMascota'>Agregar Mascota</button>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class='modal-footer d-flex justify-content-center'>" +
    "<button type='button' class='boton mb-3' id='btnCompletarRegistro'>Completar Registro</button>" +
    "</div>";

  $("#modalHijo").append(HTML);

  $("#agregarPersona").on("click", function () {
    $("#personasContainer").append(
      "<div class='input-group mb-2'>" +
      "<input type='text' class='form-control nuevaPersona'>" +
      "<button type='button' class='btn btn-danger eliminarNombre' style='float: right;'>Eliminar</button>" +
      "</div>"
    );
  });

  $("#agregarMascota").on("click", function () {
    $("#mascotasContainer").append(
      "<div class='input-group mb-2'>" +
      "<input type='text' class='form-control nuevaMascota'>" +
      "<button type='button' class='btn btn-danger eliminarNombre' style='float: right;'>Eliminar</button>" +
      "</div>"
    );
  });

  $(document).on("click", ".eliminarNombre", function () {
    $(this).closest('.input-group').remove();
  });

  $("#modal1").modal("show");

  $("#btnCompletarRegistro").on("click", function () {
    var nombresPersonasActualizados = [];
    $(".nuevaPersona").each(function () {
      var nombre = $(this).val().trim();
      if (nombre !== "") {
        nombresPersonasActualizados.push(nombre);
      }
    });

    var nombresMascotasActualizados = [];
    $(".nuevaMascota").each(function () {
      var nombre = $(this).val().trim();
      if (nombre !== "") {
        nombresMascotasActualizados.push(nombre);
      }
    });

    console.log("Nombres de personas actualizados:", nombresPersonasActualizados);
    console.log("Nombres de mascotas actualizados:", nombresMascotasActualizados);
  });
}


function agregarCampoNombre(tipo, containerId) {
  var cantidadCampos = $(containerId + ' input[type="text"]').length + 1;
  var label = tipo === 'personas' ? 'Persona' : 'Mascota';
  var inputHTML =
    "<div class='mb-3'>" +
    "<label for='" + tipo + "Nombre" + cantidadCampos + "' class='form-label'>" + label + " " + cantidadCampos + "</label>" +
    "<input id='" + tipo + "Nombre" + cantidadCampos + "' type='text' class='form-control nueva" + label + "'>" +
    "<button type='button' class='btn btn-danger eliminarNombre'>Eliminar</button>" +
    "</div>";

  $(containerId).append(inputHTML);
}


function verificarRegistro(idevento, usuario) {
  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/admin/eventos/validarRegistros?id=" + idevento + "&usuario=" + usuario.Usuario,
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      $('.loader-background').hide();
      $('.loader').hide();
      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "¡Uy ha Ocurrido un Error!",
          text: response.error,
        }).then((result) => {
          if (result.isConfirmed) {
            
          }
        });
      } else if (response.length > 0) {
        // Si hay registros existentes, mostrar mensaje de eliminar
        Swal.fire({
          title: "¡Usted ya se registró en este evento!",
          text: "¿Desea eliminar su registro?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            // Si el usuario elige eliminar ejecutar la función para eliminar el registro
            eliminarRegistro(response[0]._id);
          }
        });
      } else {
   
            RegistrarEvento(usuario, idevento);
      }
     
    },
  });
}

function eliminarRegistro(id){
  Swal.fire({
    title: "¿Esta seguro?",
    text: "Se eliminará su registro",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      $('.loader-background').show();
      $('.loader').show();
      $.ajax({
        data: JSON.stringify({
          id:id,
        }),
        url: "/admin/eventos/eliminarRegistro",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
          $('.loader-background').hide();
          $('.loader').hide();
          if (response.error) {
            Swal.fire({
              icon: "error",
              title: "¡Uy ha Ocurrido un Error!",
              text: response.error,
            }).then((result) => {
              if (result.isConfirmed) {
                
              }
              
            });
          } else {
            Swal.fire({
              icon: "success",
              title: "¡Exito!",
              text: "Información Eliminada Correctamente.",
            }).then((result) => {
              if (result.isConfirmed) {
              }
              location.reload()
            });
          }
        },
        error: function (xhr, status, error) {
          $('.loader-background').hide();
          $('.loader').hide();
          console.log("Error: ", error);
          console.log("Mensaje de error: ", xhr.responseJSON.error);
        },
      });
    }
  });
}
