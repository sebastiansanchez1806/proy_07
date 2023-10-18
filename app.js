const colors = require('colors');
const fs = require('fs').promises;
const readline = require('readline').createInterface({input:process.stdin, output:process.stdou,});
class Producto {
    #codigoproducto;
    #nombreproducto;
    #inventarioproducto;
    #precioproducto;
    constructor() {
        this.#codigoproducto = '';
        this.#nombreproducto = '';
        this.#inventarioproducto = 0;
        this.#precioproducto = 0;
    }

    get codigoproducto() {
        return this.#codigoproducto;
    }

    set codigoproducto(codigo) {
        this.#codigoproducto = codigo;
    }

    get nombreproducto() {
        return this.#nombreproducto;
    }

    set nombreproducto(nombre) {
        this.#nombreproducto = nombre;
    }

    get inventarioproducto() {
        return this.#inventarioproducto;
    }

    set inventarioproducto(inventario) {
        this.#inventarioproducto = inventario;
    }

    get precioproducto() {
        return this.#precioproducto;
    }

    set precioproducto(precio) {
        this.#precioproducto = precio;
    }
}
class ProductosTienda {
    #listaproductos;
    constructor() {
        this.#listaproductos = [];
    }

    get listaproductos() {
        return this.#listaproductos;
    }

    set listaproductos(lista) {
        this.#listaproductos = lista;
    }

    mostrarproductos() {
        this.#listaproductos.forEach((producto) => {
            console.log(
                `|    `+
                producto.codigoproducto +
                `    |`+
                `    |`+
                producto.nombreproducto +
                `    |`+
                `     `+
                producto.inventarioproducto +
                `    |`+
                `     `+
                producto.precioproducto +
                `    |`
            );
        });
    }
}

const cargaarchivosproductos = async (productosTienda) => {
    try{
        const data = await fs.readFile('./datos.json', 'utf-8');
        productosTienda.listaproductos = JSON.parse(data);
        console.log(`Productos cargados desde datos.json`.bgrren);
    } catch (error) {
        console.error(`error al cargar el archivo: ${error.message}`.bgRed);
    }
};

const agregarProducto = async (productosTienda, nuevoProducto) => {
    productosTienda.listaproductos.push(nuevoProducto);
    console.log(`Producto agregado:`.bgBlue);
    console.log(nuevoProducto);
    await grabararchivosproductos(productosTienda.listaproductos.map(producto =>({
        codigoproducto: producto.codigoproducto,
        nombreproducto: producto.nombreproducto,
        inventarioproducto: producto.inventarioproducto,
        precioproducto: producto.precioproducto,
    })));
};

const grabararchivosproductos = async (listaproductos) => {
    try {
        const cadenaJson = JSON.stringify(listaproductos,null,2);
        const nombrearchivo = './datos.json';
        await fs.writeFile(nombrearchivo, cadenaJson, 'utf-8');
        console.log(`DATOS GUARDADOS EN ${nombrearchivo}`.bgMagenta);
    } catch (error) {
        console.log(`Error al guardar el archivo: ${error.message}`.bgRed);
    }
};

const mostrarMenu = () => {
    return new Promise((resolve) => {
        console.log(`________________________________`.blue);
        console.log(`      Seleccione una opción     `.blue);
        console.log(`--------------------------------\n`.blue);
        console.log(`${'1'} Crear nuevo producto`);
        console.log(`${'2'} Listar productos`);
        console.log(`${'3'} Salir\n`);

        readline.question('Seleccione una opción: ', (opt) => {
            resolve(opt);
        });
    });
};

const pausa = () => {
    return new Promise((resolve)=>{
        readline.question(`\nPresione ${'ENTER'.blue} para continuar\n`, (opt)=>{
            resolve();
        });
    });
};

const obtenerDetallesProducto = async () => {
    return new Promise((resolve) =>{
        const nuevoProducto = new Producto();

        readline.question('codigo del producto: ', (codigo) =>{
            nuevoProducto.codigoproducto = codigo;
            readline.question('nombre del producto: ', (nombre) => {
            nuevoProducto.nombreproducto = nombre;
            readline.question('inventario del producto ', (inventario) => {
            nuevoProducto.inventarioproducto = parseInt(inventario);
            readline.question('precio del producto: ', (precio) => {
            nuevoProducto.precioproducto = parseFloat(precio);
            resolve(nuevoProducto);
            });
            });
            });
        });
    });
};

const main = async () => {
    console.clear();
    console.log('$$$$$$$$$$$$$$$$$$$$$'.yellow);
    console.log('$$ PROYECTO CLASES $$'.cyan);
    console.log('%%%%%%%%%%%%%%%%%%%%%\n'.cyan);

    let productostienda = new ProductosTienda();

    await cargaarchivosproductos(productostienda);

    let salir = false;
    while (!salir) {
        const opcion = await mostrarMenu();

        switch (opcion) {
            case '1':

            console.log(`Ingrese los detalles del nuevo producto:`.bgYellow);
                const nuevoProducto = await obtenerDetallesProducto();
            console.log(`Producto agregado:`.bgGreen);
            console.log(nuevoProducto);
            await agregarProducto(productostienda, nuevoProducto);
            await pausa();
            break;

            case '2':
                console.log(`Listado de productos:`.bgBlue);
                productostienda.mostrarproductos();
                await pausa();
                break;
            case '3':

            salir = true;
            break;
        default:
            console.log(`opvion no valida porfavor sellecione una opcion valida`.bgRed);
            await pausa();
            break;
        }
    }
    readline.close();
    console.log('¡Gracias por usar este programa!'.bgCyan);
};

main();