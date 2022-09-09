(function(){
    let DB
    const formulario = document.querySelector('#formulario')
    window.onload =  () =>{
        conectarDB()
        formulario.addEventListener('submit', validarCliente)
    }
    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1)
        abrirConexion.onerror = function(){
            console.log('Hubo un error')}
        
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result 
        }
    }
    function validarCliente(e){
        e.preventDefault();
        const nombre = document.querySelector('#nombre').value
        const email = document.querySelector('#email').value
        const telefono = document.querySelector('#telefono').value
        const empresa = document.querySelector('#empresa').value

        if(nombre === '' || email === '' || telefono === '' ||empresa === ''){
            imprimirAlerta('Todos los campos son obligatorio', 'error')
            return
        }
        //creando objeto con la informacion
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()

        }
        crearNuevoCliente(cliente)
    }
    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite')
        const objectStore = transaction.objectStore('crm')
        objectStore.add(cliente)
        transaction.onerror = () =>{
            imprimirAlerta('Hubo un error al agregar Cliente', 'error')
        }
        transaction.oncomplete = () =>{
            console.log('Cliente Agregado')
            imprimirAlerta('Cliente agregado exitosamente')
            setTimeout(()=>{
                window.location.href = 'index.html'
            },3000)
        }
    }

    
        
}())