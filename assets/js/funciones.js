const direccion = `https://backend-p2ipc1.herokuapp.com`

//funcion que realiza el login
function IniciarSesion() {
    var username = document.querySelector('#usuario').value
    var password = document.querySelector('#password').value
    var dato = {
        'username': username,
        'password': password
    }
    console.log(dato)
    fetch(direccion + '/login', {
            method: 'POST',
            body: JSON.stringify(dato),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(err => { //sucede si hay un error en el fetch
            console.error('Error: ', err)
            alert("Ocurrio un error, ver en consola")
        })
        .then(response => {
            console.log(response);
            console.log(response.message)
            if (response.message == "200") {
                alert(`Bienvenido ${username}`)
                sessionStorage.setItem("username", username)
                if (username == "admin") {
                    location.href = 'adm_us.html' //vinculo de pagina
                } else {
                    location.href = 'user_in.html' //vinculo de pagina
                }
            } else {
                alert(response.reason)
            }
        })
}

// funcion para el registro
function Registro() {
    var nombre = document.querySelector('#nombre').value
    var apellido = document.querySelector('#apellido').value
    var genero = document.querySelector('#genero').value
    var username = document.querySelector('#username').value
    var email = document.querySelector('#email').value
    var password = document.querySelector('#password').value
    var dato = {
        'nombre': nombre,
        'apellido': apellido,
        'genero': genero,
        'username': username,
        'email': email,
        'password': password
    }
    console.log(dato)
    fetch(direccion + '/agregarUsuario', {
            method: 'POST',
            body: JSON.stringify(dato),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(err => {
            console.error('Error ', err)
            alert("Ocurrio un error, ver en consola")
        })
        .then(response => {
            console.log(response)
            console.log(response.message)
            if (response.message == "025") {
                alert("Registro realizado con exito, Inicie Sesion para continuar")
                location.href = 'login.html' //vinculo de pagina
            } else {
                alert(response.reason)
            }
        })
}

// funcion para cargar los datos de los usuarios (admin)
function CargaTabla() {
    var user = document.querySelector("#user")
    var a = sessionStorage.username
    user.innerHTML = `Bienvenido: ${a}`
    var contenido = document.querySelector('#CuerpoTabla')
    fetch(direccion + '/usuarios')
        .then(response => response.json())
        .catch(error => {
            console.log(error)
        })
        .then(res => {
            console.log(res)
            for (i in res) {
                contenido.innerHTML +=
                    `<tr>
                    <td> ${res[i].nombre}</td>
                    <td> ${res[i].apellido}</td>
                    <td> ${res[i].genero}</td>
                    <td> ${res[i].username}</td>
                    <td> ${res[i].correo}</td>
                    <td> ${res[i].password}</td>
                    <td> <button type="button" value="${res[i].username}" onclick="EliminarUsuario(this)" class="btn-eliminar"></button>
                    <button type="button" value="${res[i].username}" onclick="Info(this)" class="btn-editar"></button></td>
                    </tr>`
            }
        })
}

//funcion para cargar la informacion de un usuario
function CargaInfo() {
    var user = document.querySelector("#user")
    var a = sessionStorage.username
    user.innerHTML = `Bienvenido: ${a}`
    var buscar = sessionStorage.userSelected
    fetch(direccion + `/buscar/${buscar}`)
        .then(response => response.json())
        .catch(error => {
            console.log(error)
        })
        .then(res => {
            console.log(res)
            document.querySelector('#ModNombre').value = res[0].nombre
            document.querySelector('#ModApellido').value = res[0].apellido
            document.querySelector('#genero').value = res[0].genero
            document.querySelector('#ModEmail').value = res[0].correo
            document.querySelector('#ModUsername').value = res[0].username
            document.querySelector('#ModPassword').value = res[0].password
        })
}

//funcion para obtener el nombre del usuario de un boton 
function Info(boton) {
    var username = boton.value
    sessionStorage.setItem("userSelected", username)
    location.href = 'perfilUser.html' //vinculo de pagina
}

//eliminar usuario
function EliminarUsuario(boton) {
    var username = boton.value
    fetch(direccion + `/eliminar/${username}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .catch(error => {
            console.log(error)
        })
        .then(res => {
            alert(res.reason)
            location.href = 'adm_us.html'
        })
}

//funcion para modificar los datos de un usuario
function MofidicarUsuario() {
    var nombre = document.querySelector('#ModNombre').value
    var apellido = document.querySelector('#ModApellido').value
    var genero = document.querySelector('#genero').value
    var username = document.querySelector('#ModUsername').value
    var email = document.querySelector('#ModEmail').value
    var password = document.querySelector('#ModPassword').value
    var dato = {
        'nombre': nombre,
        'apellido': apellido,
        'genero': genero,
        'username': username,
        'email': email,
        'password': password
    }
    console.log(dato)
    fetch(direccion + `/modificar/${username}`, {
            method: 'PUT',
            body: JSON.stringify(dato),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(err => {
            console.error('Error ', err)
            alert("Ocurrio un error, ver en consola")
        })
        .then(response => {
            console.log(response)
            console.log(response.message)
            if (response.message == "030") {
                alert(response.reason)
                location.href = 'adm_in.html' //vinculo de pagina
            } else {
                alert(response.reason)
            }
        })
}

//funcion para leer archivos
function leerArchivoUS(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result;
        sessionStorage.setItem("contenidoUsers", contenido)
    };
    lector.readAsText(archivo);
}

//funcion para guardar los usuarios
function guardarUsuarios() {
    var contenido = sessionStorage.contenidoUsers
    let datos = JSON.parse(contenido)
    for (let dato of datos) {
        console.log(dato)
        fetch(direccion + '/cargaUsuarios', {
                method: 'POST',
                body: JSON.stringify(dato),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
            .catch(err => {
                console.error('Error', err)
            })
            .then(response => {
                console.log(response)
            })
    }
    alert("Datos Subidos, cargue otra vez la pagina")
    adm_user()
}



//obtener el evento de archivo usuarios
try {
    document.getElementById('file-us')
        .addEventListener('change', leerArchivoUS, false);
} catch (error) {}


//Publicaciones
//funcion para leer el archivo de publicaciones
function leerArchivoPb(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result;
        sessionStorage.setItem("contenidoPublicacion", contenido)
    };
    lector.readAsText(archivo);
}

//funcion para guardar publicaciones
function guardarPublicaciones() {
    var contenido = sessionStorage.contenidoPublicacion
    let datos = JSON.parse(contenido)

    for (let dato of datos.images) {
        console.log(dato)
        fetch(direccion + '/imgPublicaciones', {
                method: 'POST',
                body: JSON.stringify(dato),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
            .catch(err => {
                console.error('Error', err)
            })
            .then(response => {
                console.log(response)
            })
    }
    for (let dato of datos.videos) {
        console.log(dato)
        fetch(direccion + '/vidPublicaciones', {
                method: 'POST',
                body: JSON.stringify(dato),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
            .catch(err => {
                console.error('Error', err)
            })
            .then(response => {
                console.log(response)
            })
    }
    alert("Publicaciones Subidas, cargue otra vez la pagina")
    adm_publi()
}

//obtener evento archivo publicacion
try {
    document.getElementById('file-pb')
        .addEventListener('change', leerArchivoPb, false);
} catch (error) {}

// funcion para cargar los datos de las publicaciones cargadas
function cargarPubAdm() {
    var user = document.querySelector("#user")
    var a = sessionStorage.username
    user.innerHTML = `Bienvenido: ${a}`
    var contenido = document.querySelector('#TablaPubliAd')
    contenido.innerHTML = ""
    fetch(direccion + '/publicaciones')
        .then(response => response.json())
        .catch(error => {
            console.log(error)
        })
        .then(res => {
            console.log(res)
            for (i in res) {
                if (res[i].tipo == "image") {
                    contenido.innerHTML +=
                        `<tr>
                    <td> ${res[i].tipo}</td>
                    <td> ${res[i].categoria}</td>
                    <td> ${res[i].author}</td>
                    <td> ${res[i].date}</td>
                    <td><img src="${res[i].url}"width="100" height="100"></td>
                    <td> <button type="button" value="${res[i].id}" onclick="EliminarPublicacion(this)" class="btn-eliminar"></button></td>
                    </tr>`
                } else {
                    contenido.innerHTML +=
                        `<tr>
                <td> ${res[i].tipo}</td>
                <td> ${res[i].categoria}</td>
                <td> ${res[i].author}</td>
                <td> ${res[i].date}</td>
                <td><iframe width="300" height="150" src="${res[i].url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></td>
                <td> <button type="button" value="${res[i].id}" onclick="EliminarPublicacion(this)" class="btn-eliminar"></button></td>
                </tr>`
                }

            }
        })
}

//eliminar publicacion
function EliminarPublicacion(boton) {
    var id = boton.value
    fetch(direccion + `/eliminarPb/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .catch(error => {
            console.log(error)
        })
        .then(res => {
            alert(res.reason)
            location.href = 'adm_pb.html'
        })
}

// funcion para cargar inicio de publicaciones usuario
function CargarIncioUs() {
    var user = document.querySelector("#user")
    var a = sessionStorage.username
    user.innerHTML = `Bienvenido: ${a}`
    var contenido = document.querySelector('#contenido_pb')

    fetch(direccion + '/publicaciones')
        .then(response => response.json())
        .catch(error => {
            console.log(error)
        })
        .then(res => {
            console.log(res)
            for (i in res) {
                if (res[i].tipo == "image") {
                    contenido.innerHTML += `
                    <h2 class="title mb-2">${res[i].categoria}</h2>
                    <div class="meta mb-3"><span class="date">Publicado el ${res[i].date}</span>
                        <figure class="blog-banner">
                            <a><img class="img-fluid" src="${res[i].url}" alt="image"></a>
                            <figcaption class="mt-2 text-center image-caption">Author: ${res[i].author}</a></figcaption>
                        </figure>
                    `
                } else {
                    contenido.innerHTML += `
                    <h3 class="mt-5 mb-3">${res[i].categoria}</h3>
                    <div class="meta mb-3"><span class="date">Publicado el ${res[i].date}</span>
                        <div class="embed-responsive embed-responsive-16by9">
                            <iframe width="560" height="315" src="${res[i].url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        <figcaption class="mt-2 text-center image-caption">Author: ${res[i].author}</a></figcaption>
                    </div>
                    `
                }
            }
        })
}


//funcion para cargar la informacion de un usuario
function CargaInfoUsuario() {
    var user = document.querySelector("#user")
    var a = sessionStorage.username
    user.innerHTML = `Bienvenido: ${a}`
    fetch(direccion + `/buscar/${a}`)
        .then(response => response.json())
        .catch(error => {
            console.log(error)
        })
        .then(res => {
            console.log(res)
            document.querySelector('#ModNombre').value = res[0].nombre
            document.querySelector('#ModApellido').value = res[0].apellido
            document.querySelector('#genero').value = res[0].genero
            document.querySelector('#ModEmail').value = res[0].correo
            document.querySelector('#ModUsername').value = res[0].username
            document.querySelector('#ModPassword').value = res[0].password
        })
}

// funcion para el registro de una publicacion 
function RegistrarPublicacion() {
    var author = sessionStorage.username
    var categoria = document.querySelector('#ModCategoria').value
    var url = document.querySelector('#ModUrl').value
    var modTipo = document.querySelector('#ModTipo').value
    var dato = {
        'author': author,
        'categoria': categoria,
        'url': url,
        'tipo': modTipo,
    }
    console.log(dato)
    fetch(direccion + '/publicarNew', {
            method: 'POST',
            body: JSON.stringify(dato),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(err => {
            console.error('Error ', err)
            alert("Ocurrio un error, ver en consola")
        })
        .then(response => {
            console.log(response)
            alert("publicacion realizada")
            location.href = 'user_in.html'
        })
}

//funcion para actualizar los datos de un usuario
function ActualizarDatosUS() {
    var nombre = document.querySelector('#ModNombre').value
    var apellido = document.querySelector('#ModApellido').value
    var genero = document.querySelector('#genero').value
    var username = document.querySelector('#ModUsername').value
    var email = document.querySelector('#ModEmail').value
    var password = document.querySelector('#ModPassword').value
    var dato = {
        'nombre': nombre,
        'apellido': apellido,
        'genero': genero,
        'username': username,
        'email': email,
        'password': password
    }
    console.log(dato)
    fetch(direccion + `/modificar/${username}`, {
            method: 'PUT',
            body: JSON.stringify(dato),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(err => {
            console.error('Error ', err)
            alert("Ocurrio un error, ver en consola")
        })
        .then(response => {
            console.log(response)
            console.log(response.message)
            if (response.message == "030") {
                alert(response.reason)
                location.href = 'user_in.html' //vinculo de pagina
            } else {
                alert(response.reason)
            }
        })
}

//funcion para redirigir al login
function Login() {
    location.href = 'login.html' //vinculo de pagina
}

// funcion para redirigir al registro
function Registrate() {
    location.href = 'signup.html' //vinculo de pagina
}

// funcion para redirigir al administrador  publicacion
function adm_publi() {
    location.href = 'adm_pb.html' //vinculo de pagina
}

// funcion para redirigir al usuario inicio
function user_in() {
    location.href = 'user_in.html' //vinculo de pagina
}

// funcion para redirigir al perfil de usuario
function user_perf() {
    location.href = 'user_perf.html' //vinculo de pagina
}

// funcion para redirigir al registro de publicacion usuarios
function user_pb() {
    location.href = 'user_pb.html' //vinculo de pagina
}

// funcion para redirigir al inicio de admin 
function adm_user() {
    location.href = 'adm_us.html' //vinculo de pagina
}
