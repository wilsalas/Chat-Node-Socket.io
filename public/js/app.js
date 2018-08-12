$(function () {
    /**
     * Variables para inicializar el socket cliente,
     * almacenar el nombre de usuario y una variable que cuenta, cuantas veces se ha presionado
     * una tecla en el textarea del mensaje
     */
    let socket = io(), username = "", countKeypress = 0;
    /** inicializa el modal emergente,  y valida que no se pueda cerrar de ninguna manera */
    $('#exampleModalCenter').modal({ backdrop: 'static', keyboard: false });
    /**
     * Evento de envio de datos del formulario, se realiza una validación
     * para comprobar si el valor del mensaje es diferente de vacio entonces
     * le permite emitir un evento socket  para almacenar los datos de nombre usuario y el mensaje
     * de lo contrario se envia una alerta indicando que no se permite el envio mientras el valor del mensaje 
     * este vacio.
     */
    $('form').submit(e => {
        e.preventDefault();
        if ($('#textmessage').val() != "") {
            socket.emit('chat-message', {
                username,
                message: $('#textmessage').val()
            });
            $('#textmessage').val('');
        } else {
            alert("El mensaje no puede estar vacio");
        }
    });
    /**
     *  Evento click para el boton del modal emergente que permite validar,
     * si el valor del input de usuario es diferente de vacio entonces pueda guardarlo en una variable
     * local llamada username y se cierre el modal, de lo contrario se envia una alerta,
     * indicando que no se permite el envio mientras el valor del nombre de usuario 
     * este vacio.
     */
    $("#registerUser").click(() => {
        if ($("#username").val() != "") {
            username = $("#username").val();
            $('#exampleModalCenter').modal("hide");
        } else {
            alert("El nombre de usuario no puede estar vacio");
        }
    });
    /**
     * Evento que permite detectar cuando se presiona una tecla, se valida en caso
     * de que  los caracteres digitados sean iguales a 3 entonces se reinicia el contador  y
     * se hace el respectivo envio de la información emitida de que la persona esta escribiendo.
     */
    $("#textmessage").keypress(() => {
        countKeypress++
        if (countKeypress === 3) {
            countKeypress = 0;
            socket.emit("info-message", {
                info: `<b>${username}</b> esta escribiendo...`
            })
        }
    });
    /**
     * Se obtiene el evento emitido desde el servidor al cliente llamado info-message
     * y se habilita el estilo de muestra para el elemento html que tiene una clase llamada
     * info-message, por consecuente a eso se le renderiza el dato de la información obtenida.
     */
    socket.on("info-message", data => {
        $(".info-message").css({ display: "block" });
        $(".info-message").html(data.info);
    });
    /**
     * Se obtiene el evento emitido desde el servidor al cliente llamado chat-message
     * y se agrega un nuevo elemento html li que contiene el dato de nombre de usuario 
     * y el mensaje del mismo, por consecuente a eso se limpia el dato que exista en el elemento 
     * con clase info-message y se oculta el mismo.
     */
    socket.on('chat-message', data => {
        $('.chatmessage').append(`<li class="card-text">${"<b>" + data.username + "</b>"}: ${data.message}`);
        $(".info-message").empty();
        $(".info-message").css({ display: "none" });
    });
});