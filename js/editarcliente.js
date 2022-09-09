(function(){
    let DB
    let idCliente
    const nombreInput = document.querySelector('#nombre')
    const correoInput = document.querySelector('#email')
    const telefonoInput = document.querySelector('#telefono')
    const empresaInput = document.querySelector('#empresa')
    const formulario = document.querySelector('#formulario')


    window.onload = ()=>{
        conectarDB()
        //actualiza el registro
        formulario.addEventListener('submit', actualizarCliente)
    
        //verificar Id de URL
        const parametroURL = new URLSearchParams(window.location.search)
        idCliente = parametroURL.get('id')
        if(idCliente){
            setTimeout(() =>{
                obtenerCliente(idCliente)

            },100)
        }
    }
    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1)
        abrirConexion.onerror = function(){
            console.log('Hubo un error')}
        
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result 
        }
    }
    function actualizarCliente(e){
        e.preventDefault()
        if(nombreInput.value === '' || correoInput.value === '' || telefonoInput.value === '' || empresaInput.value === '' ){
            imprimirAlerta('Todos los campos son obligatorio', 'error')
            return
        }
        //actualizar
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: correoInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
         }
         const transaction = DB.transaction(['crm'], 'readwrite')
         const objectStore = transaction.objectStore('crm')
         objectStore.put(clienteActualizado)
         transaction.oncomplete = function(){
             imprimirAlerta('Editado Correctamente')
             setTimeout(()=>{
                 window.location.href = 'index.html'
             },2000)
         }
         transaction.onerror = function(){
             imprimirAlerta('Hubo un error','error')
         }

    }

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readonly')
        const objectStore = transaction.objectStore('crm')
        const cliente = objectStore.openCursor()
        cliente.onsuccess = function(e){
            const cursor = e.target.result
            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value)
                }

                cursor.continue()
            }
        }

    }
    function llenarFormulario(datosCliente){
        const { nombre, email, telefono, empresa } = datosCliente
        nombreInput.value = nombre
        correoInput.value = email
        telefonoInput.value = telefono
        empresaInput.value = empresa
    }

})()